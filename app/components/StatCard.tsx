"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

/**
 * StatCard Component
 * Displays a metric for the patterns/analytics screen
 */
export default function StatCard({
  label,
  value,
  unit,
  icon,
  trend = "neutral",
}: StatCardProps) {
  const trendColor = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-on-surface-variant",
  };

  return (
    <motion.div
      className="p-6 rounded-xl border border-outline-variant bg-surface-container hover:bg-surface-container-high transition-colors"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header with icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono-data text-on-surface-variant uppercase tracking-wider">
          {label}
        </h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-display-lg text-primary">{value}</div>
        {unit && (
          <div className="text-xs font-mono-data text-on-surface-variant uppercase tracking-wider">
            {unit}
          </div>
        )}
      </div>

      {/* Trend indicator (optional) */}
      {trend !== "neutral" && (
        <div className={`text-xs mt-2 font-mono-data ${trendColor[trend]}`}>
          {trend === "up" ? "↑ Increasing" : "↓ Decreasing"}
        </div>
      )}
    </motion.div>
  );
}
