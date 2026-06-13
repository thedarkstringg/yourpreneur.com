'use client';

import { useState } from 'react';
import { useStore, VentureEvent } from '@/lib/useStore';
import { colors, spacing, radius, typography, transitions } from '@/styles/tokens';
import { validateEventTitle, validateDate } from '@/lib/validation';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
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
    const newErrors: { [key: string]: string } = {};

    const titleValidation = validateEventTitle(formData.title || '');
    if (!titleValidation.isValid) {
      newErrors.title = titleValidation.error || '';
    }

    const dateValidation = validateDate(formData.eventDate || '');
    if (!dateValidation.isValid) {
      newErrors.eventDate = dateValidation.error || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
    <div
      className="fixed right-0 top-0 h-screen flex flex-col font-mono z-[150]"
      style={{
        width: 440,
        backgroundColor: colors.background.elevated,
        borderLeft: `1px solid ${colors.border.default}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ padding: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
        <h2 className="font-display text-2xl" style={{ color: colors.text.primary }}>Add Event</h2>
        <button
          onClick={onClose}
          style={{ color: colors.text.secondary }}
          className="hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: `${spacing.lg}px ${spacing.lg}px ${spacing.md}px`, display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
        {/* Title */}
        <div>
          <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
            TITLE
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => {
              handleChange('title', e.target.value);
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            placeholder="What happened?"
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: errors.title ? `1px solid ${colors.status.failed}` : `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              padding: `${spacing.md}px ${spacing.sm}px`,
              color: colors.text.primary,
              fontSize: typography.size.xs,
            }}
            className="focus:outline-none transition-all"
            onFocus={(e) => (e.currentTarget.style.borderColor = colors.border.strong)}
            onBlur={(e) => (e.currentTarget.style.borderColor = errors.title ? colors.status.failed : colors.border.default)}
          />
          {errors.title && (
            <div style={{ fontSize: typography.size.xs, color: colors.status.failed, marginTop: spacing.xs }}>
              {errors.title}
            </div>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.md }}>
            TYPE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleChange('type', type)}
                style={{
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: formData.type === type ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                  backgroundColor: formData.type === type ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: formData.type === type ? colors.text.primary : colors.text.secondary,
                  cursor: 'pointer',
                  transition: transitions.default,
                }}
                onMouseEnter={(e) => {
                  if (formData.type !== type) e.currentTarget.style.borderColor = colors.border.strong;
                }}
                onMouseLeave={(e) => {
                  if (formData.type !== type) e.currentTarget.style.borderColor = colors.border.default;
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Planned */}
        <div style={{ display: 'flex', gap: spacing.md }}>
          <div style={{ flex: 1 }}>
            <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
              DATE
            </label>
            <input
              type="date"
              value={formData.eventDate || ''}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.md,
                padding: `${spacing.md}px ${spacing.sm}px`,
                color: colors.text.primary,
                fontSize: typography.size.xs,
              }}
              className="focus:outline-none"
              onFocus={(e) => (e.currentTarget.style.borderColor = colors.border.strong)}
              onBlur={(e) => (e.currentTarget.style.borderColor = colors.border.default)}
            />
          </div>
          <div style={{ width: 128 }}>
            <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
              INTENT
            </label>
            <button
              onClick={() => handleChange('wasPlanned', !formData.wasPlanned)}
              style={{
                width: '100%',
                padding: `${spacing.md}px`,
                borderRadius: radius.md,
                fontSize: typography.size.xs,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: formData.wasPlanned ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                backgroundColor: formData.wasPlanned ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: formData.wasPlanned ? colors.text.primary : colors.text.secondary,
                cursor: 'pointer',
                transition: transitions.default,
              }}
            >
              {formData.wasPlanned ? 'Planned' : 'Reactive'}
            </button>
          </div>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.md }}>
            MOOD (OPTIONAL)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => handleChange('mood', m.value === formData.mood ? undefined : m.value)}
                style={{
                  padding: `${spacing.xs}px ${spacing.sm}px`,
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  border: formData.mood === m.value ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                  backgroundColor: formData.mood === m.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: formData.mood === m.value ? colors.text.primary : colors.text.secondary,
                  cursor: 'pointer',
                  transition: transitions.default,
                }}
                onMouseEnter={(e) => {
                  if (formData.mood !== m.value) e.currentTarget.style.borderColor = colors.border.strong;
                }}
                onMouseLeave={(e) => {
                  if (formData.mood !== m.value) e.currentTarget.style.borderColor = colors.border.default;
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Selector */}
        <div>
          <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.md }}>
            IMPACT
          </label>
          <div style={{ display: 'flex', gap: spacing.sm }}>
            {IMPACTS.map((i) => (
              <button
                key={i.value}
                onClick={() => handleChange('impact', i.value)}
                style={{
                  flex: 1,
                  padding: `${spacing.sm}px`,
                  borderRadius: radius.full,
                  fontSize: typography.size.xs,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: formData.impact === i.value ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                  backgroundColor: formData.impact === i.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: formData.impact === i.value ? colors.text.primary : colors.text.secondary,
                  cursor: 'pointer',
                  transition: transitions.default,
                }}
                onMouseEnter={(e) => {
                  if (formData.impact !== i.value) e.currentTarget.style.borderColor = colors.border.strong;
                }}
                onMouseLeave={(e) => {
                  if (formData.impact !== i.value) e.currentTarget.style.borderColor = colors.border.default;
                }}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
            NOTES
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Details..."
            rows={3}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              padding: `${spacing.md}px ${spacing.sm}px`,
              color: colors.text.primary,
              fontSize: typography.size.xs,
              resize: 'none',
            }}
            className="focus:outline-none"
            onFocus={(e) => (e.currentTarget.style.borderColor = colors.border.strong)}
            onBlur={(e) => (e.currentTarget.style.borderColor = colors.border.default)}
          />
        </div>

        {/* Depth Link */}
        <button
          onClick={() => setShowDepth(!showDepth)}
          style={{
            fontSize: typography.size.xs,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: colors.text.tertiary,
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: transitions.default,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.secondary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.tertiary)}
        >
          {showDepth ? '- Hide depth' : '+ Add depth'}
        </button>

        {showDepth && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, paddingTop: spacing.sm, animation: `fadeIn ${transitions.default}` }}>
             <div>
              <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
                LESSON LEARNED
              </label>
              <textarea
                value={formData.lessonLearned || ''}
                onChange={(e) => handleChange('lessonLearned', e.target.value)}
                placeholder="What did this teach you?"
                rows={2}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.md,
                  padding: `${spacing.md}px ${spacing.sm}px`,
                  color: colors.text.primary,
                  fontSize: typography.size.xs,
                  resize: 'none',
                }}
                className="focus:outline-none"
                onFocus={(e) => (e.currentTarget.style.borderColor = colors.border.strong)}
                onBlur={(e) => (e.currentTarget.style.borderColor = colors.border.default)}
              />
            </div>
            <div>
              <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
                WHAT YOU&apos;D DO DIFFERENTLY
              </label>
              <textarea
                value={formData.counterfactual || ''}
                onChange={(e) => handleChange('counterfactual', e.target.value)}
                placeholder="Looking back, what would you change?"
                rows={2}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.md,
                  padding: `${spacing.md}px ${spacing.sm}px`,
                  color: colors.text.primary,
                  fontSize: typography.size.xs,
                  resize: 'none',
                }}
                className="focus:outline-none"
                onFocus={(e) => (e.currentTarget.style.borderColor = colors.border.strong)}
                onBlur={(e) => (e.currentTarget.style.borderColor = colors.border.default)}
              />
            </div>
            <div>
              <label className="block" style={{ fontSize: typography.size.xs, textTransform: 'uppercase', letterSpacing: '0.18em', color: colors.text.tertiary, marginBottom: spacing.sm }}>
                TRIGGER
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                {['internal', 'external', 'market', 'team', 'personal'].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleChange('triggerType', t)}
                    style={{
                      padding: `${spacing.xs}px ${spacing.sm}px`,
                      borderRadius: radius.md,
                      fontSize: typography.size.xs,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      border: formData.triggerType === t ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                      backgroundColor: formData.triggerType === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: formData.triggerType === t ? colors.text.primary : colors.text.secondary,
                      cursor: 'pointer',
                      transition: transitions.default,
                    }}
                    onMouseEnter={(e) => {
                      if (formData.triggerType !== t) e.currentTarget.style.borderColor = colors.border.strong;
                    }}
                    onMouseLeave={(e) => {
                      if (formData.triggerType !== t) e.currentTarget.style.borderColor = colors.border.default;
                    }}
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
      <div className="modify-footer" style={{ borderTop: `1px solid ${colors.border.default}`, padding: spacing.lg, display: 'flex', gap: spacing.md }}>
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
