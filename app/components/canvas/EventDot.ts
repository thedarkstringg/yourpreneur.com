import { Container, Graphics } from 'pixi.js';
import { VentureEvent } from '@/lib/useStore';

interface EventDotOptions {
  x: number;
  y: number;
  event: VentureEvent;
}

const MOOD_COLORS: Record<string, number> = {
  energized: 0x64dc96, // soft green
  focused: 0xffffff,   // white
  uncertain: 0xdcb450, // amber
  lost: 0x9696b4,      // slate
  proud: 0xb48cff,     // soft purple
  regretful: 0xc86450, // muted red
  burned_out: 0x787878, // gray
};

const IMPACT_SIZES: Record<string, number> = {
  low: 4,
  medium: 5,
  high: 7,
  critical: 9,
};

export class EventDot extends Container {
  private baseRadius: number;
  private dot: Graphics;
  private ring: Graphics;
  private pulseRing?: Graphics;
  private event: VentureEvent;
  private moodColor: number;
  private animationFrames: number[] = [];

  constructor(options: EventDotOptions) {
    super();

    this.event = options.event;
    this.x = options.x;
    this.y = options.y;

    this.baseRadius = IMPACT_SIZES[this.event.impact || 'low'] || 5;
    this.moodColor = MOOD_COLORS[this.event.mood || ''] || 0xffffff;

    this.dot = new Graphics();
    this.dot.circle(0, 0, this.baseRadius);
    this.dot.fill({ color: this.moodColor, alpha: this.event.mood ? 0.7 : 0.5 });
    this.addChild(this.dot);

    // subtle outer ring for hover glow (drawn but alpha 0)
    this.ring = new Graphics();
    this.ring.circle(0, 0, this.baseRadius + 6);
    this.ring.stroke({ width: 1, color: this.moodColor, alpha: 0.16 });
    this.ring.alpha = 0;
    this.addChild(this.ring);

    if (this.event.impact === 'critical') {
      this.pulseRing = new Graphics();
      this.pulseRing.circle(0, 0, this.baseRadius);
      this.pulseRing.stroke({ width: 1, color: this.moodColor, alpha: 0.4 });
      this.addChild(this.pulseRing);
      this.startPulseAnimation();
    }

    this.interactive = true;
    this.on('pointerover', this.handlePointerOver.bind(this));
    this.on('pointerout', this.handlePointerOut.bind(this));
  }

  private startPulseAnimation() {
    if (!this.pulseRing) return;

    const animate = () => {
      if (this.destroyed || !this.pulseRing) return;
      const start = Date.now();
      const dur = 3500;

      const step = () => {
        if (this.destroyed || !this.pulseRing) return;
        const t = ((Date.now() - start) % dur) / dur;
        this.pulseRing!.clear();
        this.pulseRing!.circle(0, 0, this.baseRadius + t * 25);
        this.pulseRing!.stroke({ width: 1, color: this.moodColor, alpha: 0.4 * (1 - t) });
        const rafId = requestAnimationFrame(step);
        this.animationFrames.push(rafId);
      };
      step();
    };
    animate();
  }

  public triggerPulse() {
    if (!this.pulseRing) {
      this.pulseRing = new Graphics();
      this.pulseRing.circle(0, 0, this.baseRadius);
      this.pulseRing.stroke({ width: 1, color: this.moodColor, alpha: 0.4 });
      this.addChild(this.pulseRing);
    }

    const start = Date.now();
    const dur = 800;

    const step = () => {
      if (this.destroyed || !this.pulseRing) return;
      const t = ((Date.now() - start) % dur) / dur;
      this.pulseRing!.clear();
      this.pulseRing!.circle(0, 0, this.baseRadius + t * 35);
      this.pulseRing!.stroke({ width: 1, color: this.moodColor, alpha: 0.4 * (1 - t) });
      const rafId = requestAnimationFrame(step);
      this.animationFrames.push(rafId);
    };
    step();
  }

  private handlePointerOver() {
    // enlarge smoothly
    const start = Date.now();
    const dur = 180;
    const from = this.baseRadius;
    const to = this.baseRadius + 2;

    const animate = () => {
      if (this.destroyed) return;
      const t = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const r = from + (to - from) * eased;
      this.dot.clear();
      this.dot.circle(0, 0, r);
      this.dot.fill({ color: this.moodColor, alpha: this.event.mood ? 0.95 : 0.85 });
      this.ring.alpha = 0.25 * eased;
      if (t < 1) {
        const rafId = requestAnimationFrame(animate);
        this.animationFrames.push(rafId);
      }
    };

    animate();

    // Tooltip trigger would be handled in InteractionManager
    // but we can dispatch event
    window.dispatchEvent(new CustomEvent('event-dot-hover', {
      detail: {
        hover: true,
        event: this.event,
        x: this.worldTransform.tx,
        y: this.worldTransform.ty
      }
    }));
  }

  private handlePointerOut() {
    const start = Date.now();
    const dur = 160;
    const from = this.baseRadius + 2;
    const to = this.baseRadius;

    const animate = () => {
      if (this.destroyed) return;
      const t = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const r = from + (to - from) * eased;
      this.dot.clear();
      this.dot.circle(0, 0, r);
      this.dot.fill({ color: this.moodColor, alpha: this.event.mood ? 0.7 : 0.5 });
      this.ring.alpha = 0.25 * (1 - eased);
      if (t < 1) {
        const rafId = requestAnimationFrame(animate);
        this.animationFrames.push(rafId);
      }
    };

    animate();

    window.dispatchEvent(new CustomEvent('event-dot-hover', {
      detail: { hover: false }
    }));
  }

  destroy(options?: boolean | object): void {
    this.animationFrames.forEach(rafId => cancelAnimationFrame(rafId));
    this.animationFrames = [];
    super.destroy(options);
  }
}


