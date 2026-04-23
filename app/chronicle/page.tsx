"use client";

import { useState } from "react";

interface TimelineEntry {
  id: number;
  date: string;
  title: string;
  category: string;
  status: string;
  active: boolean;
}

const entries: TimelineEntry[] = [
  {
    id: 1,
    date: "MAR 14",
    title: "Aura Pay",
    category: "Fintech",
    status: "Active",
    active: true,
  },
  {
    id: 2,
    date: "JUN 02",
    title: "FreightOS Node",
    category: "Logistics",
    status: "Pivot",
    active: false,
  },
  {
    id: 3,
    date: "OCT 19",
    title: "Synthetica",
    category: "AI / ML",
    status: "Active",
    active: true,
  },
];

export default function Chronicle() {
  const [year, setYear] = useState(2024);

  return (
    <>
      {/* Year Switcher Header */}
      <header className="flex justify-between items-center mb-32 w-full">
        <div className="font-headline-md text-headline-md text-on-surface">
          The Archive
        </div>
        <div className="flex items-center gap-6 font-mono-data text-mono-data">
          <button
            onClick={() => setYear(year - 1)}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_left</span>
            {year - 1}
          </button>
          <span className="text-primary font-bold">{year}</span>
          <button
            onClick={() => setYear(year + 1)}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
          >
            {year + 1}
            <span className="material-symbols-outlined text-sm">arrow_right</span>
          </button>
        </div>
      </header>

      {/* Horizontal Timeline Area */}
      <div className="flex-1 w-full relative flex flex-col justify-center min-h-[400px]">
        {/* The Main Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-outline-variant/30 -translate-y-1/2"></div>

        {/* Timeline Nodes & Cards Container */}
        <div className="relative w-full h-full flex justify-between items-center px-8">
          {entries.map((entry) => (
            <div key={entry.id} className="relative group flex flex-col items-center">
              <div className="absolute -top-10 font-mono-data text-mono-data text-on-surface-variant whitespace-nowrap">
                {entry.date}
              </div>

              {/* Node */}
              <div
                className={`w-3 h-3 rounded-full border-2 relative z-10 group-hover:scale-125 transition-transform duration-300 ${
                  entry.active
                    ? "bg-surface-container-high border-primary"
                    : "bg-surface-container-high border-on-surface-variant"
                }`}
              >
                {/* Glow */}
                {entry.active && (
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm scale-150 group-hover:scale-200 transition-transform"></div>
                )}
              </div>

              {/* Card (Below Line) */}
              <div
                className={`absolute top-8 left-1/2 -translate-x-1/2 mt-4 w-48 transition-opacity duration-300 ${
                  entry.active ? "opacity-70 group-hover:opacity-100" : "opacity-40 group-hover:opacity-100"
                }`}
              >
                <div
                  className={`border rounded text-xs p-4 relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300 ${
                    entry.active
                      ? "bg-[#0A0A0A] border-white/10"
                      : "bg-[#0A0A0A] border-white/10"
                  }`}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-[1px] ${
                      entry.active ? "bg-primary/40" : "bg-on-surface-variant/40"
                    }`}
                  ></div>

                  <div
                    className={`font-label-caps text-label-caps mb-2 uppercase tracking-widest ${
                      entry.active
                        ? "text-primary/60"
                        : "text-on-surface-variant/60"
                    }`}
                  >
                    {entry.category}
                  </div>

                  <h3
                    className={`font-headline-md text-headline-md mb-1 text-lg ${
                      entry.active ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {entry.title}
                  </h3>

                  <div
                    className={`inline-block px-2 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-widest ${
                      entry.active
                        ? "bg-primary/10 border border-primary/20 text-primary"
                        : "bg-surface-variant border border-outline-variant/30 text-on-surface-variant"
                    }`}
                  >
                    {entry.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
