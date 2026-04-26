import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { Venture, useStore } from '@/lib/useStore';

export class VentureNode extends Container {
  private venture: Venture;
  private card: Graphics;
  public contentContainer: Container; // Changed to public for PixiApp to access text objects
  private isHovered: boolean = false;
  private isSelected: boolean = false;
  private widthPx = 220;
  private heightPx = 120;
  private expandedHeight = 280;
  private currentHeight = 120;

  constructor(venture: Venture, x: number, y: number) {
    super();

    this.venture = venture;
    this.x = x;
    this.y = y;
    // this.width and this.height are calculated from children in PixiJS,
    // we don't need to set them manually usually if using Graphics

    this.interactive = true;
    this.cursor = 'pointer';

    this.card = new Graphics();
    this.contentContainer = new Container();

    this.addChild(this.card);
    this.addChild(this.contentContainer);

    this.drawCard();
    this.drawContent();

    this.on('pointerover', () => {
      window.dispatchEvent(new CustomEvent('pixi-card-hover', { detail: { hover: true } }));
      this.setHovered(true);
    });
    this.on('pointerout', () => {
      window.dispatchEvent(new CustomEvent('pixi-card-hover', { detail: { hover: false } }));
      this.setHovered(false);
    });

    // Emit click event for logo area
    this.on('pointerdown', (event) => {
      const logoSize = 36;
      const logoMargin = 12;
      const logoX = this.widthPx - logoSize - logoMargin;
      const logoY = logoMargin;

      if (
        event.global.x >= this.x + logoX &&
        event.global.x <= this.x + logoX + logoSize &&
        event.global.y >= this.y + logoY &&
        event.global.y <= this.y + logoY + logoSize
      ) {
        window.dispatchEvent(
          new CustomEvent('pixi-logo-click', {
            detail: { ventureId: this.venture.id },
          })
        );
      }
    });

    this.spawnAnimation();
  }

  private drawCard() {
    // draw background with border and rounded corners
    this.card.clear();
    const r = 10;
    
    this.card.roundRect(0, 0, this.widthPx, this.currentHeight, r);
    this.card.fill({ color: 0x161111, alpha: 1 });
    this.card.stroke({ width: 1, color: 0xffffff, alpha: 0.08 });

    // top inner highlight line at y=1
    this.card.moveTo(1, 1);
    this.card.lineTo(this.widthPx - 1, 1);
    this.card.stroke({ width: 1, color: 0xffffff, alpha: 0.05 });
  }

  private drawContent() {
    this.contentContainer.removeChildren();

    // Logo placeholder (top-right)
    const logoSize = 36;
    const logoMargin = 12;
    const logoX = this.widthPx - logoSize - logoMargin;
    const logoY = logoMargin;

    // Logo background
    const logoBg = new Graphics();
    logoBg.roundRect(logoX, logoY, logoSize, logoSize, 8);
    logoBg.fill({ color: 0x000000, alpha: 0.06 });
    logoBg.stroke({ width: 1, color: 0xffffff, alpha: this.isHovered ? 0.2 : 0.1 });
    this.contentContainer.addChild(logoBg);

    // Logo text (first letter of venture name)
    if (this.venture.name) {
      const logoTextStyle = new TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '500',
        fill: 'rgba(255,255,255,0.5)',
        align: 'center',
      });
      const logoText = new Text({ text: this.venture.name.charAt(0).toUpperCase(), style: logoTextStyle });
      logoText.resolution = window.devicePixelRatio * 4;
      logoText.anchor.set(0.5, 0.5);
      logoText.x = logoX + logoSize / 2;
      logoText.y = logoY + logoSize / 2;
      this.contentContainer.addChild(logoText);
    }

    // Logo hover indicator (small icon hint on hover)
    if (this.isHovered) {
      const hintStyle = new TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 10,
        fill: 'rgba(255,255,255,0.4)',
        align: 'center',
      });
      const hint = new Text({ text: '◎', style: hintStyle });
      hint.resolution = window.devicePixelRatio * 4;
      hint.anchor.set(0.5, 0.5);
      hint.x = logoX + logoSize / 2;
      hint.y = logoY + logoSize / 2;
      hint.alpha = 0.6;
      this.contentContainer.addChild(hint);
    }

    // Industry tag: Space Mono, 9px, rgba(255,255,255,0.32), uppercase, letterSpacing: 2
    const industryStyle = new TextStyle({
      fontFamily: 'Space Mono',
      fontSize: 9,
      fill: 'rgba(255,255,255,0.32)',
      letterSpacing: 2,
    });
    const industry = new Text({ text: (this.venture.industry || '').toUpperCase(), style: industryStyle });
    industry.resolution = window.devicePixelRatio * 4;
    industry.x = 24;
    industry.y = 18;
    this.contentContainer.addChild(industry);

    // Venture name: Cormorant Garamond, 26px, font-weight 500, rgba(255,255,255,0.9)
    const nameStyle = new TextStyle({
      fontFamily: 'Cormorant Garamond',
      fontSize: 26,
      fontWeight: '500',
      fill: 'rgba(255,255,255,0.9)',
    });
    const name = new Text({ text: this.venture.name, style: nameStyle });
    name.resolution = window.devicePixelRatio * 6;
    name.x = 24;
    name.y = 40;
    this.contentContainer.addChild(name);

    // Status badge: Space Mono, 9px, outlined pill
    const statusTextStyle = new TextStyle({
      fontFamily: 'Space Mono',
      fontSize: 9,
      fill: 'rgba(255,255,255,0.9)',
    });

    const statusStr = (this.venture.status || '').toUpperCase();
    const statusText = new Text({ text: (this.venture.status === 'exited' ? '✦ ' : '') + statusStr, style: statusTextStyle });
    statusText.resolution = window.devicePixelRatio * 4;
    
    const paddingX = 12;
    const paddingY = 6;
    const measured = statusText.width + paddingX * 2;

    const pill = new Graphics();
    // Determine colors per status
    let borderColor = 0xffffff;
    let borderAlpha = 0.1;
    let textAlpha = 0.4;
    
    switch (this.venture.status) {
      case 'active':
        borderColor = 0xffffff;
        borderAlpha = 0.25;
        textAlpha = 0.9;
        break;
      case 'pivot':
        borderColor = 0xc9a96e;
        borderAlpha = 0.45;
        textAlpha = 1;
        break;
      case 'paused':
        borderColor = 0xffffff;
        borderAlpha = 0.1;
        textAlpha = 0.3;
        break;
      case 'shutdown':
        borderColor = 0xffffff;
        borderAlpha = 0.06;
        textAlpha = 0.2;
        break;
      case 'exited':
        borderColor = 0xc9a96e;
        borderAlpha = 1;
        textAlpha = 1;
        break;
    }
    
    statusText.style.fill = `rgba(255,255,255,${textAlpha})`;
    
    const pillX = 24;
    const pillY = this.heightPx - 18 - statusText.height - paddingY;
    pill.roundRect(pillX, pillY, measured, paddingY * 2 + statusText.height, 999);
    pill.stroke({ width: 1, color: borderColor, alpha: borderAlpha });

    statusText.x = pillX + paddingX;
    statusText.y = pillY + paddingY;

    this.contentContainer.addChild(pill);
    this.contentContainer.addChild(statusText);

    // If expanded, draw divider and events
    if (this.isSelected) {
      // Divider
      const divider = new Graphics();
      divider.moveTo(12, 120 - 10);
      divider.lineTo(this.widthPx - 12, 120 - 10);
      divider.stroke({ width: 1, color: 0xffffff, alpha: 0.06 });
      this.contentContainer.addChild(divider);

      // Events from store
      const events = useStore.getState().events.filter((e) => e.ventureId === this.venture.id);
      let startY = 125;
      events.slice(0, 4).forEach((ev, idx) => {
        const rowY = startY + idx * 32;
        
        const rowStyle = new TextStyle({ 
          fontFamily: 'Space Mono', 
          fontSize: 9, 
          fill: 'rgba(255,255,255,0.5)' 
        });

        // Type symbol
        const symbol = new Text({ text: this.getSymbolForType(ev.type), style: rowStyle });
        symbol.resolution = window.devicePixelRatio * 4;
        symbol.x = 24;
        symbol.y = rowY + 6;
        this.contentContainer.addChild(symbol);

        // Title
        const title = new Text({ text: ev.title.length > 20 ? ev.title.slice(0, 20) + '…' : ev.title, style: rowStyle });
        title.resolution = window.devicePixelRatio * 4;
        title.x = 48;
        title.y = rowY + 6;
        this.contentContainer.addChild(title);

        // Date
        const dateStr = new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        const date = new Text({ text: dateStr, style: rowStyle });
        date.resolution = window.devicePixelRatio * 4;
        date.style.fill = 'rgba(255,255,255,0.22)';
        date.x = this.widthPx - 70;
        date.y = rowY + 6;
        this.contentContainer.addChild(date);
      });

      // + ADD EVENT row
      const addStyle = new TextStyle({
        fontFamily: 'Space Mono',
        fontSize: 9,
        fill: 'rgba(255,255,255,0.28)',
      });
      const add = new Text({ text: '+ ADD EVENT', style: addStyle });
      add.resolution = window.devicePixelRatio * 4;
      add.x = 24;
      add.y = startY + Math.min(4, events.length) * 32 + 8;
      add.interactive = true;
      add.on('pointerover', () => (add.style.fill = 'rgba(255,255,255,0.8)'));
      add.on('pointerout', () => (add.style.fill = 'rgba(255,255,255,0.28)'));
      this.contentContainer.addChild(add);
    }
  }

  private getSymbolForType(type: string) {
    switch (type) {
      case 'milestone':
        return '◆';
      case 'launch':
        return '▲';
      case 'funding':
        return '$';
      case 'setback':
        return '↓';
      case 'pivot':
        return '⟳';
      case 'exit':
        return '✦';
      default:
        return '•';
    }
  }

  private spawnAnimation() {
    this.scale.set(0.92);
    this.alpha = 0;
    const start = Date.now();
    // Base timing: t=750ms for first card, staggered 80ms after each dot
    // Dot falls at t=600ms with 120ms stagger, so card at 600+120+80 = 800ms base
    const staggerIndex = Math.floor(Math.random() * 4); // simulate stagger
    const staggerDelay = 600 + staggerIndex * 120 + staggerIndex * 80; // dots then cards
    const dur = 280;

    const animate = () => {
      const elapsed = Date.now() - start;
      const delay = staggerDelay;

      if (elapsed < delay) {
        requestAnimationFrame(animate);
        return;
      }

      const t = Math.min(1, (elapsed - delay) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      this.scale.set(0.92 + 0.08 * eased);
      this.alpha = eased;
      if (t < 1) requestAnimationFrame(animate);
    };
    animate();
  }

  setHovered(hovered: boolean) {
    this.isHovered = hovered;
    if (hovered) {
      this.card.clear();
      this.card.roundRect(0, 0, this.widthPx, this.currentHeight, 10);
      this.card.fill({ color: 0x161111, alpha: 1 });
      this.card.stroke({ width: 1, color: 0xffffff, alpha: 0.22 });

      // Add subtle glow effect on hover
      const glowGraphics = new Graphics();
      glowGraphics.roundRect(0, 0, this.widthPx, this.currentHeight, 10);
      glowGraphics.stroke({ width: 1, color: 0xffffff, alpha: 0.08 });
      glowGraphics.x = -1;
      glowGraphics.y = -1;
      this.addChildAt(glowGraphics, 0);

      // Redraw content to show hover state
      this.drawContent();
    } else {
      this.drawCard();
      // Remove glow effect
      while (this.children.length > 2) {
        this.removeChildAt(0);
      }
    }
  }

  setSelected(selected: boolean) {
    if (selected === this.isSelected) return;
    this.isSelected = selected;

    const from = this.currentHeight;
    const to = selected ? this.expandedHeight : this.heightPx;
    const start = Date.now();
    const dur = 260;

    const animate = () => {
      const t = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      this.currentHeight = from + (to - from) * eased;
      this.drawCard();
      this.drawContent();
      if (t < 1) requestAnimationFrame(animate);
    };

    animate();

    // Attention animation on selection
    if (selected) {
      this.attentionAnimation();

      // Add selection glow
      const glow = new Graphics();
      glow.roundRect(0, 0, this.widthPx, this.currentHeight, 10);
      glow.stroke({ width: 2, color: 0xffffff, alpha: 0.15 });
      this.addChildAt(glow, 1);
    }
  }

  private attentionAnimation() {
    const startScale = this.scale.x;
    const startTime = Date.now();
    const duration = 400;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: easeInOutSine
      const eased = -(Math.cos(Math.PI * progress) - 1) / 2;
      // Scale: 1.0 → 1.03 → 1.0
      const scale = 1.0 + 0.03 * Math.sin(progress * Math.PI);

      this.scale.set(scale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.scale.set(1.0);
      }
    };

    animate();
  }

  getVenture(): Venture {
    return this.venture;
  }
}
