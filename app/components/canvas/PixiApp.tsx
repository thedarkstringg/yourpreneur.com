'use client';

import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { DotGrid } from './DotGrid';
import { HorizontalTimeline } from './HorizontalTimeline';
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

      const timeline = new HorizontalTimeline(layout.timelineY, layout.yearPositions);
      rootContainer.addChild(timeline);

      // Add branch lines
      const branchContainer = new Container();
      rootContainer.addChild(branchContainer);

      ventures.forEach((venture) => {
        if (venture.parentId) {
          const parentPos = layout.positions.get(venture.parentId);
          const childPos = layout.positions.get(venture.id);
          if (parentPos && childPos) {
            const branch = new BranchLine({
              fromX: parentPos.x,
              fromY: parentPos.y,
              fromHeight: parentPos.height,
              toX: childPos.x,
              toY: childPos.y,
              toHeight: childPos.height,
              label: venture.branchLabel,
            });
            branchContainer.addChild(branch);
          }
        }
      });

      const nodeMap = new Map();
      const dateLabelsContainer = new Container();
      const stemsContainer = new Container();
      rootContainer.addChild(stemsContainer);
      rootContainer.addChild(dateLabelsContainer);

      layout.positions.forEach((pos, ventureId) => {
        const venture = ventures.find((v) => v.id === ventureId);
        if (venture) {
          // Add date label above the timeline
          const dateStr = new Date(venture.startedDate);
          const dateLabel = dateStr.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }).toUpperCase();

          const dateStyle = new TextStyle({
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            fill: 0xffffff,
          });
          const dateText = new Text(dateLabel, dateStyle);
          dateText.x = pos.x + 90; // Center of card (180 / 2)
          dateText.y = layout.timelineY - 30; // 14px above the line, accounting for text size
          dateText.anchor.set(0.5, 0);
          dateText.alpha = 0.5;
          dateLabelsContainer.addChild(dateText);

          // Add stem (vertical line from timeline to card)
          if (pos.stemHeight !== undefined) {
            const stem = new Graphics();
            stem.lineStyle(1, 0xffffff, 0.15);
            stem.moveTo(pos.x + 90, layout.timelineY);
            stem.lineTo(pos.x + 90, layout.timelineY + pos.stemHeight);
            stemsContainer.addChild(stem);

            // Add dot on timeline
            const dot = new Graphics();
            dot.stroke({ color: 0xffffff, width: 1, alpha: 0.7 });
            dot.circle(pos.x + 90, layout.timelineY, 4);
            stemsContainer.addChild(dot);
          }

          // Add venture card
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
        const venture = ventures.find((v) => v.id === event.ventureId);
        if (venture) {
          // Position event dot on the horizontal timeline based on event date
          // Use simple calculation: months since reference date * 120px
          const REFERENCE_DATE = new Date('2024-01-01');
          const eventDate = new Date(event.eventDate);

          const months =
            (eventDate.getFullYear() - REFERENCE_DATE.getFullYear()) * 12 +
            (eventDate.getMonth() - REFERENCE_DATE.getMonth());
          const dayOfMonth = eventDate.getDate();
          const daysInMonth = new Date(eventDate.getFullYear(), eventDate.getMonth() + 1, 0).getDate();
          const dayProgress = dayOfMonth / daysInMonth;

          const eventX = months * 120 + dayProgress * 120;

          const dot = new EventDot({
            x: eventX,
            y: layout.timelineY + 15,
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

      // Keyboard shortcuts (Alt + key)
      const handleKeyDown = (e: KeyboardEvent) => {
        // Only trigger shortcuts with Alt key
        if (!e.altKey) return;

        // Alt+N = new venture
        if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          onNewVenture?.();
        }

        // Alt+M = modify selected venture
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault();
          const selected = useStore.getState().selectedVentureId;
          if (selected) {
            onNodeDoubleClick?.(selected);
          }
        }

        // Alt+P = preview mode
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          onPreviewMode?.();
        }

        // Alt+L = ventures list
        if (e.key.toLowerCase() === 'l') {
          e.preventDefault();
          onListToggle?.();
        }

        // Alt+S = statistics
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          onStatsToggle?.();
        }

        // Alt+H = help
        if (e.key.toLowerCase() === 'h') {
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
