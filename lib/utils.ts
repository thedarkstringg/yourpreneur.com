/**
 * Utility functions for date and timeline calculations
 */

import { Venture, Event } from "@/lib/types";

/**
 * Calculate the position of a date within a year (0-100%)
 * Used for timeline positioning
 */
export function getPositionInYear(date: string, year: number): number {
  const dateObj = new Date(date);
  const yearStart = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31`);

  const daysSinceStart = Math.floor(
    (dateObj.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysInYear = Math.floor(
    (yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, Math.min(100, (daysSinceStart / daysInYear) * 100));
}

/**
 * Calculate days active for a venture
 */
export function calculateDaysActive(venture: Venture): number {
  const startDate = new Date(venture.started_date);
  const endDate = venture.ended_date ? new Date(venture.ended_date) : new Date();
  return Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get the month name from a date string
 */
export function getMonthName(date: string): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dateObj = new Date(date);
  return months[dateObj.getMonth()];
}

/**
 * Format date as "MMM DD" (e.g. "Mar 14")
 */
export function formatDateShort(date: string): string {
  const dateObj = new Date(date);
  const month = getMonthName(date);
  const day = dateObj.getDate().toString().padStart(2, "0");
  return `${month.toUpperCase()} ${day}`;
}

/**
 * Format date as "YYYY-MM-DD" for input fields
 */
export function formatDateISO(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

/**
 * Parse a date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Calculate stats for a set of ventures and events
 */
export function calculateStats(ventures: Venture[], events: Event[]) {
  const totalVentures = ventures.length;
  const activeVentures = ventures.filter((v) => v.status === "active").length;
  const pivotVentures = ventures.filter((v) => v.status === "pivot").length;

  const avgLifespanDays =
    totalVentures > 0
      ? Math.round(
          ventures.reduce((sum, v) => sum + calculateDaysActive(v), 0) / totalVentures
        )
      : 0;

  const eventTypes: Record<string, number> = {};
  events.forEach((e) => {
    eventTypes[e.event_type] = (eventTypes[e.event_type] || 0) + 1;
  });

  const mostCommonEventType = Object.entries(eventTypes).sort(([, a], [, b]) => b - a)[0]?.[0];

  const pivotRate =
    totalVentures > 0 ? Math.round((pivotVentures / totalVentures) * 100) : 0;

  const venturesWithRevenue = ventures.filter((v) => {
    const ventureEvents = events.filter((e) => e.venture_id === v.id);
    return ventureEvents.some(
      (e) =>
        e.event_type === "funding" ||
        e.event_type === "launch" ||
        e.notes.toLowerCase().includes("revenue")
    );
  }).length;

  return {
    totalVentures,
    activeVentures,
    pivotVentures,
    avgLifespanDays,
    mostCommonEventType,
    pivotRate,
    venturesWithRevenue,
  };
}

/**
 * Group events by month
 */
export function groupEventsByMonth(events: Event[]): Record<string, Event[]> {
  const grouped: Record<string, Event[]> = {};

  events.forEach((event) => {
    const date = new Date(event.event_date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(event);
  });

  return grouped;
}

/**
 * Get event color based on type (for visualizations)
 */
export function getEventTypeColor(eventType: string): string {
  const colors: Record<string, string> = {
    launch: "bg-blue-500",
    funding: "bg-green-500",
    pivot: "bg-amber-500",
    team: "bg-purple-500",
    setback: "bg-red-500",
    exit: "bg-gray-500",
    milestone: "bg-cyan-500",
    other: "bg-slate-500",
  };
  return colors[eventType] || "bg-slate-500";
}
