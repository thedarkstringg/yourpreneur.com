'use client';

import { Activity, Zap } from 'lucide-react';

export default function RightPanel({
  ventures = [],
}: {
  ventures?: any[];
}) {
  // Get last 8 events across all ventures, sorted by date
  const allEvents = ventures
    .flatMap((v) =>
      (v.events || []).map((e: any) => ({
        ...e,
        ventureName: v.name,
        logoUrl: v.logoUrl,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  // Calculate momentum (events per week for last 8 weeks)
  const today = new Date();
  const eightWeeksAgo = new Date(today.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

  const weekCounts = Array(8).fill(0);
  allEvents.forEach((event) => {
    const eventDate = new Date(event.date);
    if (eventDate >= eightWeeksAgo && eventDate <= today) {
      const weeksAgo = Math.floor((today.getTime() - eventDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (weeksAgo < 8) {
        weekCounts[7 - weeksAgo]++;
      }
    }
  });

  const thisWeekEvents = weekCounts[7];

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: '48px',
        width: '200px',
        height: 'calc(100vh - 48px)',
        background: 'rgba(10,8,8,0.7)',
        borderLeft: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        fontFamily: "'Space Grotesk', sans-serif",
        overflowY: 'auto',
        animation: 'slideInRight 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 50ms both',
      }}
    >
      {/* TOP: Label */}
      <div
        style={{
          fontSize: '8px',
          color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          padding: '20px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Activity size={10} strokeWidth={1.5} />
        LIVE FEED
      </div>

      {/* ACTIVITY FEED */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {allEvents.length === 0 ? (
          <div
            style={{
              padding: '40px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontFamily: "'Montserrat', sans-serif",
                color: 'rgba(255,255,255,0.08)',
                marginBottom: '8px',
              }}
            >
              ◎
            </div>
            <div
              style={{
                fontSize: '8px',
                color: 'rgba(255,255,255,0.15)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Log your first event
            </div>
            <button
              style={{
                marginTop: '12px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '7px',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'all 150ms',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              }}
            >
              → ADD EVENT
            </button>
          </div>
        ) : (
          allEvents.map((event, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
                transition: 'background 150ms',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Logo */}
              {event.logoUrl ? (
                <img
                  src={event.logoUrl}
                  alt={event.ventureName}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '3px',
                    objectFit: 'cover',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: '2px',
                  }}
                >
                  {event.ventureName}
                </div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.65)',
                    marginBottom: '2px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {event.title}
                </div>
                <div
                  style={{
                    fontSize: '7px',
                    color: 'rgba(255,255,255,0.2)',
                  }}
                >
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOTTOM: Momentum indicator */}
      {allEvents.length > 0 && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div
            style={{
              fontSize: '8px',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Zap size={10} strokeWidth={1.5} />
            MOMENTUM
          </div>

          {/* Bar chart - last 8 weeks */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '40px',
              gap: '3px',
              marginBottom: '8px',
            }}
          >
            {weekCounts.map((count, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: count > 0 ? (count / Math.max(...weekCounts, 1)) * 40 + 'px' : '2px',
                  background: count > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                  borderRadius: '2px',
                  transition: 'background 150ms',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.7)')}
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    count > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)')
                }
              />
            ))}
          </div>

          {thisWeekEvents > 0 && (
            <div
              style={{
                fontSize: '8px',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              {thisWeekEvents} event{thisWeekEvents !== 1 ? 's' : ''} this week
            </div>
          )}
        </div>
      )}
    </div>
  );
}
