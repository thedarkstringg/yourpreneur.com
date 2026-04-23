"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/appStore";
import { getMockUser, getMockVentures, getMockEvents } from "@/lib/mockData";
import { calculateDaysActive, formatDateShort } from "@/lib/utils";
import StatusBadge from "@/app/components/StatusBadge";
import { VentureStatus } from "@/lib/types";
import { useRouter } from "next/navigation";

const industries = ["All", "FinTech", "AI/ML", "SaaS", "Logistics", "Healthcare"];
const statuses: (VentureStatus | "All")[] = ["All", "active", "pivot", "paused", "shutdown", "exited"];

type SortBy = "recent" | "oldest" | "active" | "name";

export default function Ventures() {
  const router = useRouter();
  const { ventures, events, setUser, setVentures, setEvents, isLoading, setIsLoading } =
    useAppStore();

  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [filterIndustry, setFilterIndustry] = useState("All");
  const [filterStatus, setFilterStatus] = useState<VentureStatus | "All">("All");

  // Load mock data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const mockUser = await getMockUser();
        const mockVentures = await getMockVentures();
        const mockEvents = await getMockEvents();

        setUser(mockUser);
        setVentures(mockVentures);
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ventures.length === 0) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [ventures.length, setUser, setVentures, setEvents, setIsLoading]);

  // Filter ventures
  let filtered = ventures;
  if (filterIndustry !== "All") {
    filtered = filtered.filter((v) => v.industry === filterIndustry);
  }
  if (filterStatus !== "All") {
    filtered = filtered.filter((v) => v.status === filterStatus);
  }

  // Sort ventures
  let sorted = [...filtered];
  switch (sortBy) {
    case "recent":
      sorted.sort(
        (a, b) =>
          new Date(b.started_date).getTime() - new Date(a.started_date).getTime()
      );
      break;
    case "oldest":
      sorted.sort(
        (a, b) =>
          new Date(a.started_date).getTime() - new Date(b.started_date).getTime()
      );
      break;
    case "active":
      sorted.sort((a, b) => {
        const eventsA = events.filter((e) => e.venture_id === a.id).length;
        const eventsB = events.filter((e) => e.venture_id === b.id).length;
        return eventsB - eventsA;
      });
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-outline-variant border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant text-sm">Loading ventures...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-display-lg text-primary mb-2">All Ventures</h1>
        <p className="text-sm text-on-surface-variant">
          {sorted.length} venture{sorted.length !== 1 ? "s" : ""} total
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-6 mb-12 md:flex-row md:items-center md:justify-between">
        {/* Sort */}
        <div className="flex gap-2">
          {(["recent", "oldest", "active", "name"] as SortBy[]).map((option) => (
            <motion.button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1.5 text-xs font-label-caps rounded-lg transition-all ${
                sortBy === option
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant text-on-surface-variant hover:text-primary"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Industry filter */}
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono-data bg-surface-container border border-outline-variant rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as VentureStatus | "All")}
            className="px-3 py-1.5 text-xs font-mono-data bg-surface-container border border-outline-variant rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat}>
                {stat === "All" ? "All Status" : stat.charAt(0).toUpperCase() + stat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ventures Table */}
      {sorted.length > 0 ? (
        <div className="overflow-x-auto border border-outline-variant rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-high">
                <th className="text-left px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Industry
                </th>
                <th className="text-left px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Started
                </th>
                <th className="text-left px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Events
                </th>
                <th className="text-left px-6 py-4 text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((venture, idx) => {
                const ventureEvents = events.filter((e) => e.venture_id === venture.id);
                const lastEvent = ventureEvents.sort(
                  (a, b) =>
                    new Date(b.event_date).getTime() -
                    new Date(a.event_date).getTime()
                )[0];

                return (
                  <motion.tr
                    key={venture.id}
                    onClick={() => router.push(`/ventures/${venture.id}`)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-headline-md text-primary">
                        {venture.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant font-mono-data">
                        {venture.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant font-mono-data">
                        {formatDateShort(venture.started_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={venture.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-headline-md text-primary">
                        {ventureEvents.length}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant font-mono-data">
                        {lastEvent ? formatDateShort(lastEvent.event_date) : "—"}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state */
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mb-6">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-lg font-headline-md text-primary mb-2">
            No ventures match your filters
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Try adjusting your filters or create a new venture to get started.
          </p>
        </motion.div>
      )}
    </>
  );
}
