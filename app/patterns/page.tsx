"use client";

import { useState } from "react";

interface Venture {
  id: string;
  label: string;
  daysToRevenue: number;
}

const ventures: Venture[] = [
  { id: "v1", label: "V.01", daysToRevenue: 120 },
  { id: "v2", label: "V.02", daysToRevenue: 80 },
  { id: "v3", label: "V.03", daysToRevenue: 45 },
];

const maxDays = 150;

export default function Patterns() {
  // Heatmap data representing months of activity (12 months x 2 years)
  const heatmapData = [
    [0, 0, 0.2, 0.4, 0.6, 0.8, 1, 0.6, 0.4, 0.2, 0, 0],
    [0, 0.2, 0.4, 0.8, 1, 0.8, 0.4, 0.2, 0, 0, 0, 0],
  ];

  const getHeatColor = (intensity: number) => {
    if (intensity === 0) return "bg-surface-container-high";
    if (intensity <= 0.2) return "bg-primary/20";
    if (intensity <= 0.4) return "bg-primary/40";
    if (intensity <= 0.6) return "bg-primary/60";
    if (intensity <= 0.8) return "bg-primary/80";
    return "bg-primary";
  };

  return (
    <>
      {/* Header */}
      <header className="flex flex-col gap-2 mb-16">
        <h1 className="font-display-lg text-display-lg text-primary">
          Patterns
        </h1>
        <p className="font-body-base text-body-base text-on-surface-variant max-w-xl">
          Analytical abstraction of your entrepreneurial velocity. Identifying
          the friction points across ventures.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Productivity Heatmap */}
        <div className="md:col-span-2 bg-[#0A0A0A] border-t border-outline-variant/30 p-8 flex flex-col gap-6 rounded">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-primary">
              Productivity Heat Map
            </h2>
            <span className="font-mono-data text-mono-data text-on-surface-variant text-xs uppercase tracking-widest">
              Months Active
            </span>
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-12 gap-1">
            {heatmapData.map((row, rowIdx) => (
              <div key={rowIdx} className="contents">
                {row.map((intensity, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={`aspect-square ${getHeatColor(intensity)} rounded-sm transition-all hover:scale-110 cursor-pointer`}
                  ></div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between font-mono-data text-mono-data text-on-surface-variant opacity-50 text-xs">
            <span>JAN</span>
            <span>DEC</span>
          </div>
        </div>

        {/* Reflection Card - Momentum Warning */}
        <div className="bg-[#1A1A1A] border border-white/10 p-8 flex flex-col justify-between gap-8 rounded relative overflow-hidden group">
          <div className="absolute inset-0 bg-error-container/5 blur-3xl rounded-full scale-150 group-hover:bg-error-container/10 transition-colors duration-500"></div>
          <div className="relative z-10">
            <span className="material-symbols-outlined text-error mb-4 block text-4xl">
              warning
            </span>
            <h3 className="font-headline-md text-headline-md text-primary leading-tight">
              You typically lose momentum 4 months after launch.
            </h3>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-error w-1/3"></div>
            </div>
            <span className="font-mono-data text-mono-data text-error text-xs uppercase tracking-widest whitespace-nowrap">
              Critical
            </span>
          </div>
        </div>

        {/* Time to Revenue Bar Chart */}
        <div className="md:col-span-3 bg-[#0A0A0A] border-t border-outline-variant/30 p-8 flex flex-col gap-8 rounded">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-primary">
              Time to First Revenue
            </h2>
            <span className="font-mono-data text-mono-data text-on-surface-variant text-xs uppercase tracking-widest">
              Days Per Venture
            </span>
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col gap-4 mt-4">
            {ventures.map((venture) => {
              const barWidth = (venture.daysToRevenue / maxDays) * 100;
              const isHighestPerformer = venture.daysToRevenue === 45;

              return (
                <div key={venture.id} className="flex items-center gap-4">
                  <span className="font-mono-data text-mono-data text-on-surface-variant w-16 text-right text-xs">
                    {venture.label}
                  </span>
                  <div className="flex-grow h-8 flex items-center">
                    <div
                      className={`h-full rounded-r transition-all group relative hover:opacity-90 ${
                        isHighestPerformer
                          ? "bg-primary/80 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "bg-surface-container-high hover:bg-surface-container-highest"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    >
                      <span
                        className={`absolute right-4 top-1/2 -translate-y-1/2 font-mono-data text-mono-data text-xs font-bold ${
                          isHighestPerformer
                            ? "text-background"
                            : "text-on-surface opacity-0 group-hover:opacity-100"
                        } transition-opacity`}
                      >
                        {venture.daysToRevenue}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between font-mono-data text-mono-data text-on-surface-variant opacity-50 border-t border-white/10 pt-4 mt-2 pl-20 text-xs">
            <span>0</span>
            <span>{maxDays}</span>
          </div>
        </div>

        {/* Insight Card - Acceleration */}
        <div className="md:col-span-3 bg-[#1A1A1A] border border-white/10 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 rounded relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 group-hover:bg-primary/10 transition-colors duration-500"></div>
          <div className="relative z-10 flex-grow">
            <span className="inline-block px-3 py-1 bg-primary/10 border border-primary text-primary font-label-caps text-label-caps text-xs uppercase tracking-widest rounded-full mb-4">
              Insight
            </span>
            <h3 className="font-headline-md text-headline-md text-primary leading-tight">
              Iterative cycles have shortened by 40% since Vol. 01.
            </h3>
            <p className="font-body-base text-body-base text-on-surface-variant mt-2">
              Your ability to test and discard hypotheses is accelerating.
              Maintain this velocity but watch for burnout.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <button className="px-6 py-3 border border-white/30 text-white font-label-caps text-label-caps text-xs uppercase tracking-widest rounded hover:bg-[#1A1A1A] transition-colors">
              Review Timeline
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
