/**
 * Mock data service for development
 * Replace with actual Supabase queries when ready
 */

import { User, Venture, Event } from "@/lib/types";

// Mock user
export const mockUser: User = {
  id: "user-1",
  name: "Entrepreneur",
  display_title: "Vol. 01",
  avatar_url: null,
  created_at: new Date().toISOString(),
};

// Mock ventures
export const mockVentures: Venture[] = [
  {
    id: "venture-1",
    user_id: "user-1",
    name: "Infra Pay",
    description: "Financial infrastructure for Web3",
    industry: "FinTech",
    status: "active",
    started_date: "2023-03-14",
    ended_date: null,
    created_at: "2023-03-14T00:00:00Z",
  },
  {
    id: "venture-2",
    user_id: "user-1",
    name: "FreightOS Node",
    description: "Logistics automation platform",
    industry: "Logistics",
    status: "pivot",
    started_date: "2024-06-02",
    ended_date: null,
    created_at: "2024-06-02T00:00:00Z",
  },
  {
    id: "venture-3",
    user_id: "user-1",
    name: "Synthetica",
    description: "AI-powered data synthesis",
    industry: "AI / ML",
    status: "active",
    started_date: "2024-10-19",
    ended_date: null,
    created_at: "2024-10-19T00:00:00Z",
  },
  {
    id: "venture-4",
    user_id: "user-1",
    name: "Echo Analytics",
    description: "Customer insights platform",
    industry: "SaaS",
    status: "shutdown",
    started_date: "2022-01-10",
    ended_date: "2023-06-30",
    created_at: "2022-01-10T00:00:00Z",
  },
];

// Mock events
export const mockEvents: Event[] = [
  {
    id: "event-1",
    venture_id: "venture-1",
    user_id: "user-1",
    event_type: "launch",
    title: "Launched MVP",
    notes: "First public release of Infra Pay on mainnet",
    event_date: "2023-05-01",
    link_url: null,
    created_at: "2023-05-01T00:00:00Z",
  },
  {
    id: "event-2",
    venture_id: "venture-1",
    user_id: "user-1",
    event_type: "funding",
    title: "Seed Round Closed",
    notes: "$2M seed funding from a16z",
    event_date: "2023-08-15",
    link_url: null,
    created_at: "2023-08-15T00:00:00Z",
  },
  {
    id: "event-3",
    venture_id: "venture-1",
    user_id: "user-1",
    event_type: "milestone",
    title: "1000 Active Users",
    notes: "Hit first major user milestone",
    event_date: "2023-12-01",
    link_url: null,
    created_at: "2023-12-01T00:00:00Z",
  },
  {
    id: "event-4",
    venture_id: "venture-2",
    user_id: "user-1",
    event_type: "launch",
    title: "Public Beta",
    notes: "FreightOS Node beta available to logistics partners",
    event_date: "2024-07-10",
    link_url: null,
    created_at: "2024-07-10T00:00:00Z",
  },
  {
    id: "event-5",
    venture_id: "venture-2",
    user_id: "user-1",
    event_type: "pivot",
    title: "Pivot to B2B",
    notes: "Shifting focus from consumer to enterprise logistics",
    event_date: "2024-09-01",
    link_url: null,
    created_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "event-6",
    venture_id: "venture-3",
    user_id: "user-1",
    event_type: "launch",
    title: "Initial Release",
    notes: "Synthetica v0.1 released to early adopters",
    event_date: "2024-11-15",
    link_url: null,
    created_at: "2024-11-15T00:00:00Z",
  },
  {
    id: "event-7",
    venture_id: "venture-4",
    user_id: "user-1",
    event_type: "launch",
    title: "Echo Analytics Goes Live",
    notes: "First version released",
    event_date: "2022-02-01",
    link_url: null,
    created_at: "2022-02-01T00:00:00Z",
  },
  {
    id: "event-8",
    venture_id: "venture-4",
    user_id: "user-1",
    event_type: "setback",
    title: "Platform Issues",
    notes: "Major outage caused data loss, lost 40% of users",
    event_date: "2023-03-15",
    link_url: null,
    created_at: "2023-03-15T00:00:00Z",
  },
  {
    id: "event-9",
    venture_id: "venture-4",
    user_id: "user-1",
    event_type: "exit",
    title: "Shut Down",
    notes: "Decided to shut down Echo Analytics and focus on other projects",
    event_date: "2023-06-30",
    link_url: null,
    created_at: "2023-06-30T00:00:00Z",
  },
];

/**
 * Simulate API calls with mock data
 */
export function getMockUser(): Promise<User> {
  return Promise.resolve(mockUser);
}

export function getMockVentures(): Promise<Venture[]> {
  return Promise.resolve(mockVentures);
}

export function getMockEvents(): Promise<Event[]> {
  return Promise.resolve(mockEvents);
}

export function getMockVentureById(id: string): Promise<Venture | null> {
  return Promise.resolve(mockVentures.find((v) => v.id === id) || null);
}

export function getMockEventsByVenture(ventureId: string): Promise<Event[]> {
  return Promise.resolve(
    mockEvents
      .filter((e) => e.venture_id === ventureId)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
  );
}
