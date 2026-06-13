import { Container, Graphics, Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { Venture, useStore } from '@/lib/useStore';

export class VentureNode extends Container {
  private venture: Venture;
  private card: Graphics;
  public contentContainer: Container; // Changed to public for PixiApp to access text objects
  private isHovered: boolean = false;
  private isSelected: boolean = false;
  private widthPx = 220;
  private heightPx = 120;
  private expandedHeight = 220;
  private currentHeight = 120;
  private animationFrames: number[] = [];

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
    const isGraveyard = this.venture.status === 'graveyard' || this.venture.status === 'failed' || this.venture.status === 'shutdown';
    this.card.fill({ color: isGraveyard ? 0x070707 : 0x090909, alpha: 0.96 });
    this.card.stroke({ width: isGraveyard ? 1.4 : 1, color: isGraveyard ? 0x9a9a9a : 0xffffff, alpha: isGraveyard ? 0.22 : this.isSelected ? 0.22 : 0.1 });

    // top inner highlight line at y=1
    this.card.moveTo(1, 1);
    this.card.lineTo(this.widthPx - 1, 1);
    this.card.stroke({ width: 1, color: 0xffffff, alpha: 0.09 });

    if (this.venture.color) {
      const accent = parseInt(this.venture.color.slice(1), 16);
      this.card.moveTo(12, 0);
      this.card.lineTo(this.widthPx - 12, 0);
      this.card.stroke({ width: 2, color: accent, alpha: 0.55 });
    }

    if (isGraveyard) {
      this.card.moveTo(14, this.currentHeight - 18);
      this.card.lineTo(this.widthPx - 14, this.currentHeight - 18);
      this.card.stroke({ width: 1, color: 0xffffff, alpha: 0.07 });
    }
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
    logoBg.fill({ color: this.venture.color ? parseInt(this.venture.color.slice(1), 16) : 0xffffff, alpha: 0.9 });
    logoBg.stroke({ width: 1, color: 0xffffff, alpha: this.isHovered ? 0.32 : 0.14 });
    this.contentContainer.addChild(logoBg);

    if (this.venture.logoUrl) {
      const logo = new Sprite(Texture.from(this.venture.logoUrl));
      logo.x = logoX;
      logo.y = logoY;
      logo.width = logoSize;
      logo.height = logoSize;
      logo.alpha = 0.96;
      this.contentContainer.addChild(logo);
    } else if (this.venture.name) {
      const logoTextStyle = new TextStyle({
        fontFamily: 'Montserrat',
        fontSize: 16,
        fontWeight: '800',
        fill: 'rgba(0,0,0,0.88)',
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
        fill: 'rgba(0,0,0,0.5)',
        align: 'center',
      });
      const hint = new Text({ text: 'O', style: hintStyle });
      hint.resolution = window.devicePixelRatio * 4;
      hint.anchor.set(0.5, 0.5);
      hint.x = logoX + logoSize / 2;
      hint.y = logoY + logoSize / 2;
      hint.alpha = 0.6;
      this.contentContainer.addChild(hint);
    }

    // Industry tag: Inter, 9px, rgba(255,255,255,0.32), uppercase, letterSpacing: 2
    const industryStyle = new TextStyle({
      fontFamily: 'Inter',
      fontSize: 9,
      fill: 'rgba(255,255,255,0.32)',
      letterSpacing: 2,
    });
    const industry = new Text({ text: (this.venture.industry || 'ADD INDUSTRY').toUpperCase(), style: industryStyle });
    industry.resolution = window.devicePixelRatio * 4;
    industry.x = 24;
    industry.y = 18;
    this.contentContainer.addChild(industry);

    // Venture name: Plus Jakarta Sans, 22px, font-weight 600, rgba(255,255,255,0.92)
    const nameStyle = new TextStyle({
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 22,
      fontWeight: '600',
      fill: 'rgba(255,255,255,0.92)',
    });
    const name = new Text({ text: this.venture.name, style: nameStyle });
    name.resolution = window.devicePixelRatio * 6;
    name.x = 24;
    name.y = 42;
    this.contentContainer.addChild(name);

    this.drawHealthAndSync();

    // Status badge: Inter, 9px, outlined pill
    const statusTextStyle = new TextStyle({
      fontFamily: 'Inter',
      fontSize: 9,
      fill: 'rgba(255,255,255,0.9)',
    });

    const statusStr = (this.venture.status || '').toUpperCase();
    const statusText = new Text({ text: (this.venture.status === 'exited' || this.venture.status === 'acquired' ? '* ' : this.venture.status === 'graveyard' ? 'RIP ' : '') + statusStr, style: statusTextStyle });
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
      case 'stealth':
        borderColor = 0xb48cff;
        borderAlpha = 0.38;
        textAlpha = 0.86;
        break;
      case 'graveyard':
        borderColor = 0xffffff;
        borderAlpha = 0.18;
        textAlpha = 0.46;
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
      case 'acquired':
        borderColor = 0x8bdcff;
        borderAlpha = 0.7;
        textAlpha = 1;
        break;
      case 'archived':
        borderColor = 0xffffff;
        borderAlpha = 0.12;
        textAlpha = 0.35;
        break;
      case 'failed':
        borderColor = 0xff9687;
        borderAlpha = 0.45;
        textAlpha = 0.82;
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

    // If expanded, draw divider and event branches
    if (this.isSelected) {
      // Divider
      const divider = new Graphics();
      divider.moveTo(12, 120 - 10);
      divider.lineTo(this.widthPx - 12, 120 - 10);
      divider.stroke({ width: 1, color: 0xffffff, alpha: 0.06 });
      this.contentContainer.addChild(divider);

      const events = useStore.getState().events.filter((e) => e.ventureId === this.venture.id);
      const startY = 128;
      const closeStyle = new TextStyle({
        fontFamily: 'Inter',
        fontSize: 10,
        fill: 'rgba(255,255,255,0.48)',
      });
      const close = new Text({ text: 'CLOSE X', style: closeStyle });
      close.resolution = window.devicePixelRatio * 4;
      close.x = this.widthPx - 64;
      close.y = 132;
      this.contentContainer.addChild(close);

      const branchLine = new Graphics();
      branchLine.moveTo(34, 116);
      branchLine.lineTo(34, startY + Math.min(3, Math.max(events.length, 1)) * 34);
      branchLine.stroke({ width: 1, color: 0xffffff, alpha: 0.08 });
      this.contentContainer.addChild(branchLine);

      if (events.length === 0) {
        const emptyStyle = new TextStyle({
          fontFamily: 'Inter',
          fontSize: 9,
          fill: 'rgba(255,255,255,0.32)',
        });
        const empty = new Text({ text: 'NO NOTES YET - ADD FIRST BRANCH', style: emptyStyle });
        empty.resolution = window.devicePixelRatio * 4;
        empty.x = 48;
        empty.y = startY + 8;
        this.contentContainer.addChild(empty);
      }

      events.slice(0, 3).forEach((ev, idx) => {
        const rowY = startY + idx * 34;
        const offsetX = idx % 2 === 0 ? 50 : 68;
        
        const rowStyle = new TextStyle({ 
          fontFamily: 'Inter', 
          fontSize: 9, 
          fill: 'rgba(255,255,255,0.5)' 
        });

        const connector = new Graphics();
        connector.moveTo(34, rowY + 14);
        connector.lineTo(offsetX - 8, rowY + 14);
        connector.stroke({ width: 1, color: 0xffffff, alpha: 0.12 });
        this.contentContainer.addChild(connector);

        const noteBg = new Graphics();
        noteBg.roundRect(offsetX, rowY, this.widthPx - offsetX - 18, 27, 7);
        noteBg.fill({ color: 0xffffff, alpha: 0.035 });
        noteBg.stroke({ width: 1, color: 0xffffff, alpha: 0.07 });
        this.contentContainer.addChild(noteBg);

        const symbolText = this.getSymbolForType(ev.type);
        const symbol = new Text({ text: symbolText, style: rowStyle });
        symbol.resolution = window.devicePixelRatio * 4;
        symbol.x = offsetX + 8;
        symbol.y = rowY + 6;
        if (symbolText === '$') {
          symbol.style.fill = 'rgba(255,255,255,0.88)';
          const symbolHit = new Graphics();
          symbolHit.roundRect(offsetX + 3, rowY + 3, 18, 20, 5);
          symbolHit.stroke({ width: 1, color: 0xffffff, alpha: 0.14 });
          symbolHit.fill({ color: 0xffffff, alpha: 0.045 });
          this.contentContainer.addChild(symbolHit);
        }
        this.contentContainer.addChild(symbol);

        // Title
        const title = new Text({ text: ev.title.length > 16 ? ev.title.slice(0, 16) + '...' : ev.title, style: rowStyle });
        title.resolution = window.devicePixelRatio * 4;
        title.x = offsetX + 26;
        title.y = rowY + 6;
        this.contentContainer.addChild(title);

        // Date
        const dateStr = new Date(ev.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        const date = new Text({ text: dateStr, style: rowStyle });
        date.resolution = window.devicePixelRatio * 4;
        date.style.fill = 'rgba(255,255,255,0.22)';
        date.x = this.widthPx - 62;
        date.y = rowY + 6;
        this.contentContainer.addChild(date);
      });

      // + ADD EVENT row
      const addStyle = new TextStyle({
        fontFamily: 'Inter',
        fontSize: 9,
        fill: 'rgba(255,255,255,0.28)',
      });
      const add = new Text({ text: '+ ADD EVENT', style: addStyle });
      add.resolution = window.devicePixelRatio * 4;
      add.x = 48;
      add.y = startY + Math.min(3, Math.max(events.length, 1)) * 34 + 8;
      add.interactive = true;
      add.on('pointerover', () => (add.style.fill = 'rgba(255,255,255,0.8)'));
      add.on('pointerout', () => (add.style.fill = 'rgba(255,255,255,0.28)'));
      this.contentContainer.addChild(add);
    }
  }

  private drawSparkline() {
    const values = this.venture.mrrTrend?.length ? this.venture.mrrTrend : [2, 3, 4, 4, 5, 6, 6];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const spark = new Graphics();
    const x = 24;
    const y = 74;
    const width = 86;
    const height = 18;

    values.forEach((value, index) => {
      const px = x + (index / Math.max(1, values.length - 1)) * width;
      const py = y + height - ((value - min) / range) * height;
      if (index === 0) spark.moveTo(px, py);
      else spark.lineTo(px, py);
    });

    spark.stroke({
      width: 1.5,
      color: this.venture.color ? parseInt(this.venture.color.slice(1), 16) : 0xffffff,
      alpha: 0.65,
    });

    // Create clipping mask to contain sparkline within bounds
    const mask = new Graphics();
    mask.rect(x, y, width, height);
    mask.fill({ color: 0xffffff, alpha: 0 });
    spark.mask = mask;

    this.contentContainer.addChild(mask);
    this.contentContainer.addChild(spark);
  }

  private drawHealthAndSync() {
    const health = Math.round(this.venture.healthScore ?? 52);
    const source = (this.venture.source || 'manual').toUpperCase();
    const sync = this.venture.lastSyncedAt ? 'SYNCED' : 'MANUAL';

    const labelStyle = new TextStyle({
      fontFamily: 'Inter',
      fontSize: 8,
      fontWeight: '600',
      fill: 'rgba(255,255,255,0.36)',
      letterSpacing: 1,
    });

    const healthText = new Text({ text: `HEALTH ${health}`, style: labelStyle });
    healthText.resolution = window.devicePixelRatio * 4;
    healthText.x = 122;
    healthText.y = 70;
    this.contentContainer.addChild(healthText);

    const bar = new Graphics();
    bar.roundRect(122, 86, 62, 3, 999);
    bar.fill({ color: 0xffffff, alpha: 0.09 });
    bar.roundRect(122, 86, Math.max(2, (health / 100) * 62), 3, 999);
    bar.fill({ color: health > 80 ? 0x82ffbe : health > 60 ? 0xffda8a : 0xff9687, alpha: 0.72 });
    this.contentContainer.addChild(bar);

    const syncStyle = new TextStyle({
      fontFamily: 'Inter',
      fontSize: 7,
      fill: 'rgba(255,255,255,0.24)',
      letterSpacing: 0.5,
    });

    const syncText = new Text({ text: `${sync} / ${source}`, style: syncStyle });
    syncText.resolution = window.devicePixelRatio * 4;
    syncText.x = 122;
    syncText.y = 93;
    this.contentContainer.addChild(syncText);
  }

  private getSymbolForType(type: string) {
    switch (type) {
      case 'milestone':
        return 'M';
      case 'launch':
        return 'L';
      case 'funding':
        return '$';
      case 'setback':
        return '!';
      case 'pivot':
        return 'P';
      case 'exit':
        return 'X';
      default:
        return '*';
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
      if (this.destroyed) return;
      const elapsed = Date.now() - start;
      const delay = staggerDelay;

      if (elapsed < delay) {
        const rafId = requestAnimationFrame(animate);
        this.animationFrames.push(rafId);
        return;
      }

      const t = Math.min(1, (elapsed - delay) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      this.scale.set(0.92 + 0.08 * eased);
      this.alpha = eased;
      if (t < 1) {
        const rafId = requestAnimationFrame(animate);
        this.animationFrames.push(rafId);
      }
    };
    animate();
  }

  setHovered(hovered: boolean) {
    this.isHovered = hovered;
    if (hovered) {
      this.card.clear();
      this.card.roundRect(0, 0, this.widthPx, this.currentHeight, 10);
      this.card.fill({ color: 0x0b0b0b, alpha: 0.98 });
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
    const eventCount = useStore.getState().events.filter((e) => e.ventureId === this.venture.id).length;
    const targetExpandedHeight = 170 + Math.min(3, Math.max(eventCount, 1)) * 34;
    const to = selected ? targetExpandedHeight : this.heightPx;
    const start = Date.now();
    const dur = 260;

    const animate = () => {
      if (this.destroyed) return;
      const t = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      this.currentHeight = from + (to - from) * eased;
      this.drawCard();
      this.drawContent();
      if (t < 1) {
        const rafId = requestAnimationFrame(animate);
        this.animationFrames.push(rafId);
      }
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
      if (this.destroyed) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: easeInOutSine
      const eased = -(Math.cos(Math.PI * progress) - 1) / 2;
      // Scale: 1.0 → 1.03 → 1.0
      const scale = 1.0 + 0.03 * Math.sin(progress * Math.PI);

      this.scale.set(scale);

      if (progress < 1) {
        const rafId = requestAnimationFrame(animate);
        this.animationFrames.push(rafId);
      } else {
        this.scale.set(1.0);
      }
    };

    animate();
  }

  public getCardHeight(): number {
    return this.currentHeight;
  }

  public handlePointerAction(globalX: number, globalY: number): boolean {
    const localX = globalX - this.x;
    const localY = globalY - this.y;

    if (this.isSelected && localX >= this.widthPx - 70 && localX <= this.widthPx - 14 && localY >= 126 && localY <= 150) {
      window.dispatchEvent(new CustomEvent('venture-node-close'));
      return true;
    }

    if (this.isSelected && localX >= 42 && localX <= 116 && localY >= this.currentHeight - 36 && localY <= this.currentHeight - 8) {
      window.dispatchEvent(new CustomEvent('open-event-log', { detail: { ventureId: this.venture.id } }));
      return true;
    }

    return false;
  }

  getVenture(): Venture {
    return this.venture;
  }

  destroy(options?: boolean | object): void {
    this.animationFrames.forEach(rafId => cancelAnimationFrame(rafId));
    this.animationFrames = [];
    super.destroy(options);
  }
}
