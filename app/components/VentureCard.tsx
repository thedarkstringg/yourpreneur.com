"use client";

import React from "react";
import { motion } from "framer-motion";
import { Venture } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";

interface VentureCardProps {
  venture: Venture;
  positionPercentage: number;
  isExpanded?: boolean;
  onClick?: () => void;
  onNavigate?: (ventureId: string) => void;
}

const statusColors = {
  active: "border-emerald-500/50 text-emerald-400",
  pivot: "border-amber-500/50 text-amber-400",
  paused: "border-slate-500/50 text-slate-400",
  shutdown: "border-red-500/50 text-red-400",
  exited: "border-slate-600/50 text-slate-300",
};

/**
 * VentureCard Component
 * Card pinned to timeline at venture start date
 * Shows venture info and can expand to show drill-down events
 */
export default function VentureCard({
  venture,
  positionPercentage,
  isExpanded = false,
  onClick,
  onNavigate,
}: VentureCardProps) {
  return (
    <motion.div
      className="absolute top-full mt-12 transform -translate-x-1/2"
      style={{ left: `${positionPercentage}%` }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Connecting stem from timeline to card */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-px h-12 bg-gradient-to-b from-outline-variant to-transparent"></div>

      {/* Card */}
      <motion.div
        onClick={onClick}
        className={`w-64 p-6 rounded-xl border transition-all cursor-pointer ${
          isExpanded
            ? "border-primary bg-surface-container-high shadow-lg"
            : "border-outline-variant bg-surface-container hover:border-primary hover:bg-surface-container-high hover:shadow-md"
        }`}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Date */}
        <div className="text-xs font-mono-data text-on-surface-variant uppercase tracking-wider mb-4">
          {formatDateShort(venture.started_date)}
        </div>

        {/* White dot indicator */}
        <div className="w-2.5 h-2.5 rounded-full bg-primary mb-4"></div>

        {/* Venture name */}
        <h3 className="text-lg font-headline-md text-primary mb-3 group-hover:text-on-surface transition-colors">
          {venture.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
          {venture.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-outline-variant/50 mb-4"></div>

        {/* Industry & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono-data text-on-surface-variant uppercase tracking-wider">
            {venture.industry}
          </span>
          <motion.span
            className={`px-2.5 py-1 text-xs font-label-caps border rounded-lg ${
              statusColors[venture.status]
            }`}
            animate={{
              borderColor: isExpanded ? "#ffffff" : undefined,
            }}
          >
            {venture.status.charAt(0).toUpperCase() + venture.status.slice(1)}
          </motion.span>
        </div>

        {/* Navigate to profile button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate?.(venture.id);
          }}
          className="text-xs text-primary hover:text-on-surface transition-colors mt-4 pt-3 border-t border-outline-variant/30 w-full text-center"
          whileHover={{ scale: 1.02 }}
        >
          View Profile →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
