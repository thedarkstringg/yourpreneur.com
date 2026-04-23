"use client";

import { VentureStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: VentureStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  active: {
    label: "Active",
    color: "border-emerald-500/50 text-emerald-400 bg-emerald-500/5",
  },
  pivot: {
    label: "Pivot",
    color: "border-amber-500/50 text-amber-400 bg-amber-500/5",
  },
  paused: {
    label: "Paused",
    color: "border-slate-500/50 text-slate-400 bg-slate-500/5",
  },
  shutdown: {
    label: "Shut Down",
    color: "border-red-500/50 text-red-400 bg-red-500/5",
  },
  exited: {
    label: "Exited",
    color: "border-slate-600/50 text-slate-300 bg-slate-600/5",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

/**
 * StatusBadge Component
 * Displays venture status with appropriate styling
 */
export default function StatusBadge({
  status,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`font-label-caps border rounded-lg transition-colors ${
        sizeClasses[size]
      } ${config.color}`}
    >
      {config.label}
    </span>
  );
}
