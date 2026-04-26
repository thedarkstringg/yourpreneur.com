// Easing functions for animations
export const easingFunctions = {
  easeOutCubic: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  easeInOutCubic: (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  easeOutExpo: (t: number): number => {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  },

  easeInCubic: (t: number): number => {
    return t * t * t;
  },

  easeInOutSine: (t: number): number => {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  },

  linear: (t: number): number => t,
};

export const interpolate = (
  start: number,
  end: number,
  t: number
): number => {
  return start + (end - start) * t;
};

export const animateTo = (
  fromValue: number,
  toValue: number,
  duration: number,
  easing: (t: number) => number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
): (() => void) => {
  const startTime = Date.now();
  let animationFrameId: number | null = null;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = interpolate(fromValue, toValue, easedProgress);

    onUpdate(currentValue);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};
