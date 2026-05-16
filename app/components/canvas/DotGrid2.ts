import { Container, Graphics, TilingSprite, Texture, Point } from 'pixi.js';

export class DotGrid extends Container {
  private tilingSprite: TilingSprite | null = null;
  private interactiveLayer: Container;
  private gridSize = 28; // pixels between dots (spec)
  private dotRadius = 1; // radius in px
  private mousePos = new Point(0, 0);
  private influenceRadius = 70; // how far from cursor dots are affected
  private graphicsMap: Map<string, Graphics> = new Map();

  constructor() {
    super();
    this.interactiveLayer = new Container();
    this.addChild(this.interactiveLayer);
    this.createGrid();
  }

  private createGrid() {
    const canvas = document.createElement('canvas');
    const size = this.gridSize;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    // Very subtle white dot per spec
    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, this.dotRadius, 0, Math.PI * 2);
    ctx.fill();

    const texture = Texture.from(canvas);

    this.tilingSprite = new TilingSprite({
      texture,
      width: 20000,
      height: 20000,
    });

    // Keep sprites positioned so tilePosition aligns with world transform
    this.tilingSprite.position.set(-10000, -10000);
    this.addChildAt(this.tilingSprite, 0);
  }

  updateForZoom(zoomLevel: number) {
    if (this.tilingSprite) {
      // Very subtle, do not emphasize on zoom
      if (zoomLevel < 0.5) {
        this.tilingSprite.alpha = 0.035;
      } else if (zoomLevel > 2) {
        this.tilingSprite.alpha = 0.045;
      } else {
        this.tilingSprite.alpha = 0.04;
      }
    }
  }

  updateTilePosition(panX: number, panY: number) {
    if (this.tilingSprite) {
      // tilePosition must move with world transform so grid feels fixed to world
      this.tilingSprite.tilePosition.x = -panX;
      this.tilingSprite.tilePosition.y = -panY;
    }

    // interactive layer stays in world coordinates; no extra transform needed here
    this.interactiveLayer.x = 0;
    this.interactiveLayer.y = 0;
  }

  updateMousePosition(globalX: number, globalY: number) {
    if (this.destroyed || !this.parent) return;
    this.mousePos.set(globalX, globalY);
    this.updateInteractiveDots();
  }

  private updateInteractiveDots() {
    const { x, y } = this.mousePos;

    const startX = Math.floor((x - this.influenceRadius) / this.gridSize) * this.gridSize;
    const endX = Math.ceil((x + this.influenceRadius) / this.gridSize) * this.gridSize;
    const startY = Math.floor((y - this.influenceRadius) / this.gridSize) * this.gridSize;
    const endY = Math.ceil((y + this.influenceRadius) / this.gridSize) * this.gridSize;

    const seen = new Set<string>();

    for (let dotX = startX; dotX <= endX; dotX += this.gridSize) {
      for (let dotY = startY; dotY <= endY; dotY += this.gridSize) {
        const distance = Math.hypot(dotX - x, dotY - y);
        const key = `${dotX}_${dotY}`;
        seen.add(key);

        let gfx = this.graphicsMap.get(key);
        if (!gfx) {
          gfx = new Graphics();
          gfx.x = dotX;
          gfx.y = dotY;
          this.interactiveLayer.addChild(gfx);
          this.graphicsMap.set(key, gfx);
        }

        if (distance <= this.influenceRadius) {
          const influence = 1 - distance / this.influenceRadius;
          const expandedRadius = this.dotRadius + influence * 1.5;
          let opacity = 0.04 + influence * 0.34;
          if (influence > 0.9) opacity = 0.46;

          const pushDistance = influence * 10;
          const angle = Math.atan2(dotY - y, dotX - x);
          const targetX = dotX + Math.cos(angle) * pushDistance;
          const targetY = dotY + Math.sin(angle) * pushDistance;

          gfx.clear();
          gfx.beginFill(0xffffff, opacity);
          gfx.drawCircle(0, 0, expandedRadius);
          gfx.endFill();
          gfx.x = targetX;
          gfx.y = targetY;
          gfx.alpha = 1;
        } else {
          gfx.clear();
          gfx.beginFill(0xffffff, 0.035);
          gfx.drawCircle(0, 0, this.dotRadius);
          gfx.endFill();
          gfx.x = dotX;
          gfx.y = dotY;
          gfx.alpha = 1;
        }
      }
    }

    const keysToRemove: string[] = [];
    for (const key of this.graphicsMap.keys()) {
      if (!seen.has(key)) {
        const [gx, gy] = key.split('_').map(Number);
        const distance = Math.hypot(gx - x, gy - y);
        if (distance > this.influenceRadius + this.gridSize * 2) {
          const g = this.graphicsMap.get(key);
          if (g) {
            this.interactiveLayer.removeChild(g);
            g.destroy();
          }
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((k) => this.graphicsMap.delete(k));
  }

  tick() {
    // placeholder for future smoothing
  }
}
