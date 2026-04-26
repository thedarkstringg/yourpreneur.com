import { useCallback, useRef } from 'react';
import { Viewport } from 'pixi-viewport';
import { Container } from 'pixi.js';
import { easingFunctions, animateTo } from './easingFunctions';

interface NavigationTarget {
  worldX: number;
  worldY: number;
  scale?: number;
}

export function useCanvasNavigation() {
  const viewportRef = useRef<Viewport | null>(null);
  const worldContainerRef = useRef<Container | null>(null);
  const cancelAnimationRef = useRef<(() => void) | null>(null);

  const registerViewport = useCallback((viewport: Viewport, worldContainer: Container) => {
    viewportRef.current = viewport;
    worldContainerRef.current = worldContainer;
  }, []);

  const navigateToTarget = useCallback(
    (target: NavigationTarget, duration: number = 650) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      // Cancel any ongoing animation
      if (cancelAnimationRef.current) {
        cancelAnimationRef.current();
      }

      // Calculate target viewport center
      const viewportWidth = viewport.screenWidth;
      const viewportHeight = viewport.screenHeight;

      // Target position: center the card in the viewport
      // Account for left panel (240px) and right panel (200px) margins
      const centerX = target.worldX;
      const centerY = target.worldY;

      // Target world position that would center this card
      const targetWorldX = centerX - (viewportWidth - 240 - 200) / 2;
      const targetWorldY = centerY - viewportHeight / 2 + 80;

      const startX = viewport.x;
      const startY = viewport.y;
      const startScale = viewport.scale.x;
      const targetScale = target.scale ?? Math.max(0.8, Math.min(1.2, startScale));

      cancelAnimationRef.current = animateTo(
        0,
        1,
        duration,
        easingFunctions.easeInOutCubic,
        (progress) => {
          if (!viewport) return;

          const currentX = startX + (targetWorldX - startX) * progress;
          const currentY = startY + (targetWorldY - startY) * progress;
          const currentScale = startScale + (targetScale - startScale) * progress;

          viewport.x = currentX;
          viewport.y = currentY;
          viewport.setZoom(currentScale);
        },
        () => {
          cancelAnimationRef.current = null;
        }
      );
    },
    []
  );

  const navigateToYear = useCallback(
    (yearIndex: number, duration: number = 700) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      // Cancel any ongoing animation
      if (cancelAnimationRef.current) {
        cancelAnimationRef.current();
      }

      // Calculate x position of January 1st for that year
      // 1440px per year (based on prompt specification)
      const targetWorldX = yearIndex * 1440;
      const viewportWidth = viewport.screenWidth;

      // Center the year's content
      const startX = viewport.x;
      const startScale = viewport.scale.x;
      const targetScale = startScale; // Keep zoom the same for year navigation

      cancelAnimationRef.current = animateTo(
        0,
        1,
        duration,
        easingFunctions.easeInOutCubic,
        (progress) => {
          if (!viewport) return;

          const currentX = startX + (targetWorldX - startX) * progress;
          viewport.x = currentX;
        },
        () => {
          cancelAnimationRef.current = null;
        }
      );
    },
    []
  );

  return {
    registerViewport,
    navigateToTarget,
    navigateToYear,
  };
}
