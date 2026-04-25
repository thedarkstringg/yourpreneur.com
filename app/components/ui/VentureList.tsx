'use client';

import { useState } from 'react';
import { useStore } from '@/lib/useStore';

export default function VentureList({
  isOpen,
  onClose,
  onSelectVenture,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenture: (id: string) => void;
}) {
  const { ventures, selectedVentureId } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');

  const filtered = ventures.filter((v) => {
    const matchesSearch = v.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'date') {
      return (
        new Date(b.startedDate).getTime() -
        new Date(a.startedDate).getTime()
      );
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    pivot: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    shutdown: 'bg-red-500/20 text-red-400 border-red-500/30',
    exited: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-screen w-[320px] bg-zinc-950 border-r border-white/10 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white">Ventures</h2>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <input
          type="text"
          placeholder="Search ventures..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30 placeholder-white/40"
        />
      </div>

      {/* Filter */}
      <div className="px-4 py-3 border-b border-white/10 space-y-2">
        <p className="text-xs font-mono text-white/60">FILTER</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
              filterStatus === null
                ? 'bg-white/20 text-white border border-white/40'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            ALL
          </button>
          {['active', 'pivot', 'paused', 'shutdown', 'exited'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                filterStatus === status
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {status.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-xs font-mono text-white/60 mb-2">SORT BY</p>
        <div className="flex gap-2">
          {['name', 'date', 'status'].map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort as any)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                sortBy === sort
                  ? 'bg-white/20 text-white border border-white/40'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {sort.slice(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Ventures List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-white/40 text-sm">
            No ventures found
          </div>
        ) : (
          sorted.map((venture) => (
            <div
              key={venture.id}
              onClick={() => {
                onSelectVenture(venture.id);
                onClose();
              }}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                selectedVentureId === venture.id
                  ? 'bg-white/10 border-white/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {venture.name}
                  </h3>
                  <p className="text-xs text-white/50 truncate mt-1">
                    {venture.industry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${
                    statusColors[venture.status] || 'bg-white/5 border-white/10'
                  }`}
                >
                  {venture.status.toUpperCase()}
                </span>
                <span className="text-xs text-white/40">
                  {new Date(venture.startedDate).getFullYear()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-white/10 p-4 text-xs text-white/60 space-y-1">
        <p>Total: {ventures.length}</p>
        <p>Showing: {sorted.length}</p>
      </div>
    </div>
  );
}
