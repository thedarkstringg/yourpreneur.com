'use client';

import { useState, useMemo } from 'react';
import { useStore, Venture, VentureEvent } from '@/lib/useStore';

const TAB_OPTIONS = ['OVERVIEW', 'BEHAVIOR', 'RISK', 'TIMELINE HEAT', 'AI REPORT'] as const;
type Tab = typeof TAB_OPTIONS[number];

const MOOD_COLORS: Record<string, string> = {
  energized: 'rgba(100, 220, 150, 0.7)',
  focused: 'rgba(255, 255, 255, 0.7)',
  uncertain: 'rgba(220, 180, 80, 0.6)',
  lost: 'rgba(150, 150, 180, 0.6)',
  proud: 'rgba(180, 140, 255, 0.6)',
  regretful: 'rgba(200, 100, 80, 0.6)',
  burned_out: 'rgba(120, 120, 120, 0.5)',
};

export default function PatternsScreen({ onClose }: { onClose: () => void }) {
  const { ventures, events } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');

  const stats = useMemo(() => {
    const totalVentures = ventures.length;
    const activeVentures = ventures.filter(v => v.status === 'active').length;
    const completedVentures = ventures.filter(v => v.status === 'exited' || v.status === 'shutdown').length;
    const totalEvents = events.length;
    
    // Average venture life
    const lifeDays = ventures.map(v => {
      const start = new Date(v.startedDate);
      const end = v.endedDate ? new Date(v.endedDate) : new Date();
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    });
    const avgLife = lifeDays.length ? Math.round(lifeDays.reduce((a, b) => a + b, 0) / lifeDays.length) : 0;

    const pivotRate = totalVentures ? Math.round((ventures.filter(v => events.some(e => e.ventureId === v.id && e.type === 'pivot')).length / totalVentures) * 100) : 0;
    
    const highImpactCount = events.filter(e => e.impact === 'high' || e.impact === 'critical').length;

    return { totalVentures, activeVentures, completedVentures, totalEvents, avgLife, pivotRate, highImpactCount };
  }, [ventures, events]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0c0a0a] flex flex-col font-mono text-white overflow-hidden">
      {/* Navigation */}
      <div className="flex items-center justify-between px-10 pt-10 pb-6 border-b border-white/5">
        <div className="flex gap-10">
          {TAB_OPTIONS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[10px] tracking-[0.2em] transition-all pb-2 border-b-2 ${
                activeTab === tab ? 'border-white text-white' : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-xs tracking-widest">
          CLOSE ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10">
        {activeTab === 'OVERVIEW' && (
          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
            <StatCard value={stats.totalVentures} label="Total Ventures" />
            <StatCard value={stats.activeVentures} label="Currently Active" />
            <StatCard value={stats.completedVentures} label="Ventures Completed" />
            <StatCard value={stats.totalEvents} label="Total Events Logged" />
            <StatCard value={`${stats.avgLife} days`} label="Average Venture Life" />
            <StatCard value={`${stats.pivotRate}%`} label="Pivot Rate" />
            <StatCard value={stats.highImpactCount} label="High Impact Events" />
          </div>
        )}

        {activeTab === 'BEHAVIOR' && (
           <div className="max-w-4xl mx-auto space-y-12">
             <section>
               <h3 className="text-[11px] tracking-widest text-white/30 mb-8 uppercase">Momentum Map</h3>
               <MomentumMap events={events} />
             </section>
             <section>
                <h3 className="text-[11px] tracking-widest text-white/30 mb-8 uppercase">Mood Over Time</h3>
                <MoodChart events={events} />
             </section>
           </div>
        )}

        {activeTab === 'RISK' && (
           <div className="max-w-4xl mx-auto">
             <RiskAnalysis ventures={ventures} events={events} />
           </div>
        )}
        
        {(activeTab === 'TIMELINE HEAT' || activeTab === 'AI REPORT') && (
           <div className="flex items-center justify-center h-64 text-white/20 italic">
             Coming soon in Phase 3 implementation...
           </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string | number, label: string }) {
  return (
    <div className="bg-[#120e0e] border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all group">
      <div className="font-display text-5xl text-white/85 mb-3 group-hover:text-white transition-colors">
        {value}
      </div>
      <div className="text-[9px] tracking-widest text-white/30 uppercase">
        {label}
      </div>
    </div>
  );
}

function MomentumMap({ events }: { events: VentureEvent[] }) {
  // Simplistic momentum map (GitHub style)
  const weeks = Array.from({ length: 52 });
  const years = [2024, 2025];
  
  return (
    <div className="flex flex-col gap-1">
      {years.map(year => (
        <div key={year} className="flex gap-1 items-center">
          <span className="text-[8px] text-white/20 w-8">{year}</span>
          <div className="flex gap-[2px]">
            {weeks.map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 rounded-[1px] bg-white/5 hover:bg-white/20 transition-colors"
                title={`Week ${i+1}, ${year}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MoodChart({ events }: { events: VentureEvent[] }) {
  const moodData = events.filter(e => e.mood).sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  if (moodData.length < 3) return <div className="text-white/20 text-xs italic">Insufficient mood data to render chart.</div>;

  return (
    <div className="h-48 w-full bg-white/[0.02] border border-white/5 rounded-lg flex items-end px-4 py-6 gap-2">
       {moodData.slice(-20).map((e, i) => {
         const moodLevels: Record<string, number> = {
            burned_out: 1, lost: 2, regretful: 3, uncertain: 4, focused: 5, proud: 6, energized: 7
         };
         const level = moodLevels[e.mood || ''] || 0;
         return (
           <div 
             key={i} 
             className="flex-1 bg-white/10 rounded-t-sm transition-all hover:bg-white/30 cursor-help"
             style={{ height: `${(level / 7) * 100}%`, backgroundColor: MOOD_COLORS[e.mood || ''] }}
             title={`${e.eventDate}: ${e.mood}`}
           />
         );
       })}
    </div>
  );
}

function RiskAnalysis({ ventures, events }: { ventures: Venture[], events: VentureEvent[] }) {
  return (
    <div className="space-y-8">
       <div className="bg-[#1a0f0f] border border-red-900/20 rounded-xl p-8">
         <h4 className="text-red-400/80 text-[10px] tracking-[0.2em] uppercase mb-6">Burnout Signals Detected</h4>
         <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs text-white/60">Logging gap — 34 days</span>
              <span className="text-[10px] text-white/30 uppercase">Jan 2025</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/60">Setback cluster — {ventures[0]?.name}</span>
              <span className="text-[10px] text-white/30 uppercase">Q4 2024</span>
            </div>
         </div>
       </div>
    </div>
  );
}
