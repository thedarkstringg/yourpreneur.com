'use client';

import { Activity, Bot, Cable, ChevronLeft, ChevronRight, CircleDot, Database, Edit3, Flame, Radio, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useStore, Venture } from '@/lib/useStore';

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
          top: '64px',
          width: '48px',
          height: 'calc(100vh - 64px)',
          background: 'rgba(5,5,5,0.72)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(22px)',
          zIndex: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '18px',
          gap: '14px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <button onClick={onToggleCollapsed} style={collapseButtonStyle} aria-label="Expand right panel">
          <ChevronLeft size={15} />
        </button>
        <div style={railMarkStyle}>{allEvents.length}</div>
        <div style={{ writingMode: 'vertical-rl', color: 'rgba(255,255,255,0.34)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
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
        top: '64px',
        width: '238px',
        height: 'calc(100vh - 64px)',
        background: 'rgba(5,5,5,0.66)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(22px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        animation: 'slideInRight 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 50ms both',
      }}
    >
      <div
        style={{
          padding: '18px 16px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
        }}
      >
        <button onClick={onToggleCollapsed} style={{ ...collapseButtonStyle, position: 'absolute', right: '12px', top: '12px' }} aria-label="Collapse right panel">
          <ChevronRight size={15} />
        </button>
        <div style={eyebrowStyle}>
          <Activity size={12} strokeWidth={1.7} />
          Live feed
        </div>
        <div
          style={{
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          <MiniMetric icon={Radio} value={connectedVentures.length} label="Synced" />
          <MiniMetric icon={Bot} value={automatedEvents} label="Auto" />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
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
            <CircleDot size={34} strokeWidth={1.2} style={{ color: 'rgba(255,255,255,0.14)', marginBottom: '12px' }} />
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>No activity yet</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginTop: '5px', lineHeight: 1.5 }}>
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
                  padding: '10px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.028)',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                  display: 'grid',
                  gridTemplateColumns: '30px 1fr',
                  gap: '10px',
                  alignItems: 'start',
                  marginBottom: '8px',
                  textAlign: 'left',
                }}
              >
                <span style={logoStyle(event.color, event.logoUrl)}>{!event.logoUrl && event.ventureName.slice(0, 1).toUpperCase()}</span>
                <span style={{ minWidth: 0 }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.38)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.ventureName}</span>
                    {automated ? <Database size={11} strokeWidth={1.7} /> : <Edit3 size={10} strokeWidth={1.7} />}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.78)',
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.title}
                  </span>
                  <span style={{ display: 'block', marginTop: '5px', fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}>
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
          padding: '16px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        <div style={eyebrowStyle}>
          <Flame size={12} strokeWidth={1.7} />
          Venture vitals
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', marginBottom: '18px' }}>
          <MiniMetric icon={Flame} value={Math.round(totalBurn / 1000)} label="Burn $k" />
          <MiniMetric icon={Activity} value={shortestRunway ?? 0} label="Runway mo" />
        </div>
        <button onClick={syncMilestone} style={syncButtonStyle}>
          Auto-sync milestone
        </button>
        <div style={eyebrowStyle}>
          <Zap size={12} strokeWidth={1.7} />
          Momentum
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '46px', gap: '4px', marginTop: '12px' }}>
          {weekCounts.map((count, index) => (
            <div
              key={index}
              title={`${count} events`}
              style={{
                flex: 1,
                height: count > 0 ? `${Math.max(8, (count / Math.max(...weekCounts, 1)) * 46)}px` : '3px',
                borderRadius: '999px',
                background: count > 0 ? 'rgba(255,255,255,0.66)' : 'rgba(255,255,255,0.12)',
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '7px', color: 'rgba(255,255,255,0.34)', fontSize: '9px', lineHeight: 1.4 }}>
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
    <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '9px', background: 'rgba(255,255,255,0.035)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,255,255,0.34)', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <Icon size={11} strokeWidth={1.7} />
        {label}
      </div>
      <div style={{ marginTop: '7px', color: 'rgba(255,255,255,0.88)', fontFamily: "'Montserrat', sans-serif", fontSize: '20px', fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
}

const eyebrowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '9px',
  color: 'rgba(255,255,255,0.36)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
};

const logoStyle = (color?: string, logoUrl?: string): React.CSSProperties => ({
  width: '30px',
  height: '30px',
  borderRadius: '9px',
  display: 'grid',
  placeItems: 'center',
  color: '#050505',
  fontWeight: 900,
  background: logoUrl ? `center / cover no-repeat url(${logoUrl})` : color ? `linear-gradient(145deg, ${color}, rgba(255,255,255,0.9))` : 'rgba(255,255,255,0.86)',
  flexShrink: 0,
});

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

const syncButtonStyle: React.CSSProperties = {
  width: '100%',
  height: '32px',
  borderRadius: '999px',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.055)',
  color: 'rgba(255,255,255,0.72)',
  cursor: 'pointer',
  fontSize: '9px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '18px',
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
