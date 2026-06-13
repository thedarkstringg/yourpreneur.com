'use client';

import { useState } from 'react';
import { X, Plus, Flag, Rocket, DollarSign, Users, RefreshCw, AlertTriangle, LogOut, GitBranch, BookOpen, Heart, Circle } from 'lucide-react';
import { useToasts } from './Toast';
import { Venture } from '@/lib/useStore';
import { colors, spacing, radius, typography, transitions } from '@/styles/tokens';

interface EventLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    ventureId: string;
    date: string;
    type: string;
    title: string;
    notes?: string;
    mood?: string;
    impact?: string;
    lessonLearned?: string;
    whatYouddoDifferently?: string;
    linkUrl?: string;
  }) => void;
  ventures?: Venture[];
  selectedVentureId?: string | null;
}

export default function EventLogPanel({ isOpen, onClose, onSave, ventures = [], selectedVentureId }: EventLogPanelProps) {
  const [ventureId, setVentureId] = useState(selectedVentureId?.toString() || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  const [impact, setImpact] = useState('');
  const [showDepth, setShowDepth] = useState(false);
  const [lessonLearned, setLessonLearned] = useState('');
  const [whatYouddoDifferently, setWhatYouddoDifferently] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [now] = useState(() => Date.now());
  const [errors, setErrors] = useState<{ ventureId?: string; date?: string; type?: string; title?: string }>({});
  const { addToast } = useToasts();

  const eventTypes = [
    { id: 'milestone', label: 'Milestone', Icon: Flag },
    { id: 'launch', label: 'Launch', Icon: Rocket },
    { id: 'funding', label: 'Funding', Icon: DollarSign },
    { id: 'team', label: 'Team', Icon: Users },
    { id: 'pivot', label: 'Pivot', Icon: RefreshCw },
    { id: 'setback', label: 'Setback', Icon: AlertTriangle },
    { id: 'exit', label: 'Exit', Icon: LogOut },
    { id: 'decision', label: 'Decision', Icon: GitBranch },
    { id: 'lesson', label: 'Lesson', Icon: BookOpen },
    { id: 'feeling', label: 'Feeling', Icon: Heart },
    { id: 'other', label: 'Other', Icon: Circle },
  ];

  const moods = ['⚡ Energized', '◎ Focused', '? Uncertain', '↯ Lost', '✦ Proud', '↩ Regretful', '⬡ Burned Out'];
  const impacts = ['Low', 'Medium', 'High', 'Critical'];

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!ventureId) newErrors.ventureId = 'Venture is required';
    if (!date) newErrors.date = 'Date is required';
    if (!eventType) newErrors.type = 'Event type is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSave({
      ventureId,
      date,
      type: eventType,
      title: title.trim(),
      notes: notes.trim() || undefined,
      mood: mood || undefined,
      impact: impact || undefined,
      lessonLearned: lessonLearned.trim() || undefined,
      whatYouddoDifferently: whatYouddoDifferently.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
    });

    // Reset form
    setVentureId(selectedVentureId?.toString() || '');
    setDate(new Date().toISOString().split('T')[0]);
    setEventType('');
    setTitle('');
    setNotes('');
    setMood('');
    setImpact('');
    setShowDepth(false);
    setLessonLearned('');
    setWhatYouddoDifferently('');
    setLinkUrl('');
    setErrors({});

    const venture = ventures.find((v) => v.id === ventureId);
    addToast('success', `Event logged · ${venture?.name}`);
  };

  const getRelativeDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return 'Today';
    const yesterday = new Date(now - 86400000).toISOString().split('T')[0];
    if (date === yesterday) return 'Yesterday';
    const days = Math.floor((now - new Date(date).getTime()) / 86400000);
    if (days > 0 && days < 7) return `${days} days ago`;
    return '';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 400,
          animation: 'fadeIn 250ms ease',
        }}
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        style={{
          position: 'fixed',
          top: 48,
          right: 0,
          width: 400,
          height: 'calc(100vh - 48px)',
          background: colors.background.base,
          border: `1px solid ${colors.border.default}`,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 401,
          animation: 'slideInPanel 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.md}px ${spacing.lg}px`,
            borderBottom: `1px solid ${colors.border.subtle}`,
          }}
        >
          <Plus size={16} strokeWidth={1.5} style={{ color: colors.text.secondary }} />
          <h2
            style={{
              fontFamily: typography.family.display,
              fontSize: typography.size['2xl'],
              fontWeight: typography.weight.medium,
              color: colors.text.primary,
              margin: 0,
              flex: 1,
            }}
          >
            Log Event
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.secondary,
              padding: spacing.xs,
              transition: transitions.default,
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = colors.text.primary)}
            onMouseOut={(e) => (e.currentTarget.style.color = colors.text.secondary)}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: spacing.lg,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            {/* Venture */}
            <div>
              <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                Venture *
              </label>
              <select
                value={ventureId}
                onChange={(e) => {
                  setVentureId(e.target.value);
                  if (errors.ventureId) setErrors({ ...errors, ventureId: undefined });
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: errors.ventureId ? `1px solid ${colors.text.secondary}` : `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                  fontFamily: typography.family.base,
                  fontSize: typography.size.base,
                  color: colors.text.primary,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select venture...</option>
                {ventures.map((v) => (
                  <option key={v.id} value={v.id} style={{ background: colors.background.base }}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors({ ...errors, date: undefined });
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                  fontFamily: typography.family.base,
                  fontSize: typography.size.base,
                  color: colors.text.primary,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {getRelativeDate() && (
                <div style={{ fontSize: typography.size.xs, color: colors.text.tertiary, marginTop: spacing.xs }}>
                  {getRelativeDate()}
                </div>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                Event Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.sm }}>
                {eventTypes.map((et) => {
                  const Icon = et.Icon;
                  return (
                    <button
                      key={et.id}
                      onClick={() => {
                        setEventType(et.id);
                        if (errors.type) setErrors({ ...errors, type: undefined });
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: spacing.xs,
                        padding: spacing.xs,
                        border: eventType === et.id ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                        borderRadius: radius.md,
                        background: eventType === et.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                        cursor: 'pointer',
                        transition: transitions.default,
                        fontFamily: typography.family.base,
                      }}
                      onMouseOver={(e) => {
                        if (eventType !== et.id) {
                          e.currentTarget.style.borderColor = colors.border.strong;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (eventType !== et.id) {
                          e.currentTarget.style.borderColor = colors.border.default;
                        }
                      }}
                    >
                      <Icon size={12} strokeWidth={1.5} style={{ color: eventType === et.id ? colors.text.primary : colors.text.secondary }} />
                      <span style={{ fontSize: typography.size.xs, color: eventType === et.id ? colors.text.primary : colors.text.secondary }}>
                        {et.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                Title * (60 chars max)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.slice(0, 60));
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder="What happened?"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: errors.title ? `1px solid ${colors.text.secondary}` : `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                  fontFamily: typography.family.base,
                  fontSize: typography.size.base,
                  color: colors.text.primary,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: typography.size.xs, color: colors.text.tertiary, textAlign: 'right', marginTop: spacing.xs }}>
                {title.length}/60
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional context..."
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                  fontFamily: typography.family.base,
                  fontSize: typography.size.base,
                  color: colors.text.primary,
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Mood & Impact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.lg }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                  Mood
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                  {moods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(mood === m ? '' : m)}
                      style={{
                        padding: `${spacing.xs}px`,
                        border: mood === m ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                        borderRadius: radius.sm,
                        background: mood === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                        fontFamily: typography.family.base,
                        fontSize: typography.size.xs,
                        color: mood === m ? colors.text.primary : colors.text.secondary,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: transitions.default,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                  Impact
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                  {impacts.map((imp) => (
                    <button
                      key={imp}
                      onClick={() => setImpact(impact === imp ? '' : imp)}
                      style={{
                        padding: `${spacing.xs}px`,
                        border: impact === imp ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                        borderRadius: radius.sm,
                        background: impact === imp ? 'rgba(255,255,255,0.1)' : 'transparent',
                        fontFamily: typography.family.base,
                        fontSize: typography.size.xs,
                        color: impact === imp ? colors.text.primary : colors.text.secondary,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: transitions.default,
                      }}
                    >
                      {imp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Depth Toggle */}
            <button
              onClick={() => setShowDepth(!showDepth)}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.tertiary,
                cursor: 'pointer',
                fontSize: typography.size.xs,
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                transition: transitions.default,
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = colors.text.secondary)}
              onMouseOut={(e) => (e.currentTarget.style.color = colors.text.tertiary)}
            >
              + Add depth
            </button>

            {/* Depth Fields */}
            {showDepth && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                    Lesson Learned
                  </label>
                  <textarea
                    value={lessonLearned}
                    onChange={(e) => setLessonLearned(e.target.value)}
                    placeholder="What did this teach you?"
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: radius.sm,
                      padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                      fontFamily: typography.family.base,
                      fontSize: typography.size.base,
                      color: colors.text.primary,
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                    What You&apos;d Do Differently
                  </label>
                  <textarea
                    value={whatYouddoDifferently}
                    onChange={(e) => setWhatYouddoDifferently(e.target.value)}
                    placeholder="Looking back..."
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: radius.sm,
                      padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                      fontFamily: typography.family.base,
                      fontSize: typography.size.base,
                      color: colors.text.primary,
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </>
            )}

            {/* Link URL */}
            <div>
              <label style={{ display: 'block', fontSize: typography.size.xs, color: colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: spacing.sm }}>
                Link URL
              </label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  padding: `${spacing.xs + 1}px ${spacing.xs + 2}px`,
                  fontFamily: typography.family.base,
                  fontSize: typography.size.base,
                  color: colors.text.primary,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: spacing.lg, borderTop: `1px solid ${colors.border.subtle}`, display: 'flex', gap: spacing.sm, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.full,
              padding: `${spacing.xs}px ${spacing.sm}px`,
              fontFamily: typography.family.base,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: transitions.default,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = colors.border.strong;
              e.currentTarget.style.color = colors.text.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = colors.border.default;
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              borderRadius: radius.full,
              padding: `${spacing.xs + 2}px ${spacing.sm + 4}px`,
              fontFamily: typography.family.base,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.semibold,
              color: '#080808',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: transitions.default,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Save Event <span>→</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInPanel {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

