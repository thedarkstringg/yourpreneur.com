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

const SEED_DATA: Venture[] = [
  {
    id: 'freight-os',
    name: 'FreightOS Node',
    industry: 'Logistics',
    status: 'pivot',
    startedDate: '2024-06-02',
    description: 'Supply chain optimization platform',
    color: '#ff6b6b',
    burnRate: 42000,
    runwayMonths: 8,
    collaborators: ['Naila Karim', 'Omar Lee'],
    healthScore: 68,
    mrrTrend: [8, 12, 10, 15, 18, 17, 21],
    lastSyncedAt: '2026-05-12T10:30:00.000Z',
    source: 'linear',
  },
  {
    id: 'synthetica',
    name: 'Synthetica',
    industry: 'AI / ML',
    status: 'active',
    startedDate: '2024-10-19',
    description: 'AI-powered synthetic data generation',
    color: '#4ecdc4',
    burnRate: 18000,
    runwayMonths: 14,
    collaborators: ['Maya Chen'],
    healthScore: 91,
    mrrTrend: [4, 7, 11, 18, 27, 35, 44],
    lastSyncedAt: '2026-05-14T07:15:00.000Z',
    source: 'github',
  },
  {
    id: 'helio',
    name: 'Helio',
    industry: 'CleanTech',
    status: 'active',
    startedDate: '2025-02-08',
    description: 'Renewable energy marketplace',
    parentId: 'freight-os',
    branchLabel: 'Spinoff',
    color: '#95e1d3',
    burnRate: 12000,
    runwayMonths: 10,
    collaborators: ['Ibrahim Stone', 'Leila Park'],
    healthScore: 76,
    mrrTrend: [2, 3, 5, 8, 7, 12, 16],
    lastSyncedAt: '2026-05-10T12:00:00.000Z',
    source: 'notion',
  },
];

const SEED_EVENTS = [
  { id: 'e1', ventureId: 'freight-os', type: 'launch' as const, title: 'Platform Launch', eventDate: '2024-07-15', impact: 'high' as const, mood: 'focused' as const, triggerType: 'internal' as const },
  { id: 'e2', ventureId: 'freight-os', type: 'funding' as const, title: 'Series A', eventDate: '2024-09-10', impact: 'critical' as const, mood: 'proud' as const, triggerType: 'external' as const },
  { id: 'e3', ventureId: 'synthetica', type: 'launch' as const, title: 'Beta Release', eventDate: '2024-11-20', impact: 'medium' as const, mood: 'energized' as const, triggerType: 'team' as const },
  { id: 'e4', ventureId: 'synthetica', type: 'milestone' as const, title: '1M Data Points', eventDate: '2025-01-15', impact: 'high' as const, mood: 'focused' as const, triggerType: 'market' as const },
  { id: 'e5', ventureId: 'helio', type: 'funding' as const, title: 'Seed Round', eventDate: '2025-03-01', impact: 'medium' as const, mood: 'uncertain' as const, triggerType: 'external' as const },
];

const SEED_TASKS: FounderTask[] = [
  {
    id: 'task-validate-helio',
    title: 'Validate Helio buyer shortlist',
    ventureId: 'helio',
    role: 'growth',
    deadline: '2026-05-24',
    notes: 'Talk to 8 procurement leads and tag objections by source.',
    status: 'doing',
    position: { x: 120, y: 96 },
  },
  {
    id: 'task-freight-retention',
    title: 'Map FreightOS retention risks',
    ventureId: 'freight-os',
    role: 'ops',
    deadline: '2026-05-20',
    notes: 'Compare churn notes against the Series A assumptions.',
    status: 'blocked',
    position: { x: 470, y: 220 },
  },
  {
    id: 'task-synthetica-launch',
    title: 'Ship Synthetica beta narrative',
    ventureId: 'synthetica',
    role: 'product',
    deadline: '2026-05-28',
    notes: 'Turn GitHub milestones into a launch memo and demo checklist.',
    status: 'todo',
    position: { x: 780, y: 110 },
  },
];

const SEED_TASK_CONNECTIONS: TaskConnection[] = [
  { id: 'task-link-1', fromTaskId: 'task-validate-helio', toTaskId: 'task-freight-retention' },
  { id: 'task-link-2', fromTaskId: 'task-freight-retention', toTaskId: 'task-synthetica-launch' },
];

export const useStore = create<CanvasState>((set, get) => ({
  // Auth
  user: null,
  authLoading: true,

  // Data
  ventures: SEED_DATA,
  events: SEED_EVENTS,
  tasks: SEED_TASKS,
  taskConnections: SEED_TASK_CONNECTIONS,
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
      const { data, error } = await supabase
        .from('ventures')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const ventures: Venture[] = (data || []).map((v: any) => ({
        id: v.id,
        name: v.name,
        description: v.description,
        industry: v.industry,
        status: v.status,
        startedDate: v.started_date,
        endedDate: v.ended_date,
        logoUrl: v.logo_url,
        color: v.color,
        parentId: v.parent_id,
        branchLabel: v.branch_label,
        position: { x: v.position_x || 0, y: v.position_y || 0 },
        hardestLesson: v.hardest_lesson,
        burnRate: v.burn_rate,
        runwayMonths: v.runway_months,
        collaborators: v.collaborators,
        healthScore: v.health_score,
        mrrTrend: v.mrr_trend,
        lastSyncedAt: v.last_synced_at,
        source: v.source,
        timelineSide: v.timeline_side,
      }));

      set({ ventures, syncStatus: 'synced' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch ventures';
      set({ syncStatus: 'error', syncError: message });
    }
  },

  saveVenture: async (venture: Venture) => {
    try {
      set({ syncStatus: 'syncing' });
      const { error } = await supabase
        .from('ventures')
        .upsert([
          {
            id: venture.id,
            name: venture.name,
            description: venture.description,
            industry: venture.industry,
            status: venture.status,
            started_date: venture.startedDate,
            ended_date: venture.endedDate,
            logo_url: venture.logoUrl,
            color: venture.color,
            parent_id: venture.parentId,
            branch_label: venture.branchLabel,
            position_x: venture.position?.x,
            position_y: venture.position?.y,
            hardest_lesson: venture.hardestLesson,
            burn_rate: venture.burnRate,
            runway_months: venture.runwayMonths,
            collaborators: venture.collaborators,
            health_score: venture.healthScore,
            mrr_trend: venture.mrrTrend,
            last_synced_at: new Date().toISOString(),
            source: venture.source,
            timeline_side: venture.timelineSide,
          },
        ]);

      if (error) throw error;
      set({ syncStatus: 'synced' });
    } catch (error) {
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
      const { error } = await supabase
        .from('events')
        .upsert([
          {
            id: event.id,
            venture_id: event.ventureId,
            type: event.type,
            title: event.title,
            notes: event.notes,
            event_date: event.eventDate,
            link_url: event.linkUrl,
            mood: event.mood,
            impact: event.impact,
            was_planned: event.wasPlanned,
            trigger_type: event.triggerType,
            lesson_learned: event.lessonLearned,
            counterfactual: event.counterfactual,
          },
        ]);

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

      const tasks: FounderTask[] = (data || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        ventureId: t.venture_id,
        role: t.role,
        deadline: t.deadline,
        notes: t.notes,
        status: t.status,
        position: { x: t.position_x || 0, y: t.position_y || 0 },
      }));

      set({ tasks, syncStatus: 'synced' });
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
        .upsert([
          {
            id: task.id,
            venture_id: task.ventureId,
            user_id: userId,
            title: task.title,
            role: task.role,
            deadline: task.deadline,
            notes: task.notes,
            status: task.status,
            position_x: task.position.x,
            position_y: task.position.y,
          },
        ]);

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
