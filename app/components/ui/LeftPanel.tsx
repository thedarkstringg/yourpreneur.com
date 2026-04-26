'use client';

import { Briefcase, TrendingUp } from 'lucide-react';
import { useStore } from '@/lib/useStore';
import { calculateLayout } from '@/lib/layoutAlgorithm';

export default function LeftPanel({
  userName = 'Founder',
  ventures = [],
  selectedVentureId,
  onSelectVenture,
  onBack,
  isShowingDetail = false,
}: {
  userName?: string;
  ventures?: any[];
  selectedVentureId?: string | null;
  onSelectVenture?: (id: string) => void;
  onBack?: () => void;
  isShowingDetail?: boolean;
}) {
  const { onNavigateToTarget } = useStore();

  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const activeVentures = ventures.filter((v) => v.status === 'active').length;
  const totalEvents = ventures.reduce((sum, v) => sum + (v.events?.length || 0), 0);

  // Fix days calculation - handle null/undefined startDate
  const earliestVenture = ventures.length > 0 ? ventures.reduce((earliest, v) => {
    const vDate = new Date(v.startDate || Date.now());
    const eDate = new Date(earliest.startDate || Date.now());
    return vDate < eDate ? v : earliest;
  }) : null;

  const daysSinceFirst = earliestVenture && earliestVenture.startDate
    ? Math.floor((Date.now() - new Date(earliestVenture.startDate).getTime()) / 86400000)
    : 0;

  // Calculate last entry date
  const allEvents = ventures.flatMap((v) => v.events || []);
  const lastEntry = allEvents.length > 0
    ? new Date(allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || Date.now())
    : null;

  const getRelativeDate = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}m ago`;
  };

  const handleVentureClick = (ventureId: string) => {
    onSelectVenture?.(ventureId);

    // Navigate to the venture on canvas
    const layout = calculateLayout(ventures);
    const position = layout.positions.get(ventureId);
    if (position && onNavigateToTarget) {
      onNavigateToTarget(position.x + 110, position.y + 60);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: '48px',
        width: '240px',
        height: 'calc(100vh - 48px)',
        background: 'rgba(10,8,8,0.85)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 90,
        fontFamily: "'Space Grotesk', sans-serif",
        overflowY: 'auto',
        animation: 'slideInLeft 450ms cubic-bezier(0.34, 1.56, 0.64, 1) 50ms both',
      }}
    >
      {!isShowingDetail ? (
        <>
          {/* TOP SECTION — User identity */}
          <div style={{ padding: '24px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                }}
              >
                {userInitials}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '16px',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                >
                  {userName}
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.25)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  VOL. 01
                </div>
              </div>
            </div>
            <div
              style={{
                height: '1px',
                background: 'rgba(255,255,255,0.06)',
                marginTop: '10px',
              }}
            />
          </div>

          {/* MIDDLE SECTION — Portfolio snapshot */}
          <div style={{ padding: '20px', flex: 1 }}>
            <div
              style={{
                fontSize: '8px',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Briefcase size={10} strokeWidth={1.5} />
              PORTFOLIO
            </div>

            {ventures.map((venture) => (
              <div
                key={venture.id}
                onClick={() => handleVentureClick(venture.id)}
                style={{
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  marginBottom: '4px',
                  background: selectedVentureId === venture.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseOut={(e) => {
                  if (selectedVentureId !== venture.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.4)',
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '14px',
                    color: selectedVentureId === venture.id ? '#ffffff' : 'rgba(255,255,255,0.7)',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {venture.name}
                </div>
                <div
                  style={{
                    fontSize: '7px',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    borderRadius: '999px',
                    border: '0.5px solid rgba(255,255,255,0.2)',
                    padding: '2px 6px',
                  }}
                >
                  {venture.status}
                </div>
              </div>
            ))}

            <div
              style={{
                fontSize: '8px',
                color: 'rgba(255,255,255,0.18)',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {ventures.length} ventures · {totalEvents} events
            </div>
          </div>

          {/* BOTTOM SECTION — Quick stats */}
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {[
              { value: ventures.length, label: 'Total Ventures' },
              { value: activeVentures, label: 'Active Now' },
              { value: daysSinceFirst === 0 ? '—' : daysSinceFirst, label: 'Days In' },
              { value: lastEntry ? getRelativeDate(lastEntry) : '—', label: 'Last Entry' },
            ].map((stat, idx) => (
              <div key={idx} style={{ marginBottom: idx < 3 ? '16px' : 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                  }}
                >
                  <TrendingUp size={10} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.25)' }} />
                  <div
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '28px',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '8px',
                    color: 'rgba(255,255,255,0.22)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* DETAIL VIEW */}
          <div style={{ padding: '20px' }}>
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: '12px',
                marginBottom: '16px',
                transition: 'color 150ms',
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              ← All Ventures
            </button>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}>Venture detail</div>
          </div>
        </>
      )}
    </div>
  );
}
