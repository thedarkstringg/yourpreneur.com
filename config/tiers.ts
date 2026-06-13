export type Tier = 'free' | 'premium';

export const TIER_LIMITS = {
  free: {
    maxVentures: 3,
    maxEventsPerVenture: 20,
    visibleYears: 'current',
    maxIntegrations: 1,
    features: {
      liveFeed: false,
      export: false,
      taskCanvas: false,
      coach: false,
      review: false,
      collaboration: false,
      privateToggle: false,
    },
  },
  premium: {
    maxVentures: Infinity,
    maxEventsPerVenture: Infinity,
    visibleYears: 'all',
    maxIntegrations: Infinity,
    features: {
      liveFeed: true,
      export: true,
      taskCanvas: true,
      coach: true,
      review: true,
      collaboration: true,
      privateToggle: true,
    },
  },
} as const;

export const PRICING = {
  premium: {
    monthly: 1299, // in cents ($12.99/month)
    displayPrice: '$12.99',
    billingCycle: 'month',
  },
};
