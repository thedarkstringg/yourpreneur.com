'use client';

import { Graphics, Text, TextStyle } from 'pixi.js';

export class HorizontalTimeline extends Graphics {
  constructor(timelineY: number, yearPositions: Map<number, number>) {
    super();

    // Draw horizontal timeline across wide world bounds
    this.moveTo(-20000, timelineY);
    this.lineTo(20000, timelineY);
    this.stroke({ width: 1, color: 0xffffff, alpha: 0.2 });

    // Year watermark
    const yearStyle = new TextStyle({
      fontFamily: 'Cormorant Garamond',
      fontSize: 96,
      fill: 0xffffff,
      fontWeight: '300',
    });

    yearPositions.forEach((xPos, year) => {
      // Tick mark
      const tick = new Graphics();
      tick.moveTo(xPos, timelineY - 5);
      tick.lineTo(xPos, timelineY + 5);
      tick.stroke({ width: 1, color: 0xffffff, alpha: 0.35 });
      this.addChild(tick);

      // Year watermark (baseline sits on the timeline)
      const yearLabel = new Text({ text: year.toString(), style: yearStyle });
      yearLabel.resolution = window.devicePixelRatio * 4;
      yearLabel.anchor.set(0.5, 1);
      yearLabel.x = xPos;
      yearLabel.y = timelineY;
      yearLabel.alpha = 0.035;
      this.addChild(yearLabel);
    });

    this.zIndex = 1;
  }
}
