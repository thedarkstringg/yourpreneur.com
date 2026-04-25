'use client';

import { useStore } from '@/lib/useStore';

export default function Statistics({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { ventures, events } = useStore();

  const stats = {
    totalVentures: ventures.length,
    activeVentures: ventures.filter((v) => v.status === 'active').length,
    pivotVentures: ventures.filter((v) => v.status === 'pivot').length,
    pausedVentures: ventures.filter((v) => v.status === 'paused').length,
    shutdownVentures: ventures.filter((v) => v.status === 'shutdown').length,
    exitedVentures: ventures.filter((v) => v.status === 'exited').length,
    totalEvents: events.length,
    launchEvents: events.filter((e) => e.type === 'launch').length,
    fundingEvents: events.filter((e) => e.type === 'funding').length,
    milestoneEvents: events.filter((e) => e.type === 'milestone').length,
    branched: ventures.filter((v) => v.parentId).length,
    industries: [...new Set(ventures.map((v) => v.industry))].length,
    years: [
      ...new Set(
        ventures.map((v) => new Date(v.startedDate).getFullYear())
      ),
    ].length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-zinc-950 border border-white/10 rounded-lg shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ventures Overview */}
          <div>
            <h3 className="text-sm font-mono text-white/80 mb-4">VENTURES</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total" value={stats.totalVentures} />
              <StatCard
                label="Active"
                value={stats.activeVentures}
                color="green"
              />
              <StatCard label="Pivot" value={stats.pivotVentures} color="blue" />
              <StatCard
                label="Paused"
                value={stats.pausedVentures}
                color="yellow"
              />
              <StatCard
                label="Shutdown"
                value={stats.shutdownVentures}
                color="red"
              />
              <StatCard
                label="Exited"
                value={stats.exitedVentures}
                color="purple"
              />
            </div>
          </div>

          {/* Events Overview */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-mono text-white/80 mb-4">EVENTS</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total" value={stats.totalEvents} />
              <StatCard
                label="Launches"
                value={stats.launchEvents}
                color="green"
              />
              <StatCard
                label="Funding"
                value={stats.fundingEvents}
                color="blue"
              />
              <StatCard
                label="Milestones"
                value={stats.milestoneEvents}
                color="cyan"
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-mono text-white/80 mb-4">INSIGHTS</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Branched Ventures" value={stats.branched} />
              <StatCard label="Industries" value={stats.industries} />
              <StatCard label="Years Active" value={stats.years} />
              <StatCard
                label="Avg Events/Venture"
                value={
                  stats.totalVentures > 0
                    ? (stats.totalEvents / stats.totalVentures).toFixed(1)
                    : '0'
                }
              />
            </div>
          </div>

          {/* Year Distribution */}
          {stats.years > 0 && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-sm font-mono text-white/80 mb-4">
                VENTURE TIMELINE
              </h3>
              <div className="space-y-2">
                {ventures
                  .reduce(
                    (acc, v) => {
                      const year = new Date(v.startedDate).getFullYear();
                      const existing = acc.find((y) => y.year === year);
                      if (existing) {
                        existing.count++;
                      } else {
                        acc.push({ year, count: 1 });
                      }
                      return acc;
                    },
                    [] as { year: number; count: number }[]
                  )
                  .sort((a, b) => a.year - b.year)
                  .map((y) => (
                    <div key={y.year} className="flex items-center gap-3">
                      <span className="text-sm font-mono text-white/60 w-12">
                        {y.year}
                      </span>
                      <div className="flex-1 bg-white/5 rounded h-6 flex items-center px-2">
                        <div
                          className="bg-blue-500/50 h-4 rounded"
                          style={{
                            width: `${(y.count / stats.totalVentures) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-white/60 w-8 text-right">
                        {y.count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white text-sm font-mono hover:bg-white/15 transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = 'default',
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500/10 border-green-500/30 text-green-400',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    red: 'bg-red-500/10 border-red-500/30 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    default: 'bg-white/5 border-white/10 text-white',
  };

  return (
    <div
      className={`border rounded p-3 text-center ${colorClasses[color] || colorClasses.default}`}
    >
      <p className="text-xs font-mono text-white/60 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
