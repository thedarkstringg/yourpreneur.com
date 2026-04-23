"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreateEventInput, CreateVentureInput, EventType, Venture } from "@/lib/types";
import { formatDateISO } from "@/lib/utils";

interface LogEntryFormProps {
  ventures: Venture[];
  onSubmitEvent: (event: CreateEventInput) => Promise<void>;
  onSubmitVenture?: (venture: CreateVentureInput) => Promise<Venture>;
  onSuccess?: () => void;
}

const eventTypes: EventType[] = ["milestone", "launch", "funding", "team", "pivot", "setback", "exit", "other"];
const industries = ["FinTech", "AI/ML", "SaaS", "Logistics", "Healthcare", "EdTech", "Other"];

/**
 * LogEntryForm Component
 * Form for logging new events or creating new ventures
 * Used inside SlidePanel
 */
export default function LogEntryForm({
  ventures,
  onSubmitEvent,
  onSubmitVenture,
  onSuccess,
}: LogEntryFormProps) {
  const [isCreatingVenture, setIsCreatingVenture] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Event form state
  const [selectedVentureId, setSelectedVentureId] = useState<string>(
    ventures.length > 0 ? ventures[0].id : ""
  );
  const [eventDate, setEventDate] = useState(formatDateISO(new Date()));
  const [eventType, setEventType] = useState<EventType>("milestone");
  const [eventTitle, setEventTitle] = useState("");
  const [eventNotes, setEventNotes] = useState("");
  const [eventLink, setEventLink] = useState("");

  // Venture form state
  const [ventureName, setVentureName] = useState("");
  const [ventureDescription, setVentureDescription] = useState("");
  const [ventureIndustry, setVentureIndustry] = useState(industries[0]);
  const [ventureStartDate, setVentureStartDate] = useState(formatDateISO(new Date()));

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVentureId || !eventTitle || !eventDate) return;

    setIsSubmitting(true);
    try {
      await onSubmitEvent({
        venture_id: selectedVentureId,
        event_type: eventType,
        title: eventTitle,
        notes: eventNotes,
        event_date: eventDate,
        link_url: eventLink || null,
      });
      // Reset form
      setEventTitle("");
      setEventNotes("");
      setEventLink("");
      setEventDate(formatDateISO(new Date()));
      setEventType("milestone");
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitVenture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventureName || !ventureStartDate || !onSubmitVenture) return;

    setIsSubmitting(true);
    try {
      const newVenture = await onSubmitVenture({
        name: ventureName,
        description: ventureDescription,
        industry: ventureIndustry,
        started_date: ventureStartDate,
        status: "active",
      });
      // Switch to event form with new venture selected
      setSelectedVentureId(newVenture.id);
      setIsCreatingVenture(false);
      // Reset venture form
      setVentureName("");
      setVentureDescription("");
      setVentureIndustry(industries[0]);
      setVentureStartDate(formatDateISO(new Date()));
    } catch (error) {
      console.error("Error creating venture:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isCreatingVenture ? (
        /* Event Form */
        <form onSubmit={handleSubmitEvent} className="space-y-6">
          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Venture
            </label>
            <div className="flex gap-2">
              <select
                value={selectedVentureId}
                onChange={(e) => setSelectedVentureId(e.target.value)}
                className="flex-1 px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {ventures.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              {onSubmitVenture && (
                <motion.button
                  type="button"
                  onClick={() => setIsCreatingVenture(true)}
                  className="px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant hover:text-primary text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + New
                </motion.button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Event Date
            </label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Title *
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="What happened?"
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Notes
            </label>
            <textarea
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              placeholder="Add any details..."
              rows={4}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Link (optional)
            </label>
            <input
              type="url"
              value={eventLink}
              onChange={(e) => setEventLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-on-primary font-label-caps text-xs rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all uppercase tracking-wider"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? "Logging..." : "Log Event"}
          </motion.button>
        </form>
      ) : (
        /* Venture Creation Form */
        <form onSubmit={handleSubmitVenture} className="space-y-6">
          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Venture Name *
            </label>
            <input
              type="text"
              value={ventureName}
              onChange={(e) => setVentureName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={ventureDescription}
              onChange={(e) => setVentureDescription(e.target.value)}
              placeholder="What does this venture do?"
              rows={3}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary placeholder-on-surface-variant/40 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Industry
            </label>
            <select
              value={ventureIndustry}
              onChange={(e) => setVentureIndustry(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={ventureStartDate}
              onChange={(e) => setVentureStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="flex gap-2">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary text-on-primary font-label-caps text-xs rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? "Creating..." : "Create Venture"}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsCreatingVenture(false)}
              className="px-4 py-3 border border-outline-variant text-on-surface-variant hover:text-primary rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}
