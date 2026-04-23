"use client";

import React from "react";
import { motion } from "framer-motion";

interface TimelineLineProps {
  year: number;
  children?: React.ReactNode;
  showMonthLabels?: boolean;
  height?: number;
}

/**
 * TimelineLine Component
 * Renders a horizontal timeline with month markers
 * Children are positioned absolutely relative to the year
 */
export default function TimelineLine({
  year,
  children,
  showMonthLabels = true,
  height = 200,
}: TimelineLineProps) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  // Calculate position percentage for each month
  const monthPositions = months.map((_, index) => ((index + 0.5) / 12) * 100);

  return (
    <div className="w-full relative" style={{ height: `${height}px` }}>
      {/* Main horizontal line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-outline-variant transform -translate-y-1/2"></div>

      {/* Month markers and labels */}
      {months.map((month, index) => {
        const position = monthPositions[index];
        return (
          <div
            key={month}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${position}%` }}
          >
            {/* Small tick mark */}
            <div className="w-px h-2 bg-on-surface-variant/40 mx-auto mb-1"></div>

            {/* Month label */}
            {showMonthLabels && (
              <div className="text-xs font-mono-data text-on-surface-variant/50 text-center whitespace-nowrap -translate-y-6 -translate-x-1/2 left-1/2">
                {month}
              </div>
            )}
          </div>
        );
      })}

      {/* Children (ventures, events, etc.) positioned absolutely */}
      <div className="absolute inset-0 w-full">
        {children}
      </div>
    </div>
  );
}
