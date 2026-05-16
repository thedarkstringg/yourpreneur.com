'use client';

import { useRef, useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { useToasts } from './Toast';

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
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 500,
          animation: 'fadeIn 250ms ease',
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
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '32px',
          width: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
          zIndex: 501,
          animation: 'modalOpen 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
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

        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '24px' }} />

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '8px',
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
                minHeight: '58px',
                border: '1px dashed rgba(255,255,255,0.16)',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.025)',
                color: 'rgba(255,255,255,0.58)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              {logoUrl ? (
                <span
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '9px',
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
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '8px',
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
                  background: 'rgba(255,255,255,0.03)',
                  border: errors.name ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '11px 14px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  outline: 'none',
                  transition: 'border 180ms ease, background 180ms ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.name ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              />
            </div>
            {errors.name && (
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                {errors.name}
              </div>
            )}
            <div
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                textAlign: 'right',
                marginTop: '4px',
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
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '8px',
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
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '11px 14px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                outline: 'none',
                transition: 'border 180ms ease, background 180ms ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            />
          </div>

          {/* Industry */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '8px',
              }}
            >
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '11px 14px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                outline: 'none',
                transition: 'border 180ms ease, background 180ms ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <option value="">Select industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind} style={{ background: '#0f0f0f', color: 'rgba(255,255,255,0.8)' }}>
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
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '8px',
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
                background: 'rgba(255,255,255,0.03)',
                border: errors.startDate ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '11px 14px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                color: 'rgba(255,255,255,0.8)',
                outline: 'none',
                transition: 'border 180ms ease, background 180ms ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.startDate ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            />
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>
              Will appear at {getTimelinePosition()} on your timeline
            </div>
            {errors.startDate && (
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                {errors.startDate}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '8px',
              }}
            >
              Status
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Active', 'Stealth', 'Graveyard', 'Pivot', 'Paused', 'Archived'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s.toLowerCase())}
                  style={{
                    flex: 1,
                    border: status === s.toLowerCase() ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '999px',
                    padding: '7px 14px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '10px',
                    fontWeight: 500,
                    color: status === s.toLowerCase() ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                    background: status === s.toLowerCase() ? 'rgba(255,255,255,0.1)' : 'transparent',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 150ms',
                  }}
                  onMouseOver={(e) => {
                    if (status !== s.toLowerCase()) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (status !== s.toLowerCase()) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
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
        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '9px 20px',
              fontFamily: "'Inter', sans-serif",
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
              fontFamily: "'Inter', sans-serif",
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

