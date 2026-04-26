'use client';

import { useState } from 'react';
import { X, Plus, Flag, Rocket, DollarSign, Users, RefreshCw, AlertTriangle, LogOut, GitBranch, BookOpen, Heart, Circle, ChevronDown, Upload } from 'lucide-react';
import { useToasts } from './Toast';

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
  ventures?: any[];
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
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (date === yesterday) return 'Yesterday';
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / 86400000);
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
          top: '48px',
          right: 0,
          width: '400px',
          height: 'calc(100vh - 48px)',
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.08)',
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
            gap: '10px',
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Plus size={16} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '24px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.9)',
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
              color: 'rgba(255,255,255,0.4)',
              padding: '4px',
              transition: 'color 150ms',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Venture */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
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
                  border: errors.ventureId ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '11px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select venture...</option>
                {ventures.map((v) => (
                  <option key={v.id} value={v.id} style={{ background: '#0f0f0f' }}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
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
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '11px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {getRelativeDate() && (
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                  {getRelativeDate()}
                </div>
              )}
            </div>

            {/* Event Type */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
                Event Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
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
                        gap: '4px',
                        padding: '8px',
                        border: eventType === et.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        background: eventType === et.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 150ms',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                      onMouseOver={(e) => {
                        if (eventType !== et.id) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (eventType !== et.id) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                        }
                      }}
                    >
                      <Icon size={12} strokeWidth={1.5} style={{ color: eventType === et.id ? '#ffffff' : 'rgba(255,255,255,0.5)' }} />
                      <span style={{ fontSize: '9px', color: eventType === et.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
                        {et.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
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
                  border: errors.title ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '11px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', textAlign: 'right', marginTop: '4px' }}>
                {title.length}/60
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
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
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '11px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Mood & Impact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
                  Mood
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {moods.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(mood === m ? '' : m)}
                      style={{
                        padding: '6px 8px',
                        border: mood === m ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        background: mood === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '9px',
                        color: mood === m ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 150ms',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
                  Impact
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {impacts.map((imp) => (
                    <button
                      key={imp}
                      onClick={() => setImpact(impact === imp ? '' : imp)}
                      style={{
                        padding: '6px 8px',
                        border: impact === imp ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        background: impact === imp ? 'rgba(255,255,255,0.1)' : 'transparent',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '9px',
                        color: impact === imp ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 150ms',
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
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '10px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 150ms',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
            >
              + Add depth
            </button>

            {/* Depth Fields */}
            {showDepth && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
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
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '11px 14px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.8)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
                    What You'd Do Differently
                  </label>
                  <textarea
                    value={whatYouddoDifferently}
                    onChange={(e) => setWhatYouddoDifferently(e.target.value)}
                    placeholder="Looking back..."
                    rows={3}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      padding: '11px 14px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.8)',
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
              <label style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '8px' }}>
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
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '11px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '28px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '9px 20px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: 'none',
              borderRadius: '999px',
              padding: '10px 24px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              color: '#080808',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'opacity 150ms',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
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
