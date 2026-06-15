'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
  RotateCcw,
  Search,
  Share2,
  User,
} from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { useAuth } from '@/lib/useAuth';
import { calculateLayout } from '@/lib/layoutAlgorithm';
import { colors, spacing, layout, transitions } from '@/styles/tokens';

export default function TopBar({
  onYearChange,
  onNewVenture,
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
  const [publicProfile, setPublicProfile] = useState(false);
  
  const { 
    user, 
    ventures, 
    events, 
    setSelectedVenture, 
    onNavigateToTarget, 
    onNavigateToYear, 
    setZoom,
    syncStatus 
  } = useStore();
  const { logOut } = useAuth();
  const router = useRouter();

  const notice = useMemo(() => {
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'error') return 'Sync error';
    return 'Synced to Cloud';
  }, [syncStatus]);

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

  const handleSignOut = async () => {
    await logOut();
    router.push('/auth/signin');
  };

  const accountMenuItems = [
    { label: 'Profile', onClick: () => router.push('/profile') },
    { label: 'Settings', onClick: () => router.push('/settings') },
    { label: 'Billing', onClick: () => router.push('/billing') },
    { label: 'Sign Out', onClick: handleSignOut, danger: true },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: `${layout.header.height}px`,
      background: `${colors.background.base}/95`,
      borderBottom: `1px solid ${colors.border.default}`,
      backdropFilter: 'blur(48px)',
      display: 'grid',
      gridTemplateColumns: '250px 1fr auto',
      alignItems: 'center',
      padding: `0 ${spacing.lg}px`,
      gap: `${spacing.lg}px`,
      zIndex: layout.header.zIndex,
    }} className="animate-in slide-in-from-top duration-400">
      {/* Brand & Status */}
      <div className="flex items-center gap-4 min-w-0">
        <div style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 10,
          background: colors.text.primary,
          color: colors.background.base,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 900,
          fontSize: 16,
          boxShadow: `0 0 20px ${colors.accent.teal}26`,
        }}>
          Y
        </div>
        <div className="min-w-0">
          <div style={{
            fontSize: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            color: colors.text.primary,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>yourpreneur canvas</div>
          <div style={{
            fontSize: 10,
            color: colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            minWidth: 0,
          }}>
            <Clock size={10} className="flex-shrink-0" />
            <span className="truncate">{notice}</span>
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => shiftYear(-1)} className="btn-icon-sm flex-shrink-0">
          <ChevronLeft size={16} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: 4,
          borderRadius: 8,
          border: `1px solid ${colors.border.default}`,
          background: `${colors.background.surface}`,
          width: '100%',
          maxWidth: 320,
        }}>
          {years.map((year) => {
            const isActive = year === currentYear;
            return (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  transition: `all ${transitions.default}`,
                  background: isActive ? colors.text.primary : 'transparent',
                  color: isActive ? colors.background.base : colors.text.tertiary,
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {year}
                {isActive && <div style={{
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4,
                  height: 4,
                  background: colors.text.primary,
                  borderRadius: '50%',
                  boxShadow: `0 0 10px ${colors.text.primary}`,
                }} />}
              </button>
            );
          })}
        </div>

        <button onClick={() => shiftYear(1)} className="btn-icon-sm flex-shrink-0">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-2 justify-end">
        {/* Search */}
        <div className="relative w-56 flex-shrink-0">
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: colors.text.tertiary }} />
          <input
            id="venture-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            style={{
              width: '100%',
              height: 36,
              background: colors.background.surface,
              border: `1px solid ${colors.border.default}`,
              borderRadius: 8,
              paddingLeft: 36,
              paddingRight: 16,
              fontSize: 12,
              color: colors.text.primary,
              outline: 'none',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = colors.border.strong}
            onBlur={(e) => e.currentTarget.style.borderColor = colors.border.default}
          />
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2" style={{ borderLeft: `1px solid ${colors.border.default}`, paddingLeft: 12 }}>
          <button
            onClick={handleZoomReset}
            style={{
              height: 36,
              paddingLeft: 12,
              paddingRight: 12,
              borderRadius: 8,
              border: `1px solid ${colors.border.default}`,
              background: colors.background.surface,
              fontSize: 10,
              color: colors.text.tertiary,
              fontFamily: "'Monaco', monospace",
              cursor: 'pointer',
              transition: `color ${transitions.default}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.text.secondary}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.text.tertiary}
          >
            {Math.round(zoomLevel)}%
          </button>

          <div className="relative" data-sync-menu>
            <button
              onClick={() => setIsSyncHistoryOpen(!isSyncHistoryOpen)}
              className="btn-icon-sm flex-shrink-0"
            >
              <RotateCcw size={14} />
            </button>
            {isSyncHistoryOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 44,
                width: 192,
                background: colors.background.base,
                border: `1px solid ${colors.border.default}`,
                borderRadius: 12,
                padding: 8,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }} className="animate-in fade-in slide-in-from-top-2">
                 <div style={{
                   fontSize: 10,
                   color: colors.text.tertiary,
                   textTransform: 'uppercase',
                   letterSpacing: '0.08em',
                   paddingLeft: 8,
                   paddingRight: 8,
                   paddingTop: 4,
                   paddingBottom: 4,
                   marginBottom: 4,
                 }}>Sync Status</div>
                 <div style={{
                   paddingLeft: 8,
                   paddingRight: 8,
                   paddingTop: 6,
                   paddingBottom: 6,
                   fontSize: 11,
                   color: colors.text.secondary,
                   borderRadius: 8,
                 }}>
                   {notice}
                 </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setPublicProfile(!publicProfile);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 12,
              paddingRight: 12,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${publicProfile ? colors.text.primary : colors.border.default}`,
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 700,
              transition: `all ${transitions.default}`,
              flexShrink: 0,
              background: publicProfile ? colors.text.primary : colors.background.surface,
              color: publicProfile ? colors.background.base : colors.text.tertiary,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!publicProfile) e.currentTarget.style.color = colors.text.secondary;
            }}
            onMouseLeave={(e) => {
              if (!publicProfile) e.currentTarget.style.color = colors.text.tertiary;
            }}
          >
            <Share2 size={12} />
            {publicProfile ? 'Public' : 'Private'}
          </button>

          <div className="relative">
            <button className="btn-icon-sm flex-shrink-0">
              <Bell size={14} />
            </button>
            {unreadCount > 0 && <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 10,
              height: 10,
              background: colors.status.active,
              borderRadius: '50%',
              border: `2px solid ${colors.background.base}`,
            }} />}
          </div>

          <button onClick={onNewVenture} className="btn-primary flex-shrink-0">
            New Venture
          </button>

          <div className="relative" data-account-menu>
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="btn-icon-sm flex-shrink-0"
            >
              <User size={14} />
            </button>
            {isAccountOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 44,
                width: 192,
                background: colors.background.base,
                border: `1px solid ${colors.border.default}`,
                borderRadius: 12,
                padding: 8,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }} className="animate-in fade-in slide-in-from-top-2">
                 <div style={{
                   paddingLeft: 8,
                   paddingRight: 8,
                   paddingTop: 8,
                   paddingBottom: 8,
                   borderBottom: `1px solid ${colors.border.default}`,
                   marginBottom: 8,
                 }}>
                    <div style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.text.primary,
                    }}>{user?.fullName || 'Founder'}</div>
                    <div style={{
                      fontSize: 9,
                      color: colors.text.tertiary,
                      textTransform: 'capitalize',
                    }}>{user?.tier || 'Free'} Tier Plan</div>
                 </div>
                 {accountMenuItems.map(item => (
                   <button 
                     key={item.label} 
                     onClick={() => {
                       item.onClick();
                       setIsAccountOpen(false);
                     }}
                     style={{
                       width: '100%',
                       textAlign: 'left',
                       paddingLeft: 8,
                       paddingRight: 8,
                       paddingTop: 6,
                       paddingBottom: 6,
                       fontSize: 11,
                       color: item.danger ? colors.status.failed : colors.text.secondary,
                       borderRadius: 8,
                       background: 'transparent',
                       border: 'none',
                       cursor: 'pointer',
                     }}>
                     {item.label}
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
