# Vike Migration — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Migrate SnusFriend from a client-only Vite SPA to Vike with per-page SSR/SSG, plus auto-generated programmatic category pages for SEO.

**Architecture:** Replace React Router with Vike's file-based routing. Each page gets its own render mode (SSG, SSR, or SPA). Programmatic filter pages are pre-rendered at build time from product data. Deployed on Vercel via Photon.

**Tech Stack:** Vike 0.4.x, vike-react, vike-photon, @photonjs/vercel, better-themes, @supabase/supabase-js (server-side client)

---

## Context

SnusFriend is a nicotine pouch e-commerce store. It's a Vite SPA (React 18 + TypeScript + Tailwind + shadcn/ui + Supabase) with 33 pages, ~40 routes, and 9 nested context providers. Google Ads bans nicotine products, so organic SEO is the entire customer acquisition strategy. An SPA delivers empty HTML to crawlers — SSR/SSG fixes this.

### Current State
- React Router v6 (BrowserRouter) with centralized routes in App.tsx
- react-helmet-async for per-page SEO meta tags
- next-themes for dark mode (works in SPA but breaks under SSR)
- React.lazy + Suspense for code splitting (~20 lazy pages)
- Supabase client-side only (anon key, VITE_ prefixed env vars)
- PostHog analytics, Sentry error tracking, vite-plugin-pwa
- 52 files use React Router APIs (Link, useNavigate, useParams, useLocation, useSearchParams)
- Deployed on Vercel (static SPA output)

### Why Vike
- Incremental migration: start with catch-all SPA, migrate page by page
- Per-page render modes: SSG, SSR, or SPA via simple config
- Vite-native: no framework switch, keeps all existing React code
- Programmatic pages via +onBeforePrerenderStart (generates URLs at build time)
- Vercel deployment via Photon (Build Output API)
- Free (no prerendering service cost)

---

## Migration Scope

### Approach: Full Migration (Approach A)
Replace React Router entirely with Vike file-based routing. Every page becomes a Vike page with explicit render mode. Two routing systems do NOT coexist permanently — React Router is removed after migration.

### Render Modes

| Mode | Pages | Rationale |
|------|-------|-----------|
| **SSG** (prerender at build) | HomePage, BrandsIndex, FAQ, BlogIndex, all info/legal pages, WhatsNew, **all programmatic filter pages** | Static content, fastest load, zero server cost |
| **SSR** (per-request) | ProductListing (base), ProductDetail, BrandHub, BlogPost | Fresh data needed, SEO-critical |
| **SPA** (client-only) | Cart, Checkout, Account, Auth pages, Ops pages, Wishlist, Rewards, Community, Search, Leaderboard, BundleBuilder, FlavorQuiz, OrderConfirmation, Membership | Auth-gated or no SEO value |

### Programmatic Category Pages (SSG)
Auto-generate filtered listing pages from product database attributes:

**Dimensions available:**
- Category: nicotinePouches, nicotineFree, energyPouches
- Brand: 80+ brands (via brands.slug)
- Strength: normal, strong, extraStrong, ultraStrong
- Flavor: mint, fruit, berry, citrus, licorice, coffee, cola, vanilla, tropical
- Format: slim, mini, original, large
- Badge: new, popular, limited, newPrice

**URL patterns:**
- `/nicotine-pouches/mint/` — single filter
- `/nicotine-pouches/strong/` — single filter
- `/nicotine-pouches/mint/strong/` — stacked filters
- `/nicotine-pouches/velo/` — brand filter
- `/nicotine-pouches/velo/mint/` — brand + flavor
- `/nicotine-pouches/new-arrivals/` — badge filter
- `/nicotine-pouches/slim/` — format filter

**Generation:** `+onBeforePrerenderStart.ts` queries the database at build time, computes all valid combinations (where products exist), returns URL list. Each page gets a unique title, description, H1, and JSON-LD.

**Estimated page count:** ~200-400 pages depending on valid product combinations.

---

## Package Changes

### Add
```
vike                    # Core framework
vike-react              # React integration (+Wrapper, +Layout, +Head, useData, usePageContext)
vike-photon             # Deployment adapter
@photonjs/vercel        # Vercel Build Output API integration
better-themes           # SSR-safe theme switching (replaces next-themes)
```

### Remove
```
next-themes             # Next.js-specific, TypeError during Vike SSR
react-helmet-async      # Conflicts with Vike +Head (TypeError: Cannot read 'add')
```

### Keep (no changes)
```
react-router-dom        # TEMPORARY during incremental migration, removed at end
@supabase/supabase-js   # Client-side usage unchanged; add server-side client for +data.ts
vite-plugin-pwa         # Works with Vike (needs devOptions.enabled: false)
posthog-js              # Works with capture_pageview: 'history_change'
@sentry/react           # Works unchanged
framer-motion           # Wrap in <ClientOnly> for SSR pages
```

---

## File Structure

```
pages/
├── +config.ts                      # Global defaults: extends vike-react + vike-photon
│                                   # ssr: false (SPA default), redirects config
├── +Wrapper.tsx                    # All providers: AgeGate, ErrorBoundary, Easter,
│                                   # BetterThemes, QueryClient, Tooltip, Language,
│                                   # Cart, Wishlist, CookieConsent
│                                   # Cookie banner rendered via <ClientOnly>
├── +Layout.tsx                     # Header + Footer + Toasters + BackToTop + InstallPrompt
│                                   # + EasterOverlay (via <ClientOnly>)
│                                   # + CookieConsentBanner (via <ClientOnly>)
├── +Head.tsx                       # Favicons, OG defaults, OrganizationSchema
├── +onBeforeRender.server.ts       # Read auth cookies + theme cookie from request
│                                   # Populates pageContext.supabaseSession and pageContext.theme
│                                   # Note: If Vike ≥0.4.250, use +onCreatePageContext instead
├── _error/+Page.tsx                # 404 + error handling (replaces NotFound.tsx)
│
├── index/                          # / — SSG
│   ├── +Page.tsx
│   ├── +data.ts                    # Server-side: featured products
│   └── +config.ts                  # prerender: true, title, description
│
├── nicotine-pouches/               # /nicotine-pouches — SSR
│   ├── +Page.tsx
│   ├── +data.ts                    # Server-side: all products
│   └── +config.ts                  # ssr: true
│
├── nicotine-pouches/@filter/       # /nicotine-pouches/* — SSG (programmatic)
│   ├── +Page.tsx                   # Reuses ProductListing component
│   ├── +data.ts                    # Parse filter segments, query filtered products
│   ├── +route.ts                   # Custom route matching for multi-segment filters
│   ├── +onBeforePrerenderStart.ts  # Generate all valid filter URLs from DB
│   └── +config.ts                  # prerender: true
│
├── product/@id/                    # /product/:id — SSR
│   ├── +Page.tsx
│   ├── +data.ts                    # Product + reviews + variants
│   └── +config.ts                  # ssr: true
│
├── brand/@brandSlug/               # /brand/:brandSlug — SSR
│   ├── +Page.tsx
│   ├── +data.ts
│   └── +config.ts                  # ssr: true
│
├── brands/                         # /brands — SSG
│   ├── +Page.tsx
│   ├── +data.ts
│   └── +config.ts                  # prerender: true
│
├── blog/                           # /blog — SSG
│   ├── +Page.tsx
│   ├── +data.ts
│   └── +config.ts                  # prerender: true
│
├── blog/@slug/                     # /blog/:slug — SSR
│   ├── +Page.tsx
│   ├── +data.ts
│   └── +config.ts                  # ssr: true
│
├── faq/                            # /faq — SSG
│   ├── +Page.tsx
│   ├── +data.ts
│   └── +config.ts                  # prerender: true
│
├── search/+Page.tsx                # SPA (inherits global ssr:false)
├── cart/+Page.tsx                  # SPA
├── checkout/+Page.tsx              # SPA
├── login/+Page.tsx                 # SPA
├── register/+Page.tsx              # SPA
├── account/+Page.tsx               # SPA
├── forgot/+Page.tsx                # SPA
├── update-password/+Page.tsx       # SPA
├── wishlist/+Page.tsx              # SPA
├── rewards/+Page.tsx               # SPA
├── membership/+Page.tsx            # SPA
├── leaderboard/+Page.tsx           # SPA
├── bundle-builder/+Page.tsx        # SPA
├── flavor-quiz/+Page.tsx           # SPA
├── community/+Page.tsx             # SPA
├── order-confirmation/+Page.tsx    # SPA
├── order-confirmation/@orderId/+Page.tsx  # SPA
├── whats-new/+Page.tsx             # SSG
│
├── shipping/+Page.tsx              # SSG (info page)
├── returns/+Page.tsx               # SSG
├── about/+Page.tsx                 # SSG
├── contact/+Page.tsx               # SSG
├── terms/+Page.tsx                 # SSG
├── privacy/+Page.tsx               # SSG
├── cookies/+Page.tsx               # SSG
│
└── ops/                            # SPA, guarded
    ├── +guard.ts                   # Auth check for all ops routes (runs server-side by default)
    ├── +config.ts                  # { ssr: false } — all ops pages are SPA
    ├── login/+Page.tsx
    ├── +Page.tsx                   # /ops → OpsDashboard (bare /ops route)
    ├── dashboard/+Page.tsx         # /ops/dashboard (alias, redirects to /ops)
    ├── webhooks/+Page.tsx
    ├── sync/+Page.tsx
    ├── mappings/+Page.tsx
    └── users/+Page.tsx
```

---

## Server-Side Supabase Client

A new server-side Supabase client for `+data.ts` files:

**File:** `src/lib/supabase-server.ts`

Uses `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (no VITE_ prefix — server-only). Only reads public data (products, brands, blog posts). Never exposes the service role key to the client.

**Usage pattern in +data.ts:**
```ts
import { supabaseServer } from '@/lib/supabase-server'

export async function data(pageContext) {
  const { data: product } = await supabaseServer
    .from('products')
    .select('id, name, slug, ...')
    .eq('slug', pageContext.routeParams.id)
    .single()
  return { product }
}
```

Client-side mutations (cart, auth, reviews, community) continue using the existing anon-key client unchanged.

---

## SEO Head Tags Migration

### Before (react-helmet-async)
```tsx
<Helmet>
  <title>Buy Nicotine Pouches | SnusFriend</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
</Helmet>
```

### After (Vike)
```ts
// pages/nicotine-pouches/+data.ts
import { useConfig } from 'vike-react/useConfig'

export async function data() {
  const config = useConfig()
  config({ title: 'Buy Nicotine Pouches | SnusFriend', description: '...' })
  // ... fetch data
}
```

```tsx
// pages/nicotine-pouches/+Head.tsx (for OG tags, JSON-LD)
export function Head() {
  return <>
    <meta property="og:title" content="..." />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </>
}
```

---

## React Router API Replacement

| React Router | Vike Equivalent | Files Affected |
|-------------|-----------------|----------------|
| `<Link to="/path">` | `<a href="/path">` | 30 files |
| `useNavigate()` then `navigate('/path')` | `import { navigate } from 'vike/client/router'` then `navigate('/path')` | 12 files |
| `useParams()` | `usePageContext().routeParams` | 5 files |
| `useLocation()` | `usePageContext().urlPathname` + `usePageContext().urlParsed` | 5 files |
| `useSearchParams()` | `usePageContext().urlParsed.search` | 3 files |
| `<Navigate to="/x" replace />` | `redirects` config or `throw redirect('/x')` | 3 routes |
| `<BrowserRouter>` | Removed (Vike handles routing) | App.tsx |
| `<Routes>` + `<Route>` | Removed (file-based routing) | App.tsx |
| `React.lazy()` + `Suspense` | Removed (Vike handles code splitting per page) | ~20 imports |

---

## Redirects

Configured in global `+config.ts`:

```ts
redirects: {
  '/produkt/@id': '/product/@id',
  '/produkter': '/nicotine-pouches',
  '/mappings': '/ops/mappings',
}
```

---

## Theme Migration

Replace `next-themes` with `better-themes` or a cookie-based custom provider:

1. Read theme preference from cookie in `+onBeforeRender.server.ts`
2. Set `htmlAttributes: { class: theme }` via Vike config
3. Client-side: toggle writes to cookie + updates class
4. Zero flash on SSR (class is set in initial HTML)

---

## PWA Compatibility

`vite-plugin-pwa` continues working with one change:
```ts
// vite.config.ts
VitePWA({
  devOptions: { enabled: false },  // <-- add this
  // ... rest of config unchanged
})
```

Production builds work normally. Service worker registration, manifest, and caching strategies are unchanged.

---

## PostHog Page Tracking

Replace the current `PostHogPageView` component (which uses `useLocation`) with Vike's approach:

```ts
// In PostHog init config
posthog.init(key, {
  capture_pageview: 'history_change',  // Auto-detect Vike client navigation
  // ...
})
```

Or use `onAfterRenderClient()` hook for explicit control.

**Cleanup:** Remove `src/components/analytics/PostHogPageView.tsx` during Phase 5. It uses `useLocation()` from React Router and will crash after Router removal.

---

## Info Page Content Migration

In App.tsx, `/contact`, `/shipping`, `/returns`, and `/about` have hardcoded JSX content passed as props to `<InfoPage>`. During migration, extract this content into each page's `+Page.tsx`:

- `pages/contact/+Page.tsx` — inline the contact info JSX
- `pages/shipping/+Page.tsx` — inline the shipping details JSX
- `pages/returns/+Page.tsx` — inline the returns policy JSX
- `pages/about/+Page.tsx` — inline the about content JSX

Legal pages (`/terms`, `/privacy`, `/cookies`) already have separate components (`TermsContent`, `PrivacyContent`, `CookieContent`) — these just need importing into their respective `+Page.tsx`.

SSG info pages need `+config.ts` with `prerender: true` and appropriate `title`/`description`.

---

## MissingApiKeysScreen Guard

App.tsx has a `hasSupabaseEnv` check that renders `MissingApiKeysScreen` when `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` are missing. Replicate this in `+Wrapper.tsx`:

```tsx
if (!hasSupabaseEnv) return <MissingApiKeysScreen />
```

This is a dev-only guard — it never triggers in production.

---

## react-helmet-async Usage Audit

Files currently using `<Helmet>` that must be migrated to Vike's `useConfig()` + `+Head.tsx`:

- `src/components/seo/SEO.tsx` — generic SEO component (primary target)
- `src/components/seo/FaqSchema.tsx` — JSON-LD injection
- `src/components/seo/ItemListSchema.tsx` — JSON-LD injection
- `src/components/seo/WebSiteSchema.tsx` — JSON-LD injection
- `src/components/seo/OrganizationSchema.tsx` — JSON-LD injection
- Individual pages that use `<SEO>` component

All JSON-LD schemas move to per-page `+Head.tsx` files. The generic `<SEO>` component is replaced by `useConfig()` calls in `+data.ts`.

---

## Programmatic Filter URL Matching

The `+route.ts` for `/nicotine-pouches/@filter/` must handle variable-length path segments:

**Matching algorithm:**
1. Split the URL path after `/nicotine-pouches/` by `/`
2. For each segment, check if it matches a known value in any dimension (strength, flavor, format, brand slug, badge alias)
3. Each dimension can appear at most once
4. Order doesn't matter: `/mint/strong/` and `/strong/mint/` resolve to the same filter
5. Return null (no match) if any segment is unrecognized or a dimension appears twice

**Badge aliases:** Map URL-friendly slugs to badge keys: `new-arrivals` → `new`, `bestsellers` → `popular`, `limited-edition` → `limited`

**Canonical URLs:** If segments are not in canonical order (brand → strength → flavor → format → badge), redirect to the canonical form to avoid duplicate content.

---

## Sentry on SSR Pages

`@sentry/react`'s `ErrorBoundary` works on client-side only. For SSR error capture:
- Server-side errors in `+data.ts` or `+guard.ts` should be caught and reported via `Sentry.captureException()`
- Add a try/catch wrapper in server hooks, or use Vike's `onError` hook if available
- The existing `ErrorBoundary` component in `+Wrapper.tsx` handles client-side errors as before

---

## Cookie Consent

The CookieConsentBanner must be client-only to avoid hydration mismatch:

```tsx
// In +Layout.tsx or +Wrapper.tsx
import { ClientOnly } from 'vike-react/ClientOnly'

<ClientOnly>
  {() => <CookieConsentBanner />}
</ClientOnly>
```

Analytics/marketing script initialization remains client-only (in useEffect after consent check).

---

## framer-motion

For SSR pages, wrap animated components in `<ClientOnly>` to prevent hydration mismatches:

```tsx
import { ClientOnly } from 'vike-react/ClientOnly'

<ClientOnly fallback={<div className="h-48" />}>
  {() => <AnimatedHeroSection />}
</ClientOnly>
```

SPA pages are unaffected (no SSR = no hydration = no mismatch).

---

## Auth Guards (Ops Pages)

```ts
// pages/ops/+guard.ts
import { redirect } from 'vike/abort'

export async function guard(pageContext) {
  const session = pageContext.supabaseSession
  if (!session) throw redirect('/ops/login')
  // Check admin role via Supabase
}
```

Session is populated from cookies in `+onBeforeRender.server.ts`.

---

## Build & Deploy

### vite.config.ts changes
```ts
import vike from 'vike/plugin'
// ... existing plugins

plugins: [
  react(),
  vike(),           // <-- add
  VitePWA({ devOptions: { enabled: false }, ... }),
  visualizer(...),
]
```

### package.json script changes
```json
{
  "dev": "vike dev",
  "build": "vike build",
  "preview": "vike preview"
}
```

### Vercel deployment
Photon auto-detects `@photonjs/vercel` in dependencies and uses Vercel's Build Output API:
- SSG pages → static files in edge CDN
- SSR pages → serverless functions
- SPA pages → client-only bundles with fallback HTML

### Environment variables
New server-only vars needed on Vercel:
- `SUPABASE_URL` (same value as VITE_SUPABASE_URL, but without VITE_ prefix)
- `SUPABASE_SERVICE_ROLE_KEY` (from Supabase dashboard, never exposed to client)

---

## Sitemap

Extend existing `scripts/generate-sitemap.ts` to include programmatic category URLs. Query the same database logic as `+onBeforePrerenderStart` to generate the full URL list.

---

## Migration Order

The migration is incremental. Each phase produces a working, deployable app:

1. **Phase 0: Install + scaffold** — Add packages, create global config, +Wrapper, +Layout, +Head. App still works as SPA via catch-all.
2. **Phase 1: SSG info pages** — Migrate static pages (FAQ, shipping, about, etc.). Low risk, validates the pipeline.
3. **Phase 2: SSR product pages** — Migrate ProductDetail, ProductListing, BrandHub. Server-side Supabase client. High SEO impact.
4. **Phase 3: Programmatic pages** — Add filter page generation. Highest SEO value.
5. **Phase 4: SPA pages** — Migrate remaining pages to Vike file-based routing (still SPA mode). Remove React Router.
6. **Phase 5: Cleanup** — Remove react-helmet-async, next-themes, React.lazy imports. Final testing.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Photon beta breaking change | Low | High | Pin exact versions, test deployment early in Phase 0 |
| react-helmet-async removal breaks SEO during migration | Medium | Medium | Migrate all Helmet usage in same PR as installing Vike |
| Hydration mismatch on SSR pages | Medium | Low | Use `<ClientOnly>` for dynamic content, suppressHydrationWarning |
| Server-side Supabase client exposes service key | Low | Critical | Separate server client file, never import in client code, env var has no VITE_ prefix |
| Build time too long with 400 prerendered pages | Low | Low | Vike supports parallel prerendering; monitor and tune |
| Programmatic pages with no products (empty results) | Medium | Low | Skip URL generation for filter combos with 0 products |

---

## Success Criteria

1. All SSG pages return full HTML with meta tags on first request (curl test)
2. All programmatic category pages are indexed by Google within 2 weeks
3. Product pages show structured data in Google Rich Results Test
4. Lighthouse SEO score ≥ 95 on key pages
5. No hydration errors in production console
6. Build completes in < 5 minutes
7. Existing functionality (cart, checkout, auth, gamification) works unchanged
8. React Router fully removed from codebase
