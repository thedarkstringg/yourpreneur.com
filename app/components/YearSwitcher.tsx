"use client";

import { motion } from "framer-motion";

interface YearSwitcherProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

/**
 * YearSwitcher Component
 * Navigation to switch between years
 */
export default function YearSwitcher({
  years,
  selectedYear,
  onYearChange,
}: YearSwitcherProps) {
  const currentIndex = years.indexOf(selectedYear);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < years.length - 1;

  return (
    <div className="flex items-center gap-6">
      {/* Previous button */}
      <motion.button
        onClick={() => canGoPrev && onYearChange(years[currentIndex - 1])}
        disabled={!canGoPrev}
        className="text-sm text-on-surface-variant hover:text-primary disabled:opacity-20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ◀
      </motion.button>

      {/* Year buttons */}
      <div className="flex gap-4">
        {years.map((year) => (
          <motion.button
            key={year}
            onClick={() => onYearChange(year)}
            className={`px-2 py-1 text-sm font-mono-data transition-all ${
              selectedYear === year
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {year}
          </motion.button>
        ))}
      </div>

      {/* Next button */}
      <motion.button
        onClick={() => canGoNext && onYearChange(years[currentIndex + 1])}
        disabled={!canGoNext}
        className="text-sm text-on-surface-variant hover:text-primary disabled:opacity-20 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ▶
      </motion.button>
    </div>
  );
}
