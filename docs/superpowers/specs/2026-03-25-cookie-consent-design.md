# Cookie Consent — Design Spec

**Date:** 2026-03-25
**Status:** Approved

## Overview

GDPR-compliant cookie consent system for SnusFriends with a two-step modal pattern optimized for high opt-in rates while giving users full control.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Analytics | Plausible (always-on, cookieless) + GA4 (consent-gated) | Baseline analytics without consent; deeper insights with consent |
| Marketing pixels | Meta Pixel + Google Ads + TikTok Pixel | Full-funnel coverage: social awareness + search intent + younger demo |
| Banner pattern | Two-step modal | ~65-75% opt-in rate; "Accept All" prominent, granular toggles on demand |
| Categories | 3 (Essential, Analytics, Marketing) | No personalization category — logged-in prefs handled by Supabase |

## Consent Categories

| Category | Toggle | Default | What It Gates |
|----------|--------|---------|---------------|
| Essential | Locked on | On | Supabase auth, cart, checkout, CSRF tokens |
| Analytics | User toggle | Off | GA4 (gtag.js) pageviews, events, conversions |
| Marketing | User toggle | Off | Meta Pixel, Google Ads tag, TikTok Pixel |

**Plausible** runs cookieless with no personal data collection — loads unconditionally, outside consent scope.

## UX Flow

### Step 1 — Initial Modal

- Glass-panel card centered on screen with backdrop blur overlay
- Blocks scroll until interacted with
- Content:
  - Headline: "We use cookies to improve your experience"
  - One-sentence explanation (friendly, not legalese)
  - **"Accept All"** — large primary/lime CTA button
  - **"Customize"** — subtle text link below the button
- Dismissing via backdrop click or X = reject all (essential only)
- No explicit "Reject All" on step 1

### Step 2 — Granular Preferences (only if "Customize" clicked)

- Same modal expands/transitions to show toggle panel
- Three categories listed with toggle switches:
  - **Essential cookies** — locked on, dimmed toggle, brief explanation
  - **Analytics cookies** — toggle off by default, "Helps us understand how you use the site"
  - **Marketing cookies** — toggle off by default, "Lets us show you relevant ads on social media"
- Buttons:
  - **"Save Preferences"** — primary CTA
  - **"Reject All"** — text link
- Each category has a one-line friendly description

### Re-access

- Small gear/cookie icon in the footer to re-open consent preferences at any time
- Links to privacy policy page

## Technical Architecture

### Component Structure

```
src/
  components/
    cookie-consent/
      CookieConsentProvider.tsx    — React context + consent state management
      CookieConsentBanner.tsx      — Two-step modal UI
      CookieConsentToggle.tsx      — Individual category toggle row
  hooks/
    useCookieConsent.ts            — Hook returning { analytics, marketing, updateConsent }
  lib/
    analytics.ts                   — Script injection logic (GA4, Meta, Google Ads, TikTok)
```

### Consent Storage

```typescript
// localStorage key: "sf_consent"
interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  version: 1;              // Bump to re-prompt when categories change
  timestamp: string;        // ISO 8601
}
```

- **Unauthenticated users:** localStorage only
- **Authenticated users:** localStorage + sync to Supabase `user_preferences` (future)
- **Version field:** If `version` in storage < current version, re-show banner

### Script Loading

```typescript
// In CookieConsentProvider useEffect:
if (consent.analytics) {
  loadGA4('G-XXXXXXXXXX');        // Inject gtag.js
}
if (consent.marketing) {
  loadMetaPixel('XXXXXXXXXX');    // Inject Meta Pixel
  loadGoogleAds('AW-XXXXXXXXXX'); // Inject Google Ads tag
  loadTikTokPixel('XXXXXXXXXX');  // Inject TikTok Pixel
}
// Plausible always loads via <script> in index.html (cookieless)
```

Scripts are loaded dynamically — never present in the HTML until consent is granted. On consent revocation, scripts are not unloaded (page reload clears them, standard practice).

### Context API

```typescript
const { analytics, marketing, showBanner, updateConsent, resetConsent } = useCookieConsent();
```

- `updateConsent({ analytics: true, marketing: false })` — updates state + localStorage
- `resetConsent()` — clears storage, re-shows banner
- `showBanner` — true when no consent recorded or version mismatch

### Integration Points

- **CookieConsentProvider** wraps the app in `App.tsx` (inside Router, outside other providers)
- **CookieConsentBanner** rendered conditionally when `showBanner` is true
- **Footer** gets a "Cookie Preferences" link that calls `resetConsent()`
- **Privacy Policy page** references cookie categories and purposes

## Design Tokens

- Modal: `glass-panel` class with backdrop blur
- Accept button: `bg-primary text-primary-foreground` (lime CTA)
- Customize link: `text-muted-foreground hover:text-foreground`
- Toggle switches: shadcn/ui `Switch` component
- Category descriptions: `text-sm text-muted-foreground`
- Locked toggle: `opacity-50 pointer-events-none`

## GDPR Compliance Notes

- Default state is "reject" (no cookies set until explicit consent)
- No pre-ticked checkboxes
- Granular control available (per-category toggles)
- Easy withdrawal (footer link to re-open preferences anytime)
- Consent recorded with timestamp for audit trail
- Cookie policy page explains each category in plain language

## Dependencies

- No external cookie consent libraries (custom ~3KB component)
- GA4 tracking ID (from Daniel)
- Meta Pixel ID (from Daniel)
- Google Ads conversion ID (from Daniel)
- TikTok Pixel ID (from Daniel)
- Plausible already configured (cookieless, no consent needed)

## Out of Scope

- Cookie policy page content (needs solicitor review)
- Actual pixel IDs (Daniel provides when ad accounts are set up)
- Server-side consent verification (client-only for now)
- Consent sync to Supabase (future enhancement for logged-in users)
