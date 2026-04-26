'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/useStore';

export default function KeyboardShortcuts({
  onNewVenture,
  onLogEvent,
  onModify,
  onFocus,
  onList,
  onInsights,
  onNavigatePrev,
  onNavigateNext,
}: {
  onNewVenture?: () => void;
  onLogEvent?: () => void;
  onModify?: () => void;
  onFocus?: () => void;
  onList?: () => void;
  onInsights?: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}) {
  const { selectedVentureId, ventures } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Cmd/Ctrl+Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        // TODO: Implement undo
        return;
      }

      // Escape to close panels
      if (e.key === 'Escape') {
        // Close any open modals/panels
        // This can be handled by parent component
        return;
      }

      // N - New venture
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNewVenture?.();
      }

      // E - Log event
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        onLogEvent?.();
      }

      // M - Modify selected venture
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (selectedVentureId) {
          onModify?.();
        }
      }

      // F - Focus/fit all ventures
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        onFocus?.();
      }

      // L - Toggle list view
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        onList?.();
      }

      // I - Go to insights
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        onInsights?.();
      }

      // Arrow keys - Navigate between ventures
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigatePrev?.();
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigateNext?.();
      }

      // Delete - Delete selected venture
      if (e.key === 'Delete' && selectedVentureId) {
        e.preventDefault();
        // TODO: Show delete confirmation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVentureId, ventures, onNewVenture, onLogEvent, onModify, onFocus, onList, onInsights, onNavigatePrev, onNavigateNext]);

  return null;
}
