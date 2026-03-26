import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryWrapper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.componentName ?? 'Island'}] Error:`, error);
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        extra: {
          componentStack: info.componentStack,
          component: this.props.componentName,
        },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-lg border border-border bg-card/60 p-4 text-center text-sm text-muted-foreground">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundaryWrapper;
