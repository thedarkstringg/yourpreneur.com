import { useCallback } from 'react';
import { useStore } from './useStore';

export function useCanvasNavigation() {
  const { ventures } = useStore();

  const navigateToVenture = useCallback(
    (ventureId: string) => {
      const venture = ventures.find((v) => v.id === ventureId);
      if (!venture) return;

      // Calculate target position
      // This would interact with the Pixi canvas viewport
      // For now, just select the venture
      useStore.setState({ selectedVentureId: ventureId });

      // TODO: Implement canvas pan/zoom animation
      // targetX = ventureCard.worldX - (viewportWidth - leftPanel - rightPanel) / 2
      // targetY = ventureCard.worldY - viewportHeight / 2 + 80
      // Animate over 650ms with easeInOutCubic
    },
    [ventures]
  );

  const navigateToYear = useCallback((year: number) => {
    // Calculate x position of that year's January 1st
    // targetX = yearIndex * 1440 * zoom (1440px per year)

    // Animate canvas to center that year's content
    // Duration: 700ms, Easing: easeInOutCubic

    // TODO: Implement year navigation with canvas animation
  }, []);

  const focusAllVentures = useCallback(() => {
    // Calculate bounding box of all venture cards
    // Animate canvas transform so all cards fit within viewport
    // with 80px padding on all sides

    // TODO: Implement focus all animation
  }, [ventures]);

  return {
    navigateToVenture,
    navigateToYear,
    focusAllVentures,
  };
}
