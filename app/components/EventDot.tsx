"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Event } from "@/lib/types";

interface EventDotProps {
  event: Event;
  positionPercentage: number;
  isNew?: boolean;
  onDelete?: (eventId: string) => void;
}

/**
 * EventDot Component
 * Small dot on timeline with tooltip on hover
 * Positioned absolutely relative to parent timeline
 */
export default function EventDot({
  event,
  positionPercentage,
  isNew = false,
  onDelete,
}: EventDotProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const eventTypeIcons: Record<string, string> = {
    milestone: "📍",
    launch: "🚀",
    funding: "💰",
    team: "👥",
    pivot: "🔄",
    setback: "⚠️",
    exit: "🏁",
    other: "📝",
  };

  return (
    <motion.div
      className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
      style={{ left: `${positionPercentage}%` }}
      initial={isNew ? { scale: 0 } : { scale: 1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pulse animation for new events */}
      {isNew && (
        <motion.div
          className="absolute inset-0 w-3 h-3 rounded-full bg-primary/30"
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Dot */}
      <motion.button
        className="relative w-2.5 h-2.5 rounded-full bg-primary border border-background shadow-md transition-all hover:scale-125 focus:outline-none"
        whileHover={{ scale: 1.5 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      />

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-surface-container border border-outline-variant rounded-lg p-3 shadow-xl whitespace-nowrap z-50"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {eventTypeIcons[event.event_type] || "📌"}
              </span>
              <span className="text-xs font-mono-data text-on-surface-variant uppercase tracking-wider">
                {event.event_type}
              </span>
            </div>
            <div className="text-xs font-mono-data text-on-surface-variant mb-1">
              {event.event_date}
            </div>
            <div className="text-sm font-headline-md text-primary mb-2">
              {event.title}
            </div>
            {event.notes && (
              <div className="text-xs text-on-surface-variant mb-2 max-w-xs">
                {event.notes.substring(0, 100)}
                {event.notes.length > 100 ? "..." : ""}
              </div>
            )}
            {event.link_url && (
              <div className="text-xs text-primary hover:underline">
                <a href={event.link_url} target="_blank" rel="noopener noreferrer">
                  View link →
                </a>
              </div>
            )}
            {onDelete && (
              <motion.button
                onClick={() => onDelete(event.id)}
                className="text-xs text-red-400 hover:text-red-300 mt-2 block"
                whileHover={{ scale: 1.05 }}
              >
                Delete
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
