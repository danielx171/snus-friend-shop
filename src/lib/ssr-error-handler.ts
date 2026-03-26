// src/lib/ssr-error-handler.ts
// Wraps server-side data fetching with Sentry error capture.
// Usage: return await withSsrErrorCapture('ProductDetail', () => fetchData())

import * as Sentry from '@sentry/react'

export async function withSsrErrorCapture<T>(
  context: string,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    Sentry.captureException(error, {
      tags: { source: 'ssr', context },
    })
    throw error // Re-throw so Vike handles the error page
  }
}
