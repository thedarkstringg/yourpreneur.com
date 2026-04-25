import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface BranchLineOptions {
  fromX: number;
  fromY: number;
  fromHeight: number;
  toX: number;
  toY: number;
  toHeight: number;
  label?: string;
  isBranch?: boolean;
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
    const { fromX, fromY, fromHeight, toX, toY, toHeight } = options;

    const startX = fromX;
    const startY = fromY + fromHeight / 2;
    const endX = toX;
    const endY = toY + toHeight / 2;

    const controlX1 = startX + (endX - startX) * 0.35;
    const controlX2 = startX + (endX - startX) * 0.65;

    this.line.stroke({
      color: 0xcccccc,
      width: 2,
      alpha: 0.3,
    });

    this.line.moveTo(startX, startY);
    this.line.bezierCurveTo(controlX1, startY, controlX2, endY, endX, endY);
  }

  private addLabel(options: BranchLineOptions) {
    if (!options.label) return;

    const { fromX, fromY, fromHeight, toX, toY, toHeight } = options;

    const startY = fromY + fromHeight / 2;
    const endY = toY + toHeight / 2;

    // Position label at midpoint
    const labelX = (fromX + toX) / 2;
    const labelY = (startY + endY) / 2 - 15;

    const labelStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 10,
      fill: 0xcccccc,
    });

    this.labelText = new Text(options.label, labelStyle);
    this.labelText.x = labelX;
    this.labelText.y = labelY;
    this.labelText.alpha = 0.6;
    this.labelText.anchor.set(0.5, 0.5);

    this.addChild(this.labelText);
  }
}
