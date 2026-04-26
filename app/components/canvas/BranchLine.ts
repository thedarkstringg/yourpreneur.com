import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface BranchLineOptions {
  fromX: number;
  fromY: number;
  fromWidth?: number;
  fromHeight: number;
  toX: number;
  toY: number;
  toWidth?: number;
  toHeight: number;
  label?: string;
}

export class BranchLine extends Container {
  private line: Graphics;
  private labelText?: Text;

  constructor(options: BranchLineOptions) {
    super();
    this.line = new Graphics();
    this.drawBranchLine(options);
    this.addChild(this.line);

    if (options.label) {
      this.addLabel(options);
    }
  }

  private drawBranchLine(options: BranchLineOptions) {
    const { fromX, fromY, fromHeight, toX, toY } = options;

    // Start: right edge of parent card (center height)
    const parentRight = fromX + (options.fromWidth ?? 220);
    const parentCenterY = fromY + fromHeight / 2;

    // End: top-center of child card
    const childCenterX = toX + (options.toWidth ?? 220) / 2;
    const childTop = toY;

    const startX = parentRight;
    const startY = parentCenterY;
    const endX = childCenterX;
    const endY = childTop;

    // Control points per spec
    const cp1x = parentRight + 60;
    const cp1y = parentCenterY;
    const cp2x = childCenterX;
    const cp2y = childTop - 60;

    // Sample points along the cubic bezier
    const points: { x: number; y: number }[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = Math.pow(1 - t, 3) * startX + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * endX;
      const y = Math.pow(1 - t, 3) * startY + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * endY;
      points.push({ x, y });
    }

    // Draw dashed using simple on/off segment pattern [3,9] (in segment counts)
    const patternLen = 12; // 3 on, 9 off
    const onCount = 3;
    for (let i = 1; i < points.length; i++) {
      const idx = i % patternLen;
      if (idx < onCount) {
        const p0 = points[i - 1];
        const p1 = points[i];
        this.line.moveTo(p0.x, p0.y);
        this.line.lineTo(p1.x, p1.y);
      }
    }
    this.line.stroke({ width: 1, color: 0xffffff, alpha: 0.1 });
  }

  private addLabel(options: BranchLineOptions) {
    if (!options.label) return;

    const { fromX, fromY, fromHeight, toX, toY } = options;

    const startX = fromX + (options.fromWidth ?? 220);
    const startY = fromY + fromHeight / 2;
    const endX = toX + (options.toWidth ?? 220) / 2;
    const endY = toY;

    // Position label at midpoint
    const labelX = (startX + endX) / 2;
    const labelY = (startY + endY) / 2;

    const labelStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 8,
      fill: 0xffffff,
      fontWeight: '500',
    });

    this.labelText = new Text({ text: options.label, style: labelStyle });
    this.labelText.resolution = window.devicePixelRatio * 4;
    this.labelText.anchor.set(0.5, 0.5);
    // Measure and draw pill background
    const paddingX = 8;
    const paddingY = 2;
    const textW = this.labelText.width;
    const textH = this.labelText.height;
    const pillW = textW + paddingX * 2;
    const pillH = textH + paddingY * 2;
    const pill = new Graphics();
    pill.roundRect(labelX - pillW / 2, labelY - pillH / 2, pillW, pillH, 999);
    pill.fill({ color: 0x120e0e, alpha: 0.95 });
    pill.stroke({ width: 1, color: 0xffffff, alpha: 0.08 });
    pill.alpha = 1;

    this.labelText.x = labelX;
    this.labelText.y = labelY;
    this.labelText.alpha = 0.3;

    this.addChild(pill);
    this.addChild(this.labelText);
  }
}
