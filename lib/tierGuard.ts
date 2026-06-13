import { TIER_LIMITS, type Tier } from '@/config/tiers';
import type { Venture, VentureEvent } from '@/lib/useStore';

export interface TierCheckResult {
  allowed: boolean;
  reason?: string;
  feature?: string;
}

export const tierGuard = {
  canCreateVenture: (tier: Tier, currentVentureCount: number): TierCheckResult => {
    const limit = TIER_LIMITS[tier].maxVentures;
    if (currentVentureCount >= limit) {
      return {
        allowed: false,
        reason: `Free plan limited to ${limit} venture${limit > 1 ? 's' : ''}`,
        feature: 'Create Venture',
      };
    }
    return { allowed: true };
  },

  canAddEvent: (
    tier: Tier,
    ventureId: string,
    ventures: Venture[],
    events: VentureEvent[]
  ): TierCheckResult => {
    const limit = TIER_LIMITS[tier].maxEventsPerVenture;
    const ventureEvents = events.filter(e => e.ventureId === ventureId).length;

    if (ventureEvents >= limit) {
      return {
        allowed: false,
        reason: `Free plan limited to ${limit} events per venture`,
        feature: 'Add Event',
      };
    }
    return { allowed: true };
  },

  canAccessFeature: (tier: Tier, featureName: keyof typeof TIER_LIMITS.free.features): TierCheckResult => {
    const hasFeature = TIER_LIMITS[tier].features[featureName];
    if (!hasFeature) {
      return {
        allowed: false,
        reason: 'This feature is only available on Premium',
        feature: featureName,
      };
    }
    return { allowed: true };
  },

  getUpgradeMessage: (reason?: string): string => {
    return reason || 'Upgrade to Premium to unlock this feature';
  },

  getFeatureStatus: (tier: Tier) => {
    return TIER_LIMITS[tier].features;
  },
};
