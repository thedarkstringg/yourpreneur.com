import { Venture, VentureEvent, FounderTask } from './useStore';

const CACHE_VERSION = 1;
const CACHE_KEY = 'yourpreneur_cache_v' + CACHE_VERSION;

export interface CacheData {
  ventures: Venture[];
  events: VentureEvent[];
  tasks: FounderTask[];
  lastSync: string;
}

// Save data to local storage cache
export const saveCacheData = (data: CacheData) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save cache:', error);
  }
};

// Get data from local storage cache
export const getCacheData = (): CacheData | null => {
  try {
    if (typeof window === 'undefined') return null;
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Failed to read cache:', error);
    return null;
  }
};

// Check if cache is stale (older than specified minutes)
export const isCacheStale = (minutes: number = 60): boolean => {
  const cached = getCacheData();
  if (!cached) return true;

  const lastSync = new Date(cached.lastSync);
  const now = new Date();
  const diffMinutes = (now.getTime() - lastSync.getTime()) / 1000 / 60;

  return diffMinutes > minutes;
};

// Clear cache
export const clearCache = () => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};

// Merge cached data with fresh data from server
// Keeps newer items and removes duplicates
export const mergeCacheWithServerData = (cached: CacheData, serverData: CacheData): CacheData => {
  const mergedVentures: { [id: string]: Venture } = {};

  // Add cached ventures
  cached.ventures.forEach((v) => {
    mergedVentures[v.id] = v;
  });

  // Merge with server ventures (server wins on conflicts)
  serverData.ventures.forEach((v) => {
    mergedVentures[v.id] = v;
  });

  // Similar for events
  const mergedEvents: { [id: string]: VentureEvent } = {};
  cached.events.forEach((e) => {
    mergedEvents[e.id] = e;
  });
  serverData.events.forEach((e) => {
    mergedEvents[e.id] = e;
  });

  // Similar for tasks
  const mergedTasks: { [id: string]: FounderTask } = {};
  cached.tasks.forEach((t) => {
    mergedTasks[t.id] = t;
  });
  serverData.tasks.forEach((t) => {
    mergedTasks[t.id] = t;
  });

  return {
    ventures: Object.values(mergedVentures),
    events: Object.values(mergedEvents),
    tasks: Object.values(mergedTasks),
    lastSync: new Date().toISOString(),
  };
};

// Get unsynced changes (items created/modified locally after last sync)
export const getUnsyncedChanges = (
  userId: string
): { ventures: Venture[]; events: VentureEvent[]; tasks: FounderTask[] } => {
  const cached = getCacheData();
  if (!cached) return { ventures: [], events: [], tasks: [] };

  const lastSync = new Date(cached.lastSync);

  const unsyncedVentures = cached.ventures.filter((v) => {
    const modified = v.lastSyncedAt ? new Date(v.lastSyncedAt) : new Date(v.startedDate);
    return modified >= lastSync;
  });

  const unsyncedEvents = cached.events.filter((e) => {
    // Events don't have lastSyncedAt, so check if they're very recent
    return true; // In a real app, would track creation time
  });

  const unsyncedTasks = cached.tasks.filter((t) => {
    return true; // In a real app, would track creation time
  });

  return {
    ventures: unsyncedVentures,
    events: unsyncedEvents,
    tasks: unsyncedTasks,
  };
};
