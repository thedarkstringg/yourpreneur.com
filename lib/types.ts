/**
 * Core type definitions for the Preneurs application
 */

export type EventType =
  | "milestone"
  | "launch"
  | "funding"
  | "team"
  | "pivot"
  | "setback"
  | "exit"
  | "other";

export type VentureStatus = "active" | "pivot" | "paused" | "shutdown" | "exited";

export type User = {
  id: string;
  name: string;
  display_title: string; // e.g. "Vol. 01"
  avatar_url: string | null;
  created_at: string;
};

export type Venture = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  industry: string; // e.g. "FinTech", "AI/ML", "Logistics"
  status: VentureStatus;
  started_date: string; // ISO 8601 date
  ended_date: string | null;
  created_at: string;
};

export type Event = {
  id: string;
  venture_id: string;
  user_id: string;
  event_type: EventType;
  title: string;
  notes: string;
  event_date: string; // ISO 8601 date
  link_url: string | null;
  created_at: string;
};

export type YearStats = {
  year: number;
  ventures: number;
  events: number;
  pivots: number;
  avgLifespanDays: number;
};

// Form types
export type CreateVentureInput = {
  name: string;
  description: string;
  industry: string;
  started_date: string;
  status: VentureStatus;
};

export type CreateEventInput = {
  venture_id: string;
  event_type: EventType;
  title: string;
  notes: string;
  event_date: string;
  link_url?: string | null;
};

export type UpdateVentureInput = Partial<CreateVentureInput> & { id: string };

export type UpdateUserInput = {
  name?: string;
  display_title?: string;
  avatar_url?: string | null;
};

// UI/State types
export type TimelineItem = {
  id: string;
  date: string;
  positionPercentage: number; // 0-100, relative to year
  type: "venture" | "event";
};
