'use client';

import { useStore } from '@/lib/useStore';
import { User, Mail, Shield, Calendar, Settings, LogOut, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border-4 border-white/20 flex-shrink-0 shadow-lg">
                <User size={64} className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{user?.fullName || 'Founder'}</h1>
                <p className="text-lg text-white/60 mb-4 break-all">{user?.email}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-200 text-sm font-semibold flex items-center gap-2">
                    <Zap size={16} />
                    {user?.tier === 'premium' ? 'Premium' : 'Free'} Plan
                  </span>
                  <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-200 text-sm font-semibold">
                    Member Since 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Info Cards */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>

            <div className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <Mail size={24} className="text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Email Address</p>
                  <p className="text-lg text-white font-medium">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Shield size={24} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Subscription Tier</p>
                  <p className="text-lg text-white font-medium capitalize">{user?.tier || 'Free'} Plan</p>
                  <p className="text-sm text-white/40 mt-1">
                    {user?.tier === 'premium' ? 'Unlock all features and priority support' : 'Upgrade to unlock premium features'}
                  </p>
                </div>
              </div>
            </div>

            <div className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                  <Calendar size={24} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">Account Created</p>
                  <p className="text-lg text-white font-medium">June 2026</p>
                  <p className="text-sm text-white/40 mt-1">Your journey started</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/settings" className="group flex items-center gap-3 w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300">
                <Settings size={20} className="text-white/60 group-hover:text-white transition-colors" />
                <span className="text-white group-hover:font-semibold transition-all">Settings</span>
              </Link>

              <button className="group flex items-center gap-3 w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300">
                <Zap size={20} className="text-white/60 group-hover:text-purple-400 transition-colors" />
                <span className="text-white group-hover:font-semibold transition-all">
                  {user?.tier === 'premium' ? 'Manage Plan' : 'Upgrade'}
                </span>
              </button>

              <button className="group flex items-center gap-3 w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-all duration-300">
                <LogOut size={20} className="text-red-400 group-hover:text-red-300 transition-colors" />
                <span className="text-red-300 group-hover:font-semibold transition-all">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats/Features Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Your Profile Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
              <p className="text-3xl font-bold text-purple-400 mb-2">0</p>
              <p className="text-sm text-white/60">Ventures Created</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
              <p className="text-3xl font-bold text-blue-400 mb-2">0</p>
              <p className="text-sm text-white/60">Events Logged</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
              <p className="text-3xl font-bold text-emerald-400 mb-2">0</p>
              <p className="text-sm text-white/60">Tasks Completed</p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-8">
          <Link href="/profile/edit" className="block w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
