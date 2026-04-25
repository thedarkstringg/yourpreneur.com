'use client';

import { useState } from 'react';
import { useStore, VentureEvent } from '@/lib/useStore';

export default function EventForm({
  ventureId,
  onClose,
}: {
  ventureId: string | null;
  onClose: () => void;
}) {
  const { events, setEvents } = useStore();
  const [formData, setFormData] = useState<Partial<VentureEvent>>({
    type: 'milestone',
    title: '',
    notes: '',
    eventDate: new Date().toISOString().split('T')[0],
    linkUrl: '',
  });

  if (!ventureId) return null;

  const handleChange = (key: keyof VentureEvent, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAdd = () => {
    if (!formData.title || !formData.eventDate) {
      alert('Please fill in title and date');
      return;
    }

    const newEvent: VentureEvent = {
      id: `event-${Date.now()}`,
      ventureId,
      type: (formData.type as any) || 'milestone',
      title: formData.title || '',
      notes: formData.notes || '',
      eventDate: formData.eventDate || '',
      linkUrl: formData.linkUrl || '',
    };

    setEvents([...events, newEvent]);
    setFormData({
      type: 'milestone',
      title: '',
      notes: '',
      eventDate: new Date().toISOString().split('T')[0],
      linkUrl: '',
    });
    onClose();
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[440px] bg-zinc-950 border-l border-white/10 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Add Event</h2>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono text-white/60 mb-2">
            TITLE *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Series A Funding"
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-mono text-white/60 mb-2">
            TYPE
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              'milestone',
              'launch',
              'funding',
              'team',
              'pivot',
              'setback',
              'exit',
              'other',
            ].map((type) => (
              <button
                key={type}
                onClick={() => handleChange('type', type)}
                className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                  formData.type === type
                    ? 'bg-white/20 text-white border border-white/40'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-xs font-mono text-white/60 mb-2">
            DATE *
          </label>
          <input
            type="date"
            value={formData.eventDate || ''}
            onChange={(e) => handleChange('eventDate', e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-mono text-white/60 mb-2">
            NOTES
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Additional details about this event..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
          />
        </div>

        {/* Link URL */}
        <div>
          <label className="block text-xs font-mono text-white/60 mb-2">
            LINK URL (Optional)
          </label>
          <input
            type="url"
            value={formData.linkUrl || ''}
            onChange={(e) => handleChange('linkUrl', e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
          />
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
          onClick={handleAdd}
          className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded text-white text-sm font-mono hover:bg-white/30 transition-colors"
        >
          ADD EVENT
        </button>
      </div>
    </div>
  );
}
