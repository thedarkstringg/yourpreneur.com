'use client';

import { colors, spacing, radius, transitions } from '@/styles/tokens';

export default function KeyboardHelp({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigationShortcuts = [
    { key: '/', action: 'Focus global search' },
    { key: 'N', action: 'Create new venture' },
    { key: 'E', action: 'Log an event' },
    { key: 'M', action: 'Modify selected venture' },
    { key: 'F', action: 'Focus canvas' },
    { key: 'L', action: 'Toggle ventures list' },
    { key: 'R', action: 'Open annual review' },
    { key: 'T', action: 'Open task canvas' },
    { key: 'G', action: 'Grid view' },
    { key: 'A', action: 'Toggle axis' },
    { key: '?', action: 'Show this help' },
  ];

  const canvasShortcuts = [
    { key: 'Double Click', action: 'Open modify panel for venture' },
    { key: 'Space + Drag', action: 'Pan the canvas' },
    { key: 'Scroll', action: 'Zoom in/out' },
  ];

  const ShortcutRow = ({ keyLabel, action }: { keyLabel: string; action: string }) => {
    const isModifier = keyLabel.includes('+') || keyLabel.includes('Double') || keyLabel.includes('Scroll');

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: radius.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: colors.background.surface,
          border: `1px solid ${colors.border.default}`,
        }}>
          <span style={{
            fontSize: 12,
            fontFamily: "'Monaco', monospace",
            color: isModifier ? colors.text.secondary : colors.text.primary,
            textAlign: 'center',
            paddingLeft: spacing.xs,
            paddingRight: spacing.xs,
            fontWeight: isModifier ? 400 : 600,
          }}>{keyLabel}</span>
        </div>
        <p style={{
          fontSize: 14,
          color: colors.text.secondary,
        }}>{action}</p>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.lg,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border.subtle}`,
        background: colors.background.base,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'space-between',
          padding: spacing.lg,
          borderBottom: `1px solid ${colors.border.subtle}`,
        }}>
          <div>
            <h2 style={{
              fontSize: 18,
              fontWeight: 600,
              color: colors.text.primary,
            }}>Keyboard Shortcuts</h2>
            <p style={{
              fontSize: 14,
              color: colors.text.tertiary,
              marginTop: spacing.xs,
            }}>Quick reference for navigation and canvas control</p>
          </div>
          <button
            onClick={onClose}
            style={{
              color: colors.text.tertiary,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing.xs,
              transition: `color ${transitions.default}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.primary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.tertiary)}
            aria-label="Close"
          >
            <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: spacing.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.lg,
          maxHeight: 'calc(100vh - 300px)',
          overflowY: 'auto',
        }}>
          {/* Navigation Section */}
          <div>
            <h3 style={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.text.disabled,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderLeft: `2px solid ${colors.border.default}`,
              paddingLeft: spacing.sm,
              marginBottom: spacing.md,
            }}>
              Navigation
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing.lg,
            }}>
              {navigationShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.key} keyLabel={shortcut.key} action={shortcut.action} />
              ))}
            </div>
          </div>

          {/* Canvas Control Section */}
          <div>
            <h3 style={{
              fontSize: 12,
              fontWeight: 600,
              color: colors.text.disabled,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderLeft: `2px solid ${colors.border.default}`,
              paddingLeft: spacing.sm,
              marginBottom: spacing.md,
            }}>
              Canvas Control
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {canvasShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.key} keyLabel={shortcut.key} action={shortcut.action} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${colors.border.subtle}`,
          padding: spacing.lg,
          background: colors.background.surface,
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              height: 44,
              background: colors.accent.teal,
              color: colors.text.primary,
              fontWeight: 600,
              fontSize: 14,
              borderRadius: radius.md,
              border: 'none',
              cursor: 'pointer',
              transition: `opacity ${transitions.default}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
