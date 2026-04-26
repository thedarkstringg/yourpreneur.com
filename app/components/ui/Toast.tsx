'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Info, XCircle } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
  duration?: number;
}

const toastStore: { toasts: Toast[]; listeners: Set<Function> } = {
  toasts: [],
  listeners: new Set(),
};

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
    const id = Math.random().toString(36);
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
        top: '64px',
        right: '16px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            style={{
              background: 'rgba(14,11,11,0.96)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '10px',
              color: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              animation: 'slideInRight 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => removeToast(toast.id)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.1)';
            }}
          >
            <Icon
              size={14}
              strokeWidth={1.5}
              style={{
                color: toast.type === 'success' ? 'rgba(100,255,100,0.8)' : 'rgba(255,255,255,0.6)',
              }}
            />
            <span>{toast.message}</span>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(calc(100% + 16px));
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
            transform: translateX(calc(100% + 16px));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

