'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClipboardList,
  Command,
  CreditCard,
  History,
  LogOut,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  User,
  Zap,
} from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';

export default function TopBar({
  onYearChange,
  onNewVenture,
  onTaskCanvas,
  onHelpClick,
  onFitClick,
  currentYear = 2024,
  zoomLevel = 100,
}: {
  onYearChange?: (year: number) => void;
  onNewVenture?: () => void;
  onTaskCanvas?: () => void;
  onHelpClick?: () => void;
  onFitClick?: () => void;
  currentYear?: number;
  zoomLevel?: number;
}) {
  const years = [2022, 2023, 2024, 2025, 2026];
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSyncHistoryOpen, setIsSyncHistoryOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('Synced 2m ago');
  const [publicProfile, setPublicProfile] = useState(false);
  const { ventures, events, setSelectedVenture, onNavigateToTarget, onNavigateToYear, setZoom } = useStore();

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return ventures
      .filter((venture) =>
        [venture.name, venture.industry, venture.description, venture.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized))
      )
      .slice(0, 5);
  }, [query, ventures]);

  const unreadCount = useMemo(() => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    return events.filter(e => new Date(e.eventDate) > twentyFourHoursAgo).length;
  }, [events]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-account-menu]')) setIsAccountOpen(false);
      if (!target.closest('[data-sync-menu]')) setIsSyncHistoryOpen(false);
    };

    const handleSlash = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      event.preventDefault();
      document.getElementById('venture-search')?.focus();
    };

    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleSlash);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleSlash);
    };
  }, []);

  const focusVenture = (ventureId: string) => {
    const layout = calculateLayout(ventures);
    const position = layout.positions.get(ventureId);
    setSelectedVenture(ventureId);
    setQuery('');
    if (position) {
      onNavigateToTarget?.(position.x + 110, position.y + 60, 1);
    }
  };

  const handleYearClick = (year: number) => {
    onYearChange?.(year);
    onNavigateToYear?.(year);
    window.dispatchEvent(new CustomEvent('flash-year-watermark', { detail: { year } }));
  };

  const shiftYear = (direction: -1 | 1) => {
    const index = years.indexOf(currentYear);
    const nextYear = years[Math.max(0, Math.min(years.length - 1, index + direction))] ?? currentYear;
    handleYearClick(nextYear);
  };

  const handleZoomReset = () => {
    setZoom(1);
    onFitClick?.();
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#0c0a0a]/76 border-b border-white/10 backdrop-blur-3xl grid grid-cols-[250px_1fr_auto] items-center px-6 gap-6 z-[100] animate-in slide-in-from-top duration-400">
      {/* Brand & Status */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white text-[#0c0a0a] flex items-center justify-center font-display font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Y
        </div>
        <div className="min-w-0">
          <div className="text-sm font-display font-bold text-white leading-tight truncate">yourpreneur canvas</div>
          <div className="flex items-center gap-1.5 text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1 truncate">
            <Clock size={10} />
            {notice}
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => shiftYear(-1)} className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/5 max-w-[400px] w-full">
          {years.map((year) => {
            const isActive = year === currentYear;
            return (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={`flex-1 h-8 rounded-full text-[11px] font-bold transition-all relative ${
                  isActive ? 'bg-white text-[#0c0a0a] shadow-lg' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {year}
                {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />}
              </button>
            );
          })}
        </div>

        <button onClick={() => shiftYear(1)} className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            id="venture-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full h-9 bg-white/5 border border-white/10 rounded-full pl-9 pr-4 text-xs text-white outline-none focus:border-white/20 transition-all"
          />
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          <button 
            onClick={handleZoomReset}
            className="text-[10px] text-white/30 font-mono hover:text-white transition-colors w-10 text-right"
          >
            {Math.round(zoomLevel)}%
          </button>

          <div className="relative" data-sync-menu>
            <button 
              onClick={() => setIsSyncHistoryOpen(!isSyncHistoryOpen)}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RotateCcw size={14} />
            </button>
            {isSyncHistoryOpen && (
              <div className="absolute right-0 top-10 w-48 bg-[#0c0a0a] border border-white/10 rounded-xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                 <div className="text-[10px] text-white/30 uppercase tracking-widest px-2 py-1 mb-1">Last 5 Syncs</div>
                 {['GitHub (2m ago)', 'Notion (1h ago)', 'Linear (4h ago)', 'Stripe (12h ago)', 'Manual (1d ago)'].map(s => (
                   <div key={s} className="px-2 py-1.5 text-[11px] text-white/60 hover:bg-white/5 rounded-lg cursor-default">
                     {s}
                   </div>
                 ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              setPublicProfile(!publicProfile);
              setNotice(publicProfile ? 'Profile private' : 'Profile: /founder-92');
            }}
            className={`flex items-center gap-2 px-3 h-8 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
              publicProfile ? 'bg-status-active text-[#0c0a0a] border-status-active' : 'bg-white/5 text-white/40 border-white/10'
            }`}
          >
            <Share2 size={12} />
            {publicProfile ? 'Public' : 'Private'}
          </button>

          <div className="relative">
            <button className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all">
              <Bell size={14} />
            </button>
            {unreadCount > 0 && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-status-active rounded-full border-2 border-[#0c0a0a]" />}
          </div>

          <button onClick={onNewVenture} className="h-8 px-4 rounded-full bg-white text-[#0c0a0a] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all">
            New Venture
          </button>

          <div className="relative" data-account-menu>
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white/80 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <User size={14} />
            </button>
            {isAccountOpen && (
              <div className="absolute right-0 top-10 w-48 bg-[#0c0a0a] border border-white/10 rounded-xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                 <div className="px-2 py-2 border-b border-white/10 mb-2">
                    <div className="text-[11px] font-bold text-white">Founder</div>
                    <div className="text-[9px] text-white/30">Founder Tier Plan</div>
                 </div>
                 {['Profile', 'Settings', 'Billing', 'Sign Out'].map(item => (
                   <button key={item} className="w-full text-left px-2 py-1.5 text-[11px] text-white/60 hover:bg-white/5 rounded-lg">
                     {item}
                   </button>
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
