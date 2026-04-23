"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  venture: string;
  date: string;
  eventType: string;
  headline: string;
  shortNote: string;
}

const eventTypes = [
  { value: "milestone", label: "Milestone", color: "primary" },
  { value: "setback", label: "Setback", color: "error" },
  { value: "funding", label: "Funding", color: "tertiary" },
  { value: "team", label: "Team", color: "primary" },
  { value: "launch", label: "Launch", color: "primary" },
  { value: "pivot", label: "Pivot", color: "primary" },
];

const ventures = [
  { id: "acme", name: "Acme Corp" },
  { id: "globex", name: "Globex Inc" },
  { id: "soylent", name: "Soylent Corp" },
  { id: "aura", name: "Aura Financial" },
];

export default function NewEntry() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    venture: ventures[0].id,
    date: new Date().toISOString().split("T")[0],
    eventType: "milestone",
    headline: "",
    shortNote: "",
  });

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Here you would submit to your backend
    router.back();
  };

  return (
    <div className="fixed inset-0 z-20 flex overflow-hidden">
      {/* Background Layer (Timeline visible behind) */}
      <div className="hidden md:flex absolute inset-0 z-0 opacity-20 flex-col items-center pt-32 pointer-events-none">
        <div className="w-full max-w-[800px] relative">
          {/* Faded timeline visualization */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 transform -translate-x-1/2"></div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"
        onClick={handleClose}
      ></div>

      {/* Slide-in Panel */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[480px] bg-surface-container-lowest border-l border-white/10 z-30 flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between p-gutter border-b border-white/10">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">
              New Entry
            </h2>
            <p className="font-mono-data text-mono-data text-on-surface-variant mt-1">
              LOG.APPEND
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-transparent hover:border-white/20 rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-gutter">
          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {/* Venture Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-xs">
                Venture
              </label>
              <select
                value={formData.venture}
                onChange={(e) =>
                  setFormData({ ...formData, venture: e.target.value })
                }
                className="w-full ledger-input font-body-base text-body-base pb-2 bg-transparent border-b border-white/20 focus:border-white"
              >
                {ventures.map((v) => (
                  <option key={v.id} value={v.id} className="bg-surface">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-xs">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full ledger-input font-mono-data text-mono-data pb-2 bg-transparent border-b border-white/20 focus:border-white"
              />
            </div>

            {/* Event Type Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-xs">
                Event Type
              </label>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="event_type"
                      value={type.value}
                      checked={formData.eventType === type.value}
                      onChange={(e) =>
                        setFormData({ ...formData, eventType: e.target.value })
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`px-3 py-1.5 border rounded-full font-label-caps text-label-caps text-xs uppercase tracking-widest transition-all ${
                        formData.eventType === type.value
                          ? type.value === "setback"
                            ? "bg-error/10 border-error text-error"
                            : type.value === "funding"
                              ? "bg-tertiary/10 border-tertiary text-tertiary"
                              : "bg-primary/10 border-primary text-primary"
                          : "border-white/20 text-on-surface-variant hover:border-white/40"
                      }`}
                    >
                      {type.label}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Headline Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-xs">
                Headline
              </label>
              <input
                type="text"
                placeholder="Summarize the event..."
                value={formData.headline}
                onChange={(e) =>
                  setFormData({ ...formData, headline: e.target.value })
                }
                className="w-full ledger-input font-headline-md text-headline-md pb-2 bg-transparent border-b border-white/20 focus:border-white placeholder:text-white/20"
              />
            </div>

            {/* Short Note Field */}
            <div className="flex-1">
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-widest text-xs">
                Short Note
              </label>
              <textarea
                placeholder="Record the reality of the situation..."
                value={formData.shortNote}
                onChange={(e) =>
                  setFormData({ ...formData, shortNote: e.target.value })
                }
                className="w-full ledger-input font-body-base text-body-base resize-none min-h-[150px] bg-transparent border-b border-white/20 focus:border-white placeholder:text-white/20"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-gutter border-t border-white/10 flex justify-end gap-2 bg-surface-container-lowest">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-white/30 text-primary font-label-caps text-label-caps text-xs uppercase tracking-widest hover:bg-surface-container transition-colors rounded"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-primary text-background font-label-caps text-label-caps text-xs uppercase tracking-widest hover:bg-white/90 transition-colors rounded"
            type="button"
          >
            Commit Entry
          </button>
        </div>
      </div>
    </div>
  );
}
