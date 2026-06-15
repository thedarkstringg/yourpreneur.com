/**
 * YOURPRENEUR CANVAS — DESIGN TOKEN SYSTEM
 * Single source of truth for all design values
 * Never hardcode colors, spacing, fonts, shadows, or transitions
 * Import from this file everywhere
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Background Hierarchy
  background: {
    base: '#0a0a0a',        // Main app background
    surface: '#111111',      // Cards, panels, elevated surfaces
    elevated: '#1a1a1a',     // Dialogs, modals, dropdowns
    overlay: '#222222',      // Overlay backdrop
  },

  // Borders
  border: {
    subtle: 'rgba(255,255,255,0.06)',
    default: 'rgba(255,255,255,0.10)',
    strong: 'rgba(255,255,255,0.18)',
  },

  // Text
  text: {
    primary: '#ffffff',                    // Main text (100%)
    secondary: 'rgba(255,255,255,0.55)',  // Secondary text (55%)
    tertiary: 'rgba(255,255,255,0.30)',   // Disabled/hint text (30%)
    disabled: 'rgba(255,255,255,0.18)',   // Disabled state
  },

  // Accent Colors
  accent: {
    teal: '#0dcfb1',
    'teal.dim': 'rgba(13,207,177,0.15)',
    coral: '#ff6b6b',
    amber: '#f5a623',
    gold: '#d4af37',
    purple: '#9b59b6',
  },

  // Status Colors
  status: {
    active: '#0dcfb1',                  // Active ventures - teal
    pivot: '#f5a623',                   // Pivot ventures - amber
    archived: 'rgba(255,255,255,0.25)', // Archived ventures
    acquired: '#d4af37',                // Acquired ventures - gold
    failed: '#ff6b6b',                  // Failed ventures - coral
    ideation: '#9b59b6',                // Ideation ventures - purple
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================
// 4px base unit: xs:4, sm:8, md:12, lg:16, xl:24, 2xl:32, 3xl:48

export const spacing = {
  xs: 3,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  '2xl': 28,
  '3xl': 40,
} as const;

// Common computed spacing values
export const spacingValues = {
  unit: spacing.xs,          // 4px base unit
  gutter: spacing.lg * 1.5,  // 24px
  entryGap: spacing.lg * 2,  // 32px
  sectionGap: spacing.lg * 4, // 64px
  containerMax: 800,         // Max content width
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const radius = {
  sm: 6,    // Buttons, small components
  md: 8,    // Cards, inputs, moderate components
  lg: 12,   // Dialogs, modals, large components
  xl: 16,   // Extra large components
  full: 9999, // Pill/circular shapes
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  family: {
    base: "'Inter', system-ui, -apple-system, sans-serif",
    display: "'Plus Jakarta Sans', system-ui, sans-serif",
    monospace: "'Monaco', 'Courier New', monospace",
  },

  size: {
    xs: 10,    // Extra small
    sm: 11,    // Small
    base: 12,  // Base/body
    md: 13,    // Medium
    lg: 14,    // Large
    xl: 18,    // Extra large
    '2xl': 22, // 2x large
    '3xl': 28, // 3x large
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// Typography scale names for semantic use
export const typographyScale = {
  'display-lg': {
    family: typography.family.display,
    size: typography.size['3xl'],
    weight: typography.weight.semibold,
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  'headline-md': {
    family: typography.family.display,
    size: typography.size['2xl'],
    weight: typography.weight.medium,
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
  },
  'body-base': {
    family: typography.family.base,
    size: typography.size.base,
    weight: typography.weight.regular,
    lineHeight: '1.5',
  },
  'body-sm': {
    family: typography.family.base,
    size: typography.size.sm,
    weight: typography.weight.regular,
    lineHeight: '1.5',
  },
  'label-caps': {
    family: typography.family.base,
    size: typography.size.xs,
    weight: typography.weight.semibold,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  'mono-data': {
    family: typography.family.monospace,
    size: typography.size.base,
    weight: typography.weight.regular,
    lineHeight: '1.4',
  },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  card: '0 2px 12px rgba(0,0,0,0.4)',
  elevated: '0 8px 32px rgba(0,0,0,0.6)',
  'glow.teal': '0 0 20px rgba(13,207,177,0.2)',
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '120ms ease',
  default: '200ms ease',
  slow: '350ms ease',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ============================================================================
// LAYOUT DIMENSIONS
// ============================================================================
// Used for fixed layout positioning

export const layout = {
  header: {
    height: 40,
    zIndex: 100,
  },
  sidebar: {
    width: 240,
    collapsedWidth: 48,
    zIndex: 50,
  },
  rightPanel: {
    width: 260,
    zIndex: 50,
  },
  toolbar: {
    height: 56,
    bottom: 20,
    zIndex: 60,
  },
  canvas: {
    edgeFade: 64, // Gradient fade at canvas edges
  },
} as const;

// ============================================================================
// COMPONENT SIZING
// ============================================================================

export const components = {
  button: {
    primary: {
      height: 36,
      heightSmall: 32,
      heightTiny: 28,
      borderRadius: radius.md,
      paddingX: 12,
      paddingY: 8,
      fontSize: typography.size.sm,
      fontWeight: typography.weight.semibold,
    },
    icon: {
      sm: {
        size: 30,
        iconSize: 14,
        borderRadius: radius.md,
      },
      md: {
        size: 34,
        iconSize: 16,
        borderRadius: radius.md,
      },
    },
  },

  input: {
    height: 36,
    heightSmall: 32,
    borderRadius: radius.md,
    paddingX: 12,
    paddingY: 8,
    fontSize: typography.size.base,
    borderColor: colors.border.default,
  },

  card: {
    borderRadius: radius.lg,
    border: `1px solid ${colors.border.default}`,
    boxShadow: shadows.card,
  },

  modal: {
    borderRadius: radius.lg,
    maxWidth: 460,
    padding: spacing.lg * 2, // 28px
  },

  ventureNode: {
    width: 200,
    minHeight: 110,
    borderRadius: radius.lg,
    topEdgeHeight: 2,
  },

  avatar: {
    lg: 40,
    md: 32,
    sm: 28,
    xs: 24,
  },
} as const;

// ============================================================================
// HELPER: Get CSS variable names
// ============================================================================

export const getCSSVariables = () => ({
  '--color-background-base': colors.background.base,
  '--color-background-surface': colors.background.surface,
  '--color-background-elevated': colors.background.elevated,
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-accent-teal': colors.accent.teal,
  '--spacing-xs': `${spacing.xs}px`,
  '--spacing-sm': `${spacing.sm}px`,
  '--spacing-md': `${spacing.md}px`,
  '--spacing-lg': `${spacing.lg}px`,
  '--radius-md': `${radius.md}px`,
  '--font-size-base': `${typography.size.base}px`,
  '--transition-default': transitions.default,
}) as const;

export default {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  transitions,
  layout,
  components,
};
