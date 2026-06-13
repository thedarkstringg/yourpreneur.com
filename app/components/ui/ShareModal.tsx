'use client';

import { Copy, Share2, X } from 'lucide-react';
import { useState } from 'react';
import { createShareLink } from '@/lib/sharing';
import { useToasts } from './Toast';
import { useStore } from '@/lib/useStore';
import { colors, spacing, radius, typography, transitions } from '@/styles/tokens';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ventureId?: string | null;
  ventureName?: string;
}

export default function ShareModal({ isOpen, onClose, ventureId, ventureName }: ShareModalProps) {
  const [shareLink, setShareLink] = useState('');
  const [role, setRole] = useState<'viewer' | 'commenter' | 'editor'>('viewer');
  const [copied, setCopied] = useState(false);
  const { addToast } = useToasts();
  const { user } = useStore();

  const handleGenerateLink = async () => {
    if (!ventureId || !user?.id) {
      addToast('error', 'No venture or user selected');
      return;
    }

    try {
      const actualRole = (role === 'commenter' ? 'viewer' : role) as 'viewer' | 'editor';
      const shareResult = await createShareLink(user.id, ventureId, actualRole, { days: 30 });
      const link = `${window.location.origin}/share/${shareResult.linkToken}`;
      setShareLink(link);
      addToast('success', 'Share link generated');
    } catch (error) {
      addToast('error', 'Failed to generate share link');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('success', 'Link copied to clipboard');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: colors.background.base,
          borderRadius: radius.lg,
          border: `1px solid ${colors.border.default}`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.lg,
            borderBottom: `1px solid ${colors.border.subtle}`,
          }}
        >
          <h2 style={{ fontSize: typography.size.lg, fontWeight: 600, color: colors.text.primary }}>
            <Share2 size={18} style={{ display: 'inline', marginRight: spacing.sm }} />
            Share {ventureName && `"${ventureName}"`}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: colors.text.tertiary,
              cursor: 'pointer',
              padding: spacing.xs,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: spacing.lg }}>
          {/* Role selection */}
          <div style={{ marginBottom: spacing.lg }}>
            <label style={{ display: 'block', marginBottom: spacing.sm, color: colors.text.secondary, fontSize: typography.size.sm }}>
              Access level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing.sm }}>
              {(['viewer', 'commenter', 'editor'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: spacing.md,
                    border: `2px solid ${role === r ? colors.accent.teal : colors.border.subtle}`,
                    borderRadius: radius.md,
                    background: role === r ? `${colors.accent.teal}20` : colors.background.surface,
                    color: role === r ? colors.accent.teal : colors.text.secondary,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontSize: typography.size.xs,
                    fontWeight: 500,
                    transition: `all ${transitions.default}`,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Generate link button */}
          <button
            onClick={handleGenerateLink}
            style={{
              width: '100%',
              padding: `${spacing.md}px ${spacing.lg}px`,
              background: colors.accent.teal,
              color: colors.text.primary,
              border: 'none',
              borderRadius: radius.md,
              fontSize: typography.size.sm,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: spacing.lg,
              transition: `opacity ${transitions.default}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Generate share link
          </button>

          {/* Share link display */}
          {shareLink && (
            <div
              style={{
                background: colors.background.surface,
                border: `1px solid ${colors.border.subtle}`,
                borderRadius: radius.md,
                padding: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <div style={{ fontSize: typography.size.xs, color: colors.text.tertiary, marginBottom: spacing.xs }}>
                Share this link with {role === 'viewer' ? 'read-only' : role === 'commenter' ? 'comment' : 'full'} access:
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  background: colors.background.base,
                  padding: spacing.md,
                  borderRadius: radius.sm,
                  marginTop: spacing.sm,
                }}
              >
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: colors.text.primary,
                    fontSize: typography.size.xs,
                    outline: 'none',
                    fontFamily: "'Monaco', monospace",
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text.tertiary,
                    cursor: 'pointer',
                    padding: spacing.xs,
                    transition: `color ${transitions.default}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.text.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = colors.text.tertiary)}
                >
                  <Copy size={14} />
                </button>
              </div>
              {copied && (
                <div style={{ fontSize: typography.size.xs, color: colors.status.active, marginTop: spacing.sm }}>
                  ✓ Copied!
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div style={{ fontSize: typography.size.xs, color: colors.text.tertiary, lineHeight: 1.5 }}>
            Share links expire in 30 days. Recipients will see your venture data with the access level you specified.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: `1px solid ${colors.border.subtle}`,
            padding: spacing.lg,
            background: colors.background.surface,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: spacing.sm,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: `${spacing.sm}px ${spacing.lg}px`,
              background: 'none',
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              color: colors.text.secondary,
              cursor: 'pointer',
              fontSize: typography.size.sm,
              transition: `background ${transitions.default}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.background.base)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
