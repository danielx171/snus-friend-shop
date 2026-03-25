/**
 * Marketing pixels — gated by cookie consent (marketing category).
 *
 * Currently stubs for Meta Pixel and Google Ads.
 * Set VITE_META_PIXEL_ID and/or VITE_GOOGLE_ADS_ID when ready.
 */

let metaInitialized = false;
let googleAdsInitialized = false;

/** Initialize Meta Pixel. */
export function initMetaPixel() {
  if (metaInitialized) return;

  const pixelId = import.meta.env.VITE_META_PIXEL_ID;
  if (!pixelId) {
    if (import.meta.env.DEV) {
      console.info('[marketing] No VITE_META_PIXEL_ID — Meta Pixel disabled');
    }
    return;
  }

  // Meta Pixel base code
  const script = document.createElement('script');
  script.innerHTML = `
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
  document.head.appendChild(script);

  metaInitialized = true;
}

/** Initialize Google Ads conversion tracking. */
export function initGoogleAds() {
  if (googleAdsInitialized) return;

  const adsId = import.meta.env.VITE_GOOGLE_ADS_ID;
  if (!adsId) {
    if (import.meta.env.DEV) {
      console.info('[marketing] No VITE_GOOGLE_ADS_ID — Google Ads disabled');
    }
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  if (!window.gtag) window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', adsId);

  googleAdsInitialized = true;
}

/** Initialize all marketing pixels. */
export function initMarketingPixels() {
  initMetaPixel();
  initGoogleAds();
}

/** Track a purchase conversion (call on order confirmation). */
export function trackPurchase(value: number, currency = 'EUR', orderId?: string) {
  // Meta Pixel
  if (metaInitialized && window.fbq) {
    window.fbq('track', 'Purchase', { value, currency });
  }

  // Google Ads
  const conversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;
  if (googleAdsInitialized && window.gtag && conversionLabel) {
    window.gtag('event', 'conversion', {
      send_to: `${import.meta.env.VITE_GOOGLE_ADS_ID}/${conversionLabel}`,
      value,
      currency,
      transaction_id: orderId,
    });
  }
}

/** Track checkout started. */
export function trackCheckoutStarted(value: number, currency = 'EUR') {
  if (metaInitialized && window.fbq) {
    window.fbq('track', 'InitiateCheckout', { value, currency });
  }
  if (googleAdsInitialized && window.gtag) {
    window.gtag('event', 'begin_checkout', { value, currency });
  }
}

// Extend Window for fbq
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
