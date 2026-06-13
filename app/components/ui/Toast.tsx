'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Info, XCircle } from 'lucide-react';
import { colors, spacing, radius, typography, transitions, layout, shadows } from '@/styles/tokens';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
  duration?: number;
}

const toastStore: { toasts: Toast[]; listeners: Set<() => void> } = {
  toasts: [],
  listeners: new Set(),
};
let toastCounter = 0;

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const updateToasts = () => setToasts([...toastStore.toasts]);
    toastStore.listeners.add(updateToasts);

    return () => {
      toastStore.listeners.delete(updateToasts);
    };
  }, []);

  const addToast = (type: Toast['type'], message: string, duration = 2500) => {
    const id = `toast-${toastCounter++}`;
    const toast: Toast = { id, type, message, duration };

    toastStore.toasts.push(toast);
    toastStore.listeners.forEach((listener) => listener());

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
    toastStore.listeners.forEach((listener) => listener());
  };

  return { toasts, addToast, removeToast };
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToasts();

  const iconMap = {
    success: CheckCircle,
    info: Info,
    error: XCircle,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: `${layout.header.height}px`,
        right: spacing.lg,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              background: colors.background.elevated,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              padding: `${spacing.md}px ${spacing.lg}px`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              fontFamily: typography.family.base,
              fontSize: typography.size.xs,
              color: colors.text.primary,
              backdropFilter: 'blur(16px)',
              boxShadow: shadows.elevated,
              animation: `slideInRight ${transitions.default}`,
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => removeToast(toast.id)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = `1px solid ${colors.border.strong}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = `1px solid ${colors.border.default}`;
            }}
          >
            <Icon
              size={14}
              strokeWidth={1.5}
              style={{
                color: toast.type === 'success' ? colors.status.active : colors.text.secondary,
              }}
            />
            <span>{toast.message}</span>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(calc(100% + ${spacing.lg}px));
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(calc(100% + ${spacing.lg}px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

