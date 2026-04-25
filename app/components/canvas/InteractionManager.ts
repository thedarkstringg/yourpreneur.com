import { Application, Container } from 'pixi.js';
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
        const bounds = node.getBounds();
        const worldBounds = this.viewport.toWorld({
          x: canvasX,
          y: canvasY,
        } as any);

        if (
          worldBounds.x >= bounds.x &&
          worldBounds.x <= bounds.x + bounds.width &&
          worldBounds.y >= bounds.y &&
          worldBounds.y <= bounds.y + bounds.height
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

    node.on('pointerdown', () => {
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
