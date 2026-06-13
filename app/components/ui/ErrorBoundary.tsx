'use client';

import React, { ReactNode } from 'react';
import { colors, spacing, radius, typography } from '@/styles/tokens';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing['2xl'],
            background: `linear-gradient(135deg, rgba(255,0,0,0.05) 0%, rgba(255,0,0,0.02) 100%)`,
            border: `1px solid ${colors.status.failed}40`,
            borderRadius: radius.lg,
            minHeight: 200,
          }}
        >
          <h2
            style={{
              fontSize: typography.size.lg,
              fontWeight: typography.weight.medium,
              color: colors.status.failed,
              marginBottom: spacing.md,
            }}
          >
            Oops! Something went wrong
          </h2>

          <p
            style={{
              fontSize: typography.size.sm,
              color: colors.text.secondary,
              marginBottom: spacing.lg,
              textAlign: 'center',
              maxWidth: 400,
            }}
          >
            {this.state.error.message || 'An unexpected error occurred'}
          </p>

          <button
            onClick={this.handleRetry}
            style={{
              padding: `${spacing.sm}px ${spacing.lg}px`,
              background: colors.status.failed,
              color: 'white',
              border: 'none',
              borderRadius: radius.full,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 150ms ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
