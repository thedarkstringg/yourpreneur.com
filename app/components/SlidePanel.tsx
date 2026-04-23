"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: number;
}

/**
 * SlidePanel Component
 * Right-side drawer that slides in from the right
 * Does not navigate away - overlays on current page
 */
export default function SlidePanel({
  isOpen,
  onClose,
  children,
  title,
  width = 420,
}: SlidePanelProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    }; window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 bg-surface-container border-l border-outline-variant overflow-y-auto z-50"
            style={{ width: `${width}px` }}
            initial={{ x: width }}
            animate={{ x: 0 }}
            exit={{ x: width }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-surface-container border-b border-outline-variant p-6 flex items-center justify-between">
              {title && (
                <h2 className="text-lg font-headline-md text-primary">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-primary transition-colors text-xl"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
