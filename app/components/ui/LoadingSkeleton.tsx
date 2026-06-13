'use client';

import { colors, spacing, radius } from '@/styles/tokens';

interface LoadingSkeletonProps {
  count?: number;
  height?: number;
}

export function LoadingSkeleton({ count = 3, height = 60 }: LoadingSkeletonProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: `${height}px`,
            background: `linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)`,
            backgroundSize: '200% 100%',
            borderRadius: radius.md,
            border: `1px solid ${colors.border.subtle}`,
            animation: 'shimmer 2s infinite',
          }}
        >
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
