# Vike Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate SnusFriend from a client-only Vite SPA to Vike with per-page SSR/SSG and programmatic category pages for SEO.

**Architecture:** File-based routing via Vike replaces React Router. Global +Wrapper.tsx holds providers, +Layout.tsx holds shell UI. Each page gets its own render mode (SSG/SSR/SPA). Programmatic filter pages pre-rendered at build time. Deployed on Vercel via Photon.

**Tech Stack:** Vike 0.4.x, vike-react, vike-photon, @photonjs/vercel, better-themes, Supabase server client

**Design Spec:** `docs/superpowers/specs/2026-03-25-vike-migration-design.md`

---

## Phase 0: Install + Scaffold (Foundation)

The goal of Phase 0 is: Vike is installed, the app still works as a full SPA via a catch-all page, and you can `bun run dev` + `bun run build` successfully.

### Task 1: Install Vike packages and update build config

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

**Context:** The existing vite.config.ts uses `@vitejs/plugin-react-swc`, `vite-plugin-pwa`, and `rollup-plugin-visualizer`. Vike is added as a Vite plugin. PWA needs `devOptions.enabled: false` to avoid dev-mode conflict with Vike.

- [ ] **Step 1: Install Vike packages**

```bash
bun add vike vike-react vike-photon @photonjs/vercel
```

- [ ] **Step 2: Add Vike plugin to vite.config.ts**

In `vite.config.ts`, add `import vike from 'vike/plugin'` at the top, then add `vike()` to the plugins array BEFORE the PWA plugin. Also add `devOptions: { enabled: false }` to the VitePWA config.

```ts
import vike from 'vike/plugin'
// ... existing imports

plugins: [
  react(),
  vike(),
  VitePWA({
    devOptions: { enabled: false },
    // ... rest unchanged
  }),
  visualizer({ ... }),
]
```

- [ ] **Step 3: Verify vite config still loads**

```bash
bun run build 2>&1 | head -20
```

Expected: Build starts (may fail because no pages/ dir exists yet — that's fine). Verify it doesn't crash on config parsing.

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lockb vite.config.ts
git commit -m "chore: install vike, vike-react, vike-photon packages"
```

---

### Task 2: Create global Vike config and catch-all SPA page

**Files:**
- Create: `pages/+config.ts`
- Create: `pages/+Page.tsx` (catch-all that renders existing App)
- Modify: `src/App.tsx` (export the inner content for reuse)

**Context:** This task makes the entire existing app work under Vike as a single SPA page. React Router still handles all routing internally. This is the "zero behavior change" baseline.

- [ ] **Step 1: Create global pages/+config.ts**

```ts
// pages/+config.ts
import vikeReact from 'vike-react/config'
import vikePhoton from 'vike-photon/config'

export default {
  extends: [vikeReact, vikePhoton],
  ssr: false,  // Default all pages to SPA (client-only)
  redirects: {
    '/produkt/@id': '/product/@id',
    '/produkter': '/nicotine-pouches',
    '/mappings': '/ops/mappings',
  },
}
```

- [ ] **Step 2: Create catch-all pages/+Page.tsx**

This page renders the entire existing App component. React Router handles all routing internally.

```tsx
// pages/+Page.tsx
export { Page }

import App from '../src/App'

function Page() {
  return <App />
}
```

- [ ] **Step 3: Update package.json scripts**

Change `dev`, `build`, and `preview` scripts:

```json
{
  "dev": "vike dev",
  "build": "vike build",
  "preview": "vike preview"
}
```

- [ ] **Step 4: Verify dev server starts**

```bash
bun run dev
```

Expected: Dev server starts. Open browser — entire app should work exactly as before. React Router handles all navigation. Vike just wraps it.

- [ ] **Step 5: Verify build succeeds**

```bash
bun run build
```

Expected: Build completes. Output includes both server and client bundles.

- [ ] **Step 6: Commit**

```bash
git add pages/ package.json
git commit -m "feat: add Vike catch-all SPA wrapper — zero behavior change"
```

---

### Task 3: Create +Wrapper.tsx with all providers

**Files:**
- Create: `pages/+Wrapper.tsx`
- Modify: `src/App.tsx` — remove provider wrapping (providers move to +Wrapper)

**Context:** Vike's +Wrapper wraps every page (including the catch-all). Move all 9 context providers from App.tsx into +Wrapper.tsx. The catch-all +Page.tsx then renders App without the provider stack.

- [ ] **Step 1: Create pages/+Wrapper.tsx with MissingApiKeysScreen guard**

Move all providers from App.tsx. **At the very top of the render function, before any providers**, add the `hasSupabaseEnv` early-return guard:

```tsx
import { hasSupabaseEnv, missingSupabaseEnvVars } from '@/integrations/supabase/client'

function Wrapper({ children }) {
  if (!hasSupabaseEnv) return <MissingApiKeysScreen />
  // ... providers below
}
```

Use `<ClientOnly>` for components that must not SSR (cookie banner, easter overlay).

Reference `src/App.tsx` lines 104-233 for the current provider stack.

Providers to move (in order, outermost first):
1. AgeGate
2. ErrorBoundary
3. EasterProvider
4. ThemeProvider (keep next-themes for now — replaced in Phase 5)
5. QueryClientProvider
6. TooltipProvider
7. LanguageProvider
8. CartProvider
9. WishlistProvider
10. CookieConsentProvider

- [ ] **Step 2: Simplify App.tsx**

Remove the provider wrapping from App.tsx. It should now only contain `<BrowserRouter>`, `<Routes>`, and route definitions. The providers are in +Wrapper.tsx.

- [ ] **Step 3: Update catch-all +Page.tsx to render simplified App**

```tsx
// pages/+Page.tsx
export { Page }
import App from '../src/App'

function Page() {
  return <App />
}
```

- [ ] **Step 4: Test dev server**

```bash
bun run dev
```

Expected: App works identically. All providers active. Cart, auth, theme, language all work.

- [ ] **Step 5: Commit**

```bash
git add pages/+Wrapper.tsx src/App.tsx pages/+Page.tsx
git commit -m "refactor: move providers from App.tsx to Vike +Wrapper.tsx"
```

---

### Task 4: Create +Layout.tsx with shared shell

**Files:**
- Create: `pages/+Layout.tsx`
- Modify: Various — the current Header/Footer are rendered in individual page components or in a Layout wrapper

**Context:** Check how Header and Footer are currently rendered. If there's an existing Layout component, the +Layout.tsx wraps it. If pages render their own Header/Footer, +Layout.tsx centralizes this.

- [ ] **Step 1: Examine current layout pattern**

Read `src/components/layout/Layout.tsx` (if it exists) and check how pages use it. Also check App.tsx for any layout components rendered outside Routes.

From App.tsx we know these are rendered outside Routes:
- `<Toaster />`
- `<Sonner />`
- `<OrganizationSchema />`
- `<PostHogPageView />`
- `<CookieConsentBanner />`
- `<BackToTop />`
- `<InstallPrompt />`
- `<EasterOverlay />`

- [ ] **Step 2: Create pages/+Layout.tsx**

```tsx
// pages/+Layout.tsx
export { Layout }

import { ClientOnly } from 'vike-react/ClientOnly'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
```

Note: During the catch-all phase, the App component still renders its own layout. +Layout.tsx starts minimal and grows as pages migrate.

- [ ] **Step 3: Create pages/+Head.tsx**

Global head tags that apply to every page:

```tsx
// pages/+Head.tsx
export { Head }

function Head() {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
      <meta name="theme-color" content="#121620" />
    </>
  )
}
```

- [ ] **Step 4: Create pages/_error/+Page.tsx**

```tsx
// pages/_error/+Page.tsx
export { Page }

import { usePageContext } from 'vike-react/usePageContext'

function Page() {
  const { is404 } = usePageContext()

  if (is404) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-4 text-muted-foreground">Page not found</p>
          <a href="/" className="mt-6 inline-block text-primary hover:underline">Go home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">Please try refreshing the page</p>
        <a href="/" className="mt-6 inline-block text-primary hover:underline">Go home</a>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Test and commit**

```bash
bun run dev
# Verify app still works
bun run build
git add pages/+Layout.tsx pages/+Head.tsx pages/_error/
git commit -m "feat: add Vike +Layout, +Head, and error page"
```

---

### Task 5: Create server-side Supabase client

**Files:**
- Create: `src/lib/supabase-server.ts`

**Context:** SSR/SSG pages need a server-side Supabase client that uses the service role key (not the anon key). This file must NEVER be imported by client-side code. The env vars use NO `VITE_` prefix.

- [ ] **Step 1: Create src/lib/supabase-server.ts**

```ts
// src/lib/supabase-server.ts
// Server-side only — NEVER import this in client code.
// Uses SUPABASE_SERVICE_ROLE_KEY for read-only data fetching in +data.ts files.

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.warn('[supabase-server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — SSR data fetching will fail')
}

export const supabaseServer = createClient(url ?? '', key ?? '', {
  auth: { persistSession: false },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase-server.ts
git commit -m "feat: add server-side Supabase client for SSR/SSG data fetching"
```

---

### Task 5b: Create +onBeforeRender.server.ts for auth and theme cookies

**Files:**
- Create: `pages/+onBeforeRender.server.ts`

**Context:** This global server hook runs before every SSR/SSG page render. It reads auth cookies and the theme cookie from the HTTP request, populating `pageContext.supabaseSession` and `pageContext.theme`. The ops `+guard.ts` (Task 20) depends on `pageContext.supabaseSession`. The theme migration (Task 22) depends on `pageContext.theme`. Note: If Vike ≥0.4.250, use `+onCreatePageContext` instead.

- [ ] **Step 1: Create pages/+onBeforeRender.server.ts**

```ts
// pages/+onBeforeRender.server.ts
// Reads auth and theme cookies from the HTTP request.
// Populates pageContext.supabaseSession and pageContext.theme.
import { createClient } from '@supabase/supabase-js'

export async function onBeforeRender(pageContext) {
  const cookie = pageContext.headers?.cookie ?? ''

  // Parse theme cookie
  const themeMatch = cookie.match(/theme=(\w+)/)
  const theme = themeMatch?.[1] ?? 'velo'

  // Parse Supabase auth from cookies (if present)
  let supabaseSession = null
  try {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      // Extract access_token and refresh_token from cookies
      const accessToken = cookie.match(/sb-access-token=([^;]+)/)?.[1]
      const refreshToken = cookie.match(/sb-refresh-token=([^;]+)/)?.[1]
      if (accessToken && refreshToken) {
        const supabase = createClient(url, key, { auth: { persistSession: false } })
        const { data } = await supabase.auth.getUser(accessToken)
        if (data?.user) {
          supabaseSession = { user: data.user, accessToken }
        }
      }
    }
  } catch {
    // Auth cookie parsing failed — continue without session
  }

  return {
    pageContext: {
      theme,
      supabaseSession,
    },
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/+onBeforeRender.server.ts
git commit -m "feat: add server-side auth + theme cookie reading hook"
```

---

### Task 5c: Update DEPLOYMENT_CHECKLIST.md with new env vars

**Files:**
- Modify: `DEPLOYMENT_CHECKLIST.md`

**Context:** Per CLAUDE.md rules, adding a new secret should also update DEPLOYMENT_CHECKLIST.md. The Vike migration adds two server-only env vars.

- [ ] **Step 1: Add new env vars to DEPLOYMENT_CHECKLIST.md**

Add entries for:
- `SUPABASE_URL` — Same value as VITE_SUPABASE_URL (server-only, no VITE_ prefix)
- `SUPABASE_SERVICE_ROLE_KEY` — From Supabase dashboard (server-only, never exposed to client)

- [ ] **Step 2: Commit**

```bash
git add DEPLOYMENT_CHECKLIST.md
git commit -m "docs: add server-side Supabase env vars to deployment checklist"
```

---

### Task 6: Deploy Phase 0 to Vercel — validate Photon works

**Files:**
- No code changes — deployment verification

**Context:** This is the most critical validation point. If Photon deploys successfully with the catch-all SPA, the entire migration path is validated.

- [ ] **Step 1: Set server-side env vars on Vercel**

Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel (production + development). These are the same values as the VITE_ versions but without the prefix.

- [ ] **Step 2: Push and verify deployment**

```bash
git push
```

Wait for Vercel deployment. Check:
1. Build succeeds in Vercel logs
2. Site loads and works (all React Router navigation)
3. Cart, auth, theme switching all work

- [ ] **Step 3: Document any Photon issues**

If deployment fails, check Vercel build logs. Common issues:
- Missing `@photonjs/vercel` in dependencies (not devDependencies)
- Vike version mismatch with Photon

---

## Phase 1: SSG Info Pages (Low Risk, Validates Pipeline)

The goal: migrate static info pages to Vike file-based routing with SSG. These pages are simple, have no dynamic data, and validate the full SSR pipeline.

### Task 7: Migrate FAQ page to Vike (SSG)

**Files:**
- Create: `pages/faq/+Page.tsx`
- Create: `pages/faq/+config.ts`
- Create: `pages/faq/+Head.tsx`
- Reference: `src/pages/FaqPage.tsx` (existing page — keep during migration)

**Context:** FaqPage currently uses `<SEO>` component (react-helmet-async) and `<FaqSchema>` for JSON-LD. The Vike version uses `+config.ts` for title/description and `+Head.tsx` for JSON-LD.

- [ ] **Step 1: Read current FaqPage.tsx to understand its data and SEO**

Check what SEO props it passes and what data it renders.

- [ ] **Step 2: Create pages/faq/+config.ts**

```ts
export default {
  prerender: true,
  title: 'FAQ — SnusFriend',
  description: 'Frequently asked questions about nicotine pouches, ordering, shipping, and returns at SnusFriend.',
}
```

- [ ] **Step 3: Create pages/faq/+Page.tsx**

Import the FAQ content from the existing page. Strip out `<SEO>` and `<FaqSchema>` (those move to +config and +Head). Keep the visual content.

- [ ] **Step 4: Create pages/faq/+Head.tsx**

Move FaqSchema JSON-LD here.

- [ ] **Step 5: Remove /faq route from App.tsx Routes**

Comment out or remove the `<Route path="/faq" ...>` line. Vike now handles this route.

- [ ] **Step 6: Test**

```bash
bun run dev
# Navigate to /faq — should render correctly
# Check page source — should have full HTML (SSG)
bun run build
# Check dist/ for prerendered faq/index.html
```

- [ ] **Step 7: Commit**

```bash
git add pages/faq/ src/App.tsx
git commit -m "feat: migrate FAQ page to Vike SSG"
```

---

### Task 8: Migrate all static info pages to Vike (SSG)

**Files:**
- Create: `pages/shipping/+Page.tsx`, `pages/shipping/+config.ts`
- Create: `pages/returns/+Page.tsx`, `pages/returns/+config.ts`
- Create: `pages/about/+Page.tsx`, `pages/about/+config.ts`
- Create: `pages/contact/+Page.tsx`, `pages/contact/+config.ts`
- Create: `pages/terms/+Page.tsx`, `pages/terms/+config.ts`
- Create: `pages/privacy/+Page.tsx`, `pages/privacy/+config.ts`
- Create: `pages/cookies/+Page.tsx`, `pages/cookies/+config.ts`
- Create: `pages/whats-new/+Page.tsx`, `pages/whats-new/+config.ts`
- Modify: `src/App.tsx` — remove these routes

**Context:** In App.tsx, `/contact`, `/shipping`, `/returns`, `/about` have inline JSX content passed as props to `<InfoPage>`. Extract this content into each +Page.tsx. Legal pages use existing `TermsContent`, `PrivacyContent`, `CookieContent` components.

- [ ] **Step 1: Create all info page directories with +Page.tsx and +config.ts**

Each page follows the same pattern:
- `+config.ts` with `prerender: true`, `title`, `description`
- `+Page.tsx` that renders the content (wrapped in the InfoPage layout if reusing it, or directly with appropriate styling)

For `/shipping`, `/returns`, `/about`, `/contact`: extract the inline JSX from App.tsx into the +Page.tsx file.

For `/terms`, `/privacy`, `/cookies`: import the existing content components.

For `/whats-new`: import existing WhatsNewPage component.

- [ ] **Step 2: Remove all migrated routes from App.tsx**

Remove the Route entries for: `/shipping`, `/returns`, `/about`, `/contact`, `/terms`, `/privacy`, `/cookies`, `/whats-new`

- [ ] **Step 3: Test all pages**

Visit each URL in dev mode. Verify content renders correctly. Build and check for prerendered HTML files.

- [ ] **Step 4: Commit**

```bash
git add pages/shipping/ pages/returns/ pages/about/ pages/contact/ pages/terms/ pages/privacy/ pages/cookies/ pages/whats-new/ src/App.tsx
git commit -m "feat: migrate 8 info/legal pages to Vike SSG"
```

---

### Task 9: Migrate brands index and blog index to Vike (SSG)

**Files:**
- Create: `pages/brands/+Page.tsx`, `pages/brands/+data.ts`, `pages/brands/+config.ts`
- Create: `pages/blog/+Page.tsx`, `pages/blog/+data.ts`, `pages/blog/+config.ts`
- Modify: `src/App.tsx` — remove these routes

**Context:** These pages fetch data (brand list, blog post list) but the data changes infrequently. SSG with prerendering is appropriate. `+data.ts` uses the server-side Supabase client.

- [ ] **Step 1: Create pages/brands/ with server-side data fetching**

Read current `src/pages/BrandsIndex.tsx` to understand the data it needs. Create `+data.ts` that fetches brands from Supabase using `supabaseServer`.

- [ ] **Step 2: Create pages/blog/ with server-side data fetching**

Read current `src/pages/BlogIndex.tsx`. Create `+data.ts` that fetches blog posts.

- [ ] **Step 3: Remove routes from App.tsx and test**

- [ ] **Step 4: Commit**

```bash
git add pages/brands/ pages/blog/ src/App.tsx
git commit -m "feat: migrate brands index and blog index to Vike SSG"
```

---

### Task 10: Migrate HomePage to Vike (SSG)

**Files:**
- Create: `pages/index/+Page.tsx`, `pages/index/+data.ts`, `pages/index/+config.ts`, `pages/index/+Head.tsx`
- Modify: `src/App.tsx` — remove / route

**Context:** HomePage is SSG. It has featured products, hero banner, and WebSiteSchema JSON-LD. The `+data.ts` fetches featured/popular products at build time.

- [ ] **Step 1: Read current HomePage.tsx to understand data dependencies**

- [ ] **Step 2: Create pages/index/ with data fetching and Head**

`+data.ts` fetches featured products. `+Head.tsx` includes WebSiteSchema JSON-LD. `+config.ts` has `prerender: true`.

- [ ] **Step 3: Remove / route from App.tsx and test**

- [ ] **Step 4: Commit**

```bash
git add pages/index/ src/App.tsx
git commit -m "feat: migrate HomePage to Vike SSG"
```

---

## Phase 2: SSR Product Pages (High SEO Impact)

### Task 11: Migrate ProductDetail to Vike (SSR)

**Files:**
- Create: `pages/product/@id/+Page.tsx`, `pages/product/@id/+data.ts`, `pages/product/@id/+config.ts`, `pages/product/@id/+Head.tsx`
- Modify: `src/App.tsx` — remove /product/:id route

**Context:** ProductDetail is the most important SEO page. It uses `useParams()` to get the product ID. The Vike version uses `pageContext.routeParams.id`. `+data.ts` fetches product + reviews + variants server-side. `+Head.tsx` includes Product schema JSON-LD.

- [ ] **Step 1: Read current ProductDetail.tsx**

Understand: what data it fetches, what hooks it uses, what SEO/schema it renders.

- [ ] **Step 2: Create pages/product/@id/+data.ts**

Fetch product, variants, reviews, and brand info using `supabaseServer`. Return serializable data.

- [ ] **Step 3: Create pages/product/@id/+Page.tsx**

Adapt existing ProductDetail to receive data via `useData()` instead of client-side hooks. Interactive features (add to cart, reviews form) stay client-side.

- [ ] **Step 4: Create +config.ts and +Head.tsx**

SSR config + Product schema JSON-LD in +Head.tsx.

- [ ] **Step 5: Remove route from App.tsx, test, commit**

```bash
git add pages/product/ src/App.tsx
git commit -m "feat: migrate ProductDetail to Vike SSR"
```

---

### Task 12: Migrate ProductListing to Vike (SSR)

**Files:**
- Create: `pages/nicotine-pouches/+Page.tsx`, `pages/nicotine-pouches/+data.ts`, `pages/nicotine-pouches/+config.ts`, `pages/nicotine-pouches/+Head.tsx`
- Modify: `src/App.tsx` — remove /nicotine-pouches route

**Context:** The main product listing page. Currently uses `useSearchParams()` for filters. The Vike version uses `pageContext.urlParsed.search` for the base listing. Programmatic filter pages come in Task 14.

- [ ] **Step 1: Read current ProductListing.tsx**

Understand filter logic, sorting, and data dependencies.

- [ ] **Step 2: Create pages/nicotine-pouches/ with SSR data**

`+data.ts` fetches all active products with brand joins. `+config.ts` has `ssr: true`.

- [ ] **Step 3: Adapt ProductListing to work with server data + client interactivity**

Server provides initial product list. Client-side filter/sort remains interactive.

- [ ] **Step 4: Test and commit**

```bash
git add pages/nicotine-pouches/ src/App.tsx
git commit -m "feat: migrate ProductListing to Vike SSR"
```

---

### Task 13: Migrate BrandHub and BlogPost to Vike (SSR)

**Files:**
- Create: `pages/brand/@brandSlug/+Page.tsx`, `pages/brand/@brandSlug/+data.ts`, `pages/brand/@brandSlug/+config.ts`
- Create: `pages/blog/@slug/+Page.tsx`, `pages/blog/@slug/+data.ts`, `pages/blog/@slug/+config.ts`
- Modify: `src/App.tsx` — remove these routes

**Context:** Both use dynamic route params. BrandHub shows brand info + products. BlogPost shows a single blog article.

- [ ] **Step 1: Create pages/brand/@brandSlug/ with SSR data**

- [ ] **Step 2: Create pages/blog/@slug/ with SSR data**

- [ ] **Step 3: Remove routes from App.tsx, test, commit**

```bash
git add pages/brand/ pages/blog/ src/App.tsx
git commit -m "feat: migrate BrandHub and BlogPost to Vike SSR"
```

---

### Task 13b: Audit SSR/SSG pages for framer-motion and wrap in ClientOnly

**Files:**
- Modify: All SSR/SSG page components that import framer-motion
- Reference: `pages/index/+Page.tsx`, `pages/product/@id/+Page.tsx`, `pages/nicotine-pouches/+Page.tsx`, `pages/brand/@brandSlug/+Page.tsx`

**Context:** framer-motion components cause hydration mismatches during SSR. Any animated components on SSR/SSG pages must be wrapped in `<ClientOnly>` from vike-react. SPA pages are unaffected (no SSR = no hydration).

- [ ] **Step 1: Find all framer-motion imports in SSR/SSG page components**

Search for `from 'framer-motion'` or `from "framer-motion"` in all page components and their child components. Common locations: HeroBanner, ProductCard animations, page transitions.

- [ ] **Step 2: Wrap animated components in ClientOnly**

For each SSR/SSG page that uses framer-motion:

```tsx
import { ClientOnly } from 'vike-react/ClientOnly'

// Before:
<AnimatedHeroSection />

// After:
<ClientOnly fallback={<div className="h-48" />}>
  {() => <AnimatedHeroSection />}
</ClientOnly>
```

Provide meaningful static fallbacks that match the approximate dimensions to prevent layout shift.

- [ ] **Step 3: Test SSR pages for hydration errors**

```bash
bun run dev
# Open browser console, navigate to /, /product/..., /nicotine-pouches, /brand/...
# Check for "Hydration failed" or "Text content does not match" warnings
```

- [ ] **Step 4: Commit**

```bash
git add src/ pages/
git commit -m "fix: wrap framer-motion components in ClientOnly on SSR pages"
```

---

### Task 13c: Add Sentry SSR error capture pattern

**Files:**
- Create: `src/lib/ssr-error-handler.ts`
- Modify: SSR `+data.ts` files to use the wrapper

**Context:** `@sentry/react`'s ErrorBoundary only works client-side. Server-side errors in `+data.ts` and `+guard.ts` need explicit Sentry capture. Create a shared try/catch wrapper for all server-side data fetching.

- [ ] **Step 1: Create src/lib/ssr-error-handler.ts**

```ts
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
```

- [ ] **Step 2: Apply to existing +data.ts files**

Wrap the data fetching in `pages/product/@id/+data.ts`, `pages/nicotine-pouches/+data.ts`, `pages/brand/@brandSlug/+data.ts`, `pages/blog/@slug/+data.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ssr-error-handler.ts pages/
git commit -m "feat: add Sentry error capture for SSR data fetching"
```

---

## Phase 3: Programmatic Category Pages (Highest SEO Value)

### Task 14: Build filter URL matcher and dimension config

**Files:**
- Create: `src/lib/filter-dimensions.ts` — filter dimension definitions and URL parsing
- Create: `pages/nicotine-pouches/@filter/+route.ts` — Vike route matcher

**Context:** This is the core of programmatic SEO. The route matcher must handle variable-length URL segments like `/nicotine-pouches/mint/strong/` and resolve each segment to a filter dimension.

- [ ] **Step 1: Create src/lib/filter-dimensions.ts**

Define all filter dimensions with their URL slugs, DB keys, and canonical ordering:

```ts
export const DIMENSIONS = {
  strength: { values: ['normal', 'strong', 'extra-strong', 'ultra-strong'], dbKey: 'strength_key', urlToDb: { 'extra-strong': 'extraStrong', 'ultra-strong': 'ultraStrong' } },
  flavor: { values: ['mint', 'fruit', 'berry', 'citrus', 'licorice', 'coffee', 'cola', 'vanilla', 'tropical'], dbKey: 'flavor_key' },
  format: { values: ['slim', 'mini', 'original', 'large'], dbKey: 'format_key' },
  badge: { values: ['new-arrivals', 'bestsellers', 'limited-edition'], urlToDb: { 'new-arrivals': 'new', 'bestsellers': 'popular', 'limited-edition': 'limited' } },
}
// Brand slugs loaded dynamically from DB
```

Export `parseFilterSegments(segments: string[])` → returns `{ filters: Record<string, string>, canonical: string } | null`

- [ ] **Step 2: Create pages/nicotine-pouches/@filter/+route.ts**

```ts
// pages/nicotine-pouches/@filter/+route.ts
import { parseFilterSegments } from '@/lib/filter-dimensions'

export function route(pageContext) {
  const path = pageContext.urlPathname
  if (!path.startsWith('/nicotine-pouches/')) return false

  const rest = path.replace('/nicotine-pouches/', '').replace(/\/$/, '')
  if (!rest) return false  // bare /nicotine-pouches/ handled by parent route

  const segments = rest.split('/')
  const result = parseFilterSegments(segments)
  if (!result) return false

  return { routeParams: { filter: rest, ...result.filters } }
}
```

- [ ] **Step 3: Implement canonical URL redirect in +route.ts**

If the URL segments are valid but not in canonical order (brand → strength → flavor → format → badge), the route matcher should return the canonical URL so `+data.ts` can issue a redirect:

```ts
// In +route.ts, after parsing:
if (result.canonical !== rest) {
  return { routeParams: { filter: rest, redirect: `/nicotine-pouches/${result.canonical}/`, ...result.filters } }
}
```

Then in `+data.ts`, check for the redirect param and `throw redirect(routeParams.redirect)`.

- [ ] **Step 4: Write tests for parseFilterSegments**

Test cases: single segment, multi-segment, unknown segment (returns null), duplicate dimension (returns null), canonical ordering, non-canonical ordering returns redirect URL.

```bash
bun run test -- src/lib/filter-dimensions.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/filter-dimensions.ts src/lib/filter-dimensions.test.ts pages/nicotine-pouches/@filter/
git commit -m "feat: add filter URL dimension parser and Vike route matcher"
```

---

### Task 15: Build programmatic page generation and data fetching

**Files:**
- Create: `pages/nicotine-pouches/@filter/+onBeforePrerenderStart.ts`
- Create: `pages/nicotine-pouches/@filter/+data.ts`
- Create: `pages/nicotine-pouches/@filter/+Page.tsx`
- Create: `pages/nicotine-pouches/@filter/+config.ts`
- Create: `pages/nicotine-pouches/@filter/+Head.tsx`

**Context:** `+onBeforePrerenderStart` queries the database at build time and generates all valid filter URL combinations. `+data.ts` fetches filtered products for each URL. `+Page.tsx` reuses the ProductListing component.

- [ ] **Step 1: Create +onBeforePrerenderStart.ts**

Query products table for distinct values of each dimension. Compute valid single and double combinations where products exist. Return URL list.

```ts
export async function onBeforePrerenderStart() {
  // Query DB for all valid dimension combinations
  // Return: [{ url: '/nicotine-pouches/mint/' }, { url: '/nicotine-pouches/mint/strong/' }, ...]
}
```

- [ ] **Step 2: Create +data.ts**

Parse the filter segments from routeParams. Query filtered products from Supabase. Return products + filter metadata for the page.

- [ ] **Step 3: Create +Page.tsx**

Render filtered product listing. Include unique H1 (e.g., "Strong Mint Nicotine Pouches"), breadcrumbs, and internal links to related filters.

- [ ] **Step 4: Create +config.ts and +Head.tsx**

`prerender: true` in config. Dynamic ItemList JSON-LD in +Head.tsx.

- [ ] **Step 5: Test build — verify pages are generated**

```bash
bun run build
# Check build output for generated HTML files
ls dist/client/nicotine-pouches/
```

Expected: Hundreds of HTML files for each filter combination.

- [ ] **Step 6: Commit**

```bash
git add pages/nicotine-pouches/@filter/
git commit -m "feat: add programmatic category pages with SSG prerendering"
```

---

### Task 16: Update sitemap to include programmatic pages

**Files:**
- Modify: `scripts/generate-sitemap.ts`

**Context:** The sitemap script needs to include all programmatic category page URLs. Reuse the same dimension logic from `filter-dimensions.ts`.

- [ ] **Step 1: Update generate-sitemap.ts**

Add all programmatic category URLs to the sitemap. Query the same valid filter combinations as `+onBeforePrerenderStart`.

- [ ] **Step 2: Regenerate sitemap and verify**

```bash
bun run sitemap
head -50 public/sitemap.xml
```

Expected: Sitemap includes `/nicotine-pouches/mint/`, `/nicotine-pouches/strong/`, etc.

- [ ] **Step 3: Commit**

```bash
git add scripts/generate-sitemap.ts public/sitemap.xml
git commit -m "feat: add programmatic category URLs to sitemap"
```

---

## Phase 4: Migrate SPA Pages (Remove React Router)

The goal: move all remaining pages to Vike file-based routing (still in SPA mode). After this phase, React Router can be removed.

### Task 17: Migrate auth pages to Vike (SPA)

**Files:**
- Create: `pages/login/+Page.tsx`
- Create: `pages/register/+Page.tsx`
- Create: `pages/forgot/+Page.tsx`
- Create: `pages/update-password/+Page.tsx`
- Modify: `src/App.tsx` — remove auth routes

**Context:** Auth pages are SPA-only (no SEO value). Each +Page.tsx simply renders the existing page component. No `+data.ts` needed. Replace `useNavigate()` with `import { navigate } from 'vike/client/router'` in each page.

- [ ] **Step 1: Create all auth page directories**

Each is a thin wrapper around the existing component. Replace React Router imports with Vike equivalents.

- [ ] **Step 2: Update page components to use Vike navigation**

In LoginPage, RegisterPage, ForgotPasswordPage, UpdatePasswordPage:
- Replace `import { useNavigate, Link } from 'react-router-dom'` with `import { navigate } from 'vike/client/router'`
- Replace `<Link to="/...">` with `<a href="/...">`
- Replace `navigate('/...')` calls with the Vike navigate import

- [ ] **Step 3: Remove routes from App.tsx, test, commit**

```bash
git add pages/login/ pages/register/ pages/forgot/ pages/update-password/ src/
git commit -m "feat: migrate auth pages to Vike SPA routing"
```

---

### Task 18: Migrate shopping pages to Vike (SPA)

**Files:**
- Create: `pages/cart/+Page.tsx`
- Create: `pages/checkout/+Page.tsx`
- Create: `pages/wishlist/+Page.tsx`
- Create: `pages/bundle-builder/+Page.tsx`
- Create: `pages/order-confirmation/+Page.tsx`
- Create: `pages/order-confirmation/@orderId/+Page.tsx`
- Create: `pages/search/+Page.tsx`
- Modify: `src/App.tsx` — remove these routes

**Context:** All SPA-only. Replace React Router APIs in each page component.

- [ ] **Step 1: Create all shopping page directories and adapt components**

- [ ] **Step 2: Replace React Router imports in page components**

Key changes per page:
- CartPage: `useNavigate()` → Vike `navigate()`
- CheckoutHandoff: `useNavigate()` → Vike `navigate()`
- OrderConfirmation: `useParams()` → `usePageContext().routeParams`
- SearchResults: `useSearchParams()` → `usePageContext().urlParsed.search`

- [ ] **Step 3: Remove routes from App.tsx, test, commit**

```bash
git add pages/cart/ pages/checkout/ pages/wishlist/ pages/bundle-builder/ pages/order-confirmation/ pages/search/ src/
git commit -m "feat: migrate shopping pages to Vike SPA routing"
```

---

### Task 19: Migrate gamification + community pages to Vike (SPA)

**Files:**
- Create: `pages/account/+Page.tsx`
- Create: `pages/rewards/+Page.tsx`
- Create: `pages/membership/+Page.tsx`
- Create: `pages/leaderboard/+Page.tsx`
- Create: `pages/community/+Page.tsx`
- Create: `pages/flavor-quiz/+Page.tsx`
- Modify: `src/App.tsx` — remove these routes

- [ ] **Step 1: Create all page directories**

- [ ] **Step 2: Replace React Router imports**

Key changes:
- AccountPage: `useNavigate()` → Vike `navigate()`
- RewardsPage: `useNavigate()` → Vike `navigate()`

- [ ] **Step 3: Remove routes from App.tsx, test, commit**

```bash
git add pages/account/ pages/rewards/ pages/membership/ pages/leaderboard/ pages/community/ pages/flavor-quiz/ src/
git commit -m "feat: migrate gamification and community pages to Vike SPA routing"
```

---

### Task 20: Migrate ops pages to Vike with guard (SPA)

**Files:**
- Create: `pages/ops/+config.ts`
- Create: `pages/ops/+guard.ts`
- Create: `pages/ops/+Page.tsx` (dashboard — bare /ops route)
- Create: `pages/ops/login/+Page.tsx`
- Create: `pages/ops/webhooks/+Page.tsx`
- Create: `pages/ops/sync/+Page.tsx`
- Create: `pages/ops/mappings/+Page.tsx`
- Create: `pages/ops/users/+Page.tsx`
- Modify: `src/App.tsx` — remove all ops routes

**Context:** Ops pages need the `+guard.ts` for auth protection. Since these are SPA-only, the guard can check auth client-side.

- [ ] **Step 1: Create pages/ops/+config.ts**

```ts
export default { ssr: false }
```

- [ ] **Step 2: Create pages/ops/+guard.ts**

Check Supabase auth session. Redirect to /ops/login if not authenticated.

- [ ] **Step 3: Create all ops page files**

Each wraps the existing ops component. Also create `pages/ops/dashboard/+Page.tsx` that redirects to `/ops` (the spec defines this as an alias route):

```tsx
// pages/ops/dashboard/+Page.tsx
import { redirect } from 'vike/abort'
export function guard() { throw redirect('/ops') }
```

- [ ] **Step 4: Remove ops routes from App.tsx, test, commit**

```bash
git add pages/ops/ src/App.tsx
git commit -m "feat: migrate ops pages to Vike SPA with auth guard"
```

---

### Task 21: Replace React Router Link across all shared components

**Files:**
- Modify: 30 files that use `<Link>` from react-router-dom

**Context:** With all pages migrated, shared components (Header, Footer, ProductCard, etc.) still import `<Link>` from react-router-dom. Replace all with `<a href="...">`. Vike handles client-side navigation for `<a>` tags automatically.

- [ ] **Step 1: Find and replace all Link imports**

In all `.tsx` files under `src/`:
- Replace `import { Link } from 'react-router-dom'` (remove the import)
- Replace `<Link to="...">` with `<a href="...">`
- Replace `<Link to="..." className="...">` with `<a href="..." className="...">`

Files to update (from earlier audit):
- `src/components/ui/states/EmptyState.tsx`
- `src/components/home/FeaturedProducts.tsx`
- `src/components/home/MembersClub.tsx`
- `src/components/home/HeroBanner.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/UtilityBar.tsx`
- `src/components/product/ProductCard.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cookie/CookieConsent.tsx`
- `src/components/account/MembershipAccountTab.tsx`
- `src/components/community/CommunityBoard.tsx`
- And others from the 30-file list

- [ ] **Step 2: Replace useNavigate across remaining components**

Any component still using `useNavigate()` needs to switch to Vike's `navigate()`.

Files: `src/components/auth/OpsAuthGuard.tsx`, `src/components/shop/ReorderButton.tsx`, `src/components/search/SearchAutocomplete.tsx`

- [ ] **Step 3: Replace useLocation / useSearchParams**

Files: `src/components/home/CategoryShortcuts.tsx`, `src/components/layout/Layout.tsx`

- [ ] **Step 4: Build and test**

```bash
bun run build
bun run dev
# Navigate through the entire app — every link should work
```

- [ ] **Step 5: Commit**

```bash
git add src/
git commit -m "refactor: replace all React Router Link/useNavigate with Vike equivalents"
```

---

## Phase 5: Cleanup (Remove Legacy Dependencies)

### Task 22: Remove React Router, react-helmet-async, next-themes

**Files:**
- Modify: `package.json` — remove packages
- Modify: `src/App.tsx` — delete the entire catch-all (now empty)
- Delete: `pages/+Page.tsx` (catch-all no longer needed)
- Delete: `src/components/analytics/PostHogPageView.tsx`
- Modify: `src/lib/posthog.ts` — add `capture_pageview: 'history_change'`

**Context:** At this point, all pages are Vike pages. React Router, react-helmet-async, and next-themes are no longer imported anywhere.

- [ ] **Step 1: Delete PostHogPageView and update PostHog config (BEFORE removing packages)**

Delete `src/components/analytics/PostHogPageView.tsx` and remove its import/usage from `pages/+Layout.tsx` (or wherever it's rendered). It uses `useLocation()` from React Router and will crash after Router removal.

Update `src/lib/posthog.ts` to add `capture_pageview: 'history_change'` to the PostHog init config. This auto-detects Vike client navigation.

- [ ] **Step 2: Remove packages**

```bash
bun rm react-router-dom react-helmet-async next-themes
```

- [ ] **Step 3: Delete catch-all page and empty App.tsx routes**

Delete `pages/+Page.tsx` (the catch-all wrapper). Clean up App.tsx — it should be empty or deleted.

- [ ] **Step 4: Remove all remaining react-helmet-async usage**

Delete `src/components/seo/SEO.tsx` (replaced by Vike useConfig + +Head).
Delete or update schema components that use Helmet:
- `src/components/seo/FaqSchema.tsx`
- `src/components/seo/ItemListSchema.tsx`
- `src/components/seo/WebSiteSchema.tsx`
- `src/components/seo/OrganizationSchema.tsx`
- `src/components/seo/ProductSchema.tsx`

These are now rendered in per-page `+Head.tsx` files.

- [ ] **Step 5: Replace next-themes with better-themes**

```bash
bun add better-themes
```

Update `+Wrapper.tsx` to use BetterThemes provider instead of next-themes ThemeProvider. Update `src/components/layout/Header.tsx` theme toggle.

- [ ] **Step 6: Remove HelmetProvider from +Wrapper.tsx**

It was kept during migration but is no longer needed.

- [ ] **Step 7: Full build and test**

```bash
bun run build
bun run dev
# Navigate every page, test all interactive features
bun run test
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: remove React Router, react-helmet-async, next-themes — migration complete"
```

---

### Task 23: Final verification and deployment

**Files:**
- No code changes — verification only

- [ ] **Step 1: Build verification**

```bash
bun run build
```

Expected: Clean build, no warnings about missing imports.

- [ ] **Step 2: SSG verification**

```bash
# Check that SSG pages have full HTML
curl -s http://localhost:3000/faq | head -50
# Should contain <title>FAQ — SnusFriend</title> and page content in HTML
```

- [ ] **Step 3: SSR verification**

```bash
curl -s http://localhost:3000/product/some-slug | head -50
# Should contain product data in initial HTML
```

- [ ] **Step 4: Programmatic page verification**

```bash
curl -s http://localhost:3000/nicotine-pouches/mint/ | head -50
# Should contain "Mint Nicotine Pouches" in HTML with products
```

- [ ] **Step 5: SPA page verification**

Navigate to /cart, /account, /community — all should work with client-side rendering.

- [ ] **Step 6: Run tests**

```bash
bun run test
```

- [ ] **Step 7: Push to production**

```bash
git push
```

Monitor Vercel deployment. Verify live site works end-to-end.

- [ ] **Step 8: Verify with Google Rich Results Test**

Go to https://search.google.com/test/rich-results and test key URLs:
- Homepage
- A product page
- A category filter page
- FAQ page

---

## Execution Order Summary

```
Phase 0: Foundation (Tasks 1-6)
├── T1: Install packages
├── T2: Catch-all SPA wrapper
├── T3: +Wrapper.tsx providers (with MissingApiKeysScreen guard)
├── T4: +Layout, +Head, error page
├── T5: Server Supabase client
├── T5b: +onBeforeRender.server.ts (auth + theme cookies)
├── T5c: Update DEPLOYMENT_CHECKLIST.md
└── T6: Deploy to Vercel (validate Photon)

Phase 1: SSG Info Pages (Tasks 7-10)
├── T7: FAQ page
├── T8: 8 info/legal pages
├── T9: Brands + Blog index
└── T10: HomePage

Phase 2: SSR Product Pages (Tasks 11-13b/c)
├── T11: ProductDetail
├── T12: ProductListing
├── T13: BrandHub + BlogPost
├── T13b: framer-motion ClientOnly audit for SSR pages
└── T13c: Sentry SSR error capture pattern

Phase 3: Programmatic Pages (Tasks 14-16)
├── T14: Filter URL matcher (with canonical redirect)
├── T15: Page generation + data
└── T16: Sitemap update

Phase 4: SPA Pages (Tasks 17-21)
├── T17: Auth pages
├── T18: Shopping pages
├── T19: Gamification + community
├── T20: Ops pages with guard (+ /ops/dashboard redirect)
└── T21: Replace Link across components

Phase 5: Cleanup (Tasks 22-23)
├── T22: Remove legacy packages (PostHog fix FIRST, then remove packages)
└── T23: Final verification
```

**Parallelization:** Within Phase 0, T4 and T5 can be parallelized (no dependency). Within Phase 1, Tasks 7-10 can be parallelized. Within Phase 2, T13b and T13c can run after T13 in parallel. Within Phase 4, Tasks 17-20 can be parallelized. Phase 2 and 3 are sequential (programmatic pages depend on the ProductListing migration).
