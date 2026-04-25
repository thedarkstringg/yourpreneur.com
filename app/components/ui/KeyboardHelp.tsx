'use client';

import { useState } from 'react';

export default function KeyboardHelp({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const shortcuts = [
    { key: 'N', action: 'Create new venture' },
    { key: 'M', action: 'Modify selected venture (if selected)' },
    { key: 'P', action: 'Toggle preview mode' },
    { key: 'Double Click', action: 'Open modify panel for venture' },
    { key: 'Space + Drag', action: 'Pan the canvas' },
    { key: 'Scroll', action: 'Zoom in/out' },
    { key: '?', action: 'Show this help' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="bg-zinc-950 border border-white/10 rounded-lg shadow-2xl w-[500px] max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0"
              >
                <div className="bg-white/10 border border-white/20 rounded px-3 py-2 min-w-fit">
                  <span className="text-xs font-mono font-semibold text-white">
                    {shortcut.key}
                  </span>
                </div>
                <p className="text-sm text-white/70 pt-2">{shortcut.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white text-sm font-mono hover:bg-white/15 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
