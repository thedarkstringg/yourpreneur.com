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

      const newEvent: StoreVentureEvent = {
        id: crypto.randomUUID(),
        ventureId,
        eventDate: event.eventDate || event.date,
        type: event.type as StoreVentureEvent['type'],
        title: event.title,
        notes: event.notes,
        mood: event.mood as StoreVentureEvent['mood'],
        impact: event.impact as StoreVentureEvent['impact'],
        linkUrl: event.linkUrl,
        lessonLearned: event.lessonLearned,
      };

      // Update store with new event
      useStore.setState({ events: [...events, newEvent] });
      
      // Persist to DB
      useStore.getState().saveEvent(newEvent).catch(console.error);
      
      return newEvent;
    },
    [ventures, events]
  );

  const updateEvent = useCallback(
    (ventureId: string, eventId: string, updates: Partial<StoreVentureEvent>) => {
      const venture = ventures.find((v) => v.id === ventureId);
      if (!venture) return null;

      const event = events.find(e => e.id === eventId);
      if (!event) return null;

      const updatedEvent = { ...event, ...updates };
      const updatedEvents = events.map((e) =>
        e.id === eventId ? updatedEvent : e
      );

      useStore.setState({ events: updatedEvents as StoreVentureEvent[] });
      
      // Persist to DB
      useStore.getState().saveEvent(updatedEvent as StoreVentureEvent).catch(console.error);
    },
    [ventures, events]
  );

  const deleteEvent = useCallback(
    (_ventureId: string, eventId: string) => {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      useStore.setState({ events: updatedEvents });
      
      // Persist to DB
      useStore.getState().deleteEventFromDb(eventId).catch(console.error);
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
