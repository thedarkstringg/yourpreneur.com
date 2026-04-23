"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/appStore";
import { getMockUser, getMockVentures, getMockEvents } from "@/lib/mockData";

export default function Settings() {
  const {
    user,
    ventures,
    events,
    setUser,
    setVentures,
    setEvents,
    updateUser,
    isLoading,
    setIsLoading,
  } = useAppStore();

  const [displayName, setDisplayName] = useState("");
  const [volumeTitle, setVolumeTitle] = useState("");
  const [isSaving, setSaving] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setDisplayName(mockUser.name);
        setVolumeTitle(mockUser.display_title);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      loadData();
    } else {
      setDisplayName(user.name);
      setVolumeTitle(user.display_title);
      setIsLoading(false);
    }
  }, [user, setUser, setVentures, setEvents, setIsLoading]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Mock update - in real app this would POST to Supabase
      updateUser({
        name: displayName,
        display_title: volumeTitle,
      });
      // Show success toast (in real app)
      setTimeout(() => setSaving(false), 500);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaving(false);
    }
  };

  const handleExport = () => {
    const data = {
      user,
      ventures,
      events,
      exportedAt: new Date().toISOString(),
    };

    let content: string;
    let filename: string;

    if (exportFormat === "json") {
      content = JSON.stringify(data, null, 2);
      filename = `preneurs-export-${new Date().toISOString().split("T")[0]}.json`;
    } else {
      // CSV format
      let csv = "Type,Date,Title,Details,Status\n";

      ventures.forEach((v) => {
        csv += `"Venture","${v.started_date}","${v.name}","${v.industry}","${v.status}"\n`;
      });

      events.forEach((e) => {
        csv += `"Event","${e.event_date}","${e.title}","${e.notes}","${e.event_type}"\n`;
      });

      content = csv;
      filename = `preneurs-export-${new Date().toISOString().split("T")[0]}.csv`;
    }

    // Download file
    const blob = new Blob([content], {
      type: exportFormat === "json" ? "application/json" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-outline-variant border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-display-lg text-primary mb-2">Settings</h1>
        <p className="text-sm text-on-surface-variant">
          Manage your profile, data, and preferences
        </p>
      </header>

      <div className="space-y-8 max-w-2xl">
        {/* Profile Section */}
        <motion.section
          className="p-8 rounded-lg border border-outline-variant bg-surface-container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-headline-md text-primary mb-6">Profile</h2>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Volume Title */}
            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-2">
                Volume Title (e.g. "Vol. 01")
              </label>
              <input
                type="text"
                value={volumeTitle}
                onChange={(e) => setVolumeTitle(e.target.value)}
                className="w-full px-4 py-2 bg-surface-container-high border border-outline-variant rounded-lg text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Save Button */}
            <motion.button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-primary text-on-primary font-label-caps text-xs rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </motion.button>
          </form>
        </motion.section>

        {/* Export Section */}
        <motion.section
          className="p-8 rounded-lg border border-outline-variant bg-surface-container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-headline-md text-primary mb-6">Export Data</h2>

          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              Export all your ventures and events. Choose your preferred format.
            </p>

            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === "json"}
                  onChange={(e) => setExportFormat(e.target.value as "json" | "csv")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-on-surface-variant">JSON</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === "csv"}
                  onChange={(e) => setExportFormat(e.target.value as "json" | "csv")}
                  className="w-4 h-4"
                />
                <span className="text-sm text-on-surface-variant">CSV</span>
              </label>
            </div>

            <motion.button
              onClick={handleExport}
              className="w-full py-3 bg-surface-container-high border border-outline-variant text-primary font-label-caps text-xs rounded-lg hover:bg-surface-container-highest transition-colors uppercase tracking-wider"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📥 Export All Data
            </motion.button>

            <p className="text-xs text-on-surface-variant text-center">
              {ventures.length} ventures · {events.length} events
            </p>
          </div>
        </motion.section>

        {/* Data Summary */}
        <motion.section
          className="p-8 rounded-lg border border-outline-variant bg-surface-container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-headline-md text-primary mb-6">Data Summary</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
                Total Ventures
              </p>
              <p className="text-2xl font-display-lg text-primary">
                {ventures.length}
              </p>
            </div>
            <div>
              <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
                Total Events
              </p>
              <p className="text-2xl font-display-lg text-primary">
                {events.length}
              </p>
            </div>
            <div>
              <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
                Active Ventures
              </p>
              <p className="text-2xl font-display-lg text-primary">
                {ventures.filter((v) => v.status === "active").length}
              </p>
            </div>
            <div>
              <p className="text-xs font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">
                Date Range
              </p>
              <p className="text-sm font-mono-data text-primary">
                {ventures.length > 0
                  ? new Date(
                      Math.min(
                        ...ventures.map((v) =>
                          new Date(v.started_date).getTime()
                        )
                      )
                    )
                      .getFullYear()
                      .toString()
                  : "—"}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Info Section */}
        <motion.section
          className="p-8 rounded-lg border border-outline-variant bg-surface-container-high"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-headline-md text-primary mb-2">
            About Preneurs
          </h3>
          <p className="text-xs text-on-surface-variant mb-4">
            Your personal archive for tracking ventures, milestones, and
            entrepreneurial patterns. All data is stored securely.
          </p>
          <p className="text-xs text-on-surface-variant/60">
            Version 0.1.0 · Built with Next.js, Tailwind, and Supabase
          </p>
        </motion.section>
      </div>

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </>
  );
}

