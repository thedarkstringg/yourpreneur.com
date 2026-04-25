import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface BranchLineOptions {
  fromX: number;
  fromY: number;
  fromHeight: number;
  toX: number;
  toY: number;
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
    const startX = fromX + 180; // fromX is card left, 180 is card width
    const startY = fromY + fromHeight / 2;

    // End: top of child card
    const endX = toX + 90; // 90 is half card width (180 / 2)
    const endY = toY;

    // Control points for bezier: curve down and right
    const controlX1 = startX + (endX - startX) * 0.35;
    const controlY1 = startY;
    const controlX2 = startX + (endX - startX) * 0.65;
    const controlY2 = endY;

    this.line.stroke({
      color: 0xffffff,
      width: 1,
      alpha: 0.15,
    });

    // Draw with dashed pattern [4, 6]
    this.line.moveTo(startX, startY);
    this.line.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
  }

  private addLabel(options: BranchLineOptions) {
    if (!options.label) return;

    const { fromX, fromY, fromHeight, toX, toY } = options;

    const startX = fromX + 180;
    const startY = fromY + fromHeight / 2;
    const endX = toX + 90;
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

    this.labelText = new Text(options.label, labelStyle);
    this.labelText.x = labelX;
    this.labelText.y = labelY;
    this.labelText.alpha = 0.3;
    this.labelText.anchor.set(0.5, 0.5);

    this.addChild(this.labelText);
  }
}
