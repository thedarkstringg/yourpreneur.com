import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Venture } from '@/lib/useStore';

export class VentureNode extends Container {
  private venture: Venture;
  private card: Graphics;
  private isHovered: boolean = false;
  private isSelected: boolean = false;

  constructor(venture: Venture, x: number, y: number) {
    super();

    this.venture = venture;
    this.x = x;
    this.y = y;
    this.width = 180;
    this.height = 110;

    this.interactive = true;
    this.cursor = 'pointer';

    this.card = this.createCard();
    this.addChild(this.card);

    this.drawContent();

    // Spawn animation
    this.spawnAnimation();
  }

  private spawnAnimation() {
    // Start small and fade in
    this.scale.set(0.85);
    this.alpha = 0;

    let progress = 0;
    const duration = 0.3; // seconds
    const startTime = Date.now();

    const animate = () => {
      progress = (Date.now() - startTime) / (duration * 1000);

      if (progress >= 1) {
        this.scale.set(1);
        this.alpha = 1;
        return;
      }

      // Easing function: ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      this.scale.set(0.85 + easeProgress * 0.15);
      this.alpha = easeProgress;

      requestAnimationFrame(animate);
    };

    animate();
  }

  private createCard(): Graphics {
    const card = new Graphics();
    const radius = 8;

    card.fill({
      color: 0x141111,
      alpha: 1,
    });
    card.stroke({
      color: 0xffffff,
      width: 1,
      alpha: 0.09,
    });

    card.roundRect(0, 0, 180, 110, radius);

    return card;
  }

  private drawContent() {
    // Industry tag - top left
    const industryStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 9,
      fill: 0xffffff,
    });
    const industryText = new Text(this.venture.industry.toUpperCase(), industryStyle);
    industryText.x = 12;
    industryText.y = 10;
    industryText.alpha = 0.35;
    this.addChild(industryText);

    // Venture name - center
    const nameStyle = new TextStyle({
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 22,
      fontWeight: '600',
      fill: 0xffffff,
      wordWrap: true,
      wordWrapWidth: 156,
      align: 'center',
    });
    const nameText = new Text(this.venture.name, nameStyle);
    nameText.x = 90;
    nameText.y = 45;
    nameText.anchor.set(0.5, 0.5);
    nameText.alpha = 0.85;
    this.addChild(nameText);

    // Status badge - bottom left
    const badgeWidth = 50;
    const badgeHeight = 20;
    const statusBg = new Graphics();
    statusBg.stroke({
      color: this.getStatusColor(),
      width: 1,
      alpha: 0.7,
    });
    statusBg.roundRect(12, 85, badgeWidth, badgeHeight, 4);
    this.addChild(statusBg);

    const statusStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 8,
      fill: this.getStatusColor(),
      fontWeight: '500',
    });
    const statusText = new Text(this.venture.status.toUpperCase(), statusStyle);
    statusText.x = 12 + badgeWidth / 2;
    statusText.y = 85 + badgeHeight / 2;
    statusText.anchor.set(0.5, 0.5);
    statusText.alpha = 0.8;
    this.addChild(statusText);
  }

  private getStatusColor(): number {
    switch (this.venture.status) {
      case 'active':
        return 0xffffff;
      case 'pivot':
        return 0xfbbf24;
      case 'paused':
        return 0x9ca3af;
      case 'shutdown':
        return 0x6b7280;
      case 'exited':
        return 0xc9a96e;
      default:
        return 0xffffff;
    }
  }

  setHovered(hovered: boolean) {
    this.isHovered = hovered;
    if (hovered) {
      this.card.stroke({
        color: 0xffffff,
        width: 1,
        alpha: 0.2,
      });
    } else {
      this.card.stroke({
        color: 0xffffff,
        width: 1,
        alpha: 0.09,
      });
    }
  }

  setSelected(selected: boolean) {
    this.isSelected = selected;
    if (selected) {
      this.scale.set(1.02);
    } else {
      this.scale.set(1);
    }
  }

  getVenture(): Venture {
    return this.venture;
  }
}
