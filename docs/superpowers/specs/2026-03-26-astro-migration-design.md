# Astro Migration — Design Spec

> **Date:** 2026-03-26
> **Status:** Ready for review
> **Replaces:** `2026-03-25-vike-migration-design.md` (Vike approach abandoned)
> **Branch:** Will be `feat/astro-migration` (new branch from `main`)

## 1. Goal

Migrate the SnusFriends Vite SPA to Astro 5 to achieve:

- **Zero-JS static pages** for all SEO-critical content (products, brands, blog, info pages)
- **Islands architecture** — React only where interactivity is required
- **White-label ready** — tenant config system from day one
- **Hybrid SSG + SSR** — static catalog with ISR, server-rendered auth/checkout
- **Built-in i18n** — native locale routing for EU market expansion

Google Ads bans nicotine. All acquisition is organic SEO. Server-rendered HTML is not optional — it's existential.

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    Astro 5 (Hybrid)                   │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  SSG Pages   │  │  SSR Pages   │  │  API Routes │ │
│  │  (CDN cached)│  │  (serverless)│  │  (actions)  │ │
│  │              │  │              │  │             │ │
│  │ • Products   │  │ • Checkout   │  │ • Add cart  │ │
│  │ • Brands     │  │ • Account    │  │ • Reviews   │ │
│  │ • Blog       │  │ • Ops admin  │  │ • Newsletter│ │
│  │ • Info pages │  │ • Search     │  │ • Contact   │ │
│  │ • Categories │  │ • Order conf │  │             │ │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                 │        │
│  ┌──────┴─────────────────┴─────────────────┴──────┐ │
│  │              React Islands (client:*)            │ │
│  │  • Cart drawer    • Product filters              │ │
│  │  • Auth forms     • Review form                  │ │
│  │  • Pouch builder  • Flavor quiz                  │ │
│  │  • Toast provider • Theme toggle                 │ │
│  └──────────────────────┬──────────────────────────┘ │
│                         │                            │
│  ┌──────────────────────┴──────────────────────────┐ │
│  │           Nanostores (shared state)              │ │
│  │  $cart  $wishlist  $theme  $cookieConsent        │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
         │                    │
    ┌────┴────┐         ┌────┴────┐
    │ Vercel  │         │Supabase │
    │ CDN/ISR │         │ DB + EF │
    └─────────┘         └─────────┘
```

## 3. Key Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Astro 5.17 | Zero-JS default, islands, Server Islands, Content Layer, built-in i18n |
| Rendering | Hybrid (SSG default + SSR opt-in) | Static catalog for SEO, SSR for auth/dynamic pages |
| React integration | `@astrojs/react` with islands | Keep all 52 shadcn/ui components unchanged |
| State management | Nanostores (`nanostores` + `@nanostores/react`) | ~1KB, framework-agnostic, works across islands |
| Data (catalog) | Astro Content Layer with custom Supabase loader | Build-time product fetching, Zod-validated, typed |
| Data (live) | Client-side Supabase queries in React islands | Cart, auth, user-specific data |
| Mutations | Astro Actions + existing Supabase edge functions | Type-safe server functions, progressive enhancement |
| Caching | Vercel ISR (auto-revalidate + on-demand) | Product pages refresh every 4h or on Nyehandel sync |
| Styling | Tailwind CSS v4 + CSS custom properties | Framework-agnostic, unchanged from current |
| Routing | Astro file-based + View Transitions | Smooth MPA navigation, persistent elements |
| i18n | Astro built-in i18n routing | EN default, SV/DE ready, hreflang auto-generated |
| Deploy | Vercel via `@astrojs/vercel` adapter | Hybrid mode, Edge Middleware, ISR, image optimization |
| CI/CD | GitHub Actions (`astro build` → `vercel deploy --prebuilt`) | Same pattern as current Vike CI |
| White-label | Tenant config file (`src/config/tenant.ts`) | Right shape now, middleware resolution when tenant #2 |
| PWA | `@vite-pwa/astro` | Same workbox config, service worker registration |
| Analytics | PostHog + Sentry (consent-gated, client islands) | No changes to tracking logic |

## 4. Page Classification

### 4a. SSG Pages (pre-rendered, CDN-cached, ISR)

These pages are static HTML with zero or minimal JavaScript. They are the SEO backbone.

| Page | Route | Islands | ISR |
|------|-------|---------|-----|
| Homepage | `/` | Hero CTA (client:visible), Cart icon (server:defer) | 4h |
| Product listing | `/nicotine-pouches` | Filters (client:load), Sort (client:load), Cart icon | 4h |
| Product detail | `/product/[slug]` | Add-to-cart (client:load), Reviews (client:visible), Cart icon | 4h |
| Category pages | `/nicotine-pouches/[filter]` | Same as listing | 4h |
| Brand hub | `/brand/[slug]` | None (pure static) | 24h |
| Brands index | `/brands` | None (pure static) | 24h |
| Blog index | `/blog` | None (pure static) | 24h |
| Blog post | `/blog/[slug]` | None (pure static) | 24h |
| About | `/about` | None (pure static) | — |
| FAQ | `/faq` | Accordion (client:visible) | — |
| Contact | `/contact` | Form (client:load) | — |
| Shipping | `/shipping` | None (pure static) | — |
| Returns | `/returns` | None (pure static) | — |
| Terms | `/terms` | None (pure static) | — |
| Privacy | `/privacy` | None (pure static) | — |
| Cookies | `/cookies` | None (pure static) | — |
| What's New | `/whats-new` | None (pure static) | — |
| 404 | `/404` | None (pure static) | — |

### 4b. SSR Pages (server-rendered on request)

These pages require auth, user-specific data, or real-time state.

| Page | Route | Why SSR |
|------|-------|---------|
| Cart | `/cart` | Cart state is in nanostores (client-side) but page needs auth check for checkout CTA |
| Checkout | `/checkout` | Auth required, payment flow |
| Order confirmation | `/order-confirmation/[id]` | Auth + order-specific data |
| Login | `/login` | Auth flow |
| Register | `/register` | Auth flow |
| Forgot password | `/forgot` | Auth flow |
| Update password | `/update-password` | Auth flow |
| Account | `/account` | Auth required |
| Search results | `/search` | Dynamic query |
| Rewards | `/rewards` | Auth + points data |
| Community | `/community` | Dynamic feed |
| Leaderboard | `/leaderboard` | Real-time rankings |
| Membership | `/membership` | Auth + subscription state |
| Flavor quiz | `/flavor-quiz` | Interactive, stateful |
| Bundle builder | `/bundle-builder` | Interactive, stateful |
| Wishlist | `/wishlist` | User-specific |

### 4c. Ops Pages (SSR, auth-gated)

| Page | Route | Notes |
|------|-------|-------|
| Ops dashboard | `/ops` | Admin role required |
| Ops login | `/ops/login` | Separate auth flow |
| Ops users | `/ops/users` | Admin only |
| Sync status | `/ops/sync` | Admin only |
| SKU mappings | `/ops/mappings` | Admin only |
| Webhook inbox | `/ops/webhooks` | Admin only |

## 5. State Management — Nanostores

Replace all 6 React Context providers with Nanostores:

```
src/stores/
  cart.ts          — $cartItems (map), $cartOpen (atom), $cartTotal (computed)
  wishlist.ts      — $wishlistItems (map)
  theme.ts         — $theme (atom: 'velo' | 'light')
  cookie-consent.ts — $cookieConsent (map: { analytics, marketing })
  auth.ts          — $user (atom), $session (atom)
  easter.ts        — $easterMode (atom)
```

**localStorage persistence:** Use `@nanostores/persistent` for cart, wishlist, theme, and cookie consent. This replaces the manual `loadFromStorage()` functions in current contexts.

**Migration pattern:**
- Current: `const { items } = useCart()` → After: `const items = useStore($cartItems)`
- Current: `<CartContext.Provider>` wrapping app → After: no provider needed, import store directly

## 6. Content Layer — Product Catalog

Custom Supabase loader for build-time product data:

```typescript
// src/content.config.ts (project root, NOT inside src/content/)
import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  loader: async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name, slug, brand, price, strength, flavor, format, image_url, ...')
    return data.map(p => ({ id: p.slug, ...p }));
  },
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    brand: z.string(),
    price: z.number(),
    // ... full product schema
  }),
});

const brands = defineCollection({
  loader: async () => { /* fetch from brand_overrides + supabase */ },
  schema: z.object({ /* brand schema */ }),
});

export const collections = { products, brands };
```

**SSG pages query at build time:**
```astro
---
// src/pages/product/[slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const products = await getCollection('products');
  return products.map(p => ({ params: { slug: p.id }, props: { product: p } }));
}

const { product } = Astro.props;
---
```

**ISR handles freshness:** Vercel revalidates every 4 hours. Nyehandel sync webhook triggers on-demand revalidation for price/stock changes.

**Hybrid mode rendering control:** In `output: 'hybrid'`, pages are SSG by default. SSR pages must export `export const prerender = false` in their frontmatter. SSG pages with ISR set revalidation via the Vercel adapter config or per-page headers.

## 7. Astro Actions — Server Mutations

Replace direct Supabase edge function calls with type-safe Astro Actions:

```typescript
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  addToCart: defineAction({
    input: z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      packSize: z.enum(['pack1', 'pack3', 'pack5', 'pack10', 'pack30']),
    }),
    handler: async (input) => {
      // Cart is client-side (nanostores), but this validates + returns pricing
      return { success: true, unitPrice: calculatePrice(input) };
    },
  }),

  submitReview: defineAction({
    input: z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      text: z.string().min(10),
    }),
    handler: async (input, context) => {
      const user = context.locals.user;
      if (!user) throw new ActionError({ code: 'UNAUTHORIZED' });
      // Insert via Supabase server client
    },
  }),

  subscribeNewsletter: defineAction({
    accept: 'form', // Progressive enhancement — works without JS
    input: z.object({ email: z.string().email() }),
    handler: async ({ email }) => {
      await supabase.from('newsletter_subscribers').insert({ email });
      return { success: true };
    },
  }),
};
```

**Key principle:** Existing Supabase edge functions stay as-is. Actions handle new form-based mutations and simple server-side logic. Edge functions handle complex business logic (Nyehandel checkout, webhook processing, cron jobs).

## 8. Authentication

**Middleware-based auth using `@supabase/ssr`:**

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createServerClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    { cookies: { /* read/write from context.cookies */ } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  context.locals.user = user;
  context.locals.supabase = supabase;

  // Protect /account, /checkout, /ops routes
  const protectedPaths = ['/account', '/checkout', '/order-confirmation', '/rewards', '/wishlist'];
  const opsPath = context.url.pathname.startsWith('/ops');

  if (protectedPaths.some(p => context.url.pathname.startsWith(p)) && !user) {
    return context.redirect('/login');
  }

  if (opsPath && context.url.pathname !== '/ops/login') {
    // Verify admin role via edge function or JWT claim
  }

  return next();
});
```

**Auth endpoints:** `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`, `/api/auth/callback` as Astro API routes.

## 9. Tenant Configuration (White-Label Foundation)

```typescript
// src/config/tenant.ts
export const tenant = {
  id: 'snusfriends',
  name: 'SnusFriends',
  tagline: 'Premium Nicotine Pouches',
  domain: 'snusfriends.com',
  supportEmail: 'support@snusfriends.com',
  loyaltyProgramName: 'SnusFriends Rewards',
  currencyCode: 'EUR',

  theme: {
    primary: '222 47% 25%',      // navy (HSL values for CSS vars)
    accent: '82 100% 45%',       // lime
    background: '222 47% 11%',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
    darkMode: true,
  },

  features: {
    loyaltyProgram: true,
    communityHub: true,
    reviews: true,
    quests: true,
    ageGate: true,
    flavorQuiz: true,
    bundleBuilder: true,
    easterEgg: true,
  },

  seo: {
    titleTemplate: '%s | SnusFriend',
    defaultDescription: 'Shop 700+ nicotine pouches from 91 leading brands.',
    ogImage: '/og-default.png',
  },

  assets: {
    logo: '/images/logo.svg',
    logoDark: '/images/logo-dark.svg',
    favicon: '/favicon.png',
  },

  supabase: {
    url: import.meta.env.PUBLIC_SUPABASE_URL,
    anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  },
} as const satisfies TenantConfig;
```

**Usage throughout the app:**
```astro
---
import { tenant } from '@/config/tenant';
---
<title>{tenant.seo.titleTemplate.replace('%s', pageTitle)}</title>
<meta name="description" content={tenant.seo.defaultDescription} />
```

**CSS custom properties injected from config** in the base layout `<head>`:
```astro
<style define:vars={{ primary: tenant.theme.primary, accent: tenant.theme.accent, background: tenant.theme.background }}>
  :root {
    --primary: var(--primary);
    --accent: var(--accent);
    --background: var(--background);
  }
</style>
```

**Environment variable migration:** Astro uses `PUBLIC_` prefix for client-exposed env vars (replacing Vite's `VITE_` prefix). All `VITE_SUPABASE_URL` → `PUBLIC_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` → `PUBLIC_SUPABASE_ANON_KEY`, etc. Server-only vars (no prefix) are accessible in `.astro` frontmatter, middleware, actions, and API routes but not in client-side React islands.

## 10. View Transitions

Add to the base layout for smooth page navigation:

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

**Persistent elements** (survive across navigations):
- Cart icon (with item count) — `transition:persist`
- Header/nav — `transition:persist`
- Toast container — `transition:persist`
- Theme class on `<html>` — preserved via `transition:persist`

**Analytics re-fire:** PostHog pageview events fire on `astro:page-load` event.

## 11. Internationalization

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv'],
    routing: {
      prefixDefaultLocale: false, // /about not /en/about
    },
  },
});
```

**Translation files:**
```
src/i18n/
  en.json
  sv.json
```

**i18n helper** replaces current `useTranslation` hook:
```typescript
// src/lib/i18n.ts
import en from '@/i18n/en.json';
import sv from '@/i18n/sv.json';

const translations = { en, sv } as const;

export function t(key: string, locale: string = 'en'): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
```

**Nyehandel API:** The `X-Language` header is sourced from the current locale in middleware and passed to edge function calls.

## 12. Directory Structure

```
src/
  actions/
    index.ts                   # Astro Actions (add-to-cart, review, newsletter)
  components/
    islands/                   # React island wrappers (client:* components)
      CartDrawer.tsx
      ProductFilters.tsx
      ReviewForm.tsx
      AuthForm.tsx
      ThemeToggle.tsx
      ToastProvider.tsx
      ...
    ui/                        # shadcn/ui primitives (unchanged)
      button.tsx
      card.tsx
      ...
    astro/                     # Pure Astro components (zero JS)
      ProductCard.astro
      BrandCard.astro
      Header.astro
      Footer.astro
      AgeGate.astro
      SEO.astro
      JsonLd.astro
      Breadcrumb.astro
      ...
  config/
    tenant.ts                  # White-label tenant configuration
  content.config.ts              # Content Layer collections (products, brands, blog) — at src/ root
  i18n/
    en.json
    sv.json
  layouts/
    Base.astro                 # HTML shell, head, ViewTransitions, theme
    Shop.astro                 # Base + header + footer + age gate
    Ops.astro                  # Base + ops sidebar + auth guard
  lib/
    supabase-server.ts         # Server-side Supabase client
    supabase-browser.ts        # Client-side Supabase client
    i18n.ts                    # Translation helper
    utils.ts                   # cn() and shared utilities
    cart-utils.ts              # Price calculation (unchanged, never edit)
  pages/
    index.astro                # Homepage (SSG)
    about.astro                # About (SSG)
    nicotine-pouches/
      index.astro              # Product listing (SSG + ISR)
      [filter].astro           # Category filter pages (SSG + ISR)
    product/
      [slug].astro             # Product detail (SSG + ISR)
    brand/
      [slug].astro             # Brand hub (SSG)
    brands.astro               # Brand index (SSG)
    blog/
      index.astro              # Blog index (SSG)
      [slug].astro             # Blog post (SSG)
    cart.astro                 # Cart (SSR)
    checkout.astro             # Checkout (SSR)
    login.astro                # Login (SSR)
    register.astro             # Register (SSR)
    account.astro              # Account (SSR)
    search.astro               # Search (SSR)
    community.astro            # Community (SSR)
    rewards.astro              # Rewards (SSR)
    ops/
      index.astro              # Ops dashboard (SSR)
      ...
    api/
      auth/
        signin.ts              # Auth endpoint
        signup.ts
        signout.ts
        callback.ts
    faq.astro
    contact.astro
    shipping.astro
    returns.astro
    terms.astro
    privacy.astro
    cookies.astro
    whats-new.astro
    404.astro
  stores/
    cart.ts                    # Nanostore: cart items + open state
    wishlist.ts                # Nanostore: wishlist items
    theme.ts                   # Nanostore: dark/light theme
    cookie-consent.ts          # Nanostore: GDPR consent
    auth.ts                    # Nanostore: user session (client mirror)
    easter.ts                  # Nanostore: easter egg mode
  styles/
    global.css                 # Tailwind imports + CSS custom properties
```

## 13. Component Migration Strategy

### Pure Astro rewrites (zero JS)
These components become `.astro` files with no client-side JavaScript:
- ProductCard, BrandCard — render static HTML with Tailwind
- Header, Footer, MainNav — static layout (interactive parts are islands)
- SEO, JsonLd, Breadcrumb — `<head>` meta generation
- AgeGate — inline `<script is:inline>` checks localStorage
- All info page content (FAQ accordions can use `<details>` HTML element)

### React islands (keep as .tsx, wrap with client directive)
These stay as React components, loaded as islands:
- CartDrawer (`client:load`) — needs interactivity always
- ProductFilters (`client:load`) — filter/sort interactions
- ReviewForm (`client:visible`) — below fold, loads on scroll
- AuthForms (`client:load`) — login/register forms
- PouchBuilder (`client:load`) — SVG customizer
- FlavorQuiz (`client:load`) — multi-step quiz
- ThemeToggle (`client:load`) — dark mode switch
- ToastProvider (`client:only="react"`) — Sonner toaster (portal-based)

### Server Islands (server:defer)
Dynamic content rendered server-side without client JS:
- Cart item count badge — `server:defer` on header
- User avatar / auth state indicator — `server:defer`
- "Recommended for you" section — `server:defer` with its own cache

### shadcn/ui handling
- Simple components (Button, Badge, Card, Input, etc.) — use with `client:load`, SSR-safe
- Portal components (Dialog, Sheet, Select, Popover, DropdownMenu, etc.) — use with `client:only="react"`
- Source code of all 52 components: **zero changes needed**

## 14. Cross-Island Communication

### Toast notifications
Single `<ToastProvider client:only="react" />` in Base layout. Other islands trigger toasts via CustomEvent:

```typescript
// Any island can dispatch
window.dispatchEvent(new CustomEvent('show-toast', {
  detail: { message: 'Added to cart!', type: 'success' }
}));

// ToastProvider listens
useEffect(() => {
  const handler = (e: CustomEvent) => toast[e.detail.type](e.detail.message);
  window.addEventListener('show-toast', handler);
  return () => window.removeEventListener('show-toast', handler);
}, []);
```

### Cart updates across islands
Nanostores handle this natively. When the cart island updates `$cartItems`, the header's cart count island re-renders automatically because both read the same store.

## 15. Vercel Deployment

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://snusfriends.com',
  output: 'hybrid',
  adapter: vercel({
    edgeMiddleware: true,
    isr: {
      expiration: 14400, // 4 hours
      bypassToken: process.env.ISR_BYPASS_TOKEN,
    },
    imageService: true,
    webAnalytics: { enabled: true },
    maxDuration: 10,
  }),
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', sv: 'sv' } },
    }),
    AstroPWA({ /* existing PWA config */ }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: [/^@radix-ui/],
    },
  },
});
```

**CI/CD:** Same GitHub Actions pattern — `bun install` → `astro build` → `vercel deploy --prebuilt`.

## 16. Migration Phases

### Phase 1: Foundation (Scaffold + Config)
- Initialize Astro project in the repo
- Set up `astro.config.mjs` with Vercel adapter, React, Tailwind, PWA, sitemap
- Create base layouts (Base.astro, Shop.astro, Ops.astro)
- Set up tenant config (`src/config/tenant.ts`)
- Set up nanostores (cart, wishlist, theme, consent, auth, easter)
- Set up Supabase clients (server + browser)
- Set up middleware (auth + tenant)
- Set up Content Layer (products + brands loaders)
- Set up Astro Actions scaffolding
- Set up i18n with EN translations
- CI/CD pipeline (GitHub Actions)

### Phase 2: Static Pages (SEO Foundation)
- Convert all info pages to `.astro` (about, FAQ, shipping, returns, terms, privacy, cookies, whats-new)
- Build Astro layout components (Header, Footer, AgeGate, SEO, JsonLd)
- Homepage as SSG with islands
- Build ProductCard.astro and BrandCard.astro
- Brand index + Brand hub pages
- Blog index + Blog post pages
- 404 page
- View Transitions integration

### Phase 3: Catalog Pages (SEO Core)
- Product listing page with SSG + ISR
- Product detail page with SSG + ISR
- Category filter pages (`/nicotine-pouches/[filter]`)
- ProductFilters island (client:load)
- Add-to-cart island (client:load)
- Reviews display (server:defer or client:visible)
- Product recommendations
- Search page (SSR)
- Sitemap generation with all product URLs

### Phase 4: Interactive Features
- Cart page + CartDrawer island
- Checkout handoff (SSR)
- Auth pages (login, register, forgot, update password)
- Account page
- Wishlist page
- Rewards page
- Community page
- Leaderboard page
- Membership page
- Flavor quiz
- Bundle builder
- Order confirmation

### Phase 5: Ops + Polish
- Ops dashboard (SSR, auth-gated)
- Ops sub-pages (users, sync, mappings, webhooks)
- Easter egg
- PWA install prompt
- Analytics (PostHog consent-gated)
- Sentry error tracking
- Programmatic category pages for SEO
- Performance audit (Lighthouse)

### Phase 6: Cleanup
- Remove old Vite SPA files (src/pages/ React pages, App.tsx, main.tsx)
- Remove react-router-dom (already removed on Vike branch)
- Remove React Query (replaced by Content Layer for catalog, nanostores for client state)
- Remove react-helmet-async (already removed on Vike branch)
- Update CLAUDE.md, ROADMAP.md, DEPLOYMENT_CHECKLIST.md
- Close Vike migration PR (#2)

## 17. What Stays Unchanged

- **All 52 shadcn/ui component source files** — zero modifications
- **All 20 Supabase edge functions** — backend is untouched
- **All 42 database migrations** — schema unchanged
- **`src/lib/cart-utils.ts`** — never edit (per CLAUDE.md)
- **`src/data/brand-overrides.ts`** — static brand data
- **`src/data/products.ts`** — TypeScript types and enums
- **`src/data/membership.ts`** — tier definitions
- **Tailwind theme** — CSS custom properties carry over
- **PostHog + Sentry config** — just need client island wrappers
- **PWA manifest and icons** — same assets, new integration
- **Supabase client config** — split into server/browser variants

## 18. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Radix hydration mismatches | Use `client:only="react"` for portal components; `vite.ssr.noExternal` for Radix |
| Build time for 734 products | ISR means full rebuild is rare; Content Layer is 5x faster than legacy |
| Cart state loss on navigation | Nanostores + `@nanostores/persistent` + localStorage; View Transitions preserve state |
| Toast cross-island | CustomEvent bridge (proven pattern) |
| i18n complexity | Start with EN only, SV structure ready but unpopulated |
| Age gate with SSG | Inline `<script is:inline>` checks localStorage before paint, no hydration needed |
| Performance regression | Lighthouse baseline before + after; Astro's zero-JS default makes regression unlikely |

## 19. Success Criteria

- [ ] All 33 routes render correctly
- [ ] Lighthouse performance score ≥ 95 on product pages
- [ ] Zero JavaScript on info pages (about, FAQ, legal, blog)
- [ ] Product pages fully crawlable by Google (server-rendered HTML with product data)
- [ ] Cart, wishlist, theme persist across page navigations
- [ ] Auth flow works (login, register, protected routes redirect)
- [ ] Checkout completes end-to-end via Nyehandel
- [ ] ISR revalidates product pages on schedule and on-demand
- [ ] Tenant config drives all brand-specific values (no hardcoded "SnusFriend" strings)
- [ ] Build + deploy completes in under 5 minutes via GitHub Actions
