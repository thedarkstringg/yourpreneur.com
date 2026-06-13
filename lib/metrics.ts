import { Venture, VentureEvent } from './useStore';

export interface VentureMetrics {
  totalVentures: number;
  activeVentures: number;
  exitedVentures: number;
  failedVentures: number;
  averageHealthScore: number;
  totalBurnRate: number;
  totalRunway: number;
}

export interface IndustryBreakdown {
  [industry: string]: number;
}

export interface StatusBreakdown {
  [status: string]: number;
}

export interface YearlyMetrics {
  year: number;
  venturesStarted: number;
  eventsCount: number;
  fundingTotal: number;
}

// Calculate venture metrics
export const calculateVentureMetrics = (ventures: Venture[]): VentureMetrics => {
  const activeStatuses = ['active', 'stealth'];
  const exitedStatuses = ['exited', 'acquired'];
  const failedStatuses = ['failed', 'shutdown', 'graveyard'];

  const metrics: VentureMetrics = {
    totalVentures: ventures.length,
    activeVentures: ventures.filter((v) => activeStatuses.includes(v.status)).length,
    exitedVentures: ventures.filter((v) => exitedStatuses.includes(v.status)).length,
    failedVentures: ventures.filter((v) => failedStatuses.includes(v.status)).length,
    averageHealthScore:
      ventures.filter((v) => v.healthScore).length > 0
        ? Math.round(
            ventures.reduce((sum, v) => sum + (v.healthScore || 0), 0) /
              ventures.filter((v) => v.healthScore).length
          )
        : 0,
    totalBurnRate: ventures.reduce((sum, v) => sum + (v.burnRate || 0), 0),
    totalRunway: ventures.reduce((sum, v) => sum + (v.runwayMonths || 0), 0),
  };

  return metrics;
};

// Calculate industry breakdown
export const calculateIndustryBreakdown = (ventures: Venture[]): IndustryBreakdown => {
  return ventures.reduce(
    (acc, v) => {
      const industry = v.industry || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    },
    {} as IndustryBreakdown
  );
};

// Calculate status breakdown
export const calculateStatusBreakdown = (ventures: Venture[]): StatusBreakdown => {
  return ventures.reduce(
    (acc, v) => {
      const status = v.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as StatusBreakdown
  );
};

// Calculate yearly metrics
export const calculateYearlyMetrics = (
  ventures: Venture[],
  events: VentureEvent[],
  year: number
): YearlyMetrics => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const venturesStarted = ventures.filter((v) => {
    const started = new Date(v.startedDate);
    return started >= startDate && started <= endDate;
  }).length;

  const eventsInYear = events.filter((e) => {
    const eventDate = new Date(e.eventDate);
    return eventDate >= startDate && eventDate <= endDate;
  });

  const fundingEvents = eventsInYear.filter((e) => e.type === 'funding');

  return {
    year,
    venturesStarted,
    eventsCount: eventsInYear.length,
    fundingTotal: fundingEvents.length, // In a real app, would have funding amounts
  };
};

// Get multi-year comparison
export const getMultiYearComparison = (
  ventures: Venture[],
  events: VentureEvent[]
): YearlyMetrics[] => {
  const years = new Set<number>();

  ventures.forEach((v) => {
    years.add(new Date(v.startedDate).getFullYear());
    if (v.endedDate) {
      years.add(new Date(v.endedDate).getFullYear());
    }
  });

  events.forEach((e) => {
    years.add(new Date(e.eventDate).getFullYear());
  });

  return Array.from(years)
    .sort()
    .map((year) => calculateYearlyMetrics(ventures, events, year));
};

// Calculate MRR trend across ventures
export const calculateMRRTrend = (ventures: Venture[]): number[] => {
  if (ventures.length === 0) return [];

  const maxLength = Math.max(...ventures.map((v) => v.mrrTrend?.length || 0));
  if (maxLength === 0) return [];

  const trend: number[] = [];
  for (let i = 0; i < maxLength; i++) {
    let sum = 0;
    let count = 0;
    ventures.forEach((v) => {
      if (v.mrrTrend && v.mrrTrend[i]) {
        sum += v.mrrTrend[i];
        count++;
      }
    });
    if (count > 0) {
      trend.push(Math.round(sum / count));
    }
  }

  return trend;
};

// Get event sentiment distribution
export const getEventSentimentDistribution = (
  events: VentureEvent[]
): { [mood: string]: number } => {
  return events.reduce(
    (acc, e) => {
      if (e.mood) {
        acc[e.mood] = (acc[e.mood] || 0) + 1;
      }
      return acc;
    },
    {} as { [mood: string]: number }
  );
};

// Get event impact distribution
export const getEventImpactDistribution = (
  events: VentureEvent[]
): { [impact: string]: number } => {
  return events.reduce(
    (acc, e) => {
      if (e.impact) {
        acc[e.impact] = (acc[e.impact] || 0) + 1;
      }
      return acc;
    },
    {} as { [impact: string]: number }
  );
};

// Average venture lifespan in months
export const calculateAverageVentureLifespan = (ventures: Venture[]): number => {
  const completedVentures = ventures.filter((v) => v.endedDate);
  if (completedVentures.length === 0) return 0;

  const lifespans = completedVentures.map((v) => {
    const start = new Date(v.startedDate);
    const end = new Date(v.endedDate!);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, months);
  });

  return Math.round(lifespans.reduce((a, b) => a + b, 0) / lifespans.length);
};
