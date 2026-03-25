/**
 * Analytics integration — gated by cookie consent (analytics category).
 *
 * Currently a stub that logs events to console in dev.
 * Replace the GA4 block with real tracking IDs when ready.
 */

let initialized = false;

/** Initialize analytics (call once when consent.analytics becomes true). */
export function initAnalytics() {
  if (initialized) return;

  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!measurementId) {
    if (import.meta.env.DEV) {
      console.info('[analytics] No VITE_GA4_MEASUREMENT_ID — analytics disabled');
    }
    return;
  }

  // Load gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  initialized = true;
}

/** Track a custom event (only fires if analytics is initialized). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!initialized || !window.gtag) {
    if (import.meta.env.DEV) {
      console.debug('[analytics] trackEvent (not initialized):', name, params);
    }
    return;
  }
  window.gtag('event', name, params);
}

/** Track a page view. */
export function trackPageView(path: string) {
  trackEvent('page_view', { page_path: path });
}

// Extend Window for gtag
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
