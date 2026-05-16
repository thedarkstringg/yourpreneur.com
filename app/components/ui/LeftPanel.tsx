'use client';

import { useMemo, useState } from 'react';
import { Briefcase, CalendarDays, ChevronLeft, ChevronRight, Layers, Radio, Search, Target, TrendingUp } from 'lucide-react';
import { useStore, Venture } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';

export default function LeftPanel({
  userName = 'Founder',
  ventures = [],
  selectedVentureId,
  onSelectVenture,
  onBack,
  isShowingDetail = false,
  collapsed = false,
  onToggleCollapsed,
}: {
  userName?: string;
  ventures?: Venture[];
  selectedVentureId?: string | null;
  onSelectVenture?: (id: string) => void;
  onBack?: () => void;
  isShowingDetail?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [now] = useState(() => Date.now());
  const { events, onNavigateToTarget, setSelectedVenture } = useStore();

  const userInitials = userName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const activeVentures = ventures.filter((venture) => venture.status === 'active').length;
  const industries = new Set(ventures.map((venture) => venture.industry).filter(Boolean));
  const earliestVenture = ventures
    .filter((venture) => venture.startedDate)
    .sort((a, b) => new Date(a.startedDate).getTime() - new Date(b.startedDate).getTime())[0];
  const daysSinceFirst = earliestVenture
    ? Math.max(1, Math.floor((now - new Date(earliestVenture.startedDate).getTime()) / 86400000))
    : null;

  const lastEntry = events.length
    ? events
        .slice()
        .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())[0]
    : null;

  const filteredVentures = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return ventures;
    return ventures.filter((venture) =>
      [venture.name, venture.industry, venture.description, venture.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized))
    );
  }, [searchTerm, ventures]);

  const getRelativeDate = (date: Date) => {
    const days = Math.floor((now - date.getTime()) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}m ago`;
  };

  const handleVentureClick = (ventureId: string) => {
    onSelectVenture?.(ventureId);
    setSelectedVenture(ventureId);

    const layout = calculateLayout(ventures);
    const position = layout.positions.get(ventureId);
    if (position) {
      onNavigateToTarget?.(position.x + 110, position.y + 60, 1);
    }
  };

  const stats = [
    { icon: Briefcase, value: ventures.length, label: 'Ventures' },
    { icon: Target, value: activeVentures, label: 'Active' },
    { icon: CalendarDays, value: daysSinceFirst ? daysSinceFirst.toLocaleString() : 'Add date', label: 'Days in' },
    { icon: Layers, value: industries.size || 'Add industry', label: 'Industries' },
  ];

  if (collapsed) {
    return (
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: '64px',
          width: '48px',
          height: 'calc(100vh - 64px)',
          background: 'rgba(5,5,5,0.72)',
          borderRight: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(24px)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '18px',
          gap: '14px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <button onClick={onToggleCollapsed} style={collapseButtonStyle} aria-label="Expand left panel">
          <ChevronRight size={15} />
        </button>
        <div style={railMarkStyle}>{ventures.length}</div>
        <div style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.34)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Portfolio
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: '64px',
        width: '282px',
        height: 'calc(100vh - 64px)',
        background: 'rgba(5,5,5,0.76)',
        borderRight: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        animation: 'slideInLeft 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 50ms both',
        boxShadow: '18px 0 42px rgba(0,0,0,0.2)',
      }}
    >
      {!isShowingDetail ? (
        <>
          <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={onToggleCollapsed} style={{ ...collapseButtonStyle, position: 'absolute', right: '12px', top: '12px' }} aria-label="Collapse left panel">
              <ChevronLeft size={15} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.16)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '14px',
                  color: '#050505',
                  background: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                }}
              >
                {userInitials}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '17px',
                    color: 'rgba(255,255,255,0.92)',
                    fontWeight: 750,
                  }}
                >
                  {userName}
                </div>
                <div style={eyebrowStyle}>
                  <Radio size={10} strokeWidth={1.7} />
                  Portfolio live
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '18px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                const isPrompt = typeof stat.value === 'string' && stat.value.startsWith('Add');
                return (
                  <div key={stat.label} style={statCardStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.33)' }}>
                      <Icon size={12} strokeWidth={1.7} />
                      <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</span>
                    </div>
                    <div
                      style={{
                        marginTop: '7px',
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: isPrompt ? '12px' : '20px',
                        color: isPrompt ? 'rgba(255,255,255,0.46)' : 'rgba(255,255,255,0.9)',
                        fontWeight: 800,
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                strokeWidth={1.6}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.32)' }}
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find a venture"
                style={{
                  width: '100%',
                  height: '36px',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.045)',
                  color: 'rgba(255,255,255,0.82)',
                  padding: '0 12px 0 35px',
                  outline: 'none',
                  fontSize: '12px',
                }}
              />
            </div>
          </div>

          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            <div style={{ ...eyebrowStyle, justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Briefcase size={11} strokeWidth={1.7} />
                Portfolio
              </span>
              <span>{filteredVentures.length}/{ventures.length}</span>
            </div>

            {filteredVentures.length === 0 ? (
              <div style={{ padding: '34px 10px', textAlign: 'center', color: 'rgba(255,255,255,0.34)', fontSize: '12px' }}>
                No ventures match that search.
              </div>
            ) : (
              filteredVentures.map((venture) => {
                const ventureEvents = events.filter((event) => event.ventureId === venture.id);
                const isSelected = selectedVentureId === venture.id;
                return (
                  <button
                    key={venture.id}
                    onClick={() => handleVentureClick(venture.id)}
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: '34px 1fr auto',
                      alignItems: 'center',
                      gap: '10px',
                      minHeight: '58px',
                      padding: '9px 10px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 150ms',
                      marginBottom: '8px',
                      background: isSelected ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.035)',
                      border: isSelected ? '1px solid rgba(255,255,255,0.24)' : '1px solid rgba(255,255,255,0.06)',
                      textAlign: 'left',
                    }}
                  >
                    <span style={logoStyle(venture.color, venture.logoUrl)}>{!venture.logoUrl && venture.name.slice(0, 1).toUpperCase()}</span>
                    <span style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: "'Montserrat', sans-serif",
                          fontSize: '13px',
                          color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.82)',
                          fontWeight: 750,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {venture.name}
                      </span>
                      <span
                        style={{
                          display: 'block',
                          marginTop: '3px',
                          fontSize: '9px',
                          color: venture.industry ? 'rgba(255,255,255,0.36)' : 'rgba(255,255,255,0.28)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {venture.industry || 'Add industry'} | {ventureEvents.length} {ventureEvents.length === 1 ? 'event' : 'events'} all-time
                      </span>
                    </span>
                    <span style={statusStyle(venture.status)}>{venture.status}</span>
                  </button>
                );
              })
            )}
          </div>

          <div
            style={{
              padding: '16px 18px 18px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.025)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.38)' }}>
              <TrendingUp size={13} strokeWidth={1.7} />
              <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {events.length} events total
              </span>
            </div>
            <div style={{ marginTop: '9px', color: 'rgba(255,255,255,0.66)', fontSize: '12px' }}>
              {lastEntry ? `Last activity: ${getRelativeDate(new Date(lastEntry.eventDate))}` : 'Add the first event to activate the feed.'}
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: '20px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.62)', cursor: 'pointer', fontSize: '12px' }}>
            Back to portfolio
          </button>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '18px' }}>Venture detail</div>
        </div>
      )}
    </div>
  );
}

const eyebrowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '9px',
  color: 'rgba(255,255,255,0.34)',
  textTransform: 'uppercase',
  letterSpacing: '0.11em',
};

const statCardStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.07)',
  background: 'rgba(255,255,255,0.035)',
};

const logoStyle = (color?: string, logoUrl?: string): React.CSSProperties => ({
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  display: 'grid',
  placeItems: 'center',
  background: logoUrl ? `center / cover no-repeat url(${logoUrl})` : color ? `linear-gradient(145deg, ${color}, rgba(255,255,255,0.92))` : 'rgba(255,255,255,0.88)',
  color: '#050505',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 900,
  boxShadow: color ? `0 0 22px ${color}33` : 'none',
});

const statusStyle = (status: Venture['status']): React.CSSProperties => {
  const accent: Record<Venture['status'], string> = {
    active: 'rgba(130,255,190,0.72)',
    stealth: 'rgba(180,140,255,0.72)',
    graveyard: 'rgba(210,210,210,0.5)',
    pivot: 'rgba(255,218,138,0.78)',
    paused: 'rgba(255,255,255,0.5)',
    shutdown: 'rgba(255,170,170,0.58)',
    exited: 'rgba(210,190,255,0.76)',
    archived: 'rgba(210,210,210,0.54)',
    acquired: 'rgba(180,230,255,0.76)',
    failed: 'rgba(255,150,135,0.7)',
  };

  return {
    border: `1px solid ${accent[status]}`,
    color: accent[status],
    borderRadius: '999px',
    padding: '3px 7px',
    fontSize: '7px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    maxWidth: '70px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
};

const collapseButtonStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.11)',
  background: 'rgba(255,255,255,0.045)',
  color: 'rgba(255,255,255,0.58)',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const railMarkStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '9px',
  display: 'grid',
  placeItems: 'center',
  color: '#050505',
  background: 'rgba(255,255,255,0.88)',
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 900,
  fontSize: '13px',
};
