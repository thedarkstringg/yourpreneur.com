'use client';

import { useState } from 'react';
import { useStore, Venture } from '@/lib/useStore';

export default function NewVentureDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { addVenture } = useStore();
  const [formData, setFormData] = useState<Partial<Venture>>({
    name: '',
    description: '',
    industry: '',
    status: 'active',
    startedDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (key: keyof Venture, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreate = () => {
    if (!formData.name || !formData.startedDate) {
      alert('Please fill in name and start date');
      return;
    }

    const newVenture: Venture = {
      id: `venture-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      industry: formData.industry || '',
      status: (formData.status as Venture['status']) || 'active',
      startedDate: formData.startedDate || '',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };

    addVenture(newVenture);
    setFormData({
      name: '',
      description: '',
      industry: '',
      status: 'active',
      startedDate: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-950 border border-white/10 rounded-lg shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Create New Venture</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-mono text-white/60 mb-2">
              NAME *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., MyStartup"
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
              placeholder="What does this venture do?"
              rows={3}
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
              placeholder="e.g., SaaS, AI/ML, CleanTech"
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
              STARTED DATE *
            </label>
            <input
              type="date"
              value={formData.startedDate || ''}
              onChange={(e) => handleChange('startedDate', e.target.value)}
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
            onClick={handleCreate}
            className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded text-white text-sm font-mono hover:bg-white/30 transition-colors"
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
}
