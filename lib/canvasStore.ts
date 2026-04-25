import { create } from 'zustand';

interface CanvasStore {
  // Viewport state
  zoomLevel: number;
  panX: number;
  panY: number;

  // Actions
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  zoomLevel: 1,
  panX: 0,
  panY: 0,

  setZoom: (zoom) => set({ zoomLevel: zoom }),
  setPan: (x, y) => set({ panX: x, panY: y }),
  resetView: () => set({ zoomLevel: 1, panX: 0, panY: 0 }),
}));
