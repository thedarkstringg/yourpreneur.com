'use client';

import { useEffect, useRef } from 'react';
import { Application, Container } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { DotGrid } from './DotGrid';
import { TimelineTrunk } from './TimelineTrunk';
import { VentureNode } from './VentureNode';
import { BranchLine } from './BranchLine';
import { EventDot } from './EventDot';
import { InteractionManager } from './InteractionManager';
import { useStore } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';

async function loadFonts() {
  try {
    await (document as any).fonts?.ready;
  } catch (e) {
    console.log('Font loading fallback');
  }
}

export default function PixiApp({
  onNodeDoubleClick,
  onNewVenture,
  onPreviewMode,
  onHelpToggle,
  onListToggle,
  onStatsToggle,
}: {
  onNodeDoubleClick?: (ventureId: string) => void;
  onNewVenture?: () => void;
  onPreviewMode?: () => void;
  onHelpToggle?: () => void;
  onListToggle?: () => void;
  onStatsToggle?: () => void;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  const { ventures, setZoom, setPan, setSelectedVenture } = useStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const initCanvas = async () => {
      await loadFonts();

      // Clean up old canvas if it exists
      if (containerRef.current) {
        const oldCanvas = containerRef.current.querySelector('canvas');
        if (oldCanvas) {
          oldCanvas.remove();
        }
      }

      // Destroy old app if it exists
      if (appRef.current) {
        appRef.current.destroy();
        appRef.current = null;
      }

      const app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x0b0909,
        antialias: true,
      });

      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas as HTMLCanvasElement);
      }
      appRef.current = app;

      const rootContainer = new Container();
      rootContainer.sortableChildren = true;

      const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 10000,
        worldHeight: 10000,
        events: app.renderer.events,
      });

      app.stage.addChild(viewport);
      viewport.addChild(rootContainer);

      const dotGrid = new DotGrid();
      rootContainer.addChild(dotGrid);

      const layout = calculateLayout(ventures);

      const trunk = new TimelineTrunk(layout.trunkX, layout.yearPositions);
      rootContainer.addChild(trunk);

      // Add branch lines
      const branchContainer = new Container();
      rootContainer.addChild(branchContainer);

      ventures.forEach((venture) => {
        if (venture.parentId) {
          const parentPos = layout.positions.get(venture.parentId);
          const childPos = layout.positions.get(venture.id);
          if (parentPos && childPos) {
            const branch = new BranchLine({
              fromX: parentPos.x + parentPos.width,
              fromY: parentPos.y,
              fromHeight: parentPos.height,
              toX: childPos.x,
              toY: childPos.y,
              toHeight: childPos.height,
              label: venture.branchLabel,
              isBranch: true,
            });
            branchContainer.addChild(branch);
          }
        }
      });

      const nodeMap = new Map();
      layout.positions.forEach((pos, ventureId) => {
        const venture = ventures.find((v) => v.id === ventureId);
        if (venture) {
          const node = new VentureNode(venture, pos.x, pos.y);
          rootContainer.addChild(node);
          nodeMap.set(ventureId, node);
        }
      });

      // Render event dots
      const events = useStore.getState().events;
      const eventContainer = new Container();
      rootContainer.addChild(eventContainer);

      events.forEach((event) => {
        const venturePos = layout.positions.get(event.ventureId);
        if (venturePos) {
          // Position event dot to the right of the venture node, proportional to event date
          const eventDate = new Date(event.eventDate);
          const ventureStartDate = new Date(
            ventures.find((v) => v.id === event.ventureId)?.startedDate || ''
          );

          const daysElapsed =
            (eventDate.getTime() - ventureStartDate.getTime()) /
            (1000 * 60 * 60 * 24);
          const eventOffsetX = Math.min(daysElapsed * 0.2, 150); // spread out events

          const dot = new EventDot({
            x: venturePos.x + venturePos.width + eventOffsetX,
            y: venturePos.y + venturePos.height / 2,
            type: event.type,
          });
          eventContainer.addChild(dot);
        }
      });

      const interaction = new InteractionManager(app, viewport, rootContainer);

      nodeMap.forEach((node) => {
        interaction.registerNode(node);
      });

      interaction.onNodeClickHandler((nodeId) => {
        setSelectedVenture(nodeId);
      });

      interaction.onNodeDoubleClickHandler((nodeId) => {
        onNodeDoubleClick?.(nodeId);
      });

      interaction.onZoomChangeHandler((zoom) => {
        setZoom(zoom);
        dotGrid.updateForZoom(zoom);
      });

      interaction.onPanChangeHandler((x, y) => {
        setPan(x, y);
        dotGrid.updateTilePosition(x, y);
      });

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        viewport.resize(window.innerWidth, window.innerHeight);
      };

      // Keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        // N = new venture
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          onNewVenture?.();
        }

        // M = modify selected venture
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          const selected = useStore.getState().selectedVentureId;
          if (selected) {
            onNodeDoubleClick?.(selected);
          }
        }

        // P = preview mode
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          onPreviewMode?.();
        }

        // L = ventures list
        if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          onListToggle?.();
        }

        // S = statistics
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          onStatsToggle?.();
        }

        // ? = help
        if (e.key === '?') {
          e.preventDefault();
          onHelpToggle?.();
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);

      app.ticker.add(() => {
        // render loop
      });

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        if (appRef.current) {
          appRef.current.destroy();
          appRef.current = null;
        }
        if (containerRef.current) {
          const canvas = containerRef.current.querySelector('canvas');
          if (canvas) {
            canvas.remove();
          }
        }
      };
    };

    initCanvas();
  }, [ventures]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-black"
    />
  );
}
