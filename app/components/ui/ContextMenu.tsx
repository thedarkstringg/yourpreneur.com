'use client';

import { useState, useEffect } from 'react';
import { Pencil, Plus, GitBranch, Crosshair, Link, Trash2 } from 'lucide-react';

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
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    if (isOpen) {
      // Adjust position to stay within viewport
      let adjustedX = x;
      let adjustedY = y;

      if (x + 180 > window.innerWidth) {
        adjustedX = window.innerWidth - 180 - 16;
      }

      if (y + 250 > window.innerHeight) {
        adjustedY = window.innerHeight - 250 - 16;
      }

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [isOpen, x, y]);

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

  const items: any[] = [
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
        top: position.y,
        left: position.x,
        background: 'rgba(12,9,9,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '6px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
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
                background: 'rgba(255,255,255,0.06)',
                margin: '4px 0',
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
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 12px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '10px',
              color: item.isDangerous ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 150ms',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = item.isDangerous ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)';
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
