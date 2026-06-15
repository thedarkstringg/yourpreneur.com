'use client';

import { useMemo, useState } from 'react';
import { Briefcase, CalendarDays, ChevronLeft, ChevronRight, Layers, Radio, Search, Target, TrendingUp } from 'lucide-react';
import { useStore, Venture } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';
import { colors, spacing, radius, typography, transitions, layout } from '@/styles/tokens';

export default function LeftPanel({
  ventures = [],
  selectedVentureId,
  onSelectVenture,
  onBack,
  isShowingDetail = false,
  collapsed = false,
  onToggleCollapsed,
}: {
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
  const { user, events, onNavigateToTarget, setSelectedVenture } = useStore();

  const userName = user?.fullName || 'Founder';

  const userInitials = useMemo(() => {
    return userName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase();
  }, [userName]);

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
          top: `${layout.header.height}px`,
          width: `${layout.sidebar.collapsedWidth}px`,
          height: `calc(100vh - ${layout.header.height}px)`,
          background: `${colors.background.base}`,
          borderRight: `1px solid ${colors.border.default}`,
          backdropFilter: 'blur(24px)',
          zIndex: layout.sidebar.zIndex,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 18,
          gap: 14,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <button onClick={onToggleCollapsed} style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: `1px solid ${colors.border.subtle}`,
          background: colors.background.surface,
          color: colors.text.secondary,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
        }} aria-label="Expand left panel">
          <ChevronRight size={15} />
        </button>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: radius.md,
          display: 'grid',
          placeItems: 'center',
          color: colors.background.base,
          background: colors.text.primary,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 900,
          fontSize: 13,
        }}>{ventures.length}</div>
        <div style={{
          writingMode: 'vertical-rl',
          color: colors.text.tertiary,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}>
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
        top: `${layout.header.height}px`,
        width: `${layout.sidebar.width}px`,
        height: `calc(100vh - ${layout.header.height}px)`,
        background: colors.background.base,
        borderRight: `1px solid ${colors.border.default}`,
        backdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: layout.sidebar.zIndex,
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        animation: 'slideInLeft 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 50ms both',
        boxShadow: '18px 0 42px rgba(0,0,0,0.2)',
      }}
    >
      {!isShowingDetail ? (
        <>
          <div style={{
            padding: `${22}px ${spacing.md}px ${18}px`,
            borderBottom: `1px solid ${colors.border.subtle}`,
          }}>
            <button onClick={onToggleCollapsed} style={{
              position: 'absolute',
              right: 12,
              top: 12,
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: `1px solid ${colors.border.subtle}`,
              background: colors.background.surface,
              color: colors.text.secondary,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }} aria-label="Collapse left panel">
              <ChevronLeft size={15} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.border.default}`,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 13,
                  color: colors.background.base,
                  background: colors.text.primary,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 900,
                }}
              >
                {userInitials}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15,
                    color: colors.text.primary,
                    fontWeight: 750,
                  }}
                >
                  {userName}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                  fontSize: 9,
                  color: colors.text.tertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.11em',
                }}>
                  <Radio size={10} strokeWidth={1.7} />
                  Portfolio live
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.sm,
              }}
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                const isPrompt = typeof stat.value === 'string' && stat.value.startsWith('Add');
                return (
                  <div key={stat.label} style={{
                    padding: spacing.sm,
                    borderRadius: radius.lg,
                    border: `1px solid ${colors.border.subtle}`,
                    background: colors.background.surface,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                      color: colors.text.tertiary,
                    }}>
                      <Icon size={12} strokeWidth={1.7} />
                      <span style={{
                        fontSize: 8,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}>{stat.label}</span>
                    </div>
                    <div
                      style={{
                        marginTop: 7,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: isPrompt ? 11 : 18,
                        color: isPrompt ? colors.text.secondary : colors.text.primary,
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

          <div style={{
            padding: `${spacing.lg}px ${spacing.lg}px ${spacing.sm}px`,
            borderBottom: `1px solid ${colors.border.subtle}`,
          }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                strokeWidth={1.6}
                style={{
                  position: 'absolute',
                  left: spacing.md,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: colors.text.tertiary,
                }}
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find a venture"
                style={{
                  width: '100%',
                  height: 36,
                  border: `1px solid ${colors.border.default}`,
                  borderRadius: radius.lg,
                  background: colors.background.surface,
                  color: colors.text.primary,
                  padding: `0 ${spacing.md}px 0 ${spacing.lg * 2}px`,
                  outline: 'none',
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          <div style={{ padding: spacing.lg, flex: 1, overflowY: 'auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              fontSize: 9,
              color: colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.11em',
              justifyContent: 'space-between',
              marginBottom: spacing.md,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Briefcase size={11} strokeWidth={1.7} />
                Portfolio
              </span>
              <span>{filteredVentures.length}/{ventures.length}</span>
            </div>

            {filteredVentures.length === 0 ? (
              <div style={{
                padding: '34px 10px',
                textAlign: 'center',
                color: colors.text.tertiary,
                fontSize: 12,
              }}>
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
                      gap: spacing.md,
                      minHeight: 58,
                      padding: `${spacing.xs}px ${spacing.sm}px`,
                      borderRadius: radius.lg,
                      cursor: 'pointer',
                      transition: `all ${transitions.default}`,
                      marginBottom: spacing.sm,
                      background: isSelected ? colors.background.elevated : colors.background.surface,
                      border: `1px solid ${isSelected ? colors.border.strong : colors.border.subtle}`,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      width: 34,
                      height: 34,
                      borderRadius: radius.lg,
                      display: 'grid',
                      placeItems: 'center',
                      background: venture.logoUrl ? `center / contain no-repeat url(${venture.logoUrl})` : venture.color ? `linear-gradient(145deg, ${venture.color}, ${colors.text.primary})` : colors.text.primary,
                      backgroundColor: venture.logoUrl ? 'transparent' : undefined,
                      boxShadow: !venture.logoUrl && venture.color ? `0 0 22px ${venture.color}33` : 'none',
                    }}>{!venture.logoUrl && venture.name.slice(0, 1).toUpperCase()}</span>
                    <span style={{ minWidth: 0 }}>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: 13,
                          color: isSelected ? colors.text.primary : colors.text.primary,
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
                          marginTop: 3,
                          fontSize: 9,
                          color: venture.industry ? colors.text.tertiary : colors.text.disabled,
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
                    <span style={{
                      border: `1px solid ${colors.status[venture.status as keyof typeof colors.status] || colors.text.tertiary}`,
                      color: colors.status[venture.status as keyof typeof colors.status] || colors.text.tertiary,
                      borderRadius: '999px',
                      padding: `3px 7px`,
                      fontSize: 7,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      maxWidth: 70,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{venture.status}</span>
                  </button>
                );
              })
            )}
          </div>

          <div
            style={{
              padding: `${spacing.lg}px ${spacing.lg}px ${spacing.lg * 1.5}px`,
              borderTop: `1px solid ${colors.border.subtle}`,
              background: colors.background.surface,
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              color: colors.text.tertiary,
            }}>
              <TrendingUp size={13} strokeWidth={1.7} />
              <span style={{
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {events.length} events total
              </span>
            </div>
            <div style={{
              marginTop: 9,
              color: colors.text.secondary,
              fontSize: 12,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {lastEntry ? `Last activity: ${getRelativeDate(new Date(lastEntry.eventDate))}` : 'Add the first event to activate the feed.'}
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: spacing.lg }}>
          <button onClick={onBack} style={{
            background: 'none',
            border: 'none',
            color: colors.text.secondary,
            cursor: 'pointer',
            fontSize: 12,
          }}>
            Back to portfolio
          </button>
          <div style={{
            color: colors.text.secondary,
            marginTop: 18,
          }}>Venture detail</div>
        </div>
      )}
    </div>
  );
}

const eyebrowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.xs,
  fontSize: 9,
  color: colors.text.tertiary,
  textTransform: 'uppercase',
  letterSpacing: '0.11em',
};

const statCardStyle: React.CSSProperties = {
  padding: spacing.sm,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border.subtle}`,
  background: colors.background.surface,
};

const logoStyle = (color?: string, logoUrl?: string): React.CSSProperties => ({
  width: 34,
  height: 34,
  borderRadius: radius.lg,
  display: 'grid',
  placeItems: 'center',
  background: logoUrl ? `center / contain no-repeat url(${logoUrl})` : color ? `linear-gradient(145deg, ${color}, ${colors.text.primary})` : colors.text.primary,
  backgroundColor: logoUrl ? 'transparent' : undefined,
  color: colors.background.base,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 900,
  boxShadow: !logoUrl && color ? `0 0 22px ${color}33` : 'none',
});

const statusStyle = (status: Venture['status']): React.CSSProperties => {
  const accent: Record<Venture['status'], string> = {
    active: colors.status.active,
    stealth: colors.accent.purple,
    graveyard: colors.text.secondary,
    pivot: colors.status.pivot,
    paused: colors.text.secondary,
    shutdown: colors.status.failed,
    exited: colors.accent.purple,
    archived: colors.text.secondary,
    acquired: colors.status.acquired,
    failed: colors.status.failed,
  };

  return {
    border: `1px solid ${accent[status]}`,
    color: accent[status],
    borderRadius: '999px',
    padding: `3px 7px`,
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    maxWidth: 70,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
};

const collapseButtonStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: `1px solid ${colors.border.subtle}`,
  background: colors.background.surface,
  color: colors.text.secondary,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const railMarkStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: radius.md,
  display: 'grid',
  placeItems: 'center',
  color: colors.background.base,
  background: colors.text.primary,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 900,
  fontSize: 13,
};
