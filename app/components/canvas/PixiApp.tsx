'use client';

import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { DotGrid } from './DotGrid2';
import { HorizontalTimeline } from './HorizontalTimeline';
import { VentureNode } from './VentureNode';
import { BranchLine } from './BranchLine';
import { EventDot } from './EventDot';
import { InteractionManager } from './InteractionManager';
import { VentureEvent, useStore } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';

async function loadFonts() {
  try {
    await document.fonts.load('16px "Plus Jakarta Sans"');
    await document.fonts.load('12px "Inter"');
    await document.fonts.ready;
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
  taskTopologyVentureId,
}: {
  onNodeDoubleClick?: (ventureId: string) => void;
  onNewVenture?: () => void;
  onPreviewMode?: () => void;
  onHelpToggle?: () => void;
  onListToggle?: () => void;
  onStatsToggle?: () => void;
  taskTopologyVentureId?: string | null;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const textObjectsRef = useRef<Text[]>([]);
  const nodeMapRef = useRef<Map<string, VentureNode>>(new Map());
  const navigationFrameRef = useRef<number | null>(null);

  const { ventures, tasks, taskConnections, selectedVentureId, updateVenture, setZoom, setPan, setSelectedVenture, setCanvasNavigationCallbacks } = useStore();

  const updateTextResolution = (zoomScale: number) => {
    const baseRes = window.devicePixelRatio || 2;
    const res = Math.min(8, baseRes * Math.max(2, zoomScale * 2));
    textObjectsRef.current.forEach(t => {
      if (!t.destroyed) {
        t.resolution = res;
      }
    });
  };

  useEffect(() => {
    nodeMapRef.current.forEach((node, nodeId) => {
      node.setSelected(nodeId === selectedVentureId);
    });
  }, [selectedVentureId]);

  useEffect(() => {
    if (!containerRef.current) return;
    let isMounted = true;

    const initCanvas = async () => {
      await loadFonts();
      if (!isMounted || !containerRef.current) return;

      // Clean up old canvas if it exists
      const oldCanvas = containerRef.current.querySelector('canvas');
      if (oldCanvas) oldCanvas.remove();

      // Destroy old app if it exists
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }

      textObjectsRef.current = [];

      const app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 2,
        autoDensity: true,
        antialias: true,
        backgroundAlpha: 0,
      });

      if (!isMounted || !containerRef.current) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      containerRef.current.appendChild(app.canvas as HTMLCanvasElement);
      appRef.current = app;
      nodeMapRef.current = new Map();

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

      // timeline Y at 42% from top
      const timelineY = layout.timelineY;
      const timeline = new HorizontalTimeline(timelineY, layout.yearPositions);
      rootContainer.addChild(timeline);
      timeline.startLoadAnimation();

      const aboveLane = new Text({
        text: 'STEALTH / IDEATION',
        style: new TextStyle({ fontFamily: 'Inter', fontSize: 9, fill: 'rgba(255,255,255,0.26)', letterSpacing: 1.4 }),
      });
      aboveLane.resolution = window.devicePixelRatio * 4;
      aboveLane.x = -200;
      aboveLane.y = timelineY - 180;
      rootContainer.addChild(aboveLane);
      textObjectsRef.current.push(aboveLane);

      const belowLane = new Text({
        text: 'ACTIVE / LAUNCHED',
        style: new TextStyle({ fontFamily: 'Inter', fontSize: 9, fill: 'rgba(255,255,255,0.26)', letterSpacing: 1.4 }),
      });
      belowLane.resolution = window.devicePixelRatio * 4;
      belowLane.x = -200;
      belowLane.y = timelineY + 74;
      rootContainer.addChild(belowLane);
      textObjectsRef.current.push(belowLane);
      
      // Collect text objects from timeline for resolution updates
      timeline.children.forEach(child => {
        if (child instanceof Text) textObjectsRef.current.push(child);
      });

      // Add branch lines
      const branchContainer = new Container();
      rootContainer.addChild(branchContainer);

      ventures.forEach((venture, branchIndex) => {
        if (venture.parentId) {
          const parentPos = layout.positions.get(venture.parentId);
          const childPos = layout.positions.get(venture.id);
          if (parentPos && childPos) {
            const branch = new BranchLine({
              fromX: parentPos.x,
              fromY: parentPos.y,
              fromWidth: 220,
              fromHeight: 120,
              toX: childPos.x,
              toY: childPos.y,
              toWidth: 220,
              toHeight: 120,
              label: venture.branchLabel,
            });
            branchContainer.addChild(branch);
            branch.startLoadAnimation(branchIndex);
            if (branch.children) {
               branch.children.forEach(c => {
                 if (c instanceof Text) textObjectsRef.current.push(c);
               });
            }
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
            month: 'short', day: 'numeric',
          }).toUpperCase();

          const dateStyle = new TextStyle({
            fontFamily: 'Inter', fontSize: 10, fill: 0xffffff, letterSpacing: 1.5,
          });
          const dateText = new Text({ text: dateLabel, style: dateStyle });
          dateText.resolution = window.devicePixelRatio * 4;
          dateText.x = pos.x + 110; // Center of card (220/2)
          dateText.y = layout.timelineY - 30;
          dateText.anchor.set(0.5, 0);
          dateText.alpha = 0.72;

          const datePill = new Graphics();
          const pillWidth = dateText.width + 24;
          const pillHeight = 20;
          datePill.roundRect(dateText.x - pillWidth / 2, dateText.y - 4, pillWidth, pillHeight, 999);
          datePill.fill({ color: 0x060606, alpha: 0.86 });
          datePill.stroke({ width: 1, color: 0xffffff, alpha: 0.1 });
          dateLabelsContainer.addChild(datePill);
          dateLabelsContainer.addChild(dateText);
          textObjectsRef.current.push(dateText);

          if (pos.stemHeight !== undefined) {
            const stem = new Graphics();
            const centerX = pos.x + 110;
            stem.moveTo(centerX, layout.timelineY + (pos.stemHeight < 0 ? -10 : 10));
            stem.lineTo(centerX, layout.timelineY + pos.stemHeight);
            stem.stroke({ width: 1.8, color: 0xffffff, alpha: 0.62 });
            stem.circle(centerX, layout.timelineY, 3);
            stem.fill({ color: venture.color ? parseInt(venture.color.slice(1), 16) : 0xffffff, alpha: 0.75 });
            stemsContainer.addChild(stem);

            const timelineDot = new EventDot({ 
              x: centerX, 
              y: layout.timelineY, 
              event: { ...venture, id: `v-dot-${venture.id}`, ventureId: venture.id, type: 'milestone', title: 'Venture Started', eventDate: venture.startedDate } as VentureEvent
            });
            stemsContainer.addChild(timelineDot);
          }

          const node = new VentureNode(venture, pos.x, pos.y);
          rootContainer.addChild(node);
          nodeMap.set(ventureId, node);
          nodeMapRef.current.set(ventureId, node);
          
          if (node.contentContainer) {
            node.contentContainer.children.forEach((child) => {
               if (child instanceof Text) textObjectsRef.current.push(child);
            });
          }
        }
      });

      if (taskTopologyVentureId) {
        const anchor = layout.positions.get(taskTopologyVentureId);
        const venture = ventures.find((item) => item.id === taskTopologyVentureId);
        if (anchor && venture) {
          const topology = new Container();
          topology.zIndex = 8;
          rootContainer.addChild(topology);

          const rootX = anchor.x + 110;
          const rootY = anchor.y + 60;
          const taskIds = new Set(tasks.filter((task) => task.ventureId === taskTopologyVentureId).map((task) => task.id));
          let changed = true;
          while (changed) {
            changed = false;
            taskConnections.forEach((connection) => {
              if (taskIds.has(connection.fromTaskId) && !taskIds.has(connection.toTaskId)) {
                taskIds.add(connection.toTaskId);
                changed = true;
              }
              if (taskIds.has(connection.toTaskId) && !taskIds.has(connection.fromTaskId)) {
                taskIds.add(connection.fromTaskId);
                changed = true;
              }
            });
          }

          const visibleTasks = tasks.filter((task) => taskIds.has(task.id));
          const taskPositions = new Map<string, { x: number; y: number }>();
          const radius = 260;

          visibleTasks.forEach((task, index) => {
            const angle = -Math.PI / 2 + (index / Math.max(1, visibleTasks.length)) * Math.PI * 2;
            const x = rootX + Math.cos(angle) * radius - 90;
            const y = rootY + Math.sin(angle) * radius - 42;
            taskPositions.set(task.id, { x, y });
          });

          const label = new Text({
            text: `${venture.name.toUpperCase()} TASK TOPOLOGY`,
            style: new TextStyle({ fontFamily: 'Inter', fontSize: 10, fill: 'rgba(255,255,255,0.48)', letterSpacing: 1.4 }),
          });
          label.resolution = window.devicePixelRatio * 4;
          label.x = rootX - 96;
          label.y = rootY - radius - 76;
          topology.addChild(label);
          textObjectsRef.current.push(label);

          visibleTasks
            .filter((task) => task.ventureId === taskTopologyVentureId)
            .forEach((task) => {
              const pos = taskPositions.get(task.id);
              if (!pos) return;
              const line = new Graphics();
              line.moveTo(rootX, rootY);
              line.lineTo(pos.x + 90, pos.y + 42);
              line.stroke({ width: 1.35, color: 0xffffff, alpha: 0.22 });
              topology.addChild(line);
            });

          taskConnections.forEach((connection) => {
            const from = taskPositions.get(connection.fromTaskId);
            const to = taskPositions.get(connection.toTaskId);
            if (!from || !to) return;
            const line = new Graphics();
            line.moveTo(from.x + 90, from.y + 42);
            line.lineTo(to.x + 90, to.y + 42);
            line.stroke({ width: 1.2, color: 0xffffff, alpha: 0.16 });
            topology.addChild(line);
          });

          visibleTasks.forEach((task) => {
            const pos = taskPositions.get(task.id);
            if (!pos) return;
            const card = new Graphics();
            card.roundRect(pos.x, pos.y, 180, 84, 10);
            card.fill({ color: 0x080808, alpha: 0.96 });
            card.stroke({ width: 1, color: task.status === 'blocked' ? 0xff9687 : 0xffffff, alpha: task.status === 'blocked' ? 0.45 : 0.16 });
            topology.addChild(card);

            const status = new Text({
              text: `${task.status.toUpperCase()} / ${task.role.toUpperCase()}`,
              style: new TextStyle({ fontFamily: 'Inter', fontSize: 8, fill: 'rgba(255,255,255,0.38)', letterSpacing: 1 }),
            });
            status.resolution = window.devicePixelRatio * 4;
            status.x = pos.x + 12;
            status.y = pos.y + 11;
            topology.addChild(status);
            textObjectsRef.current.push(status);

            const title = new Text({
              text: task.title.length > 28 ? `${task.title.slice(0, 28)}...` : task.title,
              style: new TextStyle({ fontFamily: 'Plus Jakarta Sans', fontSize: 13, fill: 'rgba(255,255,255,0.88)', fontWeight: '700', wordWrap: true, wordWrapWidth: 152 }),
            });
            title.resolution = window.devicePixelRatio * 4;
            title.x = pos.x + 12;
            title.y = pos.y + 30;
            topology.addChild(title);
            textObjectsRef.current.push(title);

            const due = new Text({
              text: new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(),
              style: new TextStyle({ fontFamily: 'Inter', fontSize: 9, fill: 'rgba(255,255,255,0.34)' }),
            });
            due.resolution = window.devicePixelRatio * 4;
            due.x = pos.x + 12;
            due.y = pos.y + 64;
            topology.addChild(due);
            textObjectsRef.current.push(due);
          });
        }
      }

      const animateViewportTo = (worldX: number, worldY: number, scale?: number, duration = 680) => {
        if (navigationFrameRef.current !== null) {
          cancelAnimationFrame(navigationFrameRef.current);
        }

        const startCenter = viewport.center.clone();
        const startScale = viewport.scale.x;
        const targetScale = Math.max(0.72, Math.min(1.18, scale ?? startScale));
        const start = performance.now();

        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          const nextScale = startScale + (targetScale - startScale) * eased;
          const nextX = startCenter.x + (worldX - startCenter.x) * eased;
          const nextY = startCenter.y + (worldY - startCenter.y) * eased;
          viewport.setZoom(nextScale, true);
          viewport.moveCenter(nextX, nextY);
          setZoom(nextScale);
          setPan(viewport.x, viewport.y);

          if (t < 1) {
            navigationFrameRef.current = requestAnimationFrame(step);
          } else {
            navigationFrameRef.current = null;
          }
        };

        navigationFrameRef.current = requestAnimationFrame(step);
      };

      setCanvasNavigationCallbacks(
        (worldX, worldY, scale) => animateViewportTo(worldX, worldY, scale),
        (year) => {
          const yearX = layout.yearPositions.get(year) ?? (year - 2024) * 1440;
          animateViewportTo(yearX + 360, layout.timelineY + 170, viewport.scale.x, 720);
          window.dispatchEvent(new CustomEvent('flash-year-watermark', { detail: { year } }));
        }
      );

      const events = useStore.getState().events;
      const eventContainer = new Container();
      rootContainer.addChild(eventContainer);

      const revenueTopography = new Graphics();
      ventures.forEach((venture) => {
        const pos = layout.positions.get(venture.id);
        const values = venture.mrrTrend;
        if (!pos || !values?.length) return;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = Math.max(1, max - min);
        const startX = pos.x;
        const baseY = layout.timelineY - 78;
        values.forEach((value, index) => {
          const x = startX + (index / Math.max(1, values.length - 1)) * 220;
          const y = baseY - ((value - min) / range) * 42;
          if (index === 0) revenueTopography.moveTo(x, y);
          else revenueTopography.lineTo(x, y);
        });
        revenueTopography.stroke({
          width: 1.25,
          color: venture.color ? parseInt(venture.color.slice(1), 16) : 0xffffff,
          alpha: 0.34,
        });
      });
      eventContainer.addChild(revenueTopography);

      const topographyLabel = new Text({
        text: 'REVENUE TOPOGRAPHY',
        style: new TextStyle({ fontFamily: 'Inter', fontSize: 8, fill: 'rgba(255,255,255,0.28)', letterSpacing: 1.3 }),
      });
      topographyLabel.resolution = window.devicePixelRatio * 4;
      topographyLabel.x = -80;
      topographyLabel.y = layout.timelineY - 142;
      eventContainer.addChild(topographyLabel);
      textObjectsRef.current.push(topographyLabel);

      // Pivot detection visual
      ventures.forEach(v => {
        const vPivots = events
          .filter(e => e.ventureId === v.id && e.type === 'pivot')
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        
        if (vPivots.length >= 2) {
          const pivotDots: number[] = [];
          vPivots.forEach(ep => {
            const REFERENCE_DATE = new Date('2024-01-01');
            const eventDate = new Date(ep.eventDate);
            const months = (eventDate.getFullYear() - REFERENCE_DATE.getFullYear()) * 12 + (eventDate.getMonth() - REFERENCE_DATE.getMonth());
            const dayOfMonth = eventDate.getDate();
            const daysInMonth = new Date(eventDate.getFullYear(), eventDate.getMonth() + 1, 0).getDate();
            const eventX = months * 120 + (dayOfMonth / daysInMonth) * 120;
            pivotDots.push(eventX);
          });

          const minX = Math.min(...pivotDots);
          const maxX = Math.max(...pivotDots);
          const bracket = new Graphics();
          bracket.moveTo(minX, layout.timelineY + 25);
          bracket.lineTo(minX, layout.timelineY + 30);
          bracket.lineTo(maxX, layout.timelineY + 30);
          bracket.lineTo(maxX, layout.timelineY + 25);
          bracket.stroke({ width: 1, color: 0xc9a96e, alpha: 0.3 });
          eventContainer.addChild(bracket);

          const pivotLabel = new Text({ 
            text: `${vPivots.length} PIVOTS`, 
            style: new TextStyle({ fontFamily: 'Inter', fontSize: 8, fill: 0xc9a96e }) 
          });
          pivotLabel.x = (minX + maxX) / 2;
          pivotLabel.y = layout.timelineY + 32;
          pivotLabel.anchor.set(0.5, 0);
          pivotLabel.alpha = 0.5;
          eventContainer.addChild(pivotLabel);
          textObjectsRef.current.push(pivotLabel);
        }
      });

      void events;

      const interaction = new InteractionManager(app, viewport, rootContainer);
      nodeMap.forEach(node => interaction.registerNode(node));

      interaction.onNodeClickHandler(nodeId => setSelectedVenture(nodeId));
      interaction.onNodeDoubleClickHandler(nodeId => onNodeDoubleClick?.(nodeId));
      interaction.onNodeMoveHandler((nodeId, x, y) => updateVenture(nodeId, { position: { x, y } }));
      interaction.onZoomChangeHandler(zoom => {
        setZoom(zoom);
        dotGrid.updateForZoom(zoom);
        updateTextResolution(zoom);
      });
      interaction.onPanChangeHandler((x, y) => {
        setPan(x, y);
        dotGrid.updateTilePosition(x, y);
      });

      const handleResize = () => {
        if (!isMounted || !appRef.current) return;
        appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
        viewport.resize(window.innerWidth, window.innerHeight);
      };

      let cursorEl = document.getElementById('custom-cursor');
      if (!cursorEl) {
        cursorEl = document.createElement('div');
        cursorEl.id = 'custom-cursor';
        document.body.appendChild(cursorEl);
      }

      let mouseClientX = window.innerWidth / 2;
      let mouseClientY = window.innerHeight / 2;
      let cursorX = mouseClientX;
      let cursorY = mouseClientY;
      let rafId: number | null = null;

      const onMouseMoveClient = (e: MouseEvent) => {
        if (!isMounted || !appRef.current?.canvas) return;
        mouseClientX = e.clientX;
        mouseClientY = e.clientY;
        const canvasRect = appRef.current.canvas.getBoundingClientRect();
        const worldPos = viewport.toWorld({ x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top });
        dotGrid.updateMousePosition(worldPos.x, worldPos.y);
      };
      window.addEventListener('mousemove', onMouseMoveClient);

      const onPixiCardHover = (e: Event) => {
        const ev = e as CustomEvent;
        if (!cursorEl) return;
        if (ev.detail?.hover) {
          cursorEl.classList.add('ring');
          cursorEl.style.width = '6px'; cursorEl.style.height = '6px';
          cursorEl.style.background = 'rgba(255,255,255,1)';
        } else {
          cursorEl.classList.remove('ring');
          cursorEl.style.width = '10px'; cursorEl.style.height = '10px';
          cursorEl.style.background = 'rgba(255,255,255,0.7)';
        }
      };
      window.addEventListener('pixi-card-hover', onPixiCardHover as EventListener);
      window.addEventListener('event-dot-hover', onPixiCardHover as EventListener);

      const cursorLoop = () => {
        cursorX = cursorX + (mouseClientX - cursorX) * 0.14;
        cursorY = cursorY + (mouseClientY - cursorY) * 0.14;
        if (cursorEl) {
          cursorEl.style.left = cursorX + 'px';
          cursorEl.style.top = cursorY + 'px';
        }
        rafId = requestAnimationFrame(cursorLoop);
      };
      rafId = requestAnimationFrame(cursorLoop);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!e.altKey) return;
        if (e.key.toLowerCase() === 'n') { e.preventDefault(); onNewVenture?.(); }
        if (e.key.toLowerCase() === 'm') { 
          e.preventDefault(); 
          const selected = useStore.getState().selectedVentureId;
          if (selected) onNodeDoubleClick?.(selected);
        }
        if (e.key.toLowerCase() === 's') { e.preventDefault(); onStatsToggle?.(); }
        if (e.key.toLowerCase() === 'h') { e.preventDefault(); onHelpToggle?.(); }
      };
      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);

      app.ticker.add(() => dotGrid.tick?.());

      return () => {
        isMounted = false;
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousemove', onMouseMoveClient);
        window.removeEventListener('pixi-card-hover', onPixiCardHover as EventListener);
        window.removeEventListener('event-dot-hover', onPixiCardHover as EventListener);
        if (typeof rafId === 'number') cancelAnimationFrame(rafId);
        if (navigationFrameRef.current !== null) {
          cancelAnimationFrame(navigationFrameRef.current);
          navigationFrameRef.current = null;
        }
        setCanvasNavigationCallbacks(undefined, undefined);
        nodeMapRef.current = new Map();
        if (appRef.current) {
          appRef.current.destroy(true, { children: true, texture: true });
          appRef.current = null;
        }
      };
    };

    initCanvas();
  }, [ventures, tasks, taskConnections, taskTopologyVentureId, setCanvasNavigationCallbacks, setPan, setSelectedVenture, setZoom, updateVenture]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-[#0c0a0a]"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.095) 1px, transparent 0)',
        backgroundSize: '28px 28px',
        backgroundPosition: 'center',
      }}
    />
  );
}
