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
    this.width = 300;
    this.height = 120;

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
    const radius = 12;

    card.fill({
      color: 0x161212,
      alpha: 1,
    });
    card.stroke({
      color: 0xffffff,
      width: 1.5,
      alpha: 0.08,
    });

    card.roundRect(0, 0, 300, 120, radius);

    return card;
  }

  private drawContent() {
    // Logo placeholder
    const logoBg = new Graphics();
    logoBg.fill({ color: 0x2a2420 });
    logoBg.roundRect(16, 16, 56, 56, 8);
    this.addChild(logoBg);

    // First letter
    const firstLetter = this.venture.name[0].toUpperCase();
    const letterStyle = new TextStyle({
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 32,
      fontWeight: '700',
      fill: 0xffffff,
    });
    const letterText = new Text(firstLetter, letterStyle);
    letterText.x = 16 + 28;
    letterText.y = 16 + 28;
    letterText.alpha = 0.8;
    letterText.anchor.set(0.5, 0.5);
    this.addChild(letterText);

    // Venture name
    const nameStyle = new TextStyle({
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 20,
      fontWeight: '600',
      fill: 0xffffff,
      wordWrap: true,
      wordWrapWidth: 200,
    });
    const nameText = new Text(this.venture.name, nameStyle);
    nameText.x = 88;
    nameText.y = 14;
    this.addChild(nameText);

    // Date
    const dateStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 13,
      fill: 0xffffff,
    });
    const dateText = new Text(
      new Date(this.venture.startedDate).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      dateStyle
    );
    dateText.x = 88;
    dateText.y = 44;
    dateText.alpha = 0.5;
    this.addChild(dateText);

    // Industry
    const industryStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 11,
      fill: 0xffffff,
    });
    const industryText = new Text(this.venture.industry, industryStyle);
    industryText.x = 88;
    industryText.y = 62;
    industryText.alpha = 0.4;
    this.addChild(industryText);

    // Status badge
    const statusBg = new Graphics();
    statusBg.stroke({
      color: this.getStatusColor(),
      width: 1.2,
      alpha: 0.8,
    });
    statusBg.roundRect(88, 80, 70, 18, 6);
    this.addChild(statusBg);

    const statusStyle = new TextStyle({
      fontFamily: "'Space Mono', monospace",
      fontSize: 10,
      fill: this.getStatusColor(),
    });
    const statusText = new Text(
      this.venture.status.toUpperCase(),
      statusStyle
    );
    statusText.x = 123;
    statusText.y = 80;
    statusText.alpha = 0.9;
    statusText.anchor.set(0.5, 0);
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
        width: 1.5,
        alpha: 0.2,
      });
    } else {
      this.card.stroke({
        color: 0xffffff,
        width: 1.5,
        alpha: 0.08,
      });
    }
  }

  setSelected(selected: boolean) {
    this.isSelected = selected;
    // Visual feedback on selection
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
