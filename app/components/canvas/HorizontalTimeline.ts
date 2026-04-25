'use client';

import { Graphics, Text, TextStyle } from 'pixi.js';

export class HorizontalTimeline extends Graphics {
  constructor(timelineY: number, yearPositions: Map<number, number>) {
    super();

    // Draw horizontal timeline
    this.lineStyle(1, 0xffffff, 0.2);
    this.moveTo(-10000, timelineY);
    this.lineTo(10000, timelineY);

    // Draw year markers and labels
    const fontStyle = new TextStyle({
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 28,
      fill: 0xffffff,
      fontWeight: 'bold',
    });

    yearPositions.forEach((xPos, year) => {
      // Draw tick mark above timeline
      this.lineStyle(1, 0xffffff, 0.2);
      this.moveTo(xPos, timelineY - 15);
      this.lineTo(xPos, timelineY);

      // Add year label
      const yearLabel = new Text(year.toString(), fontStyle);
      yearLabel.anchor.set(0.5, 0);
      yearLabel.x = xPos;
      yearLabel.y = timelineY - 40;
      yearLabel.alpha = 0.15;
      this.addChild(yearLabel);
    });

    this.zIndex = 1;
  }
}
