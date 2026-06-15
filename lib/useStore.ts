import { create } from 'zustand';
import { supabase } from './supabaseClient';

export interface Venture {
  id: string;
  name: string;
  description: string;
  industry: string;
  status: 'active' | 'stealth' | 'graveyard' | 'pivot' | 'paused' | 'shutdown' | 'exited' | 'archived' | 'acquired' | 'failed';
  startedDate: string; // ISO date
  endedDate?: string;
  logoUrl?: string;
  color?: string;
  parentId?: string;
  branchLabel?: string;
  position?: { x: number; y: number };
  hardestLesson?: string;
  burnRate?: number;
  runwayMonths?: number;
  collaborators?: string[];
  healthScore?: number;
  mrrTrend?: number[];
  lastSyncedAt?: string;
  source?: 'manual' | 'notion' | 'github' | 'linear' | 'stripe';
  timelineSide?: 'above' | 'below';
}

export interface VentureEvent {
  id: string;
  ventureId: string;
  type: 'milestone' | 'launch' | 'funding' | 'team' | 'pivot' | 'setback' | 'exit' | 'decision' | 'lesson' | 'feeling' | 'other';
  title: string;
  notes?: string;
  eventDate: string;
  linkUrl?: string;

  // NEW FIELDS
  mood?: 'energized' | 'uncertain' | 'burned_out' | 'focused' | 'lost' | 'proud' | 'regretful';
  impact?: 'low' | 'medium' | 'high' | 'critical';
  wasPlanned?: boolean;
  triggerType?: 'internal' | 'external' | 'market' | 'team' | 'personal';
  lessonLearned?: string;
  counterfactual?: string;
}

export interface FounderTask {
  id: string;
  title: string;
  ventureId?: string;
  role: 'founder' | 'ops' | 'growth' | 'product' | 'finance';
  deadline: string;
  notes: string;
  status: 'todo' | 'doing' | 'blocked' | 'done';
  position: { x: number; y: number };
}

export interface TaskConnection {
  id: string;
  fromTaskId: string;
  toTaskId: string;
}

interface CanvasState {
  // Auth
  user: { id: string; email: string; fullName: string; tier: 'free' | 'premium' } | null;
  authLoading: boolean;

  // Data
  ventures: Venture[];
  events: VentureEvent[];
  tasks: FounderTask[];
  taskConnections: TaskConnection[];
  selectedVentureId: string | null;

  // Viewport
  zoomLevel: number;
  panX: number;
  panY: number;

  // Navigation callbacks
  onNavigateToTarget?: (worldX: number, worldY: number, scale?: number) => void;
  onNavigateToYear?: (year: number) => void;

  // Sync status
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncError: string | null;

  // Actions
  setUser: (user: { id: string; email: string; fullName: string; tier: 'free' | 'premium' } | null) => void;
  clearAuth: () => void;
  setAuthLoading: (loading: boolean) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'synced' | 'error') => void;
  setSyncError: (error: string | null) => void;
  setVentures: (ventures: Venture[]) => void;
  addVenture: (venture: Venture) => void;
  updateVenture: (id: string, updates: Partial<Venture>) => void;
  deleteVenture: (id: string) => void;
  setEvents: (events: VentureEvent[]) => void;
  addEvent: (event: VentureEvent) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: FounderTask) => void;
  updateTask: (id: string, updates: Partial<FounderTask>) => void;
  deleteTask: (id: string) => void;
  addTaskConnection: (connection: TaskConnection) => void;
  deleteTaskConnection: (id: string) => void;
  setSelectedVenture: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  setCanvasNavigationCallbacks: (
    onNavigateToTarget?: (worldX: number, worldY: number, scale?: number) => void,
    onNavigateToYear?: (year: number) => void
  ) => void;

  // Async database functions
  fetchVentures: (userId: string) => Promise<void>;
  saveVenture: (venture: Venture) => Promise<void>;
  deleteVentureFromDb: (id: string) => Promise<void>;
  saveEvent: (event: VentureEvent) => Promise<void>;
  deleteEventFromDb: (id: string) => Promise<void>;
  fetchTasks: (userId: string) => Promise<void>;
  saveTask: (task: FounderTask) => Promise<void>;
  deleteTaskFromDb: (id: string) => Promise<void>;
}

export const useStore = create<CanvasState>((set, get) => ({
  // Auth
  user: null,
  authLoading: true,

  // Data
  ventures: [],
  events: [],
  tasks: [],
  taskConnections: [],
  selectedVentureId: null,
  zoomLevel: 1,
  panX: 0,
  panY: 0,

  // Sync status
  syncStatus: 'idle',
  syncError: null,

  // Auth actions
  setUser: (user) => set({ user, authLoading: false }),
  clearAuth: () => set({ user: null }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setSyncError: (error) => set({ syncError: error }),

  setVentures: (ventures) => set({ ventures }),
  addVenture: (venture) =>
    set((state) => ({
      ventures: [...state.ventures, venture],
    })),
  updateVenture: (id, updates) =>
    set((state) => ({
      ventures: state.ventures.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    })),
  deleteVenture: (id) =>
    set((state) => ({
      ventures: state.ventures.filter((v) => v.id !== id),
      selectedVentureId:
        state.selectedVentureId === id ? null : state.selectedVentureId,
    })),
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
      taskConnections: state.taskConnections.filter(
        (connection) => connection.fromTaskId !== id && connection.toTaskId !== id
      ),
    })),
  addTaskConnection: (connection) =>
    set((state) => ({
      taskConnections: [...state.taskConnections, connection],
    })),
  deleteTaskConnection: (id) =>
    set((state) => ({
      taskConnections: state.taskConnections.filter((connection) => connection.id !== id),
    })),
  setSelectedVenture: (id) => set({ selectedVentureId: id }),
  setZoom: (zoom) => set({ zoomLevel: zoom }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  resetView: () => set({ zoomLevel: 1, panX: 0, panY: 0 }),
  setCanvasNavigationCallbacks: (onNavigateToTarget, onNavigateToYear) =>
    set({ onNavigateToTarget, onNavigateToYear }),

  // Async database functions
  fetchVentures: async (userId: string) => {
    try {
      set({ syncStatus: 'syncing' });
      
      const { data: venturesData, error: venturesError } = await supabase
        .from('ventures')
        .select('*')
        .eq('user_id', userId);
        
      if (venturesError) throw venturesError;

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId);
        
      if (eventsError) throw eventsError;

      set({
        ventures: (venturesData || []).map(v => ({
          ...v,
          startedDate: v.started_date,
          logoUrl: v.logo_url,
          timelineSide: v.timeline_side as 'above' | 'below',
          position: v.position_x !== null ? { x: Number(v.position_x), y: Number(v.position_y) } : undefined
        })),
        events: (eventsData || []).map(e => ({
          ...e,
          ventureId: e.venture_id,
          eventDate: e.event_date
        })),
        syncStatus: 'synced'
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch ventures';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  saveVenture: async (venture: Venture) => {
    try {
      set({ syncStatus: 'syncing' });
      const state = get();
      const userId = state.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ventures')
        .upsert({
          id: venture.id,
          user_id: userId,
          name: venture.name,
          description: venture.description,
          industry: venture.industry,
          status: venture.status,
          started_date: venture.startedDate,
          logo_url: venture.logoUrl,
          color: venture.color,
          source: venture.source,
          timeline_side: venture.timelineSide,
          position_x: venture.position?.x,
          position_y: venture.position?.y,
        });

      if (error) {
        console.error('Supabase saveVenture error:', error);
        throw error;
      }
      set({ syncStatus: 'synced' });
    } catch (error) {
      console.error('saveVenture failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to save venture';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  deleteVentureFromDb: async (id: string) => {
    try {
      set({ syncStatus: 'syncing' });
      const { error } = await supabase
        .from('ventures')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set({ syncStatus: 'synced' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete venture';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  saveEvent: async (event: VentureEvent) => {
    try {
      set({ syncStatus: 'syncing' });
      const state = get();
      const userId = state.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('events')
        .upsert({
          id: event.id,
          venture_id: event.ventureId,
          user_id: userId,
          type: event.type,
          title: event.title,
          notes: event.notes,
          event_date: event.eventDate,
          mood: event.mood,
          impact: event.impact,
          trigger_type: event.triggerType,
        });

      if (error) throw error;
      set({ syncStatus: 'synced' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save event';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  deleteEventFromDb: async (id: string) => {
    try {
      set({ syncStatus: 'syncing' });
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set({ syncStatus: 'synced' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete event';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  fetchTasks: async (userId: string) => {
    try {
      set({ syncStatus: 'syncing' });
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;

      set({ 
        tasks: (data || []).map(t => ({
          ...t, 
          ventureId: t.venture_id,
          position: { x: Number(t.position_x), y: Number(t.position_y) }
        })), 
        syncStatus: 'synced' 
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  saveTask: async (task: FounderTask) => {
    try {
      set({ syncStatus: 'syncing' });
      const state = get();
      const userId = state.user?.id;

      if (!userId) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('tasks')
        .upsert({
          id: task.id,
          user_id: userId,
          venture_id: task.ventureId,
          title: task.title,
          role: task.role,
          deadline: task.deadline,
          notes: task.notes,
          status: task.status,
          position_x: task.position.x,
          position_y: task.position.y,
        });

      if (error) throw error;
      set({ syncStatus: 'synced' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save task';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  deleteTaskFromDb: async (id: string) => {
    try {
      set({ syncStatus: 'syncing' });
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set({ syncStatus: 'synced' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      set({ syncStatus: 'error', syncError: message });
    }
  },
}));
