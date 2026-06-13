'use client';

import { Activity, Bot, Cable, ChevronLeft, ChevronRight, CircleDot, Database, Edit3, Flame, Radio, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStore, Venture } from '@/lib/useStore';
import { colors, spacing, radius, layout, transitions } from '@/styles/tokens';

export default function RightPanel({
  ventures = [],
  collapsed = false,
  onToggleCollapsed,
}: {
  ventures?: Venture[];
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const { events, addEvent } = useStore();

  const allEvents = events
    .map((event) => {
      const venture = ventures.find((item) => item.id === event.ventureId);
      return {
        ...event,
        title: cleanEventTitle(event.title),
        ventureName: venture?.name || 'Linked venture missing',
        color: venture?.color,
        logoUrl: venture?.logoUrl,
        source: venture?.source || 'manual',
      };
    })
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, 8);

  const today = new Date();
  const eightWeeksAgo = new Date(today.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);
  const weekCounts = Array(8).fill(0);

  events.forEach((event) => {
    const eventDate = new Date(event.eventDate);
    if (eventDate >= eightWeeksAgo && eventDate <= today) {
      const weeksAgo = Math.floor((today.getTime() - eventDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo < 8) weekCounts[7 - weeksAgo]++;
    }
  });

  const connectedVentures = ventures.filter((venture) => venture.source && venture.source !== 'manual');
  const automatedEvents = allEvents.filter((event) => event.source !== 'manual').length;
  const activeVentures = ventures.filter((venture) => venture.status === 'active' || venture.status === 'pivot' || venture.status === 'stealth');
  const totalBurn = activeVentures.reduce((sum, venture) => sum + (venture.burnRate || 0), 0);
  const shortestRunway = activeVentures.reduce<number | null>((min, venture) => {
    if (!venture.runwayMonths) return min;
    return min === null ? venture.runwayMonths : Math.min(min, venture.runwayMonths);
  }, null);
  const syncMilestone = () => {
    const target = ventures.find((venture) => venture.source === 'github') || ventures[0];
    if (!target) return;
    addEvent({
      id: `auto-${Date.now()}`,
      ventureId: target.id,
      type: 'milestone',
      title: target.source === 'github' ? 'GitHub 100 Stars' : 'Product Hunt Launch',
      eventDate: new Date().toISOString().split('T')[0],
      impact: 'high',
      mood: 'energized',
      triggerType: 'external',
      notes: 'Auto-synced from Builder Stack.',
    });
  };

  if (collapsed) {
    return (
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: `${layout.header.height}px`,
          width: `${layout.sidebar.collapsedWidth}px`,
          height: `calc(100vh - ${layout.header.height}px)`,
          background: colors.background.base,
          borderLeft: `1px solid ${colors.border.default}`,
          backdropFilter: 'blur(22px)',
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
        }} aria-label="Expand right panel">
          <ChevronLeft size={15} />
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
        }}>{allEvents.length}</div>
        <div style={{
          writingMode: 'vertical-rl',
          color: colors.text.tertiary,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}>
          Live feed
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: `${layout.header.height}px`,
        width: 238,
        height: `calc(100vh - ${layout.header.height}px)`,
        background: colors.background.base,
        borderLeft: `1px solid ${colors.border.default}`,
        backdropFilter: 'blur(22px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: layout.sidebar.zIndex,
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        animation: 'slideInRight 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 50ms both',
      }}
    >
      <div
        style={{
          padding: `${18}px ${spacing.lg}px ${14}px`,
          borderBottom: `1px solid ${colors.border.subtle}`,
          position: 'relative',
        }}
      >
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
        }} aria-label="Collapse right panel">
          <ChevronRight size={15} />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          fontSize: 9,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}>
          <Activity size={12} strokeWidth={1.7} />
          Live feed
        </div>
        <div
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.sm,
          }}
        >
          <MiniMetric icon={Radio} value={connectedVentures.length} label="Synced" />
          <MiniMetric icon={Bot} value={automatedEvents} label="Auto" />
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: `${spacing.md}px ${spacing.xs}px`,
        maxHeight: 'calc(100vh - 200px)',
        scrollBehavior: 'smooth',
      }}>
        {allEvents.length === 0 ? (
          <div
            style={{
              padding: '42px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <CircleDot size={34} strokeWidth={1.2} style={{
              color: colors.text.disabled,
              marginBottom: 12,
            }} />
            <div style={{
              fontSize: 12,
              color: colors.text.secondary,
              fontWeight: 700,
            }}>No activity yet</div>
            <div style={{
              fontSize: 10,
              color: colors.text.tertiary,
              marginTop: 5,
              lineHeight: 1.5,
            }}>
              Log a launch, pivot, funding note, or lesson to populate this stream.
            </div>
          </div>
        ) : (
          allEvents.map((event) => {
            const automated = event.source !== 'manual';
            return (
              <button
                key={event.id}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  border: `1px solid ${colors.border.subtle}`,
                  borderRadius: radius.lg,
                  background: colors.background.surface,
                  cursor: 'pointer',
                  transition: `background ${transitions.default}`,
                  display: 'grid',
                  gridTemplateColumns: '30px 1fr',
                  gap: spacing.md,
                  alignItems: 'start',
                  marginBottom: spacing.sm,
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 30,
                  height: 30,
                  borderRadius: radius.md,
                  display: 'grid',
                  placeItems: 'center',
                  color: colors.background.base,
                  fontWeight: 900,
                  background: event.logoUrl ? `center / cover no-repeat url(${event.logoUrl})` : event.color ? `linear-gradient(145deg, ${event.color}, ${colors.text.primary})` : colors.text.primary,
                  flexShrink: 0,
                }}>{!event.logoUrl && event.ventureName.slice(0, 1).toUpperCase()}</span>
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing.sm,
                      fontSize: 9,
                      color: colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>{event.ventureName}</span>
                    {automated ? <Database size={11} strokeWidth={1.7} /> : <Edit3 size={10} strokeWidth={1.7} />}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: 4,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 12,
                      color: colors.text.secondary,
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.title}
                  </span>
                  <span style={{
                    display: 'block',
                    marginTop: 5,
                    fontSize: 9,
                    color: colors.text.disabled,
                  }}>
                    {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' | '}
                    {automated ? `via ${event.source}` : 'manual'}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>

      <div
        style={{
          padding: spacing.lg,
          borderTop: `1px solid ${colors.border.subtle}`,
          background: colors.background.surface,
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          fontSize: 9,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}>
          <Flame size={12} strokeWidth={1.7} />
          Venture vitals
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.sm,
          marginTop: 12,
          marginBottom: 18,
        }}>
          <MiniMetric icon={Flame} value={Math.round(totalBurn / 1000)} label="Burn $k" />
          <MiniMetric icon={Activity} value={shortestRunway ?? 0} label="Runway mo" />
        </div>
        <button onClick={syncMilestone} style={{
          width: '100%',
          height: 32,
          borderRadius: '999px',
          border: `1px solid ${colors.border.default}`,
          background: colors.background.base,
          color: colors.text.secondary,
          cursor: 'pointer',
          fontSize: 9,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          transition: `background ${transitions.default}`,
        }}>
          Auto-sync milestone
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          fontSize: 9,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}>
          <Zap size={12} strokeWidth={1.7} />
          Momentum
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          height: 46,
          gap: spacing.xs,
          marginTop: 12,
          marginBottom: 10,
        }}>
          {weekCounts.map((count, index) => (
            <div
              key={index}
              title={`${count} events`}
              style={{
                flex: 1,
                height: count > 0 ? `${Math.max(8, (count / Math.max(...weekCounts, 1)) * 46)}px` : 3,
                borderRadius: '999px',
                background: count > 0 ? colors.text.secondary : colors.border.subtle,
              }}
            />
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 7,
          color: colors.text.disabled,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          <span>8w ago</span>
          <span>now</span>
        </div>
        <div style={{
          marginTop: 12,
          display: 'flex',
          gap: spacing.xs,
          color: colors.text.tertiary,
          fontSize: 9,
          lineHeight: 1.4,
        }}>
          <Cable size={12} strokeWidth={1.7} style={{ flexShrink: 0 }} />
          Automated markers are separated from manual notes so founders can trust what came from integrations.
        </div>
      </div>
    </div>
  );
}

function cleanEventTitle(title: string) {
  return title.replace(/\bfucked\s*up\b/gi, 'Needs review').replace(/\bfuckedup\b/gi, 'Needs review');
}

function MiniMetric({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
  return (
    <div style={{
      border: `1px solid ${colors.border.subtle}`,
      borderRadius: radius.lg,
      padding: spacing.sm,
      background: colors.background.base,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        color: colors.text.tertiary,
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        <Icon size={11} strokeWidth={1.7} />
        {label}
      </div>
      <div style={{
        marginTop: 7,
        color: colors.text.secondary,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 20,
        fontWeight: 800,
      }}>
        {value}
      </div>
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
  letterSpacing: '0.12em',
};

const logoStyle = (color?: string, logoUrl?: string): React.CSSProperties => ({
  width: 30,
  height: 30,
  borderRadius: radius.md,
  display: 'grid',
  placeItems: 'center',
  color: colors.background.base,
  fontWeight: 900,
  background: logoUrl ? `center / cover no-repeat url(${logoUrl})` : color ? `linear-gradient(145deg, ${color}, ${colors.text.primary})` : colors.text.primary,
  flexShrink: 0,
});

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

const syncButtonStyle: React.CSSProperties = {
  width: '100%',
  height: 32,
  borderRadius: '999px',
  border: `1px solid ${colors.border.default}`,
  background: colors.background.base,
  color: colors.text.secondary,
  cursor: 'pointer',
  fontSize: 9,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 18,
  transition: `background ${transitions.default}`,
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
