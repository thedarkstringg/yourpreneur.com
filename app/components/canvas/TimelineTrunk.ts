import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface YearPosition {
  year: number;
  y: number;
}

export class TimelineTrunk extends Container {
  private trunkLine: Graphics;
  private yearLabels: Map<number, Text>;
  private yearPositions: YearPosition[];

  constructor(trunkX: number, yearPositions: Map<number, number>) {
    super();

    this.trunkLine = new Graphics();
    this.yearLabels = new Map();
    this.yearPositions = Array.from(yearPositions.entries()).map(
      ([year, y]) => ({
        year,
        y,
      })
    );

    this.drawTrunk(trunkX);
    this.drawYearLabels(trunkX);
  }

  private drawTrunk(trunkX: number) {
    this.trunkLine.stroke({
      color: 0xffffff,
      width: 1.5,
      alpha: 0.15,
    });

    const startY = this.yearPositions[0]?.y || 0;
    const endY =
      this.yearPositions[this.yearPositions.length - 1]?.y || 3600;

    this.trunkLine.moveTo(trunkX, startY);
    this.trunkLine.lineTo(trunkX, endY + 600);

    this.addChild(this.trunkLine);
  }

  private drawYearLabels(trunkX: number) {
    this.yearPositions.forEach((yearPos) => {
      const style = new TextStyle({
        fontFamily: "'Plus Jakarta Sans', serif",
        fontSize: 48,
        fontWeight: '700',
        fill: 0xffffff,
      });

      const label = new Text(yearPos.year.toString(), style);
      label.x = trunkX - 120;
      label.y = yearPos.y;
      label.alpha = 0.4;
      label.anchor.set(1, 0);

      this.addChild(label);
      this.yearLabels.set(yearPos.year, label);
    });
  }
}

