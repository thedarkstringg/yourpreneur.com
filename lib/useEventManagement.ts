import { useCallback } from 'react';
import { useStore, VentureEvent as StoreVentureEvent } from './useStore';

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

type EventInput = Omit<VentureEvent, 'id'> & {
  eventDate?: string;
};

export function useEventManagement() {
  const { ventures, events } = useStore();

  const addEvent = useCallback(
    (ventureId: string, event: EventInput) => {
      const venture = ventures.find((v) => v.id === ventureId);
      if (!venture) return null;

      const newEvent = {
        ...event,
        id: Math.random().toString(36).slice(2),
        ventureId,
        eventDate: event.eventDate || event.date,
        type: event.type as StoreVentureEvent['type'],
        mood: event.mood as StoreVentureEvent['mood'],
        impact: event.impact as StoreVentureEvent['impact'],
      };

      // Update store with new event
      useStore.setState({ events: [...events, newEvent as StoreVentureEvent] });
      return newEvent;
    },
    [ventures, events]
  );

  const updateEvent = useCallback(
    (ventureId: string, eventId: string, updates: Partial<StoreVentureEvent>) => {
      const venture = ventures.find((v) => v.id === ventureId);
      if (!venture) return null;

      const updatedEvents = events.map((e) =>
        e.id === eventId ? { ...e, ...updates } : e
      );

      useStore.setState({ events: updatedEvents as StoreVentureEvent[] });
    },
    [ventures, events]
  );

  const deleteEvent = useCallback(
    (_ventureId: string, eventId: string) => {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      useStore.setState({ events: updatedEvents });
    },
    [events]
  );

  const getVentureEvents = useCallback(
    (ventureId: string) => {
      return events.filter((e) => e.ventureId === ventureId);
    },
    [events]
  );

  const getAllEvents = useCallback(() => {
    return events.map((e) => {
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
