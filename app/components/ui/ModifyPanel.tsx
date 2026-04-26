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
  const { ventures, updateVenture, deleteVenture } = useStore();
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

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this venture?')) {
      deleteVenture(venture.id);
      onClose();
    }
  };

  return (
    <>
      <div className="modify-panel">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <h2 className="font-display">Modify Venture</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors pt-8 pr-8"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-7 pb-6">
          {/* Name */}
          <div>
            <label>NAME</label>
            <input
              type="text"
              placeholder="Venture Name"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label>DESCRIPTION</label>
            <textarea
              placeholder="Brief overview..."
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
            />
          </div>

          {/* Industry */}
          <div>
            <label>INDUSTRY</label>
            <input
              type="text"
              placeholder="e.g. FINTECH, SAAS"
              value={formData.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label>STATUS</label>
            <div className="grid grid-cols-2 gap-2">
              {['active', 'pivot', 'paused', 'shutdown', 'exited'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleChange('status', status)}
                    className={`status-pill ${
                      formData.status === status ? 'selected' : ''
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
            <label>STARTED DATE</label>
            <input
              type="date"
              value={formData.startedDate || ''}
              onChange={(e) => handleChange('startedDate', e.target.value)}
            />
          </div>

          {/* Parent Venture */}
          <div>
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
          </div>

          {/* Branch Label */}
          {formData.parentId && (
            <div>
              <label>BRANCH LABEL</label>
              <input
                type="text"
                value={formData.branchLabel || ''}
                onChange={(e) => handleChange('branchLabel', e.target.value)}
                placeholder="e.g., Spinoff, Pivot"
              />
            </div>
          )}
          <div className="mt-8">
            <button
              onClick={() => setIsAddingEvent(true)}
              className="w-full btn-cancel"
            >
              + ADD EVENT
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="modify-footer">
          <button
            onClick={handleDelete}
            className="btn-delete"
          >
            DELETE
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn-cancel"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="btn-save"
            >
              SAVE
            </button>
          </div>
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
