'use client';

import { useRef, useState } from 'react';
import { CalendarDays, GitBranch, Palette, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useStore, Venture } from '@/lib/useStore';
import EventForm from './EventForm';

const STATUSES: Venture['status'][] = ['active', 'stealth', 'graveyard', 'pivot', 'paused', 'archived', 'acquired', 'failed', 'shutdown', 'exited'];

export default function ModifyPanel({
  ventureId,
  onClose,
}: {
  ventureId: string | null;
  onClose: () => void;
}) {
  const { ventures, updateVenture, deleteVenture } = useStore();
  const venture = ventures.find((v) => v.id === ventureId);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState<Partial<Venture>>(venture || {});
  const logoInputRef = useRef<HTMLInputElement>(null);

  if (!venture) return null;

  const handleChange = (key: keyof Venture, value: Venture[keyof Venture]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCloseAnimated = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const handleSave = () => {
    const status = formData.status || venture.status;
    if ((status === 'graveyard' || status === 'failed' || status === 'shutdown') && !formData.hardestLesson?.trim()) {
      window.alert('Add the hardest lesson learned before moving this venture into the graveyard.');
      return;
    }
    updateVenture(venture.id, formData);
    handleCloseAnimated();
  };

  const handleLogoFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => handleChange('logoUrl', String(event.target?.result || ''));
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this venture?')) {
      deleteVenture(venture.id);
      handleCloseAnimated();
    }
  };

  return (
    <>
      <div
        className="modify-panel"
        style={{
          width: '430px',
          zIndex: 210,
          animation: isClosing ? 'panelSlideOut 250ms cubic-bezier(0.4, 0, 0.2, 1)' : 'panelSlideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Modify venture</div>
            <h2 style={{ padding: 0, marginTop: '6px' }}>{venture.name}</h2>
            <div style={subheadStyle}>
              <span>{venture.industry || 'No industry'}</span>
              <span>|</span>
              <span>{venture.status}</span>
            </div>
          </div>
          <button onClick={handleCloseAnimated} style={iconButtonStyle} aria-label="Close modify panel">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 pb-6">
          <div style={summaryStyle}>
            <div>
              <CalendarDays size={14} />
              <span>{new Date(venture.startedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div>
              <GitBranch size={14} />
              <span>{venture.parentId ? 'Branch venture' : 'Root venture'}</span>
            </div>
          </div>

          <label>LOGO</label>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            style={{ display: 'none' }}
            onChange={(event) => handleLogoFile(event.target.files?.[0])}
          />
          <button onClick={() => logoInputRef.current?.click()} className="btn-cancel" style={logoButtonStyle}>
            {formData.logoUrl ? (
              <span style={{ ...logoPreviewStyle, backgroundImage: `url(${formData.logoUrl})` }} />
            ) : (
              <Upload size={15} />
            )}
            {formData.logoUrl ? 'Replace logo' : 'Upload logo'}
          </button>

          <label>NAME</label>
          <input
            type="text"
            placeholder="Venture name"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <label>DESCRIPTION</label>
          <textarea
            placeholder="Brief overview..."
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
          />

          <label>INDUSTRY</label>
          <input
            type="text"
            placeholder="e.g. FinTech, SaaS"
            value={formData.industry || ''}
            onChange={(e) => handleChange('industry', e.target.value)}
          />

          <label>STATUS</label>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => handleChange('status', status)}
                className={`status-pill ${formData.status === status ? 'selected' : ''}`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          <label>STARTED DATE</label>
          <input
            type="date"
            value={formData.startedDate || ''}
            onChange={(e) => handleChange('startedDate', e.target.value)}
          />

          <label>ENDED DATE</label>
          <input
            type="date"
            value={formData.endedDate || ''}
            onChange={(e) => handleChange('endedDate', e.target.value || undefined)}
          />

          {(formData.status === 'graveyard' || formData.status === 'failed' || formData.status === 'shutdown') && (
            <>
              <label>HARDEST LESSON LEARNED *</label>
              <textarea
                placeholder="What should future-you never forget?"
                value={formData.hardestLesson || ''}
                onChange={(e) => handleChange('hardestLesson', e.target.value)}
                rows={3}
              />
            </>
          )}

          <label>VENTURE VITALS</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              placeholder="Burn rate"
              value={formData.burnRate ?? ''}
              onChange={(e) => handleChange('burnRate', Number(e.target.value))}
            />
            <input
              type="number"
              min="0"
              placeholder="Runway months"
              value={formData.runwayMonths ?? ''}
              onChange={(e) => handleChange('runwayMonths', Number(e.target.value))}
            />
          </div>

          <label>COLLABORATORS</label>
          <input
            type="text"
            placeholder="Comma-separated names"
            value={(formData.collaborators || []).join(', ')}
            onChange={(e) =>
              handleChange(
                'collaborators',
                e.target.value
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
          />

          <label>ACCENT COLOR</label>
          <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: '10px', alignItems: 'center' }}>
            <span style={{ ...colorPreviewStyle, background: formData.color || 'rgba(255,255,255,0.9)' }}>
              <Palette size={16} />
            </span>
            <input
              type="text"
              value={formData.color || ''}
              onChange={(e) => handleChange('color', e.target.value)}
              placeholder="#95e1d3"
            />
          </div>

          <label>TIMELINE SIDE</label>
          <div className="grid grid-cols-2 gap-2">
            {(['above', 'below'] as const).map((side) => (
              <button
                key={side}
                onClick={() => handleChange('timelineSide', side)}
                className={`status-pill ${(formData.timelineSide || 'below') === side ? 'selected' : ''}`}
              >
                {side.toUpperCase()}
              </button>
            ))}
          </div>

          <label>PARENT VENTURE</label>
          <select
            value={formData.parentId || ''}
            onChange={(e) => handleChange('parentId', e.target.value || undefined)}
          >
            <option value="">None</option>
            {ventures
              .filter((v) => v.id !== venture.id)
              .map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
          </select>

          {formData.parentId && (
            <>
              <label>BRANCH LABEL</label>
              <input
                type="text"
                value={formData.branchLabel || ''}
                onChange={(e) => handleChange('branchLabel', e.target.value)}
                placeholder="e.g. Spinoff, Pivot"
              />
            </>
          )}

          <button
            onClick={() => setIsAddingEvent(true)}
            className="w-full btn-cancel"
            style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={14} />
            Add event
          </button>
        </div>

        <div className="modify-footer">
          <button onClick={handleDelete} className="btn-delete" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Trash2 size={13} />
            Delete
          </button>
          <div className="flex gap-3">
            <button onClick={handleCloseAnimated} className="btn-cancel">
              Cancel
            </button>
            <button onClick={handleSave} className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Save size={13} />
              Save
            </button>
          </div>
        </div>
      </div>

      {isAddingEvent && (
        <EventForm ventureId={ventureId} onClose={() => setIsAddingEvent(false)} />
      )}
    </>
  );
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  padding: '28px',
};

const eyebrowStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.34)',
  fontSize: '9px',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
};

const subheadStyle: React.CSSProperties = {
  marginTop: '10px',
  display: 'flex',
  gap: '8px',
  color: 'rgba(255,255,255,0.42)',
  fontSize: '11px',
};

const iconButtonStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  color: 'rgba(255,255,255,0.62)',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const summaryStyle: React.CSSProperties = {
  marginTop: '18px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  color: 'rgba(255,255,255,0.46)',
  fontSize: '10px',
};

const colorPreviewStyle: React.CSSProperties = {
  height: '38px',
  borderRadius: '10px',
  color: '#090909',
  display: 'grid',
  placeItems: 'center',
  border: '1px solid rgba(255,255,255,0.12)',
};

const logoButtonStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '54px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

const logoPreviewStyle: React.CSSProperties = {
  width: '34px',
  height: '34px',
  borderRadius: '9px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: '1px solid rgba(255,255,255,0.16)',
};
