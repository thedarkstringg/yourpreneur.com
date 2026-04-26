import { useCallback } from 'react';
import { useStore } from './useStore';

export interface VentureEvent {
  id: string;
  date: string;
  type: string;
  title: string;
  notes?: string;
  mood?: string;
  impact?: string;
  lessonLearned?: string;
  whatYouddoDifferently?: string;
  linkUrl?: string;
}

export function useEventManagement() {
  const { ventures, events } = useStore();

  const addEvent = useCallback(
    (ventureId: string, event: Omit<VentureEvent, 'id'>) => {
      const venture = ventures.find((v) => v.id === ventureId);
      if (!venture) return null;

      const newEvent = {
        ...event,
        id: Math.random().toString(36).slice(2),
        ventureId,
      };

      // Update store with new event
      useStore.setState({ events: [...events, newEvent as any] });
      return newEvent;
    },
    [ventures, events]
  );

  const updateEvent = useCallback(
    (ventureId: string, eventId: string, updates: Partial<VentureEvent>) => {
      const venture = ventures.find((v) => v.id === ventureId);
      if (!venture) return null;

      const updatedEvents = events.map((e: any) =>
        e.id === eventId ? { ...e, ...updates } : e
      );

      useStore.setState({ events: updatedEvents });
    },
    [ventures, events]
  );

  const deleteEvent = useCallback(
    (ventureId: string, eventId: string) => {
      const updatedEvents = events.filter((e: any) => e.id !== eventId);
      useStore.setState({ events: updatedEvents });
    },
    [events]
  );

  const getVentureEvents = useCallback(
    (ventureId: string) => {
      return events.filter((e: any) => e.ventureId === ventureId);
    },
    [events]
  );

  const getAllEvents = useCallback(() => {
    return events.map((e: any) => {
      const venture = ventures.find((v) => v.id === e.ventureId);
      return {
        ...e,
        ventureName: venture?.name,
      };
    });
  }, [ventures, events]);

  return {
    addEvent,
    updateEvent,
    deleteEvent,
    getVentureEvents,
    getAllEvents,
  };
}
