import { useCallback, useRef } from 'react';
import { useStore } from './useStore';
import { Venture, VentureEvent, FounderTask } from './useStore';

export const useOptimisticUpdates = () => {
  const store = useStore();
  const syncQueueRef = useRef<Array<() => Promise<void>>>([]);
  const isSyncingRef = useRef(false);

  const processSyncQueue = useCallback(async () => {
    if (isSyncingRef.current || syncQueueRef.current.length === 0) return;

    isSyncingRef.current = true;
    const queue = [...syncQueueRef.current];
    syncQueueRef.current = [];

    for (const syncFn of queue) {
      try {
        await syncFn();
      } catch (error) {
        console.error('Sync error:', error);
        // Re-queue failed sync
        syncQueueRef.current.push(syncFn);
      }
    }

    isSyncingRef.current = false;

    // If there are still items in queue, retry after delay
    if (syncQueueRef.current.length > 0) {
      setTimeout(processSyncQueue, 2000);
    }
  }, []);

  const addVentureOptimistic = useCallback(
    (venture: Venture) => {
      // Optimistic update: add to UI immediately
      store.addVenture(venture);

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.saveVenture(venture);
        } catch (error) {
          console.error('Failed to save venture:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const updateVentureOptimistic = useCallback(
    (id: string, updates: Partial<Venture>) => {
      // Optimistic update
      store.updateVenture(id, updates);

      // Get full venture from store to save
      const venture = store.ventures.find((v) => v.id === id);
      if (!venture) return;

      const updatedVenture = { ...venture, ...updates };

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.saveVenture(updatedVenture);
        } catch (error) {
          console.error('Failed to update venture:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const deleteVentureOptimistic = useCallback(
    (id: string) => {
      // Optimistic update
      store.deleteVenture(id);

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.deleteVentureFromDb(id);
        } catch (error) {
          console.error('Failed to delete venture:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const addEventOptimistic = useCallback(
    (event: VentureEvent) => {
      // Optimistic update
      store.addEvent(event);

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.saveEvent(event);
        } catch (error) {
          console.error('Failed to save event:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const deleteEventOptimistic = useCallback(
    (id: string) => {
      // Optimistic update
      store.deleteEvent(id);

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.deleteEventFromDb(id);
        } catch (error) {
          console.error('Failed to delete event:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const addTaskOptimistic = useCallback(
    (task: FounderTask) => {
      // Optimistic update
      store.addTask(task);

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.saveTask(task);
        } catch (error) {
          console.error('Failed to save task:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const updateTaskOptimistic = useCallback(
    (id: string, updates: Partial<FounderTask>) => {
      // Optimistic update
      store.updateTask(id, updates);

      // Get full task from store to save
      const task = store.tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = { ...task, ...updates };

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.saveTask(updatedTask);
        } catch (error) {
          console.error('Failed to update task:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  const deleteTaskOptimistic = useCallback(
    (id: string) => {
      // Optimistic update
      store.deleteTask(id);

      // Queue database sync
      const syncFn = async () => {
        try {
          await store.deleteTaskFromDb(id);
        } catch (error) {
          console.error('Failed to delete task:', error);
          throw error;
        }
      };

      syncQueueRef.current.push(syncFn);
      processSyncQueue();
    },
    [store, processSyncQueue]
  );

  return {
    addVentureOptimistic,
    updateVentureOptimistic,
    deleteVentureOptimistic,
    addEventOptimistic,
    deleteEventOptimistic,
    addTaskOptimistic,
    updateTaskOptimistic,
    deleteTaskOptimistic,
    syncQueueLength: syncQueueRef.current.length,
  };
};
