"use client";

import { useState } from "react";

interface Milestone {
  id: number;
  date: string;
  title: string;
  description: string;
  isPrimary: boolean;
}

interface Venture {
  id: string;
  name: string;
  category: string;
  status: "Active" | "Paused" | "Exited" | "Pivot";
  description: string;
  inceptionDate: string;
  pauseDate?: string;
  milestones: Milestone[];
}

const venture: Venture = {
  id: "aura-financial",
  name: "Aura Financial",
  category: "FinTech",
  status: "Paused",
  description:
    "A decentralized protocol aimed at democratizing access to institutional-grade yield strategies. Developed over 18 months, securing initial seed funding before shifting regulatory landscapes required a strategic pause. The core architecture remains a viable asset for future pivot opportunities.",
  inceptionDate: "2021.04",
  pauseDate: "2023.01",
  milestones: [
    {
      id: 1,
      date: "2021.09",
      title: "Seed Round Close",
      description:
        "Secured $2.4M from tier-one web3 native funds. Validated the initial whitepaper thesis.",
      isPrimary: true,
    },
    {
      id: 2,
      date: "2022.03",
      title: "V1 Testnet Launch",
      description:
        "Deployed initial smart contracts to Goerli. Gathered feedback from 500+ alpha testers.",
      isPrimary: true,
    },
    {
      id: 3,
      date: "2023.01",
      title: "Strategic Pause",
      description:
        "Decision made to halt development pending clearer SEC guidance on yield-bearing assets.",
      isPrimary: false,
    },
  ],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-primary/10 border-primary text-primary";
    case "Paused":
      return "bg-error-container/20 border-error text-error";
    case "Exited":
      return "bg-surface-variant border-outline-variant text-on-surface-variant";
    case "Pivot":
      return "bg-surface-variant border-outline-variant text-on-surface-variant";
    default:
      return "bg-surface-container border-outline-variant text-on-surface";
  }
};

export default function VentureProfile() {
  return (
    <>
      {/* Venture Header */}
      <header className="flex flex-col gap-6 mb-32">
        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 rounded border border-outline-variant font-label-caps text-label-caps text-on-surface bg-surface-container-high">
            {venture.category}
          </span>
          <span
            className={`px-3 py-1 rounded border font-label-caps text-label-caps ${getStatusColor(venture.status)}`}
          >
            {venture.status}
          </span>
        </div>

        <h1 className="font-display-lg text-display-lg text-primary">
          {venture.name}
        </h1>

        <p className="font-body-base text-body-base text-on-surface-variant max-w-2xl">
          {venture.description}
        </p>

        <div className="flex gap-4 mt-4 border-b border-outline-variant/30 pb-4 flex-wrap">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
              Inception
            </span>
            <span className="font-mono-data text-mono-data text-on-surface">
              {venture.inceptionDate}
            </span>
          </div>
          {venture.pauseDate && (
            <>
              <div className="w-px h-8 bg-outline-variant/30"></div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant mb-1">
                  Pause Date
                </span>
                <span className="font-mono-data text-mono-data text-on-surface">
                  {venture.pauseDate}
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Milestones Gallery */}
      <section className="flex flex-col gap-8">
        <h2 className="font-label-caps text-label-caps text-on-surface border-b border-outline-variant/30 pb-2 uppercase tracking-widest">
          Key Milestones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venture.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-[#0A0A0A] border border-outline-variant/30 rounded p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-outline-variant/60 transition-colors duration-200"
            >
              <div
                className={`absolute top-0 left-0 w-full h-[1px] ${
                  milestone.isPrimary ? "bg-primary" : "bg-error"
                }`}
              ></div>

              <span className="font-mono-data text-mono-data text-on-surface-variant">
                {milestone.date}
              </span>

              <h3 className="font-headline-md text-headline-md text-on-surface">
                {milestone.title}
              </h3>

              <p className="font-body-sm text-body-sm text-on-surface-variant flex-grow">
                {milestone.description}
              </p>

              <button className="self-start text-primary font-label-caps text-label-caps border border-primary/30 px-4 py-2 rounded hover:bg-[#1A1A1A] hover:border-primary/60 transition-colors mt-2 uppercase tracking-widest text-xs">
                View Entry
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
