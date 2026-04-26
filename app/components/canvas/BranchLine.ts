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
  private options: BranchLineOptions;
  private pill?: Graphics;

  constructor(options: BranchLineOptions) {
    super();
    this.line = new Graphics();
    this.options = options;
    this.addChild(this.line);

    if (options.label) {
      this.addLabel(options);
    }
  }

  private getBezierPoints(fromX: number, fromY: number, fromHeight: number, toX: number, toY: number, fromWidth?: number, toWidth?: number) {
    // Start: right edge of parent card (center height)
    const parentRight = fromX + (fromWidth ?? 220);
    const parentCenterY = fromY + fromHeight / 2;

    // End: top-center of child card
    const childCenterX = toX + (toWidth ?? 220) / 2;
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
    return points;
  }

  private drawBranchLine(progress: number) {
    const { fromX, fromY, fromHeight, toX, toY, fromWidth, toWidth } = this.options;
    const points = this.getBezierPoints(fromX, fromY, fromHeight, toX, toY, fromWidth, toWidth);

    this.line.clear();

    // Draw dashed using simple on/off segment pattern [3,9] (in segment counts)
    const patternLen = 12; // 3 on, 9 off
    const onCount = 3;
    const maxSegments = Math.floor(points.length * progress);

    for (let i = 1; i < maxSegments; i++) {
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

    const { fromX, fromY, fromHeight, toX, toY, fromWidth, toWidth } = options;

    const startX = fromX + (fromWidth ?? 220);
    const startY = fromY + fromHeight / 2;
    const endX = toX + (toWidth ?? 220) / 2;
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
    this.pill = new Graphics();
    this.pill.roundRect(labelX - pillW / 2, labelY - pillH / 2, pillW, pillH, 999);
    this.pill.fill({ color: 0x120e0e, alpha: 0.95 });
    this.pill.stroke({ width: 1, color: 0xffffff, alpha: 0.08 });
    this.pill.alpha = 0;

    this.labelText.x = labelX;
    this.labelText.y = labelY;
    this.labelText.alpha = 0;

    this.addChild(this.pill);
    this.addChild(this.labelText);
  }

  startLoadAnimation(staggerIndex: number = 0) {
    const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Branch lines draw animation (t=1100ms + stagger, duration 450ms)
    const lineStart = Date.now();
    const lineDelay = 1100 + staggerIndex * 40; // 40ms stagger per branch
    const lineDuration = 450;

    const lineAnimate = () => {
      const elapsed = Date.now() - lineStart;
      if (elapsed < lineDelay) {
        requestAnimationFrame(lineAnimate);
        return;
      }

      const t = Math.min(1, (elapsed - lineDelay) / lineDuration);
      const eased = easeInOutCubic(t);
      this.drawBranchLine(eased);

      if (t < 1) requestAnimationFrame(lineAnimate);
    };
    lineAnimate();

    // Label fade-in (starts after line animation)
    if (this.labelText && this.pill) {
      const labelStart = Date.now();
      const labelDelay = lineDelay + lineDuration;
      const labelDuration = 300;

      const labelAnimate = () => {
        const elapsed = Date.now() - labelStart;
        if (elapsed < labelDelay) {
          requestAnimationFrame(labelAnimate);
          return;
        }

        const t = Math.min(1, (elapsed - labelDelay) / labelDuration);
        const eased = easeInOutCubic(t);
        this.labelText!.alpha = 0.3 * eased;
        this.pill!.alpha = eased;

        if (t < 1) requestAnimationFrame(labelAnimate);
      };
      labelAnimate();
    }
  }
}
