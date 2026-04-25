import { Container, Graphics, Circle } from 'pixi.js';

interface EventDotOptions {
  x: number;
  y: number;
  type: 'milestone' | 'launch' | 'funding' | 'team' | 'pivot' | 'setback' | 'exit' | 'other';
}

export class EventDot extends Container {
  constructor(options: EventDotOptions) {
    super();

    this.x = options.x;
    this.y = options.y;

    const color = this.getColorForType(options.type);
    const dot = new Graphics();
    dot.circle(0, 0, 5);
    dot.fill({ color });

    // Add outline
    dot.stroke({
      color: 0xffffff,
      width: 1,
      alpha: 0.3,
    });

    this.addChild(dot);
  }

  private getColorForType(type: string): number {
    switch (type) {
      case 'launch':
        return 0x00ff00; // green
      case 'funding':
        return 0x0099ff; // blue
      case 'pivot':
        return 0xffaa00; // orange
      case 'milestone':
        return 0xff00ff; // magenta
      case 'team':
        return 0x00ffff; // cyan
      case 'setback':
        return 0xff3333; // red
      case 'exit':
        return 0xccaa00; // gold
      default:
        return 0xcccccc; // gray
    }
  }
}
