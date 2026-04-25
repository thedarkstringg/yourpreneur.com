import { Container, Graphics } from 'pixi.js';

export class DotGrid extends Container {
  private graphics: Graphics;

  constructor(width: number = 10000, height: number = 10000) {
    super();

    this.graphics = new Graphics();
    this.drawGrid(width, height);
    this.addChild(this.graphics);
  }

  private drawGrid(width: number, height: number) {
    this.graphics.stroke({
      color: 0xffffff,
      width: 0.5,
      alpha: 0.15,
    });

    const dotSpacing = 50; // pixels between dots

    // Draw vertical lines
    for (let x = 0; x <= width; x += dotSpacing) {
      this.graphics.moveTo(x, 0);
      this.graphics.lineTo(x, height);
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += dotSpacing) {
      this.graphics.moveTo(0, y);
      this.graphics.lineTo(width, y);
    }
  }

  updateForZoom(zoomLevel: number) {
    // Adjust grid opacity based on zoom
    if (zoomLevel < 0.5) {
      this.graphics.alpha = 0.08;
    } else if (zoomLevel > 2) {
      this.graphics.alpha = 0.2;
    } else {
      this.graphics.alpha = 0.15;
    }
  }

  updateTilePosition(_panX: number, _panY: number) {
    // Grid doesn't need position updates in this simplified version
  }
}
