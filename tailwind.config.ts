import type { Config } from "tailwindcss";
import { colors, spacing, radius, typography, transitions } from "./styles/tokens";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Use tokens for all colors
        background: colors.background.base,
        surface: colors.background.surface,
        elevated: colors.background.elevated,
        overlay: colors.background.overlay,
        border: {
          subtle: colors.border.subtle,
          default: colors.border.default,
          strong: colors.border.strong,
        },
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          tertiary: colors.text.tertiary,
          disabled: colors.text.disabled,
        },
        accent: {
          teal: colors.accent.teal,
          "teal-dim": colors.accent["teal.dim"],
          coral: colors.accent.coral,
          amber: colors.accent.amber,
          gold: colors.accent.gold,
          purple: colors.accent.purple,
        },
        status: {
          active: colors.status.active,
          pivot: colors.status.pivot,
          archived: colors.status.archived,
          acquired: colors.status.acquired,
          failed: colors.status.failed,
          ideation: colors.status.ideation,
        },
      },
      borderRadius: {
        DEFAULT: `${radius.sm}px`,
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        xl: `${radius.xl}px`,
        full: `${radius.full}px`,
      },
      spacing: {
        xs: `${spacing.xs}px`,
        sm: `${spacing.sm}px`,
        md: `${spacing.md}px`,
        lg: `${spacing.lg}px`,
        xl: `${spacing.xl}px`,
        '2xl': `${spacing['2xl']}px`,
        '3xl': `${spacing['3xl']}px`,
        unit: `${spacing.xs}px`,
        gutter: "24px",
        "entry-gap": "32px",
        "section-gap": "64px",
        "container-max": "800px",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "Montserrat", "sans-serif"],
        mono: ["Inter", "sans-serif"],
        "body-sm": ["Inter"],
        "mono-data": ["Monaco", "Courier New", "monospace"],
        "display-lg": ["Plus Jakarta Sans"],
        "body-base": ["Inter"],
        "headline-md": ["Plus Jakarta Sans"],
        "label-caps": ["Inter"],
      },
      fontSize: {
        "body-sm": [`${typography.size.sm}px`, { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "mono-data": [`${typography.size.base}px`, { lineHeight: "1.4", letterSpacing: "0em", fontWeight: "400" }],
        "display-lg": [`${typography.size['3xl']}px`, { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-base": [`${typography.size.base}px`, { lineHeight: "1.5", letterSpacing: "0em", fontWeight: "400" }],
        "headline-md": [`${typography.size['2xl']}px`, { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "500" }],
        "label-caps": [`${typography.size.xs}px`, { lineHeight: "1", letterSpacing: "0.08em", fontWeight: "600" }],
      },
      backgroundImage: {
        "dot-grid": `radial-gradient(circle at center, ${colors.border.default} 1px, transparent 1px)`,
      },
      keyframes: {
        "button-scale": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "button-scale": `button-scale ${transitions.default}`,
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }: any) {
      addComponents({
        // Primary buttons (solid white, dark text)
        ".btn-primary": {
          "@apply h-9 px-5 rounded-md bg-white text-[#0c0a0a] text-[10px] font-bold uppercase tracking-widest transition-all duration-200": {},
          "@apply hover:opacity-90 active:scale-95": {},
        },
        // Secondary buttons (border, transparent)
        ".btn-secondary": {
          "@apply h-9 px-5 rounded-md border border-white/20 bg-transparent text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-200": {},
          "@apply hover:border-white/40 hover:bg-white/5 active:scale-95": {},
        },
        // Tertiary buttons (very subtle)
        ".btn-tertiary": {
          "@apply h-9 px-5 rounded-md bg-white/5 text-white/60 text-[10px] font-bold uppercase tracking-widest transition-all duration-200": {},
          "@apply hover:bg-white/10 hover:text-white/80 active:scale-95": {},
        },
        // Small icon buttons (36px)
        ".btn-icon-sm": {
          "@apply w-9 h-9 rounded-md border border-white/10 bg-white/5 text-white/40 flex items-center justify-center transition-all duration-200": {},
          "@apply hover:bg-white/10 hover:text-white/60 active:scale-95": {},
        },
        // Medium icon buttons (40px)
        ".btn-icon-md": {
          "@apply w-10 h-10 rounded-md border border-white/15 bg-white/5 text-white/40 flex items-center justify-center transition-all duration-200": {},
          "@apply hover:bg-white/10 hover:text-white/60 hover:border-white/25 active:scale-95": {},
        },
        // Status button (active/public state)
        ".btn-status": {
          "@apply h-9 px-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border flex items-center gap-2": {},
        },
        // Panel footer buttons
        ".btn-footer-save": {
          "@apply h-9 px-5 rounded-md bg-white text-[#0c0a0a] text-[10px] font-bold uppercase tracking-widest transition-opacity duration-200": {},
          "@apply hover:opacity-85": {},
        },
        ".btn-footer-cancel": {
          "@apply h-9 px-5 rounded-md border border-white/15 bg-transparent text-white/50 text-[9px] font-bold uppercase tracking-widest transition-all duration-200": {},
          "@apply hover:border-white/35 hover:text-white/70 hover:bg-white/5": {},
        },
        ".btn-footer-delete": {
          "@apply h-9 px-5 rounded-md bg-transparent text-white/40 text-[9px] font-bold uppercase tracking-widest transition-colors duration-200": {},
          "@apply hover:text-white/60": {},
        },
      });
    },
  ],
};

export default config;

