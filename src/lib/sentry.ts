import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';

export function initSentry() {
  if (!SENTRY_DSN) return;

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Only send errors in production
    enabled: import.meta.env.PROD,
    // Sample 10% of transactions for performance monitoring
    tracesSampleRate: 0.1,
    // Sample 10% of sessions for replay
    replaysSessionSampleRate: 0.1,
    // Always sample sessions with errors for replay
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Don't send PII
    sendDefaultPii: false,
    // Ignore common non-actionable errors
    ignoreErrors: [
      'ResizeObserver loop',
      'Network request failed',
      'Load failed',
      'ChunkLoadError',
    ],
  });
}

export { Sentry };
