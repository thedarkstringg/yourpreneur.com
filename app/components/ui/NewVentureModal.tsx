'use client';

import { useRef, useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { useToasts } from './Toast';
import { colors, spacing, radius, typography, transitions, shadows, components } from '@/styles/tokens';

interface NewVentureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venture: {
    name: string;
    description?: string;
    industry?: string;
    startDate: string;
    status: string;
    logoUrl?: string;
  }) => void;
}

export default function NewVentureModal({ isOpen, onClose, onSave }: NewVentureModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('active');
  const [logoUrl, setLogoUrl] = useState('');
  const [errors, setErrors] = useState<{ name?: string; startDate?: string }>({});
  const [isShaking, setIsShaking] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToasts();

  const industries = ['Fintech', 'AgriTech', 'SaaS', 'EdTech', 'HealthTech', 'CleanTech', 'AI/ML', 'Logistics', 'E-commerce', 'Web3', 'Hardware', 'Consumer', 'B2B', 'Other'];

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      industry: industry || undefined,
      startDate,
      status,
      logoUrl: logoUrl || undefined,
    });

    // Reset form
    setName('');
    setDescription('');
    setIndustry('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setStatus('active');
    setLogoUrl('');
    setErrors({});

    addToast('success', `${name} added to ${new Date(startDate).getFullYear()}`);
  };

  const handleLogoFile = (file?: File) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(file.type)) {
      addToast('error', 'Please upload PNG, JPG, SVG, or WebP');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      addToast('error', 'Logo must be smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => setLogoUrl(String(event.target?.result || ''));
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  const getTimelinePosition = () => {
    const date = new Date(startDate);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 500,
          animation: `fadeIn ${transitions.fast}`,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: colors.background.base,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radius.lg,
          padding: spacing['2xl'],
          width: 440,
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: shadows.elevated,
          zIndex: 501,
          animation: `modalOpen ${transitions.spring}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            marginBottom: spacing.lg,
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
            }}
          >
            New Venture
          </h2>
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto',
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

        <div style={{ borderBottom: `1px solid ${colors.border.subtle}`, marginBottom: spacing.lg }} />

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.size.xs,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: spacing.sm,
              }}
            >
              Venture Logo
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              style={{ display: 'none' }}
              onChange={(event) => handleLogoFile(event.target.files?.[0])}
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              style={{
                width: '100%',
                minHeight: 58,
                border: `1px dashed ${colors.border.default}`,
                borderRadius: radius.md,
                background: colors.background.surface,
                color: colors.text.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: spacing.sm,
                cursor: 'pointer',
              }}
            >
              {logoUrl ? (
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.sm,
                    backgroundImage: `url(${logoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ) : (
                <Upload size={15} />
              )}
              {logoUrl ? 'Logo ready' : 'Upload logo'}
            </button>
          </div>

          {/* Venture Name */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.size.xs,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: spacing.sm,
              }}
            >
              Venture Name *
            </label>
            <div
              style={{
                animation: isShaking ? 'shake 300ms' : 'none',
              }}
            >
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="What did you build?"
                autoFocus
                style={{
                  width: '100%',
                  background: colors.background.surface,
                  border: errors.name ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                  borderRadius: radius.sm,
                  padding: `${spacing.xs + 3}px ${spacing.sm - 2}px`,
                  fontFamily: typography.family.base,
                  fontSize: typography.size.base,
                  color: colors.text.primary,
                  outline: 'none',
                  transition: `border ${transitions.default}, background ${transitions.default}`,
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.border.strong;
                  e.currentTarget.style.background = colors.background.elevated;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.name ? colors.border.strong : colors.border.default;
                  e.currentTarget.style.background = colors.background.surface;
                }}
              />
            </div>
            {errors.name && (
              <div style={{ fontSize: typography.size.xs, color: colors.status.failed, marginTop: spacing.xs }}>
                {errors.name}
              </div>
            )}
            <div
              style={{
                fontSize: typography.size.xs,
                color: colors.text.disabled,
                textAlign: 'right',
                marginTop: spacing.xs,
              }}
            >
              {name.length}/60
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.size.xs,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: spacing.sm,
              }}
            >
              One-line Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="In one sentence..."
              style={{
                width: '100%',
                background: colors.background.surface,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.sm,
                padding: `${spacing.xs + 3}px ${spacing.sm - 2}px`,
                fontFamily: typography.family.base,
                fontSize: typography.size.base,
                color: colors.text.primary,
                outline: 'none',
                transition: `border ${transitions.default}, background ${transitions.default}`,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.border.strong;
                e.currentTarget.style.background = colors.background.elevated;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border.default;
                e.currentTarget.style.background = colors.background.surface;
              }}
            />
          </div>

          {/* Industry */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.size.xs,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: spacing.sm,
              }}
            >
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={{
                width: '100%',
                background: colors.background.surface,
                border: `1px solid ${colors.border.default}`,
                borderRadius: radius.sm,
                padding: `${spacing.xs + 3}px ${spacing.sm - 2}px`,
                fontFamily: typography.family.base,
                fontSize: typography.size.base,
                color: colors.text.primary,
                outline: 'none',
                transition: `border ${transitions.default}, background ${transitions.default}`,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.border.strong;
                e.currentTarget.style.background = colors.background.elevated;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border.default;
                e.currentTarget.style.background = colors.background.surface;
              }}
            >
              <option value="">Select industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind} style={{ background: colors.background.base, color: colors.text.primary }}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Started Date */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.size.xs,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: spacing.sm,
              }}
            >
              Started Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate) setErrors({ ...errors, startDate: undefined });
              }}
              style={{
                width: '100%',
                background: colors.background.surface,
                border: errors.startDate ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.default}`,
                borderRadius: radius.sm,
                padding: `${spacing.xs + 3}px ${spacing.sm - 2}px`,
                fontFamily: typography.family.base,
                fontSize: typography.size.base,
                color: colors.text.primary,
                outline: 'none',
                transition: `border ${transitions.default}, background ${transitions.default}`,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.border.strong;
                e.currentTarget.style.background = colors.background.elevated;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.startDate ? colors.border.strong : colors.border.default;
                e.currentTarget.style.background = colors.background.surface;
              }}
            />
            <div style={{ fontSize: typography.size.xs, color: colors.text.tertiary, marginTop: spacing.xs }}>
              Will appear at {getTimelinePosition()} on your timeline
            </div>
            {errors.startDate && (
              <div style={{ fontSize: typography.size.xs, color: colors.status.failed, marginTop: spacing.xs }}>
                {errors.startDate}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: typography.size.xs,
                color: colors.text.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: spacing.sm,
              }}
            >
              Status
            </label>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              {['Active', 'Stealth', 'Graveyard', 'Pivot', 'Paused', 'Archived'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s.toLowerCase())}
                  style={{
                    flex: 1,
                    border: status === s.toLowerCase() ? `1px solid ${colors.border.strong}` : `1px solid ${colors.border.subtle}`,
                    borderRadius: radius.full,
                    padding: `${spacing.xs - 1}px ${spacing.sm}px`,
                    fontFamily: typography.family.base,
                    fontSize: typography.size.xs,
                    fontWeight: typography.weight.medium,
                    color: status === s.toLowerCase() ? colors.text.primary : colors.text.disabled,
                    background: status === s.toLowerCase() ? colors.border.default : 'transparent',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: `all ${transitions.fast}`,
                  }}
                  onMouseOver={(e) => {
                    if (status !== s.toLowerCase()) {
                      e.currentTarget.style.borderColor = colors.border.default;
                    }
                  }}
                  onMouseOut={(e) => {
                    if (status !== s.toLowerCase()) {
                      e.currentTarget.style.borderColor = colors.border.subtle;
                    }
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: spacing['2xl'], borderTop: `1px solid ${colors.border.subtle}`, paddingTop: spacing['2xl'], display: 'flex', gap: spacing.md, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.full,
              padding: `${spacing.xs + 2}px ${spacing.lg}px`,
              fontFamily: typography.family.base,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
              color: colors.text.secondary,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: `all ${transitions.fast}`,
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
              background: colors.text.primary,
              border: 'none',
              borderRadius: radius.full,
              padding: `${spacing.xs + 2}px ${spacing.lg}px`,
              fontFamily: typography.family.base,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.semibold,
              color: colors.background.base,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: `opacity ${transitions.fast}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Add to Timeline <span>→</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalOpen {
          from {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </>
  );
}

