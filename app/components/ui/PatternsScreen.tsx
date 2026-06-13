'use client';

import { Download, Share2, X } from 'lucide-react';
import { useMemo } from 'react';
import { useStore } from '@/lib/useStore';
import { colors, spacing, radius, typography, transitions } from '@/styles/tokens';

export default function PatternsScreen({ onClose }: { onClose: () => void }) {
  const { ventures, events } = useStore();

  const report = useMemo(() => {
    const year = 2024;
    const yearEvents = events
      .filter((event) => new Date(event.eventDate).getFullYear() === year)
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    const monthCounts = Array.from({ length: 12 }, (_, month) => ({
      month,
      count: yearEvents.filter((event) => new Date(event.eventDate).getMonth() === month).length,
    }));
    const bestMonth = monthCounts.slice().sort((a, b) => b.count - a.count)[0];
    const pivots = yearEvents.filter((event) => event.type === 'pivot' || event.type === 'decision').length;
    const ventureIds = new Set(yearEvents.map((event) => event.ventureId));
    const strategicPivots = Math.max(pivots, ventures.filter((venture) => venture.status === 'pivot').length);
    const highImpact = yearEvents.filter((event) => event.impact === 'high' || event.impact === 'critical').length;

    return {
      year,
      events: yearEvents,
      bestMonth,
      monthCounts,
      venturesStarted: ventures.filter((venture) => new Date(venture.startedDate).getFullYear() === year).length || ventureIds.size,
      milestones: yearEvents.length,
      strategicPivots,
      highImpact,
    };
  }, [events, ventures]);

  const maxMonth = Math.max(...report.monthCounts.map((item) => item.count), 1);
  const monthLabel = new Date(report.year, report.bestMonth.month).toLocaleString('en-US', { month: 'long' });

  return (
    <div style={screenStyle}>
      <button onClick={onClose} style={closeStyle} aria-label="Close review">
        <X size={17} />
      </button>

      <main style={reportStyle}>
        <section style={heroStyle}>
          <div style={eyebrowStyle}>Annual review</div>
          <h1 style={titleStyle}>{report.year}: The Year of the Pivot</h1>
          <p style={ledeStyle}>
            A definitive record of strategic shifts, foundational realignments, and calculated risks.
            This year was defined not by linear progression, but by the courage to alter the course when the data demanded it.
          </p>
          <div style={actionRowStyle}>
            <button style={lightButtonStyle}>
              <Share2 size={13} />
              Share report
            </button>
            <button style={darkButtonStyle}>
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </section>

        <section style={metricGridStyle}>
          <Metric label="Ventures started" value={report.venturesStarted} />
          <div style={{ ...metricStyle, gridColumn: 'span 2' }}>
            <div style={metricLabelStyle}>Milestones recorded</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <strong style={metricValueStyle}>{report.milestones}</strong>
              <span style={metricLineStyle} />
            </div>
          </div>
          <Metric label="Strategic pivots" value={report.strategicPivots} />
        </section>

        <section style={performanceStyle}>
          <div>
            <div style={metricLabelStyle}>Peak performance</div>
            <strong style={{ ...metricValueStyle, fontSize: '17px' }}>Best Month: {monthLabel}</strong>
          </div>
          <div style={barWrapStyle}>
            {report.monthCounts.map((item) => (
              <div key={item.month} style={barColumnStyle}>
                {item.month === report.bestMonth.month && <span style={barMonthStyle}>{monthLabel.slice(0, 3).toUpperCase()}</span>}
                <span
                  style={{
                    ...barStyle,
                    height: `${Math.max(8, (item.count / maxMonth) * 44)}px`,
                    background: item.month === report.bestMonth.month ? '#ffffff' : 'rgba(255,255,255,0.18)',
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        <section style={narrativeStyle}>
          <h2 style={sectionTitleStyle}>The Narrative</h2>
          <div style={narrativeColumnsStyle}>
            <p>
              The trajectory of {report.year} was defined by necessary recalibration. Early projections indicated a steady,
              linear growth path, but the strongest signals came from moments where the portfolio changed shape.
            </p>
            <p>
              By Q3, market focus crystallized around the ventures with clearer operator pull. The review shows
              {` ${report.highImpact} `}high-impact moments and {report.strategicPivots} strategic pivot signals.
            </p>
          </div>
        </section>

        <section style={tableStyle}>
          <div style={{ ...metricLabelStyle, marginBottom: '14px' }}>Chronicle entries</div>
          {report.events.length === 0 ? (
            <div style={emptyStyle}>No events logged for {report.year} yet.</div>
          ) : (
            report.events.map((event) => {
              const venture = ventures.find((item) => item.id === event.ventureId);
              return (
                <div key={event.id} style={entryStyle}>
                  <span>{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <strong>{event.title}</strong>
                  <span>{venture?.name || 'Linked venture missing'}</span>
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div style={metricStyle}>
      <div style={metricLabelStyle}>{label}</div>
      <strong style={metricValueStyle}>{value}</strong>
    </div>
  );
}

const screenStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 250,
  background: colors.background.surface,
  color: colors.text.primary,
  overflowY: 'auto',
  fontFamily: typography.family.base,
};

const closeStyle: React.CSSProperties = {
  position: 'fixed',
  right: spacing.xl * 1.5,
  top: spacing.lg + 6,
  width: components.button.icon.sm.size,
  height: components.button.icon.sm.size,
  borderRadius: '50%',
  border: `1px solid ${colors.border.default}`,
  background: colors.background.base,
  color: colors.text.secondary,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  transition: transitions.default,
};

const reportStyle: React.CSSProperties = {
  width: 'min(100%, 720px)',
  margin: '0 auto',
  padding: `${spacing['3xl']}px ${spacing.lg}px ${spacing['3xl'] + 8}px`,
};

const heroStyle: React.CSSProperties = {
  minHeight: '236px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  background: `radial-gradient(circle at 50% 38%, ${colors.border.default}, transparent 58%)`,
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  fontSize: typography.size.xs,
  fontWeight: typography.weight.bold,
  textTransform: 'uppercase',
  letterSpacing: 0,
  color: colors.text.primary,
};

const titleStyle: React.CSSProperties = {
  margin: `${spacing.sm}px 0 ${spacing.lg + 6}px`,
  fontFamily: typography.family.display,
  fontSize: 34,
  lineHeight: 1.08,
  fontWeight: typography.weight.bold,
  letterSpacing: 0,
};

const ledeStyle: React.CSSProperties = {
  maxWidth: '520px',
  color: colors.text.primary,
  fontSize: typography.size.sm,
  lineHeight: 1.55,
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.md,
  marginTop: spacing.xl + 4,
};

const lightButtonStyle: React.CSSProperties = {
  height: '30px',
  border: `1px solid ${colors.text.primary}`,
  background: colors.text.primary,
  color: colors.background.base,
  padding: `0 ${spacing.lg}px`,
  textTransform: 'uppercase',
  fontSize: typography.size.xs,
  fontWeight: typography.weight.bold,
  letterSpacing: '0.08em',
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  cursor: 'pointer',
  borderRadius: radius.sm,
  transition: transitions.default,
};

const darkButtonStyle: React.CSSProperties = {
  ...lightButtonStyle,
  background: 'transparent',
  color: colors.text.primary,
  border: `1px solid ${colors.border.strong}`,
};

const metricGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 2fr 1fr',
  gap: spacing.xs,
};

const metricStyle: React.CSSProperties = {
  minHeight: '94px',
  border: `1px solid ${colors.border.default}`,
  background: colors.background.surface,
  padding: spacing.lg,
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: 'Georgia, serif',
  color: colors.text.primary,
  fontSize: typography.size.xs,
  fontWeight: typography.weight.bold,
  textTransform: 'uppercase',
};

const metricValueStyle: React.CSSProperties = {
  display: 'block',
  marginTop: spacing.xs - 1,
  fontFamily: typography.family.display,
  fontSize: 28,
  lineHeight: 1,
};

const metricLineStyle: React.CSSProperties = {
  display: 'block',
  height: '1px',
  flex: 1,
  background: `linear-gradient(90deg, ${colors.text.primary} 0 64%, ${colors.border.default} 64%)`,
};

const performanceStyle: React.CSSProperties = {
  marginTop: spacing.xs,
  minHeight: '88px',
  border: `1px solid ${colors.border.default}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing['2xl'],
  padding: `${spacing.lg + 2}px ${spacing.lg + 6}px`,
};

const barWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: spacing.xs,
  height: '56px',
};

const barColumnStyle: React.CSSProperties = {
  position: 'relative',
  width: '15px',
  height: '54px',
  display: 'flex',
  alignItems: 'flex-end',
};

const barStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '8px',
};

const barMonthStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-2px',
  left: '50%',
  transform: 'translate(-50%, -100%)',
  fontSize: typography.size.xs - 1,
  fontWeight: typography.weight.bold,
};

const narrativeStyle: React.CSSProperties = {
  marginTop: spacing.xl + 10,
  paddingTop: spacing.xl + 14,
  borderTop: `1px solid ${colors.border.subtle}`,
  position: 'relative',
};

const sectionTitleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontFamily: typography.family.display,
  fontSize: 17,
  margin: `0 0 ${spacing.xl + 8}px`,
};

const narrativeColumnsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing['3xl'],
  color: colors.text.primary,
  fontSize: typography.size.sm,
  lineHeight: 1.6,
};

const tableStyle: React.CSSProperties = {
  marginTop: spacing.xl + 10,
  borderTop: `1px solid ${colors.border.subtle}`,
  paddingTop: spacing.lg + 6,
};

const entryStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '90px 1fr 160px',
  gap: spacing.lg + 2,
  alignItems: 'center',
  minHeight: '44px',
  borderBottom: `1px solid ${colors.border.subtle}`,
  color: colors.text.secondary,
  fontSize: typography.size.xs + 1,
};

const emptyStyle: React.CSSProperties = {
  border: `1px solid ${colors.border.default}`,
  color: colors.text.secondary,
  padding: spacing.lg + 2,
  fontSize: typography.size.sm,
};
