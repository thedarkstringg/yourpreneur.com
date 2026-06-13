'use client';

import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class HorizontalTimeline extends Container {
  private timelineGraphics: Graphics;
  private monthGraphics: Graphics;
  private timelineY: number;
  private yearPositions: Map<number, number>;
  private yearLabels: Text[] = [];
  private ticks: Graphics[] = [];
  private yearLabelMap: Map<number, Text> = new Map();
  private boundHandleYearFlash: (event: Event) => void;

  constructor(timelineY: number, yearPositions: Map<number, number>) {
    super();
    this.timelineY = timelineY;
    this.yearPositions = yearPositions;
    this.timelineGraphics = new Graphics();
    this.monthGraphics = new Graphics();
    this.addChild(this.monthGraphics);
    this.addChild(this.timelineGraphics);
    this.drawMonthAxis();

    // Setup year labels and ticks (hidden initially)
    const yearStyle = new TextStyle({
      fontFamily: 'Plus Jakarta Sans',
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
      tick.alpha = 0;
      this.addChild(tick);
      this.ticks.push(tick);

      // Year watermark
      const yearLabel = new Text({ text: year.toString(), style: yearStyle });
      yearLabel.resolution = window.devicePixelRatio * 4;
      yearLabel.anchor.set(0.5, 1);
      yearLabel.x = xPos;
      yearLabel.y = timelineY;
      yearLabel.alpha = 0;
      this.addChild(yearLabel);
      this.yearLabels.push(yearLabel);
      this.yearLabelMap.set(year, yearLabel);
    });

    this.zIndex = 1;

    // Create bound handler for cleanup
    this.boundHandleYearFlash = this.handleYearFlash.bind(this);
    // Listen for year watermark flash event
    window.addEventListener('flash-year-watermark', this.boundHandleYearFlash);
  }

  private drawMonthAxis() {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthStyle = new TextStyle({
      fontFamily: 'Inter',
      fontSize: 8,
      fill: 0xffffff,
      letterSpacing: 1,
    });

    this.monthGraphics.moveTo(-3600, this.timelineY);
    this.monthGraphics.lineTo(5400, this.timelineY);
    this.monthGraphics.stroke({ width: 1.5, color: 0xffffff, alpha: 0.2 });

    for (let year = 2022; year <= 2026; year++) {
      for (let month = 0; month < 12; month++) {
        const x = (year - 2024) * 1440 + month * 120;
        const isQuarter = month % 3 === 0;
        this.monthGraphics.moveTo(x, this.timelineY - (isQuarter ? 12 : 7));
        this.monthGraphics.lineTo(x, this.timelineY + (isQuarter ? 12 : 7));
        this.monthGraphics.stroke({ width: isQuarter ? 1.2 : 1, color: 0xffffff, alpha: isQuarter ? 0.2 : 0.09 });

        if (isQuarter) {
          const label = new Text({ text: months[month], style: monthStyle });
          label.resolution = window.devicePixelRatio * 4;
          label.anchor.set(0.5, 0);
          label.x = x;
          label.y = this.timelineY + 18;
          label.alpha = 0.46;
          this.addChild(label);
        }
      }
    }
  }

  private handleYearFlash(event: Event) {
    const ev = event as CustomEvent;
    const year = ev.detail?.year;
    if (year) {
      const label = this.yearLabelMap.get(year);
      if (label) {
        this.flashYearLabel(label);
      }
    }
  }

  destroy() {
    window.removeEventListener('flash-year-watermark', this.boundHandleYearFlash);
  }

  private flashYearLabel(label: Text) {
    const startTime = Date.now();
    const duration = 600;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = (elapsed % duration) / duration;
      const eased = Math.abs(Math.sin(t * Math.PI * 2));
      label.alpha = 0.035 + 0.15 * eased;

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        label.alpha = 0.035;
      }
    };
    animate();
  }

  startLoadAnimation() {
    const easeOutExpo = (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    // Timeline line draw animation (t=200ms, duration 800ms)
    const lineStart = Date.now();
    const lineDelay = 200;
    const lineDuration = 800;

    const lineAnimate = () => {
      const elapsed = Date.now() - lineStart;
      if (elapsed < lineDelay) {
        requestAnimationFrame(lineAnimate);
        return;
      }

      const t = Math.min(1, (elapsed - lineDelay) / lineDuration);
      const eased = easeOutExpo(t);

      this.timelineGraphics.clear();
      const drawLength = 40000 * eased;
      this.timelineGraphics.moveTo(-20000, this.timelineY);
      this.timelineGraphics.lineTo(-20000 + drawLength, this.timelineY);
      this.timelineGraphics.stroke({ width: 1, color: 0xffffff, alpha: 0.2 });

      if (t < 1) requestAnimationFrame(lineAnimate);
    };
    lineAnimate();

    // Year watermarks fade-in animation (t=400ms, duration 500ms)
    const watermarkStart = Date.now();
    const watermarkDelay = 400;
    const watermarkDuration = 500;

    const watermarkAnimate = () => {
      const elapsed = Date.now() - watermarkStart;
      if (elapsed < watermarkDelay) {
        requestAnimationFrame(watermarkAnimate);
        return;
      }

      const t = Math.min(1, (elapsed - watermarkDelay) / watermarkDuration);
      const eased = easeOutCubic(t);
      const centerX = 0; // Viewport center
      const maxDistance = 2000; // Distance for complete fade

      this.yearLabels.forEach((label) => {
        // Calculate fade based on distance from center
        const distance = Math.abs(label.x - centerX);
        const distanceFade = Math.max(0.02, Math.min(1, 1 - distance / maxDistance));
        label.alpha = 0.035 * eased * distanceFade;
      });

      if (t < 1) requestAnimationFrame(watermarkAnimate);
    };
    watermarkAnimate();

    // Ticks fade-in with watermarks
    const ticksStart = Date.now();
    const ticksDelay = 400;
    const ticksDuration = 500;

    const ticksAnimate = () => {
      const elapsed = Date.now() - ticksStart;
      if (elapsed < ticksDelay) {
        requestAnimationFrame(ticksAnimate);
        return;
      }

      const t = Math.min(1, (elapsed - ticksDelay) / ticksDuration);
      const eased = easeOutCubic(t);
      this.ticks.forEach((tick) => {
        tick.alpha = 0.35 * eased;
      });

      if (t < 1) requestAnimationFrame(ticksAnimate);
    };
    ticksAnimate();
  }
}

