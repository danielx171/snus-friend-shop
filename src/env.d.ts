/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SENTRY_DSN: string;
  readonly PUBLIC_POSTHOG_KEY: string;
  readonly PUBLIC_POSTHOG_HOST: string;
  readonly PUBLIC_GA_MEASUREMENT_ID: string;
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  readonly PAGESPEED_API_KEY: string;
  readonly GOOGLE_APPLICATION_CREDENTIALS: string;
  readonly GOOGLE_SERVICE_ACCOUNT_KEY_PATH: string;
  readonly GA4_PROPERTY_ID: string;
  readonly SEARCH_CONSOLE_PROPERTY: string;
  // Legacy until `audit:rank` is moved off Google Programmable Search.
  readonly GOOGLE_CUSTOM_SEARCH_API_KEY: string;
  // Legacy VITE_ vars (still used by existing React components during migration)
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_POSTHOG_KEY: string;
  readonly VITE_POSTHOG_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// PWA install prompt (carried over from current codebase)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    __pwaInstallPromptEvent: BeforeInstallPromptEvent | null;
    __AUTH_STATE__: { id: string; email: string } | null;
    __validThemes: string[];
    __OBSERVABILITY_CONFIG__?: { consentKey: string; gaMeasurementId: string };
    __OBSERVABILITY_BOOTSTRAPPED__?: boolean;
    __VERCEL_OBSERVABILITY_ENABLED__?: boolean;
    __VERCEL_SPEED_INSIGHTS_SET_ROUTE__?: ((route: string | null) => void) | null;
    __GA4_ENABLED__?: boolean;
    __LAST_OBSERVABILITY_PATH__?: string;
    __refreshObservability__?: () => void;
    __POSTHOG_LOADED__?: boolean;
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }

  // Augment Astro locals with auth data
  namespace App {
    interface Locals {
      user: import('@supabase/supabase-js').User | null;
      supabase: import('@supabase/supabase-js').SupabaseClient | null;
    }
  }
}

export {};
