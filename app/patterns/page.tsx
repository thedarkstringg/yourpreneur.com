"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/appStore";
import { getMockUser, getMockVentures, getMockEvents } from "@/lib/mockData";
import { calculateStats, groupEventsByMonth } from "@/lib/utils";
import StatCard from "@/app/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Pattern Analysis Engine
 * Generates AI-like insights from user data using heuristic rules
 */
function generateInsights(ventures: any[], events: any[]) {
  const totalVentures = ventures.length;
  const pivotVentures = ventures.filter((v) => v.status === "pivot").length;
  const eventsByType: Record<string, number> = {};

  events.forEach((e) => {
    eventsByType[e.event_type] = (eventsByType[e.event_type] || 0) + 1;
  });

  const insights: string[] = [];

  // Rule 1: Detect pivot rate patterns
  if (totalVentures > 0) {
    const pivotRate = (pivotVentures / totalVentures) * 100;
    if (pivotRate > 50) {
      insights.push(`You've pivoted ${pivotRate.toFixed(0)}% of your ventures. Consider focusing on validation earlier.`);
    } else if (totalVentures > 1) {
      insights.push(`You typically iterate strategically—${pivotRate.toFixed(0)}% of ventures have pivoted.`);
    }
  }

  // Rule 2: Detect most common event types
  if (Object.keys(eventsByType).length > 0) {
    const mostCommon = Object.entries(eventsByType).sort(([, a], [, b]) => b - a)[0];
    if (mostCommon[1] > 3) {
      insights.push(`"${mostCommon[0]}" events dominate your activity (${mostCommon[1]} logged).`);
    }
  }

  // Rule 3: Detect growth pattern
  if (totalVentures > 2) {
    insights.push(`You've started ${totalVentures} ventures. Diversification is your strength.`);
  }

  return insights.length > 0
    ? insights[Math.floor(Math.random() * insights.length)]
    : "Keep building and logging your ventures to unlock insights.";
}

export default function Patterns() {
  const {
    ventures,
    events,
    setUser,
    setVentures,
    setEvents,
    isLoading,
    setIsLoading,
  } = useAppStore();

  const [chartData, setChartData] = useState<any[]>([]);
  const [insight, setInsight] = useState("");

  // Load mock data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const mockUser = await getMockUser();
        const mockVentures = await getMockVentures();
        const mockEvents = await getMockEvents();

        setUser(mockUser);
        setVentures(mockVentures);
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ventures.length === 0) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [ventures.length, setUser, setVentures, setEvents, setIsLoading]);

  // Calculate stats
  useEffect(() => {
    if (ventures.length > 0) {
      const stats = calculateStats(ventures, events);
      setInsight(generateInsights(ventures, events));

      // Prepare chart data (ventures started per year)
      const yearMap: Record<number, number> = {};
      ventures.forEach((v) => {
        const year = new Date(v.started_date).getFullYear();
        yearMap[year] = (yearMap[year] || 0) + 1;
      });

      const data = Object.entries(yearMap)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([year, count]) => ({
          year: parseInt(year),
          ventures: count,
        }));

      setChartData(data);
    }
  }, [ventures, events]);

  const stats = calculateStats(ventures, events);
  const eventsByMonth = groupEventsByMonth(events);
  const monthsWithEvents = Object.keys(eventsByMonth).length;
  const mostProductiveMonth = Object.entries(eventsByMonth).sort(
    ([, a], [, b]) => b.length - a.length
  )[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-outline-variant border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant text-sm">Analyzing patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-4xl font-display-lg text-primary mb-2">Patterns</h1>
        <p className="text-sm text-on-surface-variant max-w-xl">
          Analytical abstraction of your entrepreneurial velocity. Identifying
          patterns and opportunities across your ventures.
        </p>
      </header>

      {/* AI Insight Block */}
      <motion.div
        className="mb-12 p-8 rounded-lg border border-outline-variant bg-surface-container relative overflow-hidden group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-150 group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none"></div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary text-primary font-label-caps text-xs uppercase tracking-widest rounded-full mb-3">
            Insight
          </span>
          <p className="font-headline-md text-primary leading-relaxed">
            {insight}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Ventures" value={stats.totalVentures} />
        <StatCard label="Active Now" value={stats.activeVentures} />
        <StatCard
          label="Avg Lifespan"
          value={stats.avgLifespanDays}
          unit="days"
        />
        <StatCard
          label="Most Logged Event"
          value={stats.mostCommonEventType ? stats.mostCommonEventType.charAt(0).toUpperCase() + stats.mostCommonEventType.slice(1) : "—"}
        />
        <StatCard label="Pivot Rate" value={`${stats.pivotRate}%`} />
        <StatCard
          label="With Revenue"
          value={stats.venturesWithRevenue}
        />
      </div>

      {/* Charts Section */}
      <motion.div
        className="space-y-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Ventures Per Year Chart */}
        {chartData.length > 0 && (
          <div className="p-6 rounded-lg border border-outline-variant bg-surface-container">
            <h2 className="text-lg font-headline-md text-primary mb-6">
              Ventures Started Per Year
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="year"
                  stroke="rgba(255,255,255,0.4)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(19,19,19,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Bar
                  dataKey="ventures"
                  fill="rgba(255,255,255,0.8)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mostProductiveMonth && (
            <motion.div
              className="p-6 rounded-lg border border-outline-variant bg-surface-container"
              whileHover={{ y: -2 }}
            >
              <h3 className="text-sm font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
                Most Productive Month
              </h3>
              <p className="text-2xl font-display-lg text-primary">
                {mostProductiveMonth[0]}
              </p>
              <p className="text-xs text-on-surface-variant mt-2">
                {mostProductiveMonth[1].length} event
                {mostProductiveMonth[1].length !== 1 ? "s" : ""} logged
              </p>
            </motion.div>
          )}

          <motion.div
            className="p-6 rounded-lg border border-outline-variant bg-surface-container"
            whileHover={{ y: -2 }}
          >
            <h3 className="text-sm font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
              Months with Activity
            </h3>
            <p className="text-2xl font-display-lg text-primary">
              {monthsWithEvents}
            </p>
            <p className="text-xs text-on-surface-variant mt-2">
              Tracking across {Object.keys(eventsByMonth).length} distinct months
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
