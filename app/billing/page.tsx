'use client';

import { useStore } from '@/lib/useStore';
import { Check } from 'lucide-react';
import { TIER_LIMITS, PRICING } from '@/config/tiers';

export default function BillingPage() {
  const { user } = useStore();
  const currentTier = user?.tier || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Plans & Billing</h1>
          <p className="text-lg text-white/60">Choose the plan that fits your founder journey</p>
        </div>

        {/* Current Plan */}
        <div className="mb-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
          <p className="text-sm text-white/50 uppercase tracking-widest mb-3">Your Current Plan</p>
          <p className="text-3xl font-bold text-white capitalize">{currentTier} Plan</p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className={`border rounded-xl p-8 transition-all duration-300 ${
            currentTier === 'free'
              ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/20 to-purple-500/5'
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}>
            <h2 className="text-2xl font-bold text-white mb-2">Free</h2>
            <p className="text-white/40 text-base mb-8">For exploring and getting started</p>

            <div className="mb-8">
              <p className="text-sm text-white/60 mb-4 font-semibold">Includes:</p>
              <ul className="space-y-3">
                {[
                  '3 ventures',
                  '20 events per venture',
                  'Current year timeline',
                  '1 integration',
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-base text-white/70">
                    <Check size={20} className="text-purple-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button disabled className="w-full py-3 bg-white/10 text-white rounded-lg text-base font-semibold opacity-60 cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`border rounded-xl p-8 transition-all duration-300 transform ${
            currentTier === 'premium'
              ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 scale-105'
              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:scale-102'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
                <p className="text-white/40 text-base">
                  {PRICING.premium.displayPrice}/month
                </p>
              </div>
              {currentTier === 'premium' && (
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-bold rounded-full border border-cyan-500/40">
                  ACTIVE
                </span>
              )}
            </div>

            <div className="mb-8">
              <p className="text-sm text-white/60 mb-4 font-semibold">Everything in Free, plus:</p>
              <ul className="space-y-3">
                {[
                  'Unlimited ventures',
                  'Unlimited events',
                  'Full timeline (all years)',
                  'All integrations',
                  'Export to PDF/CSV',
                  'Task Canvas',
                  'COACH & REVIEW tools',
                  'Collaboration (5 viewers)',
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-base text-white/70">
                    <Check size={20} className="text-cyan-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {currentTier === 'premium' ? (
              <button disabled className="w-full py-3 bg-cyan-500/30 text-white rounded-lg text-base font-semibold opacity-60 cursor-not-allowed border border-cyan-500/40">
                Current Plan
              </button>
            ) : (
              <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="border-t border-white/10 pt-12">
          <h3 className="text-2xl font-bold text-white mb-8">Your Usage</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Ventures', value: '2/3', tier: 'free' },
              { label: 'Events', value: '15/20', tier: 'free' },
              { label: 'Integrations', value: '1/1', tier: 'free' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-6 transition-colors">
                <p className="text-white/50 text-sm font-semibold mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
