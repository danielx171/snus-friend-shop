import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'sf_consent';
const CURRENT_VERSION = 1;

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  version: number;
  timestamp: string; // ISO 8601
}

export interface CookieConsentContextValue {
  analytics: boolean;
  marketing: boolean;
  showBanner: boolean;
  updateConsent: (prefs: { analytics: boolean; marketing: boolean }) => void;
  resetConsent: () => void;
  // Compat helpers used by useConsentGatedTracking / existing code
  hasConsented: boolean;
  allowsAnalytics: boolean;
  allowsMarketing: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveCustomPreferences: (categories: { analytics: boolean; marketing: boolean }) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

function persist(state: ConsentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private mode / quota exceeded).
  }
}

function loadStored(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Re-prompt if version is outdated
    if (!parsed.version || parsed.version < CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Script injection helpers
// ---------------------------------------------------------------------------

function scriptExists(id: string): boolean {
  return !!document.getElementById(id);
}

function loadGA4(measurementId: string) {
  if (scriptExists('sf-ga4')) return;
  const s = document.createElement('script');
  s.id = 'sf-ga4';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
}

function loadMetaPixel(pixelId: string) {
  if (scriptExists('sf-meta-pixel')) return;
  const s = document.createElement('script');
  s.id = 'sf-meta-pixel';
  s.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(s);
}

function loadGoogleAds(adsId: string) {
  if (scriptExists('sf-gads')) return;
  const s = document.createElement('script');
  s.id = 'sf-gads';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  if (!window.gtag) window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', adsId);
}

function loadTikTokPixel(pixelId: string) {
  if (scriptExists('sf-tiktok-pixel')) return;
  const s = document.createElement('script');
  s.id = 'sf-tiktok-pixel';
  s.innerHTML = `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
      ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
      var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
      var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load('${pixelId}');
      ttq.page();
    }(window, document, 'ttq');
  `;
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(() => loadStored());

  const showBanner = consent === null;
  const analytics = consent?.analytics ?? false;
  const marketing = consent?.marketing ?? false;

  // Inject / block scripts based on consent
  useEffect(() => {
    if (!consent) return;

    if (consent.analytics) {
      const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
      // Only inject with a real ID or the placeholder (placeholder won't actually fire)
      if (ga4Id !== 'G-XXXXXXXXXX') loadGA4(ga4Id);
      else if (import.meta.env.DEV) console.info('[consent] GA4 placeholder — skipping injection');
    }

    if (consent.marketing) {
      const metaId = import.meta.env.VITE_META_PIXEL_ID || 'XXXXXXXXXX';
      const gadsId = import.meta.env.VITE_GOOGLE_ADS_ID || 'AW-XXXXXXXXXX';
      const tiktokId = import.meta.env.VITE_TIKTOK_PIXEL_ID || 'XXXXXXXXXX';

      if (metaId !== 'XXXXXXXXXX') loadMetaPixel(metaId);
      else if (import.meta.env.DEV) console.info('[consent] Meta Pixel placeholder — skipping injection');

      if (gadsId !== 'AW-XXXXXXXXXX') loadGoogleAds(gadsId);
      else if (import.meta.env.DEV) console.info('[consent] Google Ads placeholder — skipping injection');

      if (tiktokId !== 'XXXXXXXXXX') loadTikTokPixel(tiktokId);
      else if (import.meta.env.DEV) console.info('[consent] TikTok Pixel placeholder — skipping injection');
    }
  }, [consent]);

  const updateConsent = useCallback((prefs: { analytics: boolean; marketing: boolean }) => {
    const next: ConsentState = {
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
    };
    persist(next);
    setConsent(next);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent({ analytics: true, marketing: true });
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent({ analytics: false, marketing: false });
  }, [updateConsent]);

  const resetConsent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConsent(null);
  }, []);

  const value: CookieConsentContextValue = {
    analytics,
    marketing,
    showBanner,
    updateConsent,
    resetConsent,
    // Compat with existing useConsentGatedTracking / CookieConsent component
    hasConsented: !showBanner,
    allowsAnalytics: analytics,
    allowsMarketing: marketing,
    acceptAll,
    rejectNonEssential,
    saveCustomPreferences: updateConsent,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Global type augmentations (extend Window for pixels)
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: unknown;
    TiktokAnalyticsObject?: string;
  }
}
