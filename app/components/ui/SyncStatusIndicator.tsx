'use client';

import { useStore } from '@/lib/useStore';
import { colors, spacing, typography, radius } from '@/styles/tokens';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export function SyncStatusIndicator() {
  const { syncStatus, syncError } = useStore();

  if (syncStatus === 'idle') return null;

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return colors.text.secondary;
      case 'synced':
        return colors.status.success;
      case 'error':
        return colors.status.failed;
      default:
        return colors.text.primary;
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Loader size={14} className="animate-spin" />;
      case 'synced':
        return <CheckCircle size={14} />;
      case 'error':
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return 'Synced';
      case 'error':
        return `Error: ${syncError || 'Failed to sync'}`;
      default:
        return '';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs}px ${spacing.sm}px`,
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: radius.full,
        fontSize: typography.size.xs,
        color: getStatusColor(),
      }}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}

export default SyncStatusIndicator;
