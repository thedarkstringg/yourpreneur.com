"use client";

import { useState } from "react";

interface Milestone {
  date: string;
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  isVenture: boolean;
  badge?: string;
  milestones?: Milestone[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "inception",
    date: "2021.11.15",
    title: "Inception Phase",
    description:
      "Initial ideation and market research for decentralized storage solutions.",
    isVenture: false,
  },
  {
    id: "phoenix",
    date: "2022.04.01",
    title: "Project Phoenix",
    description:
      "Incorporation and seed round closure. Focus shifts to MVP development for enterprise clients.",
    isVenture: true,
    badge: "Venture",
    milestones: [
      { date: "2022.06.12", title: "Launched MVP", status: "completed" },
      {
        date: "2022.08.30",
        title: "First Customer Onboarded",
        status: "completed",
      },
      {
        date: "2023.01.15",
        title: "Strategic Pivot to B2B SaaS",
        status: "completed",
      },
      { date: "2023.05.20", title: "Reached $10K MRR", status: "current" },
    ],
  },
  {
    id: "expansion",
    date: "2023.09.10",
    title: "Team Expansion",
    description: "Hired first engineering lead and marketing director.",
    isVenture: false,
  },
];

export default function Chronicle() {
  const [expandedVenture, setExpandedVenture] = useState<string | null>("phoenix");

  const toggleVenture = (id: string) => {
    setExpandedVenture(expandedVenture === id ? null : id);
  };

  return (
    <>
      {/* Page Header */}
      <header className="text-center mb-16 relative z-10 flex flex-col items-center">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">
          Chronicle
        </h1>
        <p className="font-mono-data text-mono-data text-on-surface-variant max-w-md mx-auto text-center text-xs uppercase tracking-widest">
          Tracing the arc of ambition. Select a venture to inspect granular
          milestones.
        </p>
      </header>

      {/* Timeline */}
      <div className="relative w-full flex flex-col gap-16">
        {/* Vertical Axis */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 z-0"></div>

        {/* Timeline Events */}
        {timelineEvents.map((event, idx) => (
          <div key={event.id} className="relative z-10">
            {/* Main Timeline Node */}
            <div
              className={`flex flex-col md:flex-row gap-8 items-center md:items-start w-full group ${
                event.isVenture ? "cursor-pointer" : ""
              }`}
              onClick={() => event.isVenture && toggleVenture(event.id)}
            >
              {/* Left Content */}
              <div className="md:w-1/2 flex md:justify-end text-center md:text-right">
                <div className="font-mono-data text-mono-data text-on-surface-variant pt-2 text-xs">
                  {event.date}
                </div>
              </div>

              {/* Central Node */}
              <div className="relative flex-shrink-0 flex items-center justify-center my-4 md:my-0 md:pt-3">
                {event.isVenture && expandedVenture === event.id && (
                  <div className="absolute w-8 h-8 rounded-full bg-primary/20 blur-sm animate-pulse"></div>
                )}
                <div
                  className={`rounded-full transition-all duration-300 ${
                    event.isVenture
                      ? "w-3 h-3 bg-primary border-2 border-background"
                      : "w-2 h-2 bg-surface-variant group-hover:bg-primary"
                  }`}
                ></div>
              </div>

              {/* Right Content */}
              <div className="md:w-1/2 flex flex-col gap-2 text-center md:text-left">
                {event.badge && (
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="px-2 py-1 bg-surface-container-high border border-outline-variant rounded-full font-label-caps text-[10px] text-primary tracking-widest uppercase">
                      {event.badge}
                    </span>
                  </div>
                )}
                <h3 className="font-headline-md text-headline-md text-primary">
                  {event.title}
                </h3>
                <p className="font-body-base text-body-base text-on-surface-variant">
                  {event.description}
                </p>

                {/* Drill-down Sub-timeline */}
                {event.isVenture &&
                  event.milestones &&
                  expandedVenture === event.id && (
                    <div className="bg-surface-container-lowest border border-white/10 rounded p-6 mt-6 w-full relative overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.03)] backdrop-blur-sm">
                      {/* Sub-timeline connecting line */}
                      <div className="absolute left-9 top-8 bottom-8 w-[1px] bg-white/20"></div>

                      {/* Milestones */}
                      {event.milestones.map((milestone, milestoneIdx) => (
                        <div
                          key={milestoneIdx}
                          className={`flex gap-6 items-start relative ${
                            milestoneIdx < event.milestones!.length - 1
                              ? "mb-6"
                              : ""
                          }`}
                        >
                          {/* Milestone Node */}
                          <div className="flex flex-col items-center gap-1 w-8 flex-shrink-0 mt-1">
                            {milestone.status === "completed" && (
                              <div className="w-[6px] h-[6px] rounded-full bg-white relative z-10"></div>
                            )}
                            {milestone.status === "current" && (
                              <div className="w-[6px] h-[6px] rounded-full bg-white relative z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                            )}
                            {milestone.status === "upcoming" && (
                              <div className="w-[6px] h-[6px] rounded-full bg-white/40 border border-white relative z-10"></div>
                            )}
                          </div>

                          {/* Milestone Content */}
                          <div className="flex flex-col gap-1">
                            <span className="font-mono-data text-[11px] text-on-surface-variant">
                              {milestone.date}
                            </span>
                            <span
                              className={`font-body-sm text-body-sm ${
                                milestone.status === "current"
                                  ? "text-primary font-medium"
                                  : "text-primary"
                              }`}
                            >
                              {milestone.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* Spacing between events */}
            {idx < timelineEvents.length - 1 && <div className="h-8 md:h-12"></div>}
          </div>
        ))}
      </div>
    </>
  );
}
