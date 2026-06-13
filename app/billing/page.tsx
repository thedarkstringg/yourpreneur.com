'use client';

import { useStore } from '@/lib/useStore';
import { Check } from 'lucide-react';
import { TIER_LIMITS, PRICING } from '@/config/tiers';

export default function BillingPage() {
  const { user } = useStore();
  const currentTier = user?.tier || 'free';

  return (
    <div className="min-h-screen bg-black pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Plans & Billing</h1>
          <p className="text-white/50">Choose the plan that fits your founder journey</p>
        </div>

        {/* Current Plan */}
        <div className="mb-8 bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-2">Current Plan</p>
          <p className="text-2xl font-bold text-white capitalize">{currentTier} Plan</p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`border rounded-lg p-8 transition-all ${
            currentTier === 'free'
              ? 'border-white/20 bg-white/10'
              : 'border-white/8 bg-white/5 opacity-60'
          }`}>
            <h2 className="text-xl font-bold text-white mb-2">Free</h2>
            <p className="text-white/40 text-sm mb-6">For exploring</p>

            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3">Includes:</p>
              <ul className="space-y-2">
                {[
                  '3 ventures',
                  '20 events per venture',
                  'Current year timeline',
                  '1 integration',
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                    <Check size={16} className="text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button disabled className="w-full py-2 bg-white/5 text-white rounded-lg text-sm opacity-50">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`border rounded-lg p-8 transition-all ${
            currentTier === 'premium'
              ? 'border-cyan-500/50 bg-cyan-500/10'
              : 'border-white/20 bg-white/5'
          }`}>
            <h2 className="text-xl font-bold text-white mb-2">Premium</h2>
            <p className="text-white/40 text-sm mb-6">
              {PRICING.premium.displayPrice}/month
            </p>

            <div className="mb-6">
              <p className="text-sm text-white/60 mb-3">Includes everything, plus:</p>
              <ul className="space-y-2">
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
                  <li key={feature} className="flex items-center gap-2 text-sm text-white/60">
                    <Check size={16} className="text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {currentTier === 'premium' ? (
              <button disabled className="w-full py-2 bg-cyan-500/50 text-white rounded-lg text-sm opacity-60">
                Current Plan
              </button>
            ) : (
              <button className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition-colors">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <h3 className="text-lg font-bold text-white mb-6">Usage</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Ventures', value: '2/3', tier: 'free' },
              { label: 'Events', value: '15/20', tier: 'free' },
              { label: 'Integrations', value: '1/1', tier: 'free' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
