"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/appStore";
import { getMockUser, getMockVentures, getMockEvents } from "@/lib/mockData";
import { calculateDaysActive, formatDateShort, getPositionInYear } from "@/lib/utils";
import TimelineLine from "@/app/components/TimelineLine";
import EventDot from "@/app/components/EventDot";
import StatusBadge from "@/app/components/StatusBadge";
import StatCard from "@/app/components/StatCard";
import SlidePanel from "@/app/components/SlidePanel";
import LogEntryForm from "@/app/components/LogEntryForm";
import { useParams, useRouter } from "next/navigation";

export default function VentureProfile() {
  const params = useParams();
  const router = useRouter();
  const ventureId = params.id as string;

  const {
    user,
    ventures,
    events,
    isLogPanelOpen,
    setUser,
    setVentures,
    setEvents,
    setIsLoading,
    setLogPanelOpen,
    addEvent,
    getVentureById,
  } = useAppStore();

  const venture = getVentureById(ventureId);
  const ventureEvents = events
    .filter((e) => e.venture_id === ventureId)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

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

  const handleEventSubmit = async (formData: any) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      user_id: user?.id || "user-1",
      venture_id: ventureId,
      event_type: formData.event_type,
      title: formData.title,
      notes: formData.notes,
      event_date: formData.event_date,
      link_url: formData.link_url,
      created_at: new Date().toISOString(),
    };
    addEvent(newEvent);
    setLogPanelOpen(false);
  };

  if (!venture) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-24 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mb-6">
          <span className="text-2xl">❌</span>
        </div>
        <h2 className="text-lg font-headline-md text-primary mb-2">Venture not found</h2>
        <motion.button
          onClick={() => router.push("/ventures")}
          className="mt-4 px-4 py-2 bg-primary text-on-primary font-label-caps text-xs rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Ventures
        </motion.button>
      </motion.div>
    );
  }

  const daysActive = calculateDaysActive(venture);
  const eventTypes = new Set(ventureEvents.map((e) => e.event_type));

  return (
    <>
      {/* Header */}
      <header className="mb-16 pb-8 border-b border-outline-variant">
        <div className="flex gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 rounded border border-outline-variant font-label-caps text-xs text-on-surface-variant bg-surface-container uppercase tracking-wider">
            {venture.industry}
          </span>
          <StatusBadge status={venture.status} size="sm" />
        </div>

        <h1 className="text-4xl font-display-lg text-primary mb-4">
          {venture.name}
        </h1>

        <p className="text-sm text-on-surface-variant max-w-2xl mb-6">
          {venture.description}
        </p>

        <div className="flex gap-8 flex-wrap">
          <div className="flex flex-col">
            <span className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
              Started
            </span>
            <span className="text-sm font-mono-data text-primary">
              {formatDateShort(venture.started_date)}
            </span>
          </div>
          {venture.ended_date && (
            <div className="flex flex-col">
              <span className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
                Ended
              </span>
              <span className="text-sm font-mono-data text-primary">
                {formatDateShort(venture.ended_date)}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <StatCard label="Total Events" value={ventureEvents.length} />
        <StatCard label="Days Active" value={daysActive} unit="days" />
        <StatCard
          label="Event Types"
          value={eventTypes.size}
          unit={eventTypes.size === 1 ? "type" : "types"}
        />
        <StatCard
          label="Last Activity"
          value={ventureEvents.length > 0 ? formatDateShort(ventureEvents[ventureEvents.length - 1].event_date) : "—"}
        />
      </div>

      {/* Timeline */}
      {ventureEvents.length > 0 && (
        <motion.div className="mb-16" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-headline-md text-primary mb-8">
            Event Timeline
          </h2>
          <TimelineLine year={new Date(venture.started_date).getFullYear()} height={200}>
            {ventureEvents.map((event) => {
              const positionPercentage = getPositionInYear(
                event.event_date,
                new Date(event.event_date).getFullYear()
              );
              return (
                <EventDot
                  key={event.id}
                  event={event}
                  positionPercentage={positionPercentage}
                />
              );
            })}
          </TimelineLine>
        </motion.div>
      )}

      {/* Events Feed */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-headline-md text-primary">
            {ventureEvents.length} Event{ventureEvents.length !== 1 ? "s" : ""}
          </h2>
          <motion.button
            onClick={() => setLogPanelOpen(true)}
            className="px-3 py-1.5 text-xs font-label-caps bg-surface-container border border-outline-variant text-primary hover:bg-surface-container-high rounded-lg transition-colors uppercase tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Log Event
          </motion.button>
        </div>

        {ventureEvents.length > 0 ? (
          <div className="space-y-4">
            {ventureEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors"
              >
                <div className="flex gap-4">
                  {/* Event type icon */}
                  <div className="text-2xl flex-shrink-0">
                    {event.event_type === "launch" && "🚀"}
                    {event.event_type === "funding" && "💰"}
                    {event.event_type === "team" && "👥"}
                    {event.event_type === "pivot" && "🔄"}
                    {event.event_type === "setback" && "⚠️"}
                    {event.event_type === "exit" && "🏁"}
                    {event.event_type === "milestone" && "📍"}
                    {event.event_type === "other" && "📝"}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                        {event.event_type}
                      </span>
                      <span className="text-xs font-mono-data text-on-surface-variant">
                        {formatDateShort(event.event_date)}
                      </span>
                    </div>
                    <h3 className="text-sm font-headline-md text-primary mb-2">
                      {event.title}
                    </h3>
                    {event.notes && (
                      <p className="text-xs text-on-surface-variant mb-2">
                        {event.notes}
                      </p>
                    )}
                    {event.link_url && (
                      <a
                        href={event.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View link →
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-3xl mb-3">📭</div>
            <p className="text-sm text-on-surface-variant mb-4">
              No events logged yet. Start recording milestones!
            </p>
            <motion.button
              onClick={() => setLogPanelOpen(true)}
              className="px-3 py-1.5 text-xs font-label-caps bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Log First Event
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Log Entry Slide Panel */}
      <SlidePanel
        isOpen={isLogPanelOpen}
        onClose={() => setLogPanelOpen(false)}
        title={`Log Event - ${venture.name}`}
      >
        <LogEntryForm
          ventures={ventures}
          onSubmitEvent={handleEventSubmit}
          onSuccess={() => setLogPanelOpen(false)}
        />
      </SlidePanel>
    </>
  );
}
