'use client';

import { useState } from 'react';
import { useStore, VentureEvent } from '@/lib/useStore';

const MOODS = [
  { label: '⚡ Energized', value: 'energized' },
  { label: '◎ Focused', value: 'focused' },
  { label: '? Uncertain', value: 'uncertain' },
  { label: '↯ Lost', value: 'lost' },
  { label: '✦ Proud', value: 'proud' },
  { label: '↩ Regretful', value: 'regretful' },
  { label: '⬡ Burned Out', value: 'burned_out' },
];

const IMPACTS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const EVENT_TYPES = [
  'milestone', 'launch', 'funding', 'team', 'pivot', 'setback', 'exit', 'decision', 'lesson', 'feeling', 'other'
];

export default function EventForm({
  ventureId,
  onClose,
}: {
  ventureId: string | null;
  onClose: () => void;
}) {
  const { events, setEvents } = useStore();
  const [showDepth, setShowDepth] = useState(false);
  const [formData, setFormData] = useState<Partial<VentureEvent>>({
    type: 'milestone',
    title: '',
    notes: '',
    eventDate: new Date().toISOString().split('T')[0],
    linkUrl: '',
    wasPlanned: true,
  });

  if (!ventureId) return null;

  const handleChange = (key: keyof VentureEvent, value: VentureEvent[keyof VentureEvent]) => {
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
      type: (formData.type as VentureEvent['type']) || 'milestone',
      title: formData.title || '',
      notes: formData.notes || '',
      eventDate: formData.eventDate || '',
      linkUrl: formData.linkUrl || '',
      mood: formData.mood,
      impact: formData.impact,
      wasPlanned: formData.wasPlanned,
      triggerType: formData.triggerType,
      lessonLearned: formData.lessonLearned,
      counterfactual: formData.counterfactual,
    };

    setEvents([...events, newEvent]);
    onClose();
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[440px] bg-[#0e0b0b] border-l border-white/10 shadow-2xl z-[150] flex flex-col font-mono">
      {/* Header */}
      <div className="flex items-center justify-between px-7 pt-8 pb-4">
        <h2 className="font-display text-2xl text-white/90">Add Event</h2>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-7 pb-6 space-y-7">
        {/* Title */}
        <div>
          <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
            TITLE
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="What happened?"
            className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-white/20 transition-all"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-3">
            TYPE
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleChange('type', type)}
                className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-wider transition-all border ${
                  formData.type === type
                    ? 'bg-white/10 border-white/30 text-white/90'
                    : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Planned */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
              DATE
            </label>
            <input
              type="date"
              value={formData.eventDate || ''}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-white/20"
            />
          </div>
          <div className="w-32">
            <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
              INTENT
            </label>
            <button
              onClick={() => handleChange('wasPlanned', !formData.wasPlanned)}
              className={`w-full py-3 rounded-md text-[9px] uppercase tracking-wider border transition-all ${
                formData.wasPlanned
                  ? 'bg-white/10 border-white/30 text-white/90'
                  : 'bg-transparent border-white/10 text-white/40'
              }`}
            >
              {formData.wasPlanned ? 'Planned' : 'Reactive'}
            </button>
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-3">
            MOOD (OPTIONAL)
          </label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => handleChange('mood', m.value === formData.mood ? undefined : m.value)}
                className={`px-3 py-1.5 rounded-full text-[8px] transition-all border ${
                  formData.mood === m.value
                    ? 'bg-white/10 border-white/30 text-white/90'
                    : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Selector */}
        <div>
          <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-3">
            IMPACT
          </label>
          <div className="flex gap-2">
            {IMPACTS.map((i) => (
              <button
                key={i.value}
                onClick={() => handleChange('impact', i.value)}
                className={`flex-1 py-2 rounded-full text-[9px] uppercase tracking-wider transition-all border ${
                  formData.impact === i.value
                    ? 'bg-white/10 border-white/30 text-white/90'
                    : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
            NOTES
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Details..."
            rows={3}
            className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-white/20 resize-none"
          />
        </div>

        {/* Depth Link */}
        <button
          onClick={() => setShowDepth(!showDepth)}
          className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
        >
          {showDepth ? '- Hide depth' : '+ Add depth'}
        </button>

        {showDepth && (
          <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
             <div>
              <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
                LESSON LEARNED
              </label>
              <textarea
                value={formData.lessonLearned || ''}
                onChange={(e) => handleChange('lessonLearned', e.target.value)}
                placeholder="What did this teach you?"
                rows={2}
                className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-white/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
                WHAT YOU&apos;D DO DIFFERENTLY
              </label>
              <textarea
                value={formData.counterfactual || ''}
                onChange={(e) => handleChange('counterfactual', e.target.value)}
                placeholder="Looking back, what would you change?"
                rows={2}
                className="w-full bg-white/[0.03] border border-white/10 rounded-md px-4 py-3 text-white/80 text-xs focus:outline-none focus:border-white/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-[8px] tracking-[0.18em] text-white/20 mb-2">
                TRIGGER
              </label>
              <div className="flex flex-wrap gap-2">
                {['internal', 'external', 'market', 'team', 'personal'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleChange('triggerType', t)}
                    className={`px-3 py-1.5 rounded-md text-[9px] uppercase tracking-wider border transition-all ${
                      formData.triggerType === t
                        ? 'bg-white/10 border-white/30 text-white/90'
                        : 'bg-transparent border-white/10 text-white/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="modify-footer border-t border-white/10 px-7 py-6 flex gap-3">
        <button
          onClick={onClose}
          className="btn-cancel flex-1"
        >
          CANCEL
        </button>
        <button
          onClick={handleAdd}
          className="btn-save flex-1"
        >
          ADD EVENT
        </button>
      </div>
    </div>
  );
}
