import { Container, Graphics, TilingSprite, Texture, Point } from 'pixi.js';

export class DotGrid extends Container {
  private tilingSprite: TilingSprite | null = null;
  private interactiveLayer: Container;
  private gridSize = 28; // pixels between dots
  private dotRadius = 1; // radius of each dot
  private mousePos = new Point(0, 0);
  private influenceRadius = 120; // how far from cursor dots are affected
  private graphics: Graphics[] = [];

  constructor() {
    super();
    this.interactiveLayer = new Container();
    this.addChild(this.interactiveLayer);
    this.createGrid();
    this.setupMouseTracking();
  }

  private createGrid() {
    // Create a canvas to draw the dot texture for base grid
    const canvas = document.createElement('canvas');
    const size = this.gridSize;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw a single dot in the center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, this.dotRadius, 0, Math.PI * 2);
    ctx.fill();

    // Create texture from canvas
    const texture = Texture.from(canvas);

    // Create tiling sprite for base grid
    this.tilingSprite = new TilingSprite({
      texture,
      width: 20000,
      height: 20000,
    });

    // subtle base alpha per spec
    this.tilingSprite.alpha = 0.07;

    this.tilingSprite.position.set(-10000, -10000);
    this.addChildAt(this.tilingSprite, 0);
  }

  private setupMouseTracking() {
    // This will be called from PixiApp to update mouse position
    // We'll set it up via a public method instead
  }

  updateForZoom(zoomLevel: number) {
    if (this.tilingSprite) {
      if (zoomLevel < 0.5) {
        this.tilingSprite.alpha = 0.08;
      } else if (zoomLevel > 2) {
        this.tilingSprite.alpha = 0.2;
      } else {
        this.tilingSprite.alpha = 0.12;
      }
    }
  }

  updateTilePosition(panX: number, panY: number) {
    if (this.tilingSprite) {
      this.tilingSprite.tilePosition.x = -panX;
      this.tilingSprite.tilePosition.y = -panY;
    }
  }

  updateMousePosition(globalX: number, globalY: number) {
    this.mousePos.set(globalX, globalY);
    this.updateInteractiveDots();
  }

  private updateInteractiveDots() {
    // Clear previous interactive dots
    this.interactiveLayer.removeChildren();
    this.graphics = [];

    const { x, y } = this.mousePos;

    // Calculate grid bounds around mouse position
    const startX = Math.floor((x - this.influenceRadius) / this.gridSize) * this.gridSize;
    const endX = Math.ceil((x + this.influenceRadius) / this.gridSize) * this.gridSize;
    const startY = Math.floor((y - this.influenceRadius) / this.gridSize) * this.gridSize;
    const endY = Math.ceil((y + this.influenceRadius) / this.gridSize) * this.gridSize;

    // Draw dots around cursor
    for (let dotX = startX; dotX <= endX; dotX += this.gridSize) {
      for (let dotY = startY; dotY <= endY; dotY += this.gridSize) {
        const distance = Math.hypot(dotX - x, dotY - y);

        // Only render dots within influence radius
        if (distance <= this.influenceRadius) {
          const influence = 1 - distance / this.influenceRadius; // 0 to 1
          const expandedRadius = this.dotRadius + influence * 1.2; // expand up to 2x
          const opacity = 0.3 + influence * 0.7; // opacity from 0.3 to 1.0

          // Push dots away from cursor slightly
          const pushDistance = influence * 8;
          const angle = Math.atan2(dotY - y, dotX - x);
          const pushedX = dotX + Math.cos(angle) * pushDistance;
          const pushedY = dotY + Math.sin(angle) * pushDistance;

          // Draw the interactive dot
          const dot = new Graphics();
          dot.circle(pushedX, pushedY, expandedRadius);
          dot.fill({ color: 0xffffff, alpha: opacity });
          this.interactiveLayer.addChild(dot);
          this.graphics.push(dot);
        }
      }
    }
  }
}
