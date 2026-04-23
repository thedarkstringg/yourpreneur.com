"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/appStore";
import { getMockUser, getMockVentures, getMockEvents } from "@/lib/mockData";
import { getPositionInYear } from "@/lib/utils";
import TimelineLine from "@/app/components/TimelineLine";
import VentureCard from "@/app/components/VentureCard";
import EventDot from "@/app/components/EventDot";
import YearSwitcher from "@/app/components/YearSwitcher";
import SlidePanel from "@/app/components/SlidePanel";
import LogEntryForm from "@/app/components/LogEntryForm";
import { useRouter } from "next/navigation";

const years = [2023, 2024, 2025];

export default function Chronicle() {
  const router = useRouter();
  const {
    user,
    ventures,
    events,
    selectedYear,
    expandedVentureId,
    isLogPanelOpen,
    setUser,
    setVentures,
    setEvents,
    setSelectedYear,
    setExpandedVentureId,
    setLogPanelOpen,
    addEvent,
    addVenture,
    deleteEvent,
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);

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

    loadData();
  }, [setUser, setVentures, setEvents]);

  // Keyboard shortcut: N to open log panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setLogPanelOpen(!isLogPanelOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLogPanelOpen, setLogPanelOpen]);

  // Filter ventures for selected year
  const venturesForYear = ventures.filter((v) => {
    const startYear = new Date(v.started_date).getFullYear();
    const endYear = v.ended_date ? new Date(v.ended_date).getFullYear() : null;
    return startYear === selectedYear || (endYear && endYear >= selectedYear);
  });

  const handleEventSubmit = async (formData: any) => {
    // Mock submit - in real app this would POST to Supabase
    const newEvent = {
      id: `event-${Date.now()}`,
      user_id: user?.id || "user-1",
      venture_id: formData.venture_id,
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

  const handleVentureCreate = async (formData: any) => {
    // Mock submit - in real app this would POST to Supabase
    const newVenture = {
      id: `venture-${Date.now()}`,
      user_id: user?.id || "user-1",
      name: formData.name,
      description: formData.description,
      industry: formData.industry,
      status: formData.status,
      started_date: formData.started_date,
      ended_date: null,
      created_at: new Date().toISOString(),
    };
    addVenture(newVenture);
    return newVenture;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-outline-variant border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant text-sm">Loading archive...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <header className="flex items-center justify-between mb-20 pb-8 border-b border-outline-variant w-full">
        <div>
          <h1 className="text-4xl font-display-lg text-primary">The Archive</h1>
          <p className="text-xs font-mono-data text-on-surface-variant uppercase tracking-wider mt-2">
            {venturesForYear.length} venture{venturesForYear.length !== 1 ? "s" : ""} in {selectedYear}
          </p>
        </div>

        {/* Year Navigation */}
        <YearSwitcher
          years={years}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </header>

      {/* Timeline Visualization */}
      {venturesForYear.length > 0 ? (
        <div className="w-full">
          {/* Main venture timeline */}
          <TimelineLine year={selectedYear} height={300}>
            {venturesForYear.map((venture) => {
              const positionPercentage = getPositionInYear(
                venture.started_date,
                selectedYear
              );

              // Get events for this venture
              const ventureEvents = events
                .filter((e) => e.venture_id === venture.id)
                .sort(
                  (a, b) =>
                    new Date(a.event_date).getTime() -
                    new Date(b.event_date).getTime()
                );

              return (
                <motion.div key={venture.id} className="absolute inset-0">
                  {/* Venture card pinned to timeline */}
                  <VentureCard
                    venture={venture}
                    positionPercentage={positionPercentage}
                    isExpanded={expandedVentureId === venture.id}
                    onClick={() =>
                      setExpandedVentureId(
                        expandedVentureId === venture.id
                          ? null
                          : venture.id
                      )
                    }
                    onNavigate={(id) => router.push(`/ventures/${id}`)}
                  />

                  {/* Expanded drill-down timeline for venture events */}
                  {expandedVentureId === venture.id && ventureEvents.length > 0 && (
                    <motion.div
                      className="absolute top-80 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Sub-timeline for events */}
                      <TimelineLine
                        year={selectedYear}
                        height={120}
                        showMonthLabels={false}
                      >
                        {ventureEvents.map((event) => {
                          const eventPosition = getPositionInYear(
                            event.event_date,
                            selectedYear
                          );
                          return (
                            <EventDot
                              key={event.id}
                              event={event}
                              positionPercentage={eventPosition}
                              onDelete={deleteEvent}
                            />
                          );
                        })}
                      </TimelineLine>

                      {/* Log Event button */}
                      <motion.button
                        onClick={() => setLogPanelOpen(true)}
                        className="mt-6 px-4 py-2 text-xs font-label-caps bg-surface-container border border-outline-variant text-primary hover:bg-surface-container-high rounded-lg transition-colors uppercase tracking-wider mx-auto block"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        + Log Event for {venture.name}
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </TimelineLine>
        </div>
      ) : (
        /* Empty state */
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center mb-6">
            <span className="text-2xl">📭</span>
          </div>
          <h2 className="text-lg font-headline-md text-primary mb-2">
            Nothing recorded for {selectedYear}
          </h2>
          <p className="text-sm text-on-surface-variant mb-6 max-w-md">
            Create your first venture to start building your archive. Click "NEW ENTRY" to get started.
          </p>
          <motion.button
            onClick={() => setLogPanelOpen(true)}
            className="px-4 py-2 bg-primary text-on-primary font-label-caps text-xs rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Logging
          </motion.button>
        </motion.div>
      )}

      {/* Keyboard hint */}
      <div className="text-xs text-on-surface-variant/40 text-center mt-12 font-mono-data">
        Press Ctrl+N to quickly log an entry
      </div>

      {/* Log Entry Slide Panel */}
      <SlidePanel
        isOpen={isLogPanelOpen}
        onClose={() => setLogPanelOpen(false)}
        title="Log Entry"
      >
        <LogEntryForm
          ventures={ventures}
          onSubmitEvent={handleEventSubmit}
          onSubmitVenture={handleVentureCreate}
          onSuccess={() => setLogPanelOpen(false)}
        />
      </SlidePanel>
    </>
  );
}

