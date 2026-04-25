import { Container, Graphics, TilingSprite, Texture } from 'pixi.js';

export class DotGrid extends Container {
  private tilingSprite: TilingSprite | null = null;
  private gridSize = 12; // pixels between dots (tight spacing)
  private dotRadius = 0.8; // radius of each dot

  constructor() {
    super();
    this.createGrid();
  }

  private createGrid() {
    // Create a canvas to draw the dot texture
    const canvas = document.createElement('canvas');
    const size = this.gridSize;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw a single dot in the center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, this.dotRadius, 0, Math.PI * 2);
    ctx.fill();

    // Create texture from canvas
    const texture = Texture.from(canvas);

    // Create tiling sprite
    this.tilingSprite = new TilingSprite({
      texture,
      width: 20000,
      height: 20000,
    });

    this.tilingSprite.position.set(-10000, -10000);
    this.addChild(this.tilingSprite);
  }

  updateForZoom(zoomLevel: number) {
    // Grid opacity adapts to zoom level
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
    // Update tile position to follow pan transform
    if (this.tilingSprite) {
      this.tilingSprite.tilePosition.x = -panX;
      this.tilingSprite.tilePosition.y = -panY;
    }
  }
}
