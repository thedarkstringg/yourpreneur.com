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
import { useStore } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';
import { easingFunctions, animateTo } from '@/lib/easingFunctions';
import { useToasts } from '../ui/Toast';

async function loadFonts() {
  try {
    await document.fonts.load('16px "Montserrat"');
    await document.fonts.load('12px "Space Grotesk"');
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
  const textObjectsRef = useRef<Text[]>([]);

  const { ventures, setZoom, setPan, setSelectedVenture } = useStore();
  const { addToast } = useToasts();

  const updateTextResolution = (zoomScale: number) => {
    const baseRes = window.devicePixelRatio || 2;
    const res = Math.min(8, baseRes * Math.max(2, zoomScale * 2));
    textObjectsRef.current.forEach(t => {
      t.resolution = res;
      // updateText is not always needed but ensures it redraws
      if ((t as any).updateText) (t as any).updateText(true);
    });
  };

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

      // Account for panels: left 240px, right 200px, top 48px, bottom 80px for toolbar
      const canvasWidth = window.innerWidth - 240 - 200;
      const canvasHeight = window.innerHeight - 48 - 80;

      await app.init({
        width: canvasWidth,
        height: canvasHeight,
        resolution: window.devicePixelRatio || 2,
        autoDensity: true,
        antialias: true,
        backgroundAlpha: 0,
        canvas: containerRef.current?.querySelector('canvas') || undefined,
      });

      if (containerRef.current && !containerRef.current.querySelector('canvas')) {
        containerRef.current.appendChild(app.canvas as HTMLCanvasElement);
      }
      appRef.current = app;

      const rootContainer = new Container();
      rootContainer.sortableChildren = true;

      const viewport = new Viewport({
        screenWidth: canvasWidth,
        screenHeight: canvasHeight,
        worldWidth: 10000,
        worldHeight: 10000,
        events: app.renderer.events,
      });

      app.stage.addChild(viewport);
      viewport.addChild(rootContainer);

      // Register canvas navigation callbacks with the store
      const navigationCancelRef = useRef<(() => void) | null>(null);

      const onNavigateToTarget = (worldX: number, worldY: number, scale?: number) => {
        // Cancel any ongoing animation
        if (navigationCancelRef.current) {
          navigationCancelRef.current();
        }

        const startX = viewport.x;
        const startY = viewport.y;
        const startScale = viewport.scale.x;
        const targetScale = scale ?? Math.max(0.8, Math.min(1.2, startScale));

        navigationCancelRef.current = animateTo(
          0,
          1,
          650,
          easingFunctions.easeInOutCubic,
          (progress) => {
            const currentX = startX + (worldX - startX) * progress;
            const currentY = startY + (worldY - startY) * progress;
            const currentScale = startScale + (targetScale - startScale) * progress;

            viewport.x = currentX;
            viewport.y = currentY;
            viewport.setZoom(currentScale);
          },
          () => {
            navigationCancelRef.current = null;
            // Show toast with venture name and date
            // Find which venture is being navigated to based on world position
            for (const [ventureId, position] of (layout as any).positions) {
              const venture = ventures.find(v => v.id === ventureId);
              if (venture && Math.abs(position.x - worldX) < 50 && Math.abs(position.y - worldY) < 50) {
                const date = new Date(venture.startedDate);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                addToast('info', `${venture.name} · ${dateStr}`);
                break;
              }
            }
          }
        );
      };

      const onNavigateToYear = (year: number) => {
        // Cancel any ongoing animation
        if (navigationCancelRef.current) {
          navigationCancelRef.current();
        }

        const targetWorldX = year * 1440;
        const startX = viewport.x;

        navigationCancelRef.current = animateTo(
          0,
          1,
          700,
          easingFunctions.easeInOutCubic,
          (progress) => {
            const currentX = startX + (targetWorldX - startX) * progress;
            viewport.x = currentX;
          },
          () => {
            navigationCancelRef.current = null;
            // Show toast with year and venture count
            const yearVentures = ventures.filter(v => {
              const vYear = new Date(v.startedDate).getFullYear();
              return vYear === (year + 2022);
            });
            const ventureCount = yearVentures.length;
            addToast('info', `Viewing ${year + 2022} · ${ventureCount} venture${ventureCount !== 1 ? 's' : ''}`);
          }
        );
      };

      useStore.setState({
        onNavigateToTarget,
        onNavigateToYear,
      });

      const dotGrid = new DotGrid();
      rootContainer.addChild(dotGrid);

      const layout = calculateLayout(ventures);

      // timeline Y at 42% from top
      const timelineY = Math.floor(window.innerHeight * 0.42);
      const timeline = new HorizontalTimeline(timelineY, layout.yearPositions);
      rootContainer.addChild(timeline);
      
      // Collect text objects from timeline for resolution updates
      timeline.children.forEach(child => {
        if (child instanceof Text) textObjectsRef.current.push(child);
      });

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
              fromWidth: 220, // New width
              fromHeight: 120, // New height
              toX: childPos.x,
              toY: childPos.y,
              toWidth: 220,
              toHeight: 120,
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
            fontFamily: 'Space Grotesk',
            fontSize: 10,
            fill: 0xffffff,
            letterSpacing: 1.5,
          });
          const dateText = new Text({ text: dateLabel, style: dateStyle });
          dateText.resolution = window.devicePixelRatio * 4;
          dateText.x = pos.x + 110; // Center of card (220/2)
          dateText.y = layout.timelineY - 18; // 18px above the line per spec
          dateText.anchor.set(0.5, 0);
          dateText.alpha = 0.45;
          dateLabelsContainer.addChild(dateText);
          textObjectsRef.current.push(dateText);

          // Add stem (vertical line from timeline to card)
          if (pos.stemHeight !== undefined) {
            const stem = new Graphics();
            const centerX = pos.x + 110;
            stem.moveTo(centerX, layout.timelineY);
            stem.lineTo(centerX, layout.timelineY + pos.stemHeight);
            stem.stroke({ width: 1, color: 0xffffff, alpha: 0.1 });
            stemsContainer.addChild(stem);

            // Add dot on timeline (use EventDot for hover/animation)
            const timelineDot = new EventDot({ 
              x: centerX, 
              y: layout.timelineY, 
              event: { ...venture, id: `v-dot-${venture.id}`, ventureId: venture.id, type: 'milestone', title: 'Venture Started', eventDate: venture.startedDate } as any 
            });
            stemsContainer.addChild(timelineDot);
          }

          // Add venture card
          const node = new VentureNode(venture, pos.x, pos.y);
          rootContainer.addChild(node);
          nodeMap.set(ventureId, node);
          
          // Collect text objects from VentureNode
          // This is a bit hacky, maybe VentureNode should expose them
          (node as any).contentContainer.children.forEach((child: any) => {
             if (child instanceof Text) textObjectsRef.current.push(child);
          });
        }
      });

      // Render event dots
      const events = useStore.getState().events;
      const eventContainer = new Container();
      rootContainer.addChild(eventContainer);

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
            style: new TextStyle({ fontFamily: 'Space Mono', fontSize: 8, fill: 0xc9a96e }) 
          });
          pivotLabel.x = (minX + maxX) / 2;
          pivotLabel.y = layout.timelineY + 32;
          pivotLabel.anchor.set(0.5, 0);
          pivotLabel.alpha = 0.5;
          eventContainer.addChild(pivotLabel);
        }
      });

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
            event: event,
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
        updateTextResolution(zoom);
      });

      interaction.onPanChangeHandler((x, y) => {
        setPan(x, y);
        dotGrid.updateTilePosition(x, y);
      });

      const handleResize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        viewport.resize(window.innerWidth, window.innerHeight);
      };

      // Track mouse position for interactive dot grid
      const handleMouseMove = (e: MouseEvent) => {
        // Get the canvas position relative to the viewport
        const canvasRect = app.canvas.getBoundingClientRect();
        const screenX = e.clientX - canvasRect.left;
        const screenY = e.clientY - canvasRect.top;

        // Convert screen coordinates to world coordinates through the viewport
        const worldPos = viewport.toWorld({ x: screenX, y: screenY });
        dotGrid.updateMousePosition(worldPos.x, worldPos.y);
      };

      // CUSTOM CURSOR: create DOM element and lerp-follow logic
      const cursorEl = document.createElement('div');
      cursorEl.id = 'custom-cursor';
      document.body.appendChild(cursorEl);

      let mouseClientX = window.innerWidth / 2;
      let mouseClientY = window.innerHeight / 2;
      let cursorX = mouseClientX;
      let cursorY = mouseClientY;
      let rafId: number | null = null;
      let isDragging = false;

      const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

      const onMouseMoveClient = (e: MouseEvent) => {
        mouseClientX = e.clientX;
        mouseClientY = e.clientY;
      };

      window.addEventListener('mousemove', onMouseMoveClient);

      const onPixiCardHover = (e: Event) => {
        // custom event from VentureNode: detail.hover true/false
        const ev = e as CustomEvent;
        if (!cursorEl) return;
        if (ev.detail?.hover) {
          cursorEl.classList.add('ring');
          cursorEl.style.width = '6px';
          cursorEl.style.height = '6px';
          cursorEl.style.background = 'rgba(255,255,255,1)';
        } else {
          cursorEl.classList.remove('ring');
          cursorEl.style.width = '10px';
          cursorEl.style.height = '10px';
          cursorEl.style.background = 'rgba(255,255,255,0.7)';
        }
      };

      window.addEventListener('pixi-card-hover', onPixiCardHover as EventListener);

      // Toolbar hover
      const toolbarEl = document.getElementById('toolbar');
      const onToolbarEnter = () => {
        cursorEl.style.width = '8px';
        cursorEl.style.height = '8px';
        cursorEl.style.background = 'rgba(255,255,255,0.9)';
      };
      const onToolbarLeave = () => {
        cursorEl.style.width = '10px';
        cursorEl.style.height = '10px';
        cursorEl.style.background = 'rgba(255,255,255,0.7)';
      };
      if (toolbarEl) {
        toolbarEl.addEventListener('mouseenter', onToolbarEnter);
        toolbarEl.addEventListener('mouseleave', onToolbarLeave);
      }

      // Dragging state on canvas
      const onPointerDown = () => {
        isDragging = true;
        cursorEl.style.width = '14px';
        cursorEl.style.height = '14px';
        cursorEl.style.background = 'rgba(255,255,255,0.4)';
      };
      const onPointerUp = () => {
        isDragging = false;
        cursorEl.style.width = '10px';
        cursorEl.style.height = '10px';
        cursorEl.style.background = 'rgba(255,255,255,0.7)';
      };
      app.canvas.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);

      const cursorLoop = () => {
        cursorX = lerp(cursorX, mouseClientX, 0.14);
        cursorY = lerp(cursorY, mouseClientY, 0.14);
        cursorEl.style.left = cursorX + 'px';
        cursorEl.style.top = cursorY + 'px';
        rafId = requestAnimationFrame(cursorLoop);
      };
      rafId = requestAnimationFrame(cursorLoop);

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
        dotGrid.tick?.();
      });

      return () => {
        // Remove global listeners
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousemove', onMouseMoveClient);
        window.removeEventListener('pixi-card-hover', onPixiCardHover as EventListener);
        window.removeEventListener('pointerup', onPointerUp);

        // Toolbar listeners
        const toolbarElCleanup = document.getElementById('toolbar');
        if (toolbarElCleanup) {
          toolbarElCleanup.removeEventListener('mouseenter', onToolbarEnter);
          toolbarElCleanup.removeEventListener('mouseleave', onToolbarLeave);
        }

        // Canvas pointerdown cleanup
        if (app && app.canvas) {
          app.canvas.removeEventListener('pointerdown', onPointerDown);
        }

        // Stop cursor loop and remove element
        if (typeof rafId === 'number') cancelAnimationFrame(rafId);
        const existingCursor = document.getElementById('custom-cursor');
        if (existingCursor && existingCursor.parentNode) existingCursor.parentNode.removeChild(existingCursor);

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
      style={{
        position: 'fixed',
        top: '48px',
        left: '240px',
        right: '200px',
        bottom: '80px',
        overflow: 'hidden',
        background: 'transparent',
      }}
    />
  );
}
