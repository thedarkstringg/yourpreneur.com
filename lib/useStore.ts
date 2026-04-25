import { create } from 'zustand';

export interface Venture {
  id: string;
  name: string;
  description: string;
  industry: string;
  status: 'active' | 'pivot' | 'paused' | 'shutdown' | 'exited';
  startedDate: string; // ISO date
  endedDate?: string;
  logoUrl?: string;
  color?: string;
  parentId?: string;
  branchLabel?: string;
  position?: { x: number; y: number };
}

export interface VentureEvent {
  id: string;
  ventureId: string;
  type: 'milestone' | 'launch' | 'funding' | 'team' | 'pivot' | 'setback' | 'exit' | 'other';
  title: string;
  notes?: string;
  eventDate: string;
  linkUrl?: string;
}

interface CanvasState {
  // Data
  ventures: Venture[];
  events: VentureEvent[];
  selectedVentureId: string | null;

  // Viewport
  zoomLevel: number;
  panX: number;
  panY: number;

  // Actions
  setVentures: (ventures: Venture[]) => void;
  addVenture: (venture: Venture) => void;
  updateVenture: (id: string, updates: Partial<Venture>) => void;
  setEvents: (events: VentureEvent[]) => void;
  addEvent: (event: VentureEvent) => void;
  setSelectedVenture: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
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
  },
  {
    id: 'synthetica',
    name: 'Synthetica',
    industry: 'AI / ML',
    status: 'active',
    startedDate: '2024-10-19',
    description: 'AI-powered synthetic data generation',
    color: '#4ecdc4',
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
  },
];

const SEED_EVENTS = [
  { id: 'e1', ventureId: 'freight-os', type: 'launch' as const, title: 'Platform Launch', eventDate: '2024-07-15' },
  { id: 'e2', ventureId: 'freight-os', type: 'funding' as const, title: 'Series A', eventDate: '2024-09-10' },
  { id: 'e3', ventureId: 'synthetica', type: 'launch' as const, title: 'Beta Release', eventDate: '2024-11-20' },
  { id: 'e4', ventureId: 'synthetica', type: 'milestone' as const, title: '1M Data Points', eventDate: '2025-01-15' },
  { id: 'e5', ventureId: 'helio', type: 'funding' as const, title: 'Seed Round', eventDate: '2025-03-01' },
];

export const useStore = create<CanvasState>((set) => ({
  ventures: SEED_DATA,
  events: SEED_EVENTS,
  selectedVentureId: null,
  zoomLevel: 1,
  panX: 0,
  panY: 0,

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
  setEvents: (events) => set({ events }),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),
  setSelectedVenture: (id) => set({ selectedVentureId: id }),
  setZoom: (zoom) => set({ zoomLevel: zoom }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  resetView: () => set({ zoomLevel: 1, panX: 0, panY: 0 }),
}));
