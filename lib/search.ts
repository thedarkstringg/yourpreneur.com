import { Venture, VentureEvent, FounderTask } from './useStore';

export interface SearchResult {
  type: 'venture' | 'event' | 'task';
  id: string;
  title: string;
  subtext?: string;
  matchedFields: string[];
}

// Simple text search across ventures
export const searchVentures = (ventures: Venture[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  ventures.forEach((v) => {
    const matchedFields: string[] = [];

    if (v.name.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('name');
    }
    if (v.description?.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('description');
    }
    if (v.industry?.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('industry');
    }
    if (v.hardestLesson?.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('lesson');
    }

    if (matchedFields.length > 0) {
      results.push({
        type: 'venture',
        id: v.id,
        title: v.name,
        subtext: v.industry,
        matchedFields,
      });
    }
  });

  return results;
};

// Search events
export const searchEvents = (events: VentureEvent[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  events.forEach((e) => {
    const matchedFields: string[] = [];

    if (e.title.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('title');
    }
    if (e.notes?.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('notes');
    }
    if (e.type.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('type');
    }

    if (matchedFields.length > 0) {
      results.push({
        type: 'event',
        id: e.id,
        title: e.title,
        subtext: e.type,
        matchedFields,
      });
    }
  });

  return results;
};

// Search tasks
export const searchTasks = (tasks: FounderTask[], query: string): SearchResult[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  tasks.forEach((t) => {
    const matchedFields: string[] = [];

    if (t.title.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('title');
    }
    if (t.notes.toLowerCase().includes(lowerQuery)) {
      matchedFields.push('notes');
    }

    if (matchedFields.length > 0) {
      results.push({
        type: 'task',
        id: t.id,
        title: t.title,
        subtext: t.role,
        matchedFields,
      });
    }
  });

  return results;
};

// Combined search
export const globalSearch = (
  ventures: Venture[],
  events: VentureEvent[],
  tasks: FounderTask[],
  query: string
): SearchResult[] => {
  return [
    ...searchVentures(ventures, query),
    ...searchEvents(events, query),
    ...searchTasks(tasks, query),
  ].slice(0, 20); // Limit to 20 results
};

// Filter ventures by status
export const filterByStatus = (ventures: Venture[], status: Venture['status']): Venture[] => {
  return ventures.filter((v) => v.status === status);
};

// Filter ventures by industry
export const filterByIndustry = (ventures: Venture[], industry: string): Venture[] => {
  return ventures.filter((v) => v.industry === industry);
};

// Sort ventures by health score
export const sortByHealthScore = (ventures: Venture[], descending = true): Venture[] => {
  return [...ventures].sort((a, b) => {
    const scoreA = a.healthScore || 0;
    const scoreB = b.healthScore || 0;
    return descending ? scoreB - scoreA : scoreA - scoreB;
  });
};

// Sort ventures by start date
export const sortByStartDate = (ventures: Venture[], descending = true): Venture[] => {
  return [...ventures].sort((a, b) => {
    const dateA = new Date(a.startedDate).getTime();
    const dateB = new Date(b.startedDate).getTime();
    return descending ? dateB - dateA : dateA - dateB;
  });
};
