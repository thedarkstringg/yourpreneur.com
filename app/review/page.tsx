"use client";

interface StatCard {
  id: string;
  label: string;
  value: string | number;
  column?: number;
}

const stats: StatCard[] = [
  { id: "ventures", label: "Ventures Started", value: "3", column: 1 },
  { id: "milestones", label: "Milestones Recorded", value: "18", column: 2 },
  { id: "pivots", label: "Strategic Pivots", value: "2", column: 1 },
];

const sparklineData = [
  { month: "", value: 20, isPeak: false },
  { month: "", value: 30, isPeak: false },
  { month: "", value: 25, isPeak: false },
  { month: "", value: 40, isPeak: false },
  { month: "", value: 50, isPeak: false },
  { month: "", value: 35, isPeak: false },
  { month: "", value: 60, isPeak: false },
  { month: "", value: 80, isPeak: false },
  { month: "", value: 45, isPeak: false },
  { month: "OCT", value: 100, isPeak: true },
  { month: "", value: 65, isPeak: false },
  { month: "", value: 55, isPeak: false },
];

const narrativeText = [
  "The trajectory of 2024 was defined by a necessary recalibration. Early Q1 projections indicated a steady, linear growth path, but internal metrics suggested a stagnation in core product innovation. The decision to execute the first major pivot in March was contentious, yet ultimately validated by the subsequent acceleration in user acquisition.",
  "We deprioritized short-term revenue features in favor of fundamental infrastructure overhauls. This period, internally referred to as 'The Deep Work Phase,' yielded the 18 recorded milestones that now form the bedrock of our current technological advantage. The temporary dip in top-line metrics was a calculated sacrifice for long-term scalability.",
  "By Q3, the second pivot—shifting market focus from SMB to Enterprise—crystalized. This was not a change in product, but a refinement of positioning. The launch of three new exploratory ventures running parallel to the core offering served as crucial testing grounds for this new narrative.",
  "October stands as the inflection point. The culmination of the foundational work and the refined positioning resulted in the highest monthly recurring revenue to date, proving the efficacy of the preceding turbulent months. 2024 was not about easy wins; it was about building the resilience required for the next decade.",
];

export default function YearInReview() {
  return (
    <>
      {/* Hero Section */}
      <header className="flex flex-col items-center text-center gap-8 relative mb-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="flex flex-col gap-2 items-center">
          <span className="font-mono-data text-mono-data text-on-surface-variant uppercase tracking-widest text-xs">
            Annual Review
          </span>
          <h1 className="font-display-lg text-display-lg text-primary">
            2024: The Year of the Pivot
          </h1>
        </div>

        <p className="font-body-base text-body-base text-on-surface-variant max-w-[600px] mx-auto text-center">
          A definitive record of strategic shifts, foundational realignments,
          and calculated risks. This year was defined not by linear progression,
          but by the courage to alter the course when the data demanded it.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button className="bg-primary text-background font-label-caps text-label-caps text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-white/90 transition-colors">
            Share Report
          </button>
          <button className="bg-transparent border border-white/30 text-primary font-label-caps text-label-caps text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-surface-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span>
            Export PDF
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-16">
        {/* Ventures Started */}
        <div className="bg-surface-container-lowest border border-white/10 rounded p-8 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <span className="font-mono-data text-mono-data text-on-surface-variant text-xs uppercase tracking-widest">
            Ventures Started
          </span>
          <span className="font-display-lg text-5xl leading-none text-primary font-bold">
            3
          </span>
        </div>

        {/* Milestones Recorded */}
        <div className="bg-surface-container-lowest border border-white/10 rounded p-8 flex flex-col gap-4 relative overflow-hidden group lg:col-span-2">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <span className="font-mono-data text-mono-data text-on-surface-variant text-xs uppercase tracking-widest">
            Milestones Recorded
          </span>
          <div className="flex items-end gap-4">
            <span className="font-display-lg text-5xl leading-none text-primary font-bold">
              18
            </span>
            <div className="flex-1 h-1 bg-surface-variant rounded-full overflow-hidden mb-2">
              <div className="h-full w-[70%] bg-primary rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Strategic Pivots */}
        <div className="bg-surface-container-lowest border border-white/10 rounded p-8 flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <span className="font-mono-data text-mono-data text-on-surface-variant text-xs uppercase tracking-widest">
            Strategic Pivots
          </span>
          <span className="font-display-lg text-5xl leading-none text-primary font-bold">
            2
          </span>
        </div>

        {/* Peak Performance */}
        <div className="bg-surface-container-lowest border border-white/10 rounded p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group lg:col-span-4">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>
          <div className="flex flex-col gap-1">
            <span className="font-mono-data text-mono-data text-on-surface-variant text-xs uppercase tracking-widest">
              Peak Performance
            </span>
            <span className="font-headline-md text-headline-md text-primary">
              Best Month: October
            </span>
          </div>

          {/* Sparkline Chart */}
          <div className="w-full md:w-1/2 h-16 flex items-end gap-1 md:gap-0.5">
            {sparklineData.map((data, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center relative"
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    data.isPeak
                      ? "bg-primary shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "bg-surface-variant hover:bg-surface-container-high"
                  }`}
                  style={{ height: `${data.value}%` }}
                ></div>
                {data.month && (
                  <span className="absolute -bottom-6 font-mono-data text-[10px] text-primary font-bold">
                    {data.month}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="flex flex-col gap-8 border-t border-white/10 pt-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-white/20 to-transparent"></div>

        <h2 className="font-headline-md text-headline-md text-primary text-center">
          The Narrative
        </h2>

        {/* Multi-column Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {narrativeText.map((paragraph, idx) => (
            <p
              key={idx}
              className="font-body-base text-body-base text-on-surface-variant leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
