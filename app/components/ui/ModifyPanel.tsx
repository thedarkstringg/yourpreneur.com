'use client';

import { useState } from 'react';
import { useStore, Venture } from '@/lib/useStore';
import EventForm from './EventForm';

export default function ModifyPanel({
  ventureId,
  onClose,
}: {
  ventureId: string | null;
  onClose: () => void;
}) {
  const { ventures, updateVenture } = useStore();
  const venture = ventures.find((v) => v.id === ventureId);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const [formData, setFormData] = useState<Partial<Venture>>(venture || {});

  if (!venture) return null;

  const handleChange = (key: keyof Venture, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    updateVenture(venture.id, formData);
    onClose();
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-screen w-[440px] bg-zinc-950 border-l border-white/10 shadow-2xl z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Modify Venture</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              NAME
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              DESCRIPTION
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              INDUSTRY
            </label>
            <input
              type="text"
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              STATUS
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['active', 'pivot', 'paused', 'shutdown', 'exited'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleChange('status', status)}
                    className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                      formData.status === status
                        ? 'bg-white/20 text-white border border-white/40'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Started Date */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              STARTED DATE
            </label>
            <input
              type="date"
              value={formData.startedDate || ''}
              onChange={(e) => handleChange('startedDate', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Ended Date */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              ENDED DATE (Optional)
            </label>
            <input
              type="date"
              value={formData.endedDate || ''}
              onChange={(e) => handleChange('endedDate', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Add Event Button */}
          <div className="border-t border-white/10 pt-6">
            <button
              onClick={() => setIsAddingEvent(true)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white text-sm font-mono hover:bg-white/15 transition-colors"
            >
              + ADD EVENT
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded text-white text-sm font-mono hover:bg-white/10 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded text-white text-sm font-mono hover:bg-white/30 transition-colors"
          >
            SAVE
          </button>
        </div>
      </div>

      {isAddingEvent && (
        <EventForm
          ventureId={ventureId}
          onClose={() => setIsAddingEvent(false)}
        />
      )}
    </>
  );
}
