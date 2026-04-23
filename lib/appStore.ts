/**
 * Zustand store for global app state
 * Manages ventures, events, user data, and UI state
 */

import { create } from "zustand";
import {
  Venture,
  Event,
  User,
  VentureStatus,
  CreateVentureInput,
  CreateEventInput,
  UpdateVentureInput,
  UpdateUserInput,
} from "@/lib/types";

interface AppStore {
  // Data
  user: User | null;
  ventures: Venture[];
  events: Event[];

  // UI State
  selectedYear: number;
  expandedVentureId: string | null;
  isLogPanelOpen: boolean;
  statusFilters: VentureStatus[];
  industryFilters: string[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions - User
  setUser: (user: User | null) => void;
  updateUser: (updates: UpdateUserInput) => void;
  fetchUser: () => Promise<void>;
  updateUserProfile: (updates: UpdateUserInput) => Promise<void>;

  // Actions - Ventures
  setVentures: (ventures: Venture[]) => void;
  addVenture: (venture: Venture) => void;
  updateVenture: (venture: Venture) => void;
  deleteVenture: (ventureId: string) => void;
  fetchVentures: (year?: number) => Promise<void>;
  createVenture: (input: CreateVentureInput) => Promise<Venture>;

  // Actions - Events
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  fetchEvents: (ventureId?: string) => Promise<void>;
  createEvent: (input: CreateEventInput) => Promise<Event>;

  // Actions - UI
  setSelectedYear: (year: number) => void;
  setExpandedVentureId: (ventureId: string | null) => void;
  toggleLogPanel: () => void;
  setLogPanelOpen: (isOpen: boolean) => void;
  setStatusFilters: (statuses: VentureStatus[]) => void;
  setIndustryFilters: (industries: string[]) => void;

  // Actions - Loading & Error
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilities
  getVenturesForYear: (year: number) => Venture[];
  getEventsForVenture: (ventureId: string) => Event[];
  getVentureById: (ventureId: string) => Venture | undefined;
  getEventById: (eventId: string) => Event | undefined;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  ventures: [],
  events: [],
  selectedYear: new Date().getFullYear(),
  expandedVentureId: null,
  isLogPanelOpen: false,
  statusFilters: [],
  industryFilters: [],
  isLoading: false,
  error: null,

  // User actions
  setUser: (user) => set({ user }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  // Venture actions
  setVentures: (ventures) => set({ ventures }),
  addVenture: (venture) =>
    set((state) => ({
      ventures: [venture, ...state.ventures],
    })),
  updateVenture: (venture) =>
    set((state) => ({
      ventures: state.ventures.map((v) => (v.id === venture.id ? venture : v)),
    })),
  deleteVenture: (ventureId) =>
    set((state) => ({
      ventures: state.ventures.filter((v) => v.id !== ventureId),
    })),

  // Event actions
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),
  deleteEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    })),

  // UI actions
  setSelectedYear: (year) => set({ selectedYear: year }),
  setExpandedVentureId: (ventureId) => set({ expandedVentureId: ventureId }),
  toggleLogPanel: () =>
    set((state) => ({
      isLogPanelOpen: !state.isLogPanelOpen,
    })),
  setLogPanelOpen: (isOpen) => set({ isLogPanelOpen: isOpen }),
  setStatusFilters: (statuses) => set({ statusFilters: statuses }),
  setIndustryFilters: (industries) => set({ industryFilters: industries }),

  // Loading & error actions
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Utility functions
  getVenturesForYear: (year) => {
    const { ventures } = get();
    return ventures.filter((v) => {
      const startYear = new Date(v.started_date).getFullYear();
      const endYear = v.ended_date ? new Date(v.ended_date).getFullYear() : null;
      // Include venture if it started in this year or is still active
      return startYear === year || (endYear && endYear >= year);
    });
  },

  getEventsForVenture: (ventureId) => {
    const { events } = get();
    return events
      .filter((e) => e.venture_id === ventureId)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  },

  getVentureById: (ventureId) => {
    const { ventures } = get();
    return ventures.find((v) => v.id === ventureId);
  },

  getEventById: (eventId) => {
    const { events } = get();
    return events.find((e) => e.id === eventId);
  },
}));
