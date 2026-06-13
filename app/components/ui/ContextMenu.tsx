'use client';

import { useEffect } from 'react';
import { Pencil, Plus, GitBranch, Crosshair, Link, Trash2 } from 'lucide-react';
import { colors, spacing, radius, typography, transitions, shadows } from '@/styles/tokens';
import type { LucideIcon } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  ventureId?: string;
  ventureName?: string;
  onEdit?: () => void;
  onLogEvent?: () => void;
  onBranch?: () => void;
  onFocus?: () => void;
  onCopyLink?: () => void;
  onDelete?: () => void;
}

export default function ContextMenu({
  x,
  y,
  isOpen,
  onClose,
  ventureId,
  ventureName,
  onEdit,
  onLogEvent,
  onBranch,
  onFocus,
  onCopyLink,
  onDelete,
}: ContextMenuProps) {
  const adjustedX = typeof window !== 'undefined' && x + 180 > window.innerWidth ? window.innerWidth - 180 - 16 : x;
  const adjustedY = typeof window !== 'undefined' && y + 250 > window.innerHeight ? window.innerHeight - 250 - 16 : y;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = () => {
      onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('click', handleClickOutside);

      return () => {
        window.removeEventListener('keydown', handleEscape);
        window.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  void ventureId;
  void ventureName;

  type ContextMenuItem =
    | { icon: LucideIcon; label: string; onClick?: () => void; isDangerous?: boolean; isDivider?: false }
    | { isDivider: true };

  const items: ContextMenuItem[] = [
    { icon: Pencil, label: 'Edit Venture', onClick: onEdit },
    { icon: Plus, label: 'Log Event', onClick: onLogEvent },
    { icon: GitBranch, label: 'Create Branch', onClick: onBranch },
    { icon: Crosshair, label: 'Focus on this', onClick: onFocus },
    { icon: Link, label: 'Copy venture link', onClick: onCopyLink },
    { isDivider: true },
    { icon: Trash2, label: 'Delete', onClick: onDelete, isDangerous: true },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: adjustedY,
        left: adjustedX,
        background: 'rgba(12,9,9,0.97)',
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius.md,
        padding: spacing.xs,
        boxShadow: shadows.elevated,
        minWidth: '180px',
        zIndex: 1000,
        animation: 'contextMenuOpen 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, idx) => {
        if (item.isDivider) {
          return (
            <div
              key={idx}
              style={{
                height: '1px',
                background: colors.border.subtle,
                margin: `${spacing.xs}px 0`,
              }}
            />
          );
        }

        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
            style={{
              width: '100%',
              height: 36,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `0 ${spacing.sm}px`,
              borderRadius: radius.sm,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: typography.size.xs,
              color: item.isDangerous ? colors.text.tertiary : colors.text.secondary,
              fontFamily: typography.family.base,
              transition: transitions.default,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = colors.border.subtle;
              e.currentTarget.style.color = colors.text.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = item.isDangerous ? colors.text.tertiary : colors.text.secondary;
            }}
          >
            <Icon size={12} strokeWidth={1.5} style={{ opacity: 0.6 }} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Helper function to show context menu
export function showContextMenu(
  x: number,
  y: number,
  callbacks: {
    onEdit?: () => void;
    onLogEvent?: () => void;
    onBranch?: () => void;
    onFocus?: () => void;
    onCopyLink?: () => void;
    onDelete?: () => void;
  }
) {
  // This would be used with state management to show the context menu
  // Return the callbacks and position for the ContextMenu component to use
  return {
    x,
    y,
    ...callbacks,
  };
}

