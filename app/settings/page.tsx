'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, Bell, Lock, Eye, Globe, Shield, ChevronRight, ArrowLeft, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    productUpdates: false,
    twoFactor: false,
    darkMode: true,
    language: 'English (US)',
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
        enabled ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white/10'
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    action,
    settingKey,
    isToggle,
  }: {
    icon: any;
    title: string;
    description: string;
    action?: React.ReactNode;
    settingKey?: keyof typeof settings;
    isToggle?: boolean;
  }) => (
    <div className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/5 group-hover:bg-white/10 rounded-lg transition-colors">
          <Icon size={24} className="text-white/70 group-hover:text-white" />
        </div>
        <div>
          <p className="text-white font-semibold">{title}</p>
          <p className="text-sm text-white/50">{description}</p>
        </div>
      </div>
      {isToggle && settingKey ? (
        <ToggleSwitch
          enabled={settings[settingKey] as boolean}
          onChange={() => toggleSetting(settingKey)}
        />
      ) : (
        action
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/profile" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} />
            Back to Profile
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white">Settings</h1>
            <p className="text-white/60 mt-2">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Appearance Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Eye size={20} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Appearance</h2>
            </div>
            <div className="space-y-4">
              <SettingItem
                icon={Eye}
                title="Dark Mode"
                description="Uses less battery and is easier on the eyes"
                settingKey="darkMode"
                isToggle
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Bell size={20} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <SettingItem
                icon={Bell}
                title="Email Notifications"
                description="Receive important updates about your ventures"
                settingKey="emailNotifications"
                isToggle
              />
              <SettingItem
                icon={Bell}
                title="Weekly Founder Digest"
                description="Get a summary of your venture activity each week"
                settingKey="weeklyDigest"
                isToggle
              />
              <SettingItem
                icon={Zap}
                title="Product Updates"
                description="Stay informed about new features and improvements"
                settingKey="productUpdates"
                isToggle
              />
            </div>
          </div>

          {/* Security Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Lock size={20} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Security</h2>
            </div>
            <div className="space-y-4">
              <SettingItem
                icon={Lock}
                title="Change Password"
                description="Update your login password regularly"
                action={
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    Update
                    <ChevronRight size={18} />
                  </button>
                }
              />
              <SettingItem
                icon={Shield}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                settingKey="twoFactor"
                isToggle
              />
              <SettingItem
                icon={Shield}
                title="Active Sessions"
                description="View and manage your active login sessions"
                action={
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    Manage
                    <ChevronRight size={18} />
                  </button>
                }
              />
            </div>
          </div>

          {/* Language & Region Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Globe size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Language & Region</h2>
            </div>
            <div className="space-y-4">
              <SettingItem
                icon={Globe}
                title="Language"
                description="Choose your preferred language"
                action={
                  <select className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:border-white/30 transition-colors">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                }
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Settings size={20} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              <SettingItem
                icon={Settings}
                title="Delete Account"
                description="Permanently delete your account and all data"
                action={
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold rounded-lg border border-red-500/30 transition-colors flex items-center gap-2">
                    Delete
                    <ChevronRight size={18} />
                  </button>
                }
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-white/60">
            💡 Changes are saved automatically. If you need additional help, contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
