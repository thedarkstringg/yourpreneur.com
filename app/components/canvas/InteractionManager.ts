import { Application, Container, Point } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { VentureNode } from './VentureNode';

export class InteractionManager {
  private app: Application;
  private viewport: Viewport;
  private rootContainer: Container;
  private ventureNodes: Map<string, VentureNode>;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private selectedNodeId: string | null = null;
  private onNodeClick: (nodeId: string) => void = () => {};
  private onNodeDoubleClick: (nodeId: string) => void = () => {};
  private onNodeMove: (nodeId: string, x: number, y: number) => void = () => {};
  private onZoomChange: (zoom: number) => void = () => {};
  private onPanChange: (x: number, y: number) => void = () => {};
  private lastClickTime: number = 0;
  private lastClickNodeId: string | null = null;

  constructor(
    app: Application,
    viewport: Viewport,
    rootContainer: Container
  ) {
    this.app = app;
    this.viewport = viewport;
    this.rootContainer = rootContainer;
    this.ventureNodes = new Map();

    this.setupViewportInteractions();
    this.setupCanvasInteractions();
  }

  private setupViewportInteractions() {
    // Setup drag/pan
    this.viewport.drag();

    // Setup zoom with mouse wheel
    this.viewport
      .wheel({
        smooth: 8,
        percent: 0.1,
      })
      .clampZoom({
        minWidth: 500,
        minHeight: 500,
        maxWidth: 10000,
        maxHeight: 10000,
      });

    // Listen to viewport events
    this.viewport.on('zoomed', () => {
      const zoom = this.viewport.scale.x;
      this.onZoomChange(zoom);
    });

    this.viewport.on('moved', () => {
      this.onPanChange(this.viewport.x, this.viewport.y);
    });
  }

  private setupCanvasInteractions() {
    // Canvas click for deselection
    this.app.canvas.addEventListener('click', (e) => {
      const rect = this.app.canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;

      // Check if click is on a node
      let clickedNode = false;
      for (const node of this.ventureNodes.values()) {
        const localBounds = node.getBounds();
        // convert node world position to compare with worldBounds
        const nodeWorldX = node.x;
        const nodeWorldY = node.y;
        const worldBounds = this.viewport.toWorld(new Point(canvasX, canvasY));

        if (
          worldBounds.x >= nodeWorldX &&
          worldBounds.x <= nodeWorldX + 220 && // card width
          worldBounds.y >= nodeWorldY &&
          worldBounds.y <= nodeWorldY + node.getCardHeight() // card height
        ) {
          clickedNode = true;
          break;
        }
      }

      if (!clickedNode) {
        this.deselectAll();
      }
    });
  }

  registerNode(node: VentureNode) {
    const venture = node.getVenture();
    this.ventureNodes.set(venture.id, node);

    node.on('pointerover', () => {
      node.setHovered(true);
    });

    node.on('pointerout', () => {
      node.setHovered(false);
    });

    node.on('pointerdown', (event) => {
      if (node.handlePointerAction(event.global.x, event.global.y)) {
        return;
      }
      event.stopPropagation();

      const now = Date.now();
      const isDoubleClick =
        venture.id === this.lastClickNodeId &&
        now - this.lastClickTime < 300;

      if (isDoubleClick) {
        this.onNodeDoubleClick(venture.id);
      } else {
        this.selectNode(venture.id);
        this.onNodeClick(venture.id);
      }

      this.lastClickTime = now;
      this.lastClickNodeId = venture.id;

      const startX = event.global.x;
      const startY = event.global.y;
      const originX = node.x;
      const originY = node.y;
      let moved = false;

      const onMove = (moveEvent: PointerEvent) => {
        if (!this.app?.canvas) return;
        const rect = this.app.canvas.getBoundingClientRect();
        const nextX = originX + (moveEvent.clientX - rect.left - startX) / this.viewport.scale.x;
        const nextY = originY + (moveEvent.clientY - rect.top - startY) / this.viewport.scale.y;
        if (Math.hypot(nextX - originX, nextY - originY) > 4) moved = true;
        if (moved) {
          node.x = nextX;
          node.y = nextY;
        }
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        if (moved) {
          this.onNodeMove(venture.id, node.x, node.y);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  selectNode(nodeId: string) {
    this.deselectAll();
    this.selectedNodeId = nodeId;
    const node = this.ventureNodes.get(nodeId);
    if (node) {
      node.setSelected(true);
    }
  }

  deselectAll() {
    if (this.selectedNodeId) {
      const node = this.ventureNodes.get(this.selectedNodeId);
      if (node) {
        node.setSelected(false);
      }
      this.selectedNodeId = null;
    }
  }

  onNodeClickHandler(callback: (nodeId: string) => void) {
    this.onNodeClick = callback;
  }

  onNodeDoubleClickHandler(callback: (nodeId: string) => void) {
    this.onNodeDoubleClick = callback;
  }

  onNodeMoveHandler(callback: (nodeId: string, x: number, y: number) => void) {
    this.onNodeMove = callback;
  }

  onZoomChangeHandler(callback: (zoom: number) => void) {
    this.onZoomChange = callback;
  }

  onPanChangeHandler(callback: (x: number, y: number) => void) {
    this.onPanChange = callback;
  }

  getViewport(): Viewport {
    return this.viewport;
  }
}
