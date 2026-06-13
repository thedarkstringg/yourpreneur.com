'use client';

import { colors, spacing, radius, typography } from '@/styles/tokens';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  onAction: () => void;
  actionLabel: string;
}

export function EmptyState({ title, description, onAction, actionLabel }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['3xl'],
        textAlign: 'center',
        height: '100%',
        background: `linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)`,
        borderRadius: radius.lg,
      }}
    >
      <h2
        style={{
          fontSize: typography.size.lg,
          fontWeight: typography.weight.medium,
          color: colors.text.primary,
          marginBottom: spacing.md,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: typography.size.sm,
          color: colors.text.secondary,
          marginBottom: spacing.xl,
          maxWidth: 300,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      <button
        onClick={onAction}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing.sm}px ${spacing.lg}px`,
          background: colors.text.primary,
          color: colors.background.base,
          border: 'none',
          borderRadius: radius.full,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.medium,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          transition: 'opacity 150ms ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <Plus size={14} />
        {actionLabel}
      </button>
    </div>
  );
}

export default EmptyState;
