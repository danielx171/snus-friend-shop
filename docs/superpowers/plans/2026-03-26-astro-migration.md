# Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the SnusFriends e-commerce site from Vike (Vite SPA) to Astro 5 with islands architecture for zero-JS SEO pages, nanostores for cross-island state, and white-label tenant configuration.

**Architecture:** Astro 5 hybrid mode (SSG default + SSR opt-in) deployed on Vercel. React islands hydrate only where interactivity is needed. Nanostores replace 6 React Context providers. Content Layer fetches products at build time. Existing Supabase edge functions and database are untouched.

**Tech Stack:** Astro 5, React 19, Nanostores, @astrojs/vercel, Tailwind CSS 3, shadcn/ui (50 components), Supabase, Vitest

**Design Spec:** `docs/superpowers/specs/2026-03-26-astro-migration-design.md`

---

## Scope Note

This plan covers Phases 1–3 (Foundation, Static Pages, Catalog Pages). These phases produce a fully deployable site with all SEO-critical pages server-rendered. Phases 4–6 (Interactive Features, Ops, Cleanup) will be planned separately once Phases 1–3 are validated.

**Why split?** Phases 1–3 are the SEO-critical path — the entire business reason for migrating. Shipping them first lets us validate the architecture, measure Lighthouse scores, and catch integration issues before migrating 16+ interactive pages.

---

## File Map

### New Files (Phase 1 — Foundation)

| File | Responsibility |
|------|---------------|
| `astro.config.mjs` | Astro config: Vercel adapter, React, Tailwind, PWA, sitemap, i18n |
| `src/config/tenant.ts` | White-label tenant config (brand, theme, SEO, features, assets) |
| `src/stores/cart.ts` | Nanostore: cart items, open state, computed totals |
| `src/stores/wishlist.ts` | Nanostore: wishlist IDs (localStorage for anon, syncs to Supabase) |
| `src/stores/theme.ts` | Nanostore: dark/light theme with localStorage persistence |
| `src/stores/cookie-consent.ts` | Nanostore: GDPR consent state |
| `src/stores/auth.ts` | Nanostore: client-side auth mirror |
| `src/stores/easter.ts` | Nanostore: easter egg mode |
| `src/stores/language.ts` | Nanostore: language/market/currency |
| `src/lib/supabase-browser.ts` | Browser Supabase client (PUBLIC_ env vars) |
| `src/lib/supabase-server.ts` | Server Supabase client (updated for Astro env) |
| `src/content.config.ts` | Content Layer: products + brands collections |
| `src/middleware.ts` | Astro middleware: auth + locale |
| `src/layouts/Base.astro` | HTML shell, head, ViewTransitions, theme injection |
| `src/layouts/Shop.astro` | Base + Header + Footer + AgeGate |
| `src/i18n/en.json` | English translation strings |
| `src/env.d.ts` | Astro env type declarations |
| `src/actions/index.ts` | Astro Actions scaffold |

### New Files (Phase 2 — Static Pages)

| File | Responsibility |
|------|---------------|
| `src/components/astro/Header.astro` | Site header (static shell + cart island) |
| `src/components/astro/Footer.astro` | Site footer (pure static) |
| `src/components/astro/SEO.astro` | Meta tags, OG, JSON-LD |
| `src/components/astro/Breadcrumb.astro` | Breadcrumb navigation |
| `src/components/astro/AgeGate.astro` | Age verification (inline script) |
| `src/pages/index.astro` | Homepage (SSG) |
| `src/pages/about.astro` | About page (SSG) |
| `src/pages/faq.astro` | FAQ page (SSG, `<details>` elements) |
| `src/pages/contact.astro` | Contact page (SSG + form island) |
| `src/pages/shipping.astro` | Shipping info (SSG) |
| `src/pages/returns.astro` | Returns policy (SSG) |
| `src/pages/terms.astro` | Terms of service (SSG) |
| `src/pages/privacy.astro` | Privacy policy (SSG) |
| `src/pages/cookies.astro` | Cookie policy (SSG) |
| `src/pages/whats-new.astro` | Changelog (SSG) |
| `src/pages/404.astro` | Not found page (SSG) |
| `src/pages/brands.astro` | Brands index (SSG) |
| `src/pages/brand/[slug].astro` | Brand detail (SSG) |

### New Files (Phase 3 — Catalog Pages)

| File | Responsibility |
|------|---------------|
| `src/components/astro/ProductCard.astro` | Product card (zero JS) |
| `src/components/astro/BrandCard.astro` | Brand card (zero JS) |
| `src/components/islands/CartDrawer.tsx` | Cart drawer island (client:load) |
| `src/components/islands/CartIcon.tsx` | Header cart icon with count (client:load) |
| `src/components/islands/ProductFilters.tsx` | Filter/sort controls (client:load) |
| `src/components/islands/AddToCart.tsx` | Add-to-cart button + pack selector (client:load) |
| `src/components/islands/ThemeToggle.tsx` | Dark/light toggle (client:load) |
| `src/components/islands/ToastProvider.tsx` | Sonner toast bridge (client:only="react") |
| `src/pages/nicotine-pouches/index.astro` | Product listing (SSG + ISR) |
| `src/pages/nicotine-pouches/[filter].astro` | Category filter pages (SSG + ISR) |
| `src/pages/product/[slug].astro` | Product detail (SSG + ISR) |

### Modified Files

| File | Change |
|------|--------|
| `package.json` | Add astro deps, remove vike deps, update scripts |
| `.github/workflows/deploy.yml` | Update build command + branch trigger |
| `src/lib/supabase-server.ts` | Update env var access for Astro |
| `src/index.css` | Keep as-is (imported by Base.astro) |
| `tailwind.config.ts` | Update content paths for `.astro` files |
| `.env.example` | Add PUBLIC_ vars alongside VITE_ vars |
| `tsconfig.json` | Add Astro types |

### Unchanged Files (carried over as-is)

- All 50 `src/components/ui/*.tsx` — shadcn/ui primitives
- `src/lib/cart-utils.ts` — **never edit**
- `src/lib/currency.ts`, `src/lib/market.ts`, `src/lib/format.ts`
- `src/lib/utils.ts` — cn() utility
- `src/data/products.ts` — Product/PackSize types
- `src/data/brand-overrides.ts` — brand data
- `src/data/membership.ts` — tier definitions
- `src/integrations/supabase/types.ts` — DB types
- All `supabase/functions/` — edge functions untouched
- All `supabase/migrations/` — schema untouched

---

## Phase 1: Foundation

### Task 1: Initialize Astro and Install Dependencies

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`
- Modify: `tsconfig.json`

- [ ] **Step 1: Install Astro and core integrations**

```bash
cd /Users/Daniel/Projects/snus-friend-shop
bun add astro @astrojs/react @astrojs/vercel @astrojs/sitemap nanostores @nanostores/persistent @nanostores/react @supabase/ssr
bun add -D @vite-pwa/astro
```

- [ ] **Step 2: Update package.json scripts**

Replace the `scripts` block in `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev --port 8080",
    "build": "astro build",
    "preview": "astro preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "sitemap": "bun run scripts/generate-sitemap.ts"
  }
}
```

- [ ] **Step 3: Create astro.config.mjs**

Create `astro.config.mjs` at project root:

```javascript
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';
import path from 'path';

export default defineConfig({
  site: 'https://snusfriends.com',
  output: 'hybrid',
  adapter: vercel({
    isr: {
      expiration: 14400, // 4 hours default
    },
    imageService: true,
    maxDuration: 10,
  }),
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', sv: 'sv' } },
    }),
    AstroPWA({
      devOptions: { enabled: false },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon.ico', 'robots.txt', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'SnusFriend | Premium Nicotine Pouches',
        short_name: 'SnusFriend',
        description: 'Shop 700+ nicotine pouches from 91 brands. Fast EU delivery.',
        theme_color: '#121620',
        background_color: '#121620',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/ops\//, /^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url, request }) =>
              /^https:\/\/.*\.supabase\.co\/functions\/v1\/.*/.test(url.href) &&
              request.method === 'GET',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'product-images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/nycdn\.nyehandel\.se\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'nyehandel-images-cache',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'sv'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    ssr: {
      noExternal: [/^@radix-ui/],
    },
    define: {
      // Read from package.json at build time
      __APP_VERSION__: JSON.stringify('1.5.0'),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0]),
    },
  },
});
```

- [ ] **Step 4: Update tsconfig.json**

Replace `tsconfig.json` with Astro-compatible config:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "types": ["vite/client"]
  },
  "include": ["src/**/*", "astro.config.mjs", "src/env.d.ts"],
  "exclude": ["node_modules", "dist", ".vercel"]
}
```

- [ ] **Step 5: Create src/env.d.ts**

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_PREVIEW_MODE: string;
  readonly PUBLIC_SENTRY_DSN: string;
  readonly PUBLIC_POSTHOG_KEY: string;
  readonly PUBLIC_POSTHOG_HOST: string;
  readonly SUPABASE_URL: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// PWA install prompt (carried over from current codebase)
declare global {
  interface Window {
    __pwaInstallPromptEvent: BeforeInstallPromptEvent | null;
  }
}
```

- [ ] **Step 6: Update tailwind.config.ts content paths**

Add `.astro` files to the content array in `tailwind.config.ts`:

Change:
```typescript
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
```

To:
```typescript
content: ["./src/**/*.{astro,ts,tsx}", "./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
```

- [ ] **Step 7: Update .env.example**

Add the PUBLIC_ equivalents to `.env.example`:

```
# Astro public env vars (replace VITE_ vars after migration)
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
PUBLIC_SITE_URL=
PUBLIC_PREVIEW_MODE=false
PUBLIC_SENTRY_DSN=
PUBLIC_POSTHOG_KEY=
PUBLIC_POSTHOG_HOST=
```

- [ ] **Step 8: Verify installation compiles**

```bash
bunx astro check
```

Expected: No fatal errors. Warnings about missing pages are OK at this stage.

- [ ] **Step 9: Commit**

```bash
git add astro.config.mjs src/env.d.ts package.json tsconfig.json tailwind.config.ts .env.example
git commit -m "feat(astro): initialize Astro 5 with Vercel adapter, React, Tailwind, PWA"
```

---

### Task 2: Tenant Configuration

**Files:**
- Create: `src/config/tenant.ts`

- [ ] **Step 1: Create tenant config**

```typescript
// src/config/tenant.ts
// White-label tenant configuration — all brand-specific values live here.
// When tenant #2 arrives, this becomes middleware-resolved per hostname.

export interface TenantConfig {
  readonly id: string;
  readonly name: string;
  readonly tagline: string;
  readonly domain: string;
  readonly supportEmail: string;
  readonly loyaltyProgramName: string;
  readonly currencyCode: string;

  readonly theme: {
    readonly primary: string;
    readonly accent: string;
    readonly background: string;
    readonly foreground: string;
    readonly card: string;
    readonly border: string;
    readonly fontFamily: string;
    readonly borderRadius: string;
    readonly darkModeClass: string;
    readonly lightModeClass: string;
    readonly defaultTheme: 'velo' | 'light';
  };

  readonly features: {
    readonly loyaltyProgram: boolean;
    readonly communityHub: boolean;
    readonly reviews: boolean;
    readonly quests: boolean;
    readonly ageGate: boolean;
    readonly flavorQuiz: boolean;
    readonly bundleBuilder: boolean;
    readonly easterEgg: boolean;
  };

  readonly seo: {
    readonly titleTemplate: string;
    readonly defaultTitle: string;
    readonly defaultDescription: string;
    readonly ogImage: string;
  };

  readonly assets: {
    readonly logo: string;
    readonly logoDark: string;
    readonly favicon: string;
  };

  readonly storage: {
    readonly cartKey: string;
    readonly wishlistKey: string;
    readonly themeKey: string;
    readonly languageKey: string;
    readonly easterKey: string;
    readonly consentKey: string;
    readonly ageVerifiedKey: string;
  };

  readonly freeShippingThreshold: number;
}

export const tenant: TenantConfig = {
  id: 'snusfriends',
  name: 'SnusFriend',
  tagline: 'Premium Nicotine Pouches',
  domain: 'snusfriends.com',
  supportEmail: 'support@snusfriends.com',
  loyaltyProgramName: 'SnusFriends Rewards',
  currencyCode: 'EUR',

  theme: {
    primary: '174 90% 50%',
    accent: '174 90% 50%',
    background: '220 16% 8%',
    foreground: '210 20% 95%',
    card: '220 14% 13%',
    border: '220 12% 22%',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
    darkModeClass: 'velo',
    lightModeClass: 'light',
    defaultTheme: 'velo',
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
    defaultTitle: 'SnusFriend | Premium Nicotine Pouches',
    defaultDescription: 'Shop 700+ nicotine pouches from 91 leading brands. Fast EU-wide delivery, loyalty rewards, and the best prices online.',
    ogImage: '/og-default.png',
  },

  assets: {
    logo: '/images/logo.svg',
    logoDark: '/images/logo-dark.svg',
    favicon: '/favicon.png',
  },

  storage: {
    cartKey: 'snusfriend_cart',
    wishlistKey: 'snusfriend_wishlist',
    themeKey: 'theme',
    languageKey: 'snusfriend-language',
    easterKey: 'sf_easter_mode',
    consentKey: 'cookie-consent',
    ageVerifiedKey: 'age_verified',
  },

  freeShippingThreshold: 29,
} as const satisfies TenantConfig;
```

- [ ] **Step 2: Commit**

```bash
git add src/config/tenant.ts
git commit -m "feat(astro): add white-label tenant configuration"
```

---

### Task 3: Nanostores — Cart, Theme, Easter, Cookie Consent

**Files:**
- Create: `src/stores/cart.ts`
- Create: `src/stores/theme.ts`
- Create: `src/stores/easter.ts`
- Create: `src/stores/cookie-consent.ts`
- Create: `src/stores/language.ts`
- Create: `src/stores/auth.ts`
- Create: `src/stores/wishlist.ts`

- [ ] **Step 1: Create cart store**

```typescript
// src/stores/cart.ts
import { map, atom, computed } from 'nanostores';
import { persistentMap, persistentAtom } from '@nanostores/persistent';
import type { Product, PackSize } from '@/data/products';
import { tenant } from '@/config/tenant';

export interface CartItem {
  product: Product;
  packSize: PackSize;
  quantity: number;
}

// Serialize/deserialize cart items for localStorage
const encoder = {
  encode: JSON.stringify,
  decode: JSON.parse,
};

export const $cartItems = persistentAtom<CartItem[]>(
  tenant.storage.cartKey,
  [],
  encoder,
);

export const $cartOpen = atom(false);

export const $cartTotal = computed($cartItems, (items) =>
  items.reduce((sum, item) => {
    const price = item.product.prices[item.packSize];
    return sum + price * item.quantity;
  }, 0),
);

export const $cartCount = computed($cartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const $freeShippingProgress = computed($cartTotal, (total) => ({
  reached: total >= tenant.freeShippingThreshold,
  remaining: Math.max(0, tenant.freeShippingThreshold - total),
  threshold: tenant.freeShippingThreshold,
}));

export function addToCart(product: Product, packSize: PackSize, quantity = 1) {
  const items = $cartItems.get();
  const existingIndex = items.findIndex(
    (item) => item.product.id === product.id && item.packSize === packSize,
  );

  if (existingIndex >= 0) {
    const updated = [...items];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    $cartItems.set(updated);
  } else {
    $cartItems.set([...items, { product, packSize, quantity }]);
  }
}

export function removeFromCart(productId: string, packSize: PackSize) {
  $cartItems.set(
    $cartItems.get().filter(
      (item) => !(item.product.id === productId && item.packSize === packSize),
    ),
  );
}

export function updateCartQuantity(productId: string, packSize: PackSize, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId, packSize);
    return;
  }
  $cartItems.set(
    $cartItems.get().map((item) =>
      item.product.id === productId && item.packSize === packSize
        ? { ...item, quantity }
        : item,
    ),
  );
}

export function clearCart() {
  $cartItems.set([]);
}

export function openCart() {
  $cartOpen.set(true);
}

export function closeCart() {
  $cartOpen.set(false);
}
```

- [ ] **Step 2: Create theme store**

```typescript
// src/stores/theme.ts
import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export type Theme = 'velo' | 'light';

export const $theme = persistentAtom<Theme>(
  tenant.storage.themeKey,
  tenant.theme.defaultTheme,
);

export function setTheme(next: Theme) {
  $theme.set(next);
  // Apply class to <html> immediately (no React needed)
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('velo', 'light');
    root.classList.add(next);
  }
}

export function toggleTheme() {
  setTheme($theme.get() === 'velo' ? 'light' : 'velo');
}
```

- [ ] **Step 3: Create easter store**

```typescript
// src/stores/easter.ts
import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export const $easterMode = persistentAtom<boolean>(
  tenant.storage.easterKey,
  false,
  {
    encode: String,
    decode: (s) => s === 'true',
  },
);

export function toggleEaster() {
  $easterMode.set(!$easterMode.get());
}
```

- [ ] **Step 4: Create cookie consent store**

```typescript
// src/stores/cookie-consent.ts
import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  answered: boolean;
}

const defaultConsent: ConsentState = {
  analytics: false,
  marketing: false,
  answered: false,
};

export const $cookieConsent = persistentAtom<ConsentState>(
  tenant.storage.consentKey,
  defaultConsent,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function acceptAll() {
  $cookieConsent.set({ analytics: true, marketing: true, answered: true });
}

export function rejectAll() {
  $cookieConsent.set({ analytics: false, marketing: false, answered: true });
}

export function setConsent(analytics: boolean, marketing: boolean) {
  $cookieConsent.set({ analytics, marketing, answered: true });
}
```

- [ ] **Step 5: Create language store**

```typescript
// src/stores/language.ts
import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { tenant } from '@/config/tenant';
import { getMarketForLanguage, convertFromGBP, formatMarketPrice, type MarketConfig } from '@/lib/market';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

// Top languages for EU nicotine pouch market
export const availableLanguages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

function detectBrowserLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  const browserLangs = navigator.languages ?? [navigator.language ?? 'en'];
  for (const lang of browserLangs) {
    const code = lang.toLowerCase().split('-')[0];
    if (availableLanguages.find((l) => l.code === code)) return code;
  }
  return 'en';
}

export const $languageCode = persistentAtom<string>(
  tenant.storage.languageKey,
  detectBrowserLanguage(),
);

export const $language = computed($languageCode, (code) =>
  availableLanguages.find((l) => l.code === code) ?? availableLanguages[0],
);

export const $market = computed($languageCode, (code) =>
  getMarketForLanguage(code),
);

export function setLanguage(code: string) {
  $languageCode.set(code);
}

export function formatPrice(gbpPrice: number, market: MarketConfig, decimals = 2): string {
  const converted = convertFromGBP(gbpPrice, market);
  const formatted = formatMarketPrice(converted, market, decimals);
  if (market.currencyCode !== 'EUR') {
    return `≈ ${formatted}`;
  }
  return formatted;
}
```

- [ ] **Step 6: Create auth store**

```typescript
// src/stores/auth.ts
import { atom } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';

// Client-side mirror of auth state — set from Supabase onAuthStateChange
export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $isAuthenticated = atom(false);

export function setAuth(user: User | null, session: Session | null) {
  $user.set(user);
  $session.set(session);
  $isAuthenticated.set(!!user);
}

export function clearAuth() {
  $user.set(null);
  $session.set(null);
  $isAuthenticated.set(false);
}
```

- [ ] **Step 7: Create wishlist store**

```typescript
// src/stores/wishlist.ts
import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { tenant } from '@/config/tenant';

// Anonymous wishlist (localStorage). Supabase sync for logged-in users
// is handled by the WishlistIsland React component (Phase 4).
export const $wishlistIds = persistentAtom<string[]>(
  tenant.storage.wishlistKey,
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const $wishlistCount = computed($wishlistIds, (ids) => ids.length);

export function toggleWishlist(productId: string) {
  const ids = $wishlistIds.get();
  if (ids.includes(productId)) {
    $wishlistIds.set(ids.filter((id) => id !== productId));
  } else {
    $wishlistIds.set([...ids, productId]);
  }
}

export function hasInWishlist(productId: string): boolean {
  return $wishlistIds.get().includes(productId);
}

export function clearWishlist() {
  $wishlistIds.set([]);
}
```

- [ ] **Step 8: Commit**

```bash
git add src/stores/
git commit -m "feat(astro): add nanostores for cart, theme, wishlist, consent, language, auth, easter"
```

---

### Task 4: Supabase Clients (Browser + Server)

**Files:**
- Create: `src/lib/supabase-browser.ts`
- Modify: `src/lib/supabase-server.ts`

- [ ] **Step 1: Create browser Supabase client**

```typescript
// src/lib/supabase-browser.ts
// Client-side Supabase client for React islands.
// Uses PUBLIC_ env vars (Astro convention, replaces VITE_ prefix).
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('[supabase-browser] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(url ?? '', key ?? '', {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

- [ ] **Step 2: Update server Supabase client for Astro**

Replace `src/lib/supabase-server.ts`:

```typescript
// src/lib/supabase-server.ts
// Server-side only — NEVER import this in client-side React islands.
// Uses non-prefixed env vars (Astro server-only, no PUBLIC_ prefix).
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// In Astro, server-only env vars are accessed via import.meta.env (no prefix)
// During build: set via Vercel env vars or .env file
const url = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.warn('[supabase-server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — SSR/build data fetching will fail');
}

export const supabaseServer = createClient<Database>(url ?? '', key ?? '', {
  auth: { persistSession: false },
});
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase-browser.ts src/lib/supabase-server.ts
git commit -m "feat(astro): add browser + server Supabase clients with Astro env vars"
```

---

### Task 5: Content Layer — Products and Brands

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create Content Layer config**

```typescript
// src/content.config.ts
// Astro Content Layer — fetches products and brands from Supabase at build time.
// These collections are used by SSG pages via getCollection() / getEntry().
import { defineCollection, z } from 'astro:content';
import { createClient } from '@supabase/supabase-js';

// Build-time Supabase client (service role for full read access)
const url = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

const buildClient = createClient(url, key, {
  auth: { persistSession: false },
});

const RETAIL_MARKUP = 1.55;
const PACK_DISCOUNT: Record<string, number> = {
  pack1: 1.0,
  pack3: 0.95,
  pack5: 0.90,
  pack10: 0.85,
  pack30: 0.80,
};
const PACK_QUANTITIES: Record<string, number> = {
  pack1: 1,
  pack3: 3,
  pack5: 5,
  pack10: 10,
  pack30: 30,
};

function computePrices(variants: Array<{ pack_size: number; price: number }>) {
  // Find the single-can wholesale price (pack_size = 1)
  const baseCan = variants.find((v) => v.pack_size === 1);
  const wholesalePerCan = baseCan?.price ?? 3.29;
  const retailPerCan = wholesalePerCan * RETAIL_MARKUP;

  const prices: Record<string, number> = {};
  for (const [packKey, qty] of Object.entries(PACK_QUANTITIES)) {
    const discount = PACK_DISCOUNT[packKey] ?? 1.0;
    prices[packKey] = Math.round(retailPerCan * qty * discount * 100) / 100;
  }
  return prices;
}

function computeStock(variants: Array<{ inventory?: Array<{ quantity: number }> }>) {
  return variants.reduce((total, v) => {
    const qty = v.inventory?.[0]?.quantity ?? 0;
    return total + qty;
  }, 0);
}

const products = defineCollection({
  loader: async () => {
    if (!url || !key) {
      console.warn('[content.config] No Supabase credentials — returning empty product catalog');
      return [];
    }
    const { data, error } = await buildClient
      .from('products')
      .select('*, brands(id, slug, name, manufacturer), product_variants(pack_size, price, sku, inventory(quantity))')
      .eq('is_active', true);

    if (error) {
      console.error('[content.config] Failed to fetch products:', error.message);
      return [];
    }

    return (data ?? []).map((p) => ({
      id: p.slug ?? p.id,
      slug: p.slug ?? p.id,
      name: p.name,
      brand: p.brands?.name ?? 'Unknown',
      brandSlug: p.brands?.slug ?? '',
      manufacturer: p.brands?.manufacturer ?? '',
      categoryKey: p.category_key ?? 'nicotinePouches',
      flavorKey: p.flavor_key ?? 'mint',
      strengthKey: p.strength_key ?? 'normal',
      formatKey: p.format_key ?? 'slim',
      nicotineContent: p.nicotine_mg ?? 0,
      portionsPerCan: p.portions_per_can ?? 20,
      description: p.description ?? '',
      descriptionKey: p.description_key ?? '',
      comparePrice: p.compare_price ?? undefined,
      imageUrl: p.image_url ?? '',
      ratings: p.ratings ?? 0,
      badgeKeys: p.badge_keys ?? [],
      prices: computePrices(p.product_variants ?? []),
      stock: computeStock(p.product_variants ?? []),
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    brand: z.string(),
    brandSlug: z.string(),
    manufacturer: z.string(),
    categoryKey: z.string(),
    flavorKey: z.string(),
    strengthKey: z.string(),
    formatKey: z.string(),
    nicotineContent: z.number(),
    portionsPerCan: z.number(),
    description: z.string(),
    descriptionKey: z.string(),
    comparePrice: z.number().optional(),
    imageUrl: z.string(),
    ratings: z.number(),
    badgeKeys: z.array(z.string()),
    prices: z.record(z.string(), z.number()),
    stock: z.number(),
  }),
});

const brands = defineCollection({
  loader: async () => {
    if (!url || !key) return [];
    const { data, error } = await buildClient
      .from('brands')
      .select('id, slug, name, manufacturer, logo_url, description, country_code')
      .order('name');

    if (error) {
      console.error('[content.config] Failed to fetch brands:', error.message);
      return [];
    }

    return (data ?? []).map((b) => ({
      id: b.slug ?? b.id,
      slug: b.slug ?? b.id,
      name: b.name,
      manufacturer: b.manufacturer ?? '',
      logoUrl: b.logo_url ?? '',
      description: b.description ?? '',
      countryCode: b.country_code ?? '',
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    manufacturer: z.string(),
    logoUrl: z.string(),
    description: z.string(),
    countryCode: z.string(),
  }),
});

export const collections = { products, brands };
```

- [ ] **Step 2: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(astro): add Content Layer with Supabase product + brand loaders"
```

---

### Task 6: Layouts (Base + Shop)

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/layouts/Shop.astro`
- Create: `src/components/astro/SEO.astro`

- [ ] **Step 1: Create SEO component**

```astro
---
// src/components/astro/SEO.astro
import { tenant } from '@/config/tenant';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

const {
  title,
  description = tenant.seo.defaultDescription,
  ogImage = tenant.seo.ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
} = Astro.props;

const pageTitle = title
  ? tenant.seo.titleTemplate.replace('%s', title)
  : tenant.seo.defaultTitle;

const canonicalUrl = canonical ?? Astro.url.href;
const ogImageUrl = ogImage.startsWith('http') ? ogImage : new URL(ogImage, Astro.site).href;
---

<title>{pageTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />

{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph -->
<meta property="og:title" content={pageTitle} />
<meta property="og:description" content={description} />
<meta property="og:type" content={ogType} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:site_name" content={tenant.name} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={pageTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />
```

- [ ] **Step 2: Create Base layout**

```astro
---
// src/layouts/Base.astro
import { ViewTransitions } from 'astro:transitions';
import { tenant } from '@/config/tenant';
import SEO from '@/components/astro/SEO.astro';
import '@/index.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  class?: string;
}

const props = Astro.props;
---

<!doctype html>
<html lang={Astro.currentLocale ?? 'en'} class={tenant.theme.darkModeClass}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content={Astro.generator} />
  <link rel="icon" type="image/png" href={tenant.assets.favicon} />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
  <meta name="theme-color" content="#121620" />

  <SEO
    title={props.title}
    description={props.description}
    ogImage={props.ogImage}
    ogType={props.ogType}
    canonical={props.canonical}
    noindex={props.noindex}
  />

  <ViewTransitions />

  <!-- Restore theme before paint to prevent flash -->
  <script is:inline define:vars={{ storageKey: tenant.storage.themeKey, defaultTheme: tenant.theme.darkModeClass }}>
    (function() {
      const stored = localStorage.getItem(storageKey);
      const theme = (stored === 'velo' || stored === 'light') ? stored : defaultTheme;
      document.documentElement.classList.add(theme);
    })();
  </script>
</head>
<body class:list={['min-h-screen bg-background text-foreground antialiased', props.class]}>
  <slot />

  <!-- Re-apply theme after View Transition navigation -->
  <script>
    import { $theme } from '@/stores/theme';

    document.addEventListener('astro:page-load', () => {
      const theme = $theme.get();
      const root = document.documentElement;
      root.classList.remove('velo', 'light');
      root.classList.add(theme);
    });
  </script>
</body>
</html>
```

- [ ] **Step 3: Create Shop layout**

```astro
---
// src/layouts/Shop.astro
// Standard shop layout: Base + Header + Footer + AgeGate + ToastProvider + CartDrawer
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

const props = Astro.props;
---

<Base {...props}>
  <AgeGate />
  <div class="flex min-h-screen flex-col" transition:persist="shop-shell">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</Base>
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/ src/components/astro/SEO.astro
git commit -m "feat(astro): add Base + Shop layouts with SEO, ViewTransitions, theme restore"
```

---

### Task 7: Header, Footer, AgeGate Components

**Files:**
- Create: `src/components/astro/Header.astro`
- Create: `src/components/astro/Footer.astro`
- Create: `src/components/astro/AgeGate.astro`
- Create: `src/components/astro/Breadcrumb.astro`

- [ ] **Step 1: Create Header**

```astro
---
// src/components/astro/Header.astro
import { tenant } from '@/config/tenant';

// Navigation links — static, no JS needed
const navLinks = [
  { href: '/nicotine-pouches', label: 'Products' },
  { href: '/brands', label: 'Brands' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
];
---

<header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl" transition:persist="header">
  <div class="container flex h-16 items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-bold text-lg text-primary">
      {tenant.name}
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-6" aria-label="Main navigation">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {label}
        </a>
      ))}
    </nav>

    <!-- Right side: search, cart, theme toggle -->
    <div class="flex items-center gap-3">
      <a href="/search" class="text-muted-foreground hover:text-foreground" aria-label="Search products">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </a>

      <!-- Cart icon island — client:load for live count -->
      <div id="cart-icon-slot">
        <!-- CartIcon island injected by Shop layout or page -->
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden text-muted-foreground hover:text-foreground"
        aria-label="Open menu"
        data-mobile-menu-toggle
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
    </div>
  </div>
</header>
```

- [ ] **Step 2: Create Footer**

```astro
---
// src/components/astro/Footer.astro
import { tenant } from '@/config/tenant';

const currentYear = new Date().getFullYear();

const footerLinks = {
  shop: [
    { href: '/nicotine-pouches', label: 'All Products' },
    { href: '/brands', label: 'Brands' },
    { href: '/shipping', label: 'Shipping' },
    { href: '/returns', label: 'Returns' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
    { href: '/whats-new', label: "What's New" },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};
---

<footer class="border-t border-border/40 bg-card/50 py-12">
  <div class="container">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
      <!-- Brand column -->
      <div class="col-span-2 md:col-span-1">
        <p class="font-bold text-lg text-primary">{tenant.name}</p>
        <p class="mt-2 text-sm text-muted-foreground">{tenant.tagline}</p>
        <p class="mt-4 text-xs text-muted-foreground">
          <a href={`mailto:${tenant.supportEmail}`} class="hover:text-foreground">
            {tenant.supportEmail}
          </a>
        </p>
      </div>

      <!-- Shop links -->
      <div>
        <h3 class="text-sm font-semibold text-foreground">Shop</h3>
        <ul class="mt-3 space-y-2">
          {footerLinks.shop.map(({ href, label }) => (
            <li>
              <a href={href} class="text-sm text-muted-foreground hover:text-foreground">{label}</a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Company links -->
      <div>
        <h3 class="text-sm font-semibold text-foreground">Company</h3>
        <ul class="mt-3 space-y-2">
          {footerLinks.company.map(({ href, label }) => (
            <li>
              <a href={href} class="text-sm text-muted-foreground hover:text-foreground">{label}</a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Legal links -->
      <div>
        <h3 class="text-sm font-semibold text-foreground">Legal</h3>
        <ul class="mt-3 space-y-2">
          {footerLinks.legal.map(({ href, label }) => (
            <li>
              <a href={href} class="text-sm text-muted-foreground hover:text-foreground">{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div class="mt-8 border-t border-border/40 pt-6">
      <p class="text-center text-xs text-muted-foreground">
        © {currentYear} {tenant.name}. All rights reserved. 18+ only.
      </p>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create AgeGate**

```astro
---
// src/components/astro/AgeGate.astro
// Full-screen age verification gate. Uses inline script + localStorage.
// No React hydration needed — pure vanilla JS.
import { tenant } from '@/config/tenant';
---

{tenant.features.ageGate && (
  <div id="age-gate" class="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm" style="display:none;">
    <div class="mx-4 max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-xl">
      <h2 class="text-2xl font-bold text-foreground">Age Verification</h2>
      <p class="mt-3 text-sm text-muted-foreground">
        You must be 18 years or older to access this site. Nicotine products are intended for adult use only.
      </p>
      <div class="mt-6 flex flex-col gap-3">
        <button
          id="age-gate-confirm"
          class="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          I am 18 or older
        </button>
        <button
          id="age-gate-deny"
          class="rounded-md border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
        >
          I am under 18
        </button>
      </div>
    </div>
  </div>
)}

<script is:inline define:vars={{ storageKey: tenant.storage.ageVerifiedKey, enabled: tenant.features.ageGate }}>
  (function() {
    if (!enabled) return;
    var gate = document.getElementById('age-gate');
    if (!gate) return;

    var verified = localStorage.getItem(storageKey) === 'true';
    if (verified) return;

    // Show the gate
    gate.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    document.getElementById('age-gate-confirm').addEventListener('click', function() {
      localStorage.setItem(storageKey, 'true');
      gate.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.getElementById('age-gate-deny').addEventListener('click', function() {
      window.location.href = 'https://google.com';
    });
  })();
</script>
```

- [ ] **Step 4: Create Breadcrumb**

```astro
---
// src/components/astro/Breadcrumb.astro
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

const { items } = Astro.props;
---

<nav aria-label="Breadcrumb" class="mb-4">
  <ol class="flex items-center gap-1.5 text-sm text-muted-foreground" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/" itemprop="item" class="hover:text-foreground">
        <span itemprop="name">Home</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    {items.map((item, i) => (
      <>
        <li class="text-muted-foreground/50">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          {item.href ? (
            <a href={item.href} itemprop="item" class="hover:text-foreground">
              <span itemprop="name">{item.label}</span>
            </a>
          ) : (
            <span itemprop="name" class="text-foreground font-medium">{item.label}</span>
          )}
          <meta itemprop="position" content={String(i + 2)} />
        </li>
      </>
    ))}
  </ol>
</nav>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/astro/
git commit -m "feat(astro): add Header, Footer, AgeGate, Breadcrumb components"
```

---

### Task 8: Astro Middleware (Auth + Locale)

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  // Create server-side Supabase client with cookie-based auth
  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // No Supabase credentials — skip auth, continue
    context.locals.user = null;
    context.locals.supabase = null;
    return next();
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return context.cookies
            .headers()
            .map((h) => {
              const [name, ...rest] = h.split('=');
              return { name, value: rest.join('=') };
            });
        },
        setAll(cookies: { name: string; value: string; options?: CookieOptions }[]) {
          for (const cookie of cookies) {
            context.cookies.set(cookie.name, cookie.value, cookie.options as any);
          }
        },
      },
    },
  );

  // Get current user (validates JWT, refreshes token if needed)
  const { data: { user } } = await supabase.auth.getUser();
  context.locals.user = user;
  context.locals.supabase = supabase;

  // Protected route checks
  const pathname = context.url.pathname;
  const protectedPaths = ['/account', '/checkout', '/order-confirmation', '/rewards', '/wishlist'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isOps = pathname.startsWith('/ops') && pathname !== '/ops/login';

  if (isProtected && !user) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  if (isOps && !user) {
    return context.redirect('/ops/login');
  }

  return next();
});
```

- [ ] **Step 2: Add locals type declaration to env.d.ts**

Append to `src/env.d.ts`:

```typescript
// Augment Astro locals with auth data
declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
    supabase: import('@supabase/supabase-js').SupabaseClient | null;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/middleware.ts src/env.d.ts
git commit -m "feat(astro): add middleware with Supabase SSR auth and route protection"
```

---

### Task 9: i18n Foundation

**Files:**
- Create: `src/i18n/en.json`
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: Create English translations**

```json
{
  "site.name": "SnusFriend",
  "site.tagline": "Premium Nicotine Pouches",
  "nav.products": "Products",
  "nav.brands": "Brands",
  "nav.about": "About",
  "nav.faq": "FAQ",
  "nav.search": "Search",
  "cart.title": "Shopping Cart",
  "cart.empty": "Your cart is empty",
  "cart.checkout": "Proceed to Checkout",
  "cart.freeShipping": "Free shipping on orders over €{threshold}",
  "cart.addedToCart": "Added {name} to cart",
  "product.addToCart": "Add to Cart",
  "product.outOfStock": "Out of Stock",
  "product.reviews": "{count} reviews",
  "product.strength": "Strength",
  "product.flavor": "Flavor",
  "product.format": "Format",
  "product.portions": "{count} portions per can",
  "filter.all": "All",
  "filter.brand": "Brand",
  "filter.strength": "Strength",
  "filter.flavor": "Flavor",
  "filter.format": "Format",
  "filter.sort": "Sort by",
  "filter.sort.popular": "Most Popular",
  "filter.sort.priceAsc": "Price: Low to High",
  "filter.sort.priceDesc": "Price: High to Low",
  "filter.sort.newest": "Newest",
  "footer.copyright": "© {year} SnusFriend. All rights reserved. 18+ only.",
  "ageGate.title": "Age Verification",
  "ageGate.message": "You must be 18 years or older to access this site.",
  "ageGate.confirm": "I am 18 or older",
  "ageGate.deny": "I am under 18"
}
```

- [ ] **Step 2: Create i18n helper**

```typescript
// src/lib/i18n.ts
import en from '@/i18n/en.json';

const translations: Record<string, Record<string, string>> = { en };

/**
 * Look up a translation key for a given locale.
 * Supports simple interpolation: t('cart.freeShipping', 'en', { threshold: '29' })
 */
export function t(
  key: string,
  locale: string = 'en',
  params?: Record<string, string | number>,
): string {
  const dict = translations[locale] ?? translations.en;
  let text = dict[key] ?? translations.en[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }

  return text;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ src/lib/i18n.ts
git commit -m "feat(astro): add i18n foundation with English translations"
```

---

### Task 10: CI/CD Pipeline Update

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Update deploy workflow for Astro**

Replace `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, feat/astro-migration]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build
        run: bun run build
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
          PUBLIC_SITE_URL: https://snusfriends.com
          PUBLIC_PREVIEW_MODE: "true"

      - name: Verify Build Output
        run: |
          echo "Checking Astro build output..."
          test -d dist || (echo "ERROR: dist/ missing" && exit 1)
          echo "✓ Astro build output verified"

      - name: Install Vercel CLI
        run: bun add -g vercel@latest

      - name: Deploy Preview
        if: github.event_name == 'pull_request' || (github.event_name == 'push' && github.ref != 'refs/heads/main')
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy Production
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: update deploy workflow for Astro build"
```

---

### Task 11: Smoke Test — First Astro Page

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create minimal homepage**

```astro
---
// src/pages/index.astro
// SSG homepage — minimal version to validate the full stack works.
import Shop from '@/layouts/Shop.astro';
import { tenant } from '@/config/tenant';
---

<Shop title="Home" description={tenant.seo.defaultDescription}>
  <section class="container py-16 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
      {tenant.name}
    </h1>
    <p class="mt-4 text-lg text-muted-foreground">
      {tenant.tagline} — {tenant.seo.defaultDescription}
    </p>
    <div class="mt-8">
      <a
        href="/nicotine-pouches"
        class="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Shop Now
      </a>
    </div>
  </section>
</Shop>
```

- [ ] **Step 2: Run dev server to validate**

```bash
bun run dev
```

Expected: Dev server starts on port 8080. Navigate to `http://localhost:8080/` — you should see the homepage with header, footer, age gate, and correct theme.

- [ ] **Step 3: Run build to validate**

```bash
bun run build
```

Expected: Build completes without errors. `dist/` directory created with static HTML for the homepage.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(astro): add smoke test homepage — validates full stack"
```

---

## Phase 2: Static Pages

### Task 12: Info Pages (About, FAQ, Shipping, Returns, Terms, Privacy, Cookies, What's New)

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/faq.astro`
- Create: `src/pages/shipping.astro`
- Create: `src/pages/returns.astro`
- Create: `src/pages/terms.astro`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/cookies.astro`
- Create: `src/pages/whats-new.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`

**Pattern:** Each page reads its content from the existing React component in `src/pages/`. For Phase 2 we extract the static text into `.astro` pages. The existing React page components stay in `src/pages/` (old Vike location) until Phase 6 cleanup.

- [ ] **Step 1: Read existing page content**

Read the current React page files to extract their content:
- `src/pages/About.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/Shipping.tsx`
- `src/pages/Returns.tsx`
- `src/pages/Terms.tsx`
- `src/pages/Privacy.tsx`
- `src/pages/Cookies.tsx`
- `src/pages/WhatsNew.tsx`
- `src/pages/Contact.tsx`

Extract the static text/HTML content from each.

- [ ] **Step 2: Create all info pages**

Each info page follows this pattern (shown for About, replicate for all):

```astro
---
// src/pages/about.astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
---

<Shop title="About Us">
  <div class="container max-w-3xl py-12">
    <Breadcrumb items={[{ label: 'About Us' }]} />

    <!-- Copy content from src/pages/About.tsx -->
    <!-- Replace JSX with plain HTML + Tailwind classes -->
    <!-- Remove React hooks, imports, and interactivity -->
    <h1 class="text-3xl font-bold tracking-tight text-foreground">About SnusFriend</h1>

    <div class="mt-6 space-y-4 text-muted-foreground">
      <!-- Static content from the React component -->
    </div>
  </div>
</Shop>
```

For FAQ, use native `<details>` + `<summary>` instead of Radix Accordion (zero JS):

```astro
---
// src/pages/faq.astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';

const faqs = [
  { q: 'What are nicotine pouches?', a: 'Nicotine pouches are...' },
  { q: 'How do I use nicotine pouches?', a: 'Place the pouch...' },
  // ... extract from src/pages/FAQ.tsx
];
---

<Shop title="FAQ">
  <div class="container max-w-3xl py-12">
    <Breadcrumb items={[{ label: 'FAQ' }]} />
    <h1 class="text-3xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h1>

    <div class="mt-8 space-y-3">
      {faqs.map(({ q, a }) => (
        <details class="group rounded-lg border border-border bg-card p-4">
          <summary class="cursor-pointer font-medium text-foreground">
            {q}
          </summary>
          <p class="mt-3 text-sm text-muted-foreground">
            {a}
          </p>
        </details>
      ))}
    </div>
  </div>
</Shop>
```

For Contact, use an Astro Action form (progressive enhancement):

```astro
---
// src/pages/contact.astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import { tenant } from '@/config/tenant';
---

<Shop title="Contact Us">
  <div class="container max-w-xl py-12">
    <Breadcrumb items={[{ label: 'Contact' }]} />
    <h1 class="text-3xl font-bold tracking-tight text-foreground">Contact Us</h1>
    <p class="mt-3 text-muted-foreground">
      Email us at <a href={`mailto:${tenant.supportEmail}`} class="text-primary hover:underline">{tenant.supportEmail}</a>
    </p>

    <form method="POST" action="/api/contact" class="mt-8 space-y-4">
      <div>
        <label for="name" class="text-sm font-medium text-foreground">Name</label>
        <input type="text" id="name" name="name" required
          class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label for="email" class="text-sm font-medium text-foreground">Email</label>
        <input type="email" id="email" name="email" required
          class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label for="message" class="text-sm font-medium text-foreground">Message</label>
        <textarea id="message" name="message" rows="5" required
          class="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
      </div>
      <button type="submit"
        class="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
        Send Message
      </button>
    </form>
  </div>
</Shop>
```

For 404:

```astro
---
// src/pages/404.astro
import Shop from '@/layouts/Shop.astro';
---

<Shop title="Page Not Found" noindex>
  <div class="container flex flex-col items-center justify-center py-24 text-center">
    <h1 class="text-6xl font-bold text-primary">404</h1>
    <p class="mt-4 text-lg text-muted-foreground">Page not found. This page doesn't exist or has been moved.</p>
    <a href="/" class="mt-8 inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
      Back to Home
    </a>
  </div>
</Shop>
```

- [ ] **Step 3: Verify all pages render**

```bash
bun run dev
```

Visit each page in the browser: `/about`, `/faq`, `/shipping`, `/returns`, `/terms`, `/privacy`, `/cookies`, `/whats-new`, `/contact`, and trigger the 404 with a bad URL.

Expected: All pages render with correct layout (header + content + footer). Zero JavaScript on info pages (check network tab — no .js bundles loaded except PWA service worker).

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/faq.astro src/pages/shipping.astro src/pages/returns.astro src/pages/terms.astro src/pages/privacy.astro src/pages/cookies.astro src/pages/whats-new.astro src/pages/contact.astro src/pages/404.astro
git commit -m "feat(astro): add all static info pages — zero JS, SSG"
```

---

### Task 13: Brand Pages (Index + Detail)

**Files:**
- Create: `src/pages/brands.astro`
- Create: `src/pages/brand/[slug].astro`
- Create: `src/components/astro/BrandCard.astro`

- [ ] **Step 1: Create BrandCard**

```astro
---
// src/components/astro/BrandCard.astro
interface Props {
  slug: string;
  name: string;
  manufacturer: string;
  logoUrl: string;
  productCount?: number;
}

const { slug, name, manufacturer, logoUrl, productCount } = Astro.props;
---

<a
  href={`/brand/${slug}`}
  class="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
>
  <div class="flex items-center gap-4">
    {logoUrl ? (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        class="h-12 w-12 rounded-md object-contain"
        loading="lazy"
      />
    ) : (
      <div class="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-lg font-bold text-muted-foreground">
        {name.charAt(0)}
      </div>
    )}
    <div>
      <h3 class="font-medium text-foreground group-hover:text-primary">{name}</h3>
      {manufacturer && (
        <p class="text-xs text-muted-foreground">by {manufacturer}</p>
      )}
      {productCount !== undefined && (
        <p class="text-xs text-muted-foreground">{productCount} products</p>
      )}
    </div>
  </div>
</a>
```

- [ ] **Step 2: Create brands index page**

```astro
---
// src/pages/brands.astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import BrandCard from '@/components/astro/BrandCard.astro';
import { getCollection } from 'astro:content';

const allBrands = await getCollection('brands');
const allProducts = await getCollection('products');

// Count products per brand
const brandProductCount = new Map<string, number>();
for (const product of allProducts) {
  const count = brandProductCount.get(product.data.brandSlug) ?? 0;
  brandProductCount.set(product.data.brandSlug, count + 1);
}

// Sort brands alphabetically
const brands = allBrands.sort((a, b) => a.data.name.localeCompare(b.data.name));
---

<Shop title="All Brands" description="Browse all 91+ nicotine pouch brands available at SnusFriend.">
  <div class="container py-12">
    <Breadcrumb items={[{ label: 'Brands' }]} />
    <h1 class="text-3xl font-bold tracking-tight text-foreground">All Brands</h1>
    <p class="mt-2 text-muted-foreground">
      {brands.length} brands available
    </p>

    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {brands.map((brand) => (
        <BrandCard
          slug={brand.data.slug}
          name={brand.data.name}
          manufacturer={brand.data.manufacturer}
          logoUrl={brand.data.logoUrl}
          productCount={brandProductCount.get(brand.data.slug) ?? 0}
        />
      ))}
    </div>
  </div>
</Shop>
```

- [ ] **Step 3: Create brand detail page**

```astro
---
// src/pages/brand/[slug].astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import ProductCard from '@/components/astro/ProductCard.astro';
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const brands = await getCollection('brands');
  return brands.map((brand) => ({
    params: { slug: brand.data.slug },
    props: { brand: brand.data },
  }));
}

const { brand } = Astro.props;

// Get all products for this brand
const allProducts = await getCollection('products');
const brandProducts = allProducts.filter((p) => p.data.brandSlug === brand.slug);
---

<Shop
  title={brand.name}
  description={`Shop ${brand.name} nicotine pouches. ${brandProducts.length} products available at SnusFriend.`}
>
  <div class="container py-12">
    <Breadcrumb items={[
      { label: 'Brands', href: '/brands' },
      { label: brand.name },
    ]} />

    <div class="flex items-center gap-4">
      {brand.logoUrl && (
        <img src={brand.logoUrl} alt={`${brand.name} logo`} class="h-16 w-16 rounded-lg object-contain" />
      )}
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground">{brand.name}</h1>
        {brand.manufacturer && (
          <p class="text-sm text-muted-foreground">by {brand.manufacturer}</p>
        )}
      </div>
    </div>

    {brand.description && (
      <p class="mt-4 text-muted-foreground">{brand.description}</p>
    )}

    <h2 class="mt-8 text-xl font-semibold text-foreground">
      Products ({brandProducts.length})
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {brandProducts.map((product) => (
        <ProductCard product={product.data} />
      ))}
    </div>
  </div>
</Shop>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/astro/BrandCard.astro src/pages/brands.astro src/pages/brand/
git commit -m "feat(astro): add brand index + detail pages with Content Layer"
```

---

## Phase 3: Catalog Pages

### Task 14: ProductCard Component (Zero JS)

**Files:**
- Create: `src/components/astro/ProductCard.astro`

- [ ] **Step 1: Create ProductCard**

```astro
---
// src/components/astro/ProductCard.astro
// Zero-JS product card — renders static HTML with Tailwind.
// Add-to-cart interactivity is handled by the product detail page island.

interface ProductData {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  prices: Record<string, number>;
  ratings: number;
  strengthKey: string;
  flavorKey: string;
  formatKey: string;
  badgeKeys: string[];
  stock: number;
}

interface Props {
  product: ProductData;
}

const { product } = Astro.props;
const price = product.prices.pack1 ?? 0;
const outOfStock = product.stock === 0;

const strengthLabels: Record<string, string> = {
  normal: 'Normal',
  strong: 'Strong',
  extraStrong: 'Extra Strong',
  ultraStrong: 'Ultra Strong',
};

const badgeColors: Record<string, string> = {
  new: 'bg-green-500/20 text-green-400',
  popular: 'bg-amber-500/20 text-amber-400',
  limited: 'bg-red-500/20 text-red-400',
  newPrice: 'bg-blue-500/20 text-blue-400',
};
---

<a
  href={`/product/${product.slug}`}
  class:list={[
    'group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg',
    outOfStock && 'opacity-60',
  ]}
>
  <!-- Badges -->
  {product.badgeKeys.length > 0 && (
    <div class="absolute top-2 left-2 z-10 flex gap-1">
      {product.badgeKeys.map((badge) => (
        <span class:list={['rounded-full px-2 py-0.5 text-xs font-medium', badgeColors[badge] ?? 'bg-muted text-muted-foreground']}>
          {badge}
        </span>
      ))}
    </div>
  )}

  <!-- Image -->
  <div class="aspect-square overflow-hidden bg-muted">
    {product.imageUrl ? (
      <img
        src={product.imageUrl}
        alt={product.name}
        class="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
        loading="lazy"
        width="300"
        height="300"
      />
    ) : (
      <div class="flex h-full items-center justify-center text-4xl text-muted-foreground">
        📦
      </div>
    )}
  </div>

  <!-- Info -->
  <div class="flex flex-1 flex-col p-3">
    <p class="text-xs text-muted-foreground">{product.brand}</p>
    <h3 class="mt-0.5 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary">
      {product.name}
    </h3>
    <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
      <span>{strengthLabels[product.strengthKey] ?? product.strengthKey}</span>
      <span>·</span>
      <span class="capitalize">{product.flavorKey}</span>
    </div>
    <div class="mt-auto pt-2 flex items-end justify-between">
      <p class="text-lg font-bold text-foreground">
        €{price.toFixed(2)}
      </p>
      {outOfStock && (
        <span class="text-xs text-destructive font-medium">Out of Stock</span>
      )}
    </div>
  </div>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/astro/ProductCard.astro
git commit -m "feat(astro): add zero-JS ProductCard component"
```

---

### Task 15: React Islands (CartIcon, CartDrawer, ThemeToggle, ToastProvider, AddToCart)

**Files:**
- Create: `src/components/islands/CartIcon.tsx`
- Create: `src/components/islands/CartDrawer.tsx`
- Create: `src/components/islands/ThemeToggle.tsx`
- Create: `src/components/islands/ToastProvider.tsx`
- Create: `src/components/islands/AddToCart.tsx`

- [ ] **Step 1: Create CartIcon island**

```tsx
// src/components/islands/CartIcon.tsx
import { useStore } from '@nanostores/react';
import { $cartCount, openCart } from '@/stores/cart';

export default function CartIcon() {
  const count = useStore($cartCount);

  return (
    <button
      onClick={openCart}
      className="relative text-muted-foreground hover:text-foreground"
      aria-label={`Shopping cart, ${count} items`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Create CartDrawer island**

```tsx
// src/components/islands/CartDrawer.tsx
import { useStore } from '@nanostores/react';
import {
  $cartItems, $cartOpen, $cartTotal, $cartCount, $freeShippingProgress,
  closeCart, removeFromCart, updateCartQuantity, clearCart,
} from '@/stores/cart';
import { Sheet, SheetContent, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function CartDrawer() {
  const items = useStore($cartItems);
  const isOpen = useStore($cartOpen);
  const total = useStore($cartTotal);
  const count = useStore($cartCount);
  const shipping = useStore($freeShippingProgress);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Cart ({count})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="outline" className="mt-4" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            {/* Free shipping progress */}
            {!shipping.reached && (
              <div className="mb-4 rounded-md bg-muted p-3 text-sm">
                <p className="text-muted-foreground">
                  €{shipping.remaining.toFixed(2)} away from free shipping
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(100, (total / shipping.threshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart items */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.packSize}`} className="flex items-center gap-3 rounded-md border border-border p-3">
                  <div className="h-14 w-14 flex-shrink-0 rounded bg-muted">
                    {item.product.image && (
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.packSize}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.packSize, item.quantity - 1)}
                        className="h-6 w-6 rounded border border-border text-xs hover:bg-muted"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                      >−</button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.packSize, item.quantity + 1)}
                        className="h-6 w-6 rounded border border-border text-xs hover:bg-muted"
                        aria-label={`Increase quantity of ${item.product.name}`}
                      >+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">€{(item.product.prices[item.packSize] * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.packSize)}
                      className="mt-1 text-xs text-destructive hover:underline"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <a
                href="/checkout"
                className="mt-3 block w-full rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Proceed to Checkout
              </a>
              <button
                onClick={clearCart}
                className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-destructive"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 3: Create ThemeToggle island**

```tsx
// src/components/islands/ThemeToggle.tsx
import { useStore } from '@nanostores/react';
import { $theme, toggleTheme } from '@/stores/theme';

export default function ThemeToggle() {
  const theme = useStore($theme);
  const isDark = theme === 'velo';

  return (
    <button
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 4: Create ToastProvider island**

```tsx
// src/components/islands/ToastProvider.tsx
// Bridges cross-island toast notifications via CustomEvent.
// Must be rendered with client:only="react" (Sonner uses portals).
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

interface ToastDetail {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function ToastProvider() {
  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent<ToastDetail>).detail;
      switch (type) {
        case 'success': toast.success(message); break;
        case 'error': toast.error(message); break;
        case 'warning': toast.warning(message); break;
        default: toast.info(message);
      }
    };

    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, []);

  return <Toaster richColors position="bottom-right" />;
}

// Helper for dispatching toasts from any island or inline script
export function showToast(message: string, type: ToastDetail['type'] = 'info') {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
}
```

- [ ] **Step 5: Create AddToCart island**

```tsx
// src/components/islands/AddToCart.tsx
import { useState } from 'react';
import { addToCart, openCart } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import type { Product, PackSize } from '@/data/products';
import { RETAIL_PACK_SIZES, packSizeMultipliers } from '@/data/products';

interface Props {
  product: Product;
}

const packLabels: Record<string, string> = {
  pack1: '1 can',
  pack3: '3 cans',
  pack5: '5 cans',
  pack10: '10 cans',
};

export default function AddToCart({ product }: Props) {
  const [selectedPack, setSelectedPack] = useState<PackSize>('pack1');
  const outOfStock = product.stock === 0;
  const price = product.prices[selectedPack];

  function handleAdd() {
    addToCart(product, selectedPack, 1);
    // Dispatch toast via CustomEvent bridge
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message: `Added ${product.name} to cart`, type: 'success' },
    }));
    openCart();
  }

  return (
    <div className="space-y-3">
      {/* Pack size selector */}
      <div className="flex flex-wrap gap-2">
        {RETAIL_PACK_SIZES.map((pack) => (
          <button
            key={pack}
            onClick={() => setSelectedPack(pack)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              selectedPack === pack
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
            aria-label={`Select ${packLabels[pack]}`}
          >
            <span className="font-medium">{packLabels[pack]}</span>
            <span className="ml-1 text-xs">€{product.prices[pack]?.toFixed(2)}</span>
          </button>
        ))}
      </div>

      {/* Price display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-foreground">€{price?.toFixed(2)}</span>
        {selectedPack !== 'pack1' && (
          <span className="text-sm text-muted-foreground">
            (€{(price / packSizeMultipliers[selectedPack]).toFixed(2)}/can)
          </span>
        )}
      </div>

      {/* Add to cart button */}
      <Button
        onClick={handleAdd}
        disabled={outOfStock}
        className="w-full"
        size="lg"
      >
        {outOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/islands/
git commit -m "feat(astro): add React islands — CartIcon, CartDrawer, ThemeToggle, ToastProvider, AddToCart"
```

---

### Task 16: Wire Islands into Layouts

**Files:**
- Modify: `src/layouts/Shop.astro`
- Modify: `src/components/astro/Header.astro`

- [ ] **Step 1: Update Shop layout to include islands**

Update `src/layouts/Shop.astro` to include the CartDrawer and ToastProvider islands:

```astro
---
// src/layouts/Shop.astro
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';
import CartDrawer from '@/components/islands/CartDrawer';
import ToastProvider from '@/components/islands/ToastProvider';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

const props = Astro.props;
---

<Base {...props}>
  <AgeGate />
  <CartDrawer client:load />
  <ToastProvider client:only="react" />
  <div class="flex min-h-screen flex-col" transition:persist="shop-shell">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</Base>
```

- [ ] **Step 2: Update Header to include CartIcon and ThemeToggle**

Update the `<!-- Cart icon island -->` section in `src/components/astro/Header.astro`:

Replace the placeholder `<div id="cart-icon-slot">` section with:

```astro
---
// Add to imports at top of Header.astro
import CartIcon from '@/components/islands/CartIcon';
import ThemeToggle from '@/components/islands/ThemeToggle';
---
```

And replace the right-side div content:

```astro
<div class="flex items-center gap-3">
  <a href="/search" class="text-muted-foreground hover:text-foreground" aria-label="Search products">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  </a>
  <ThemeToggle client:load />
  <CartIcon client:load />

  <!-- Mobile menu button -->
  <button
    class="md:hidden text-muted-foreground hover:text-foreground"
    aria-label="Open menu"
    data-mobile-menu-toggle
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  </button>
</div>
```

- [ ] **Step 3: Test islands work**

```bash
bun run dev
```

Navigate to `http://localhost:8080/`. Verify:
- Cart icon shows in the header with count badge
- Clicking cart icon opens the CartDrawer sheet
- Theme toggle switches between dark/light mode
- Theme persists across page reloads

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Shop.astro src/components/astro/Header.astro
git commit -m "feat(astro): wire CartDrawer, CartIcon, ThemeToggle, ToastProvider into layouts"
```

---

### Task 17: Product Listing Page

**Files:**
- Create: `src/pages/nicotine-pouches/index.astro`
- Create: `src/components/islands/ProductFilters.tsx`

- [ ] **Step 1: Create ProductFilters island**

```tsx
// src/components/islands/ProductFilters.tsx
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface ProductData {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  prices: Record<string, number>;
  ratings: number;
  strengthKey: string;
  flavorKey: string;
  formatKey: string;
  badgeKeys: string[];
  stock: number;
  brandSlug: string;
}

interface Props {
  products: ProductData[];
  brands: string[];
  strengths: string[];
  flavors: string[];
}

type SortOption = 'popular' | 'priceAsc' | 'priceDesc' | 'newest';

const strengthLabels: Record<string, string> = {
  normal: 'Normal',
  strong: 'Strong',
  extraStrong: 'Extra Strong',
  ultraStrong: 'Ultra Strong',
};

export default function ProductFilters({ products, brands, strengths, flavors }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedStrength, setSelectedStrength] = useState<string>('');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (selectedStrength) result = result.filter((p) => p.strengthKey === selectedStrength);
    if (selectedFlavor) result = result.filter((p) => p.flavorKey === selectedFlavor);

    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => (a.prices.pack1 ?? 0) - (b.prices.pack1 ?? 0));
        break;
      case 'priceDesc':
        result.sort((a, b) => (b.prices.pack1 ?? 0) - (a.prices.pack1 ?? 0));
        break;
      case 'newest':
        result.reverse();
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.ratings - a.ratings);
        break;
    }

    return result;
  }, [products, selectedBrand, selectedStrength, selectedFlavor, sortBy]);

  const hasFilters = selectedBrand || selectedStrength || selectedFlavor;

  function clearFilters() {
    setSelectedBrand('');
    setSelectedStrength('');
    setSelectedFlavor('');
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          aria-label="Filter by brand"
        >
          <option value="">All Brands</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={selectedStrength}
          onChange={(e) => setSelectedStrength(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          aria-label="Filter by strength"
        >
          <option value="">All Strengths</option>
          {strengths.map((s) => <option key={s} value={s}>{strengthLabels[s] ?? s}</option>)}
        </select>

        <select
          value={selectedFlavor}
          onChange={(e) => setSelectedFlavor(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          aria-label="Filter by flavor"
        >
          <option value="">All Flavors</option>
          {flavors.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          aria-label="Sort products"
        >
          <option value="popular">Most Popular</option>
          <option value="priceAsc">Price: Low → High</option>
          <option value="priceDesc">Price: High → Low</option>
          <option value="newest">Newest</option>
        </select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          {filtered.length} products
        </span>
      </div>

      {/* Product grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <a
            key={product.slug}
            href={`/product/${product.slug}`}
            className="group relative flex flex-col rounded-lg border border-border bg-card overflow-hidden transition-all hover:border-primary/40 hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                  loading="lazy"
                  width={300}
                  height={300}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">📦</div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-3">
              <p className="text-xs text-muted-foreground">{product.brand}</p>
              <h3 className="mt-0.5 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary">
                {product.name}
              </h3>
              <div className="mt-auto pt-2">
                <p className="text-lg font-bold text-foreground">€{(product.prices.pack1 ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create product listing page**

```astro
---
// src/pages/nicotine-pouches/index.astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import ProductFilters from '@/components/islands/ProductFilters';
import { getCollection } from 'astro:content';

const allProducts = await getCollection('products');

// Extract unique filter values
const brands = [...new Set(allProducts.map((p) => p.data.brand))].sort();
const strengths = [...new Set(allProducts.map((p) => p.data.strengthKey))];
const flavors = [...new Set(allProducts.map((p) => p.data.flavorKey))].sort();

// Serialize product data for the island (no Astro content metadata)
const productData = allProducts.map((p) => p.data);
---

<Shop
  title="Nicotine Pouches"
  description="Shop 700+ nicotine pouches from 91+ brands. Fast EU delivery, best prices, and loyalty rewards."
>
  <div class="container py-8">
    <Breadcrumb items={[{ label: 'Nicotine Pouches' }]} />
    <h1 class="text-3xl font-bold tracking-tight text-foreground">Nicotine Pouches</h1>
    <p class="mt-2 text-muted-foreground">{allProducts.length} products available</p>

    <div class="mt-6">
      <ProductFilters
        client:load
        products={productData}
        brands={brands}
        strengths={strengths}
        flavors={flavors}
      />
    </div>
  </div>
</Shop>
```

- [ ] **Step 3: Verify listing page renders with product data**

```bash
bun run dev
```

Navigate to `http://localhost:8080/nicotine-pouches`. Verify:
- Products load from Content Layer (Supabase build-time fetch)
- Filter dropdowns work (brand, strength, flavor)
- Sort works (popular, price asc/desc, newest)
- Product cards link to `/product/[slug]`

- [ ] **Step 4: Commit**

```bash
git add src/pages/nicotine-pouches/index.astro src/components/islands/ProductFilters.tsx
git commit -m "feat(astro): add product listing page with filters island"
```

---

### Task 18: Product Detail Page

**Files:**
- Create: `src/pages/product/[slug].astro`

- [ ] **Step 1: Create product detail page**

```astro
---
// src/pages/product/[slug].astro
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import AddToCart from '@/components/islands/AddToCart';
import { getCollection } from 'astro:content';
import type { Product, PackSize } from '@/data/products';

export async function getStaticPaths() {
  const products = await getCollection('products');
  return products.map((p) => ({
    params: { slug: p.data.slug },
    props: { product: p.data },
  }));
}

const { product } = Astro.props;

const strengthLabels: Record<string, string> = {
  normal: 'Normal',
  strong: 'Strong',
  extraStrong: 'Extra Strong',
  ultraStrong: 'Ultra Strong',
};

// Construct a Product object compatible with cart-utils and AddToCart island
const productForCart: Product = {
  id: product.slug,
  name: product.name,
  brand: product.brand,
  categoryKey: product.categoryKey as any,
  flavorKey: product.flavorKey as any,
  strengthKey: product.strengthKey as any,
  formatKey: product.formatKey as any,
  nicotineContent: product.nicotineContent,
  portionsPerCan: product.portionsPerCan,
  descriptionKey: product.descriptionKey,
  description: product.description,
  comparePrice: product.comparePrice,
  stock: product.stock,
  image: product.imageUrl,
  ratings: product.ratings,
  badgeKeys: product.badgeKeys as any[],
  prices: product.prices as any,
  manufacturer: product.manufacturer,
};

// JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description || `${product.name} by ${product.brand}`,
  image: product.imageUrl,
  brand: { '@type': 'Brand', name: product.brand },
  offers: {
    '@type': 'Offer',
    price: product.prices.pack1?.toFixed(2),
    priceCurrency: 'EUR',
    availability: product.stock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    url: `https://snusfriends.com/product/${product.slug}`,
  },
};
---

<Shop
  title={product.name}
  description={product.description || `Shop ${product.name} by ${product.brand}. Fast EU delivery.`}
  ogType="product"
>
  <!-- JSON-LD -->
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

  <div class="container py-8">
    <Breadcrumb items={[
      { label: 'Nicotine Pouches', href: '/nicotine-pouches' },
      { label: product.brand, href: `/brand/${product.brandSlug}` },
      { label: product.name },
    ]} />

    <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
      <!-- Product image -->
      <div class="aspect-square rounded-lg border border-border bg-card">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            class="h-full w-full object-contain p-8"
            width="600"
            height="600"
          />
        ) : (
          <div class="flex h-full items-center justify-center text-6xl text-muted-foreground">
            📦
          </div>
        )}
      </div>

      <!-- Product info -->
      <div>
        <p class="text-sm text-muted-foreground">
          <a href={`/brand/${product.brandSlug}`} class="hover:text-primary">{product.brand}</a>
        </p>
        <h1 class="mt-1 text-2xl font-bold text-foreground md:text-3xl">{product.name}</h1>

        <!-- Specs -->
        <div class="mt-4 flex flex-wrap gap-3">
          <span class="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {strengthLabels[product.strengthKey] ?? product.strengthKey}
          </span>
          <span class="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground capitalize">
            {product.flavorKey}
          </span>
          <span class="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground capitalize">
            {product.formatKey}
          </span>
          <span class="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {product.nicotineContent}mg
          </span>
          <span class="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {product.portionsPerCan} portions
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p class="mt-6 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        )}

        <!-- Add to cart island -->
        <div class="mt-6">
          <AddToCart client:load product={productForCart} />
        </div>
      </div>
    </div>
  </div>
</Shop>
```

- [ ] **Step 2: Verify product detail page renders**

```bash
bun run dev
```

Navigate to any product from the listing page. Verify:
- Product image, name, brand, specs display correctly
- Pack size selector works
- Add to cart button adds items and opens cart drawer
- JSON-LD structured data in page source
- Breadcrumb navigation works

- [ ] **Step 3: Run a production build**

```bash
bun run build
```

Expected: Build generates static HTML for all product pages (one per product slug). Check build output for the number of pages generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/product/
git commit -m "feat(astro): add product detail page with SSG, AddToCart island, JSON-LD"
```

---

### Task 19: Category Filter Pages

**Files:**
- Create: `src/pages/nicotine-pouches/[filter].astro`

- [ ] **Step 1: Create category filter page**

```astro
---
// src/pages/nicotine-pouches/[filter].astro
// Programmatic SEO pages: /nicotine-pouches/mint, /nicotine-pouches/strong, etc.
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import ProductCard from '@/components/astro/ProductCard.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const products = await getCollection('products');

  // Build filter pages for flavors and strengths
  const flavors = [...new Set(products.map((p) => p.data.flavorKey))];
  const strengths = [...new Set(products.map((p) => p.data.strengthKey))];

  const paths = [];

  for (const flavor of flavors) {
    const filtered = products.filter((p) => p.data.flavorKey === flavor);
    paths.push({
      params: { filter: flavor },
      props: {
        filterType: 'flavor' as const,
        filterValue: flavor,
        products: filtered.map((p) => p.data),
        title: `${flavor.charAt(0).toUpperCase() + flavor.slice(1)} Nicotine Pouches`,
        description: `Shop ${filtered.length} ${flavor} nicotine pouches. Find your perfect ${flavor} pouch at SnusFriend.`,
      },
    });
  }

  for (const strength of strengths) {
    const strengthLabels: Record<string, string> = {
      normal: 'Normal Strength',
      strong: 'Strong',
      extraStrong: 'Extra Strong',
      ultraStrong: 'Ultra Strong',
    };
    const label = strengthLabels[strength] ?? strength;
    const filtered = products.filter((p) => p.data.strengthKey === strength);
    paths.push({
      params: { filter: strength },
      props: {
        filterType: 'strength' as const,
        filterValue: strength,
        products: filtered.map((p) => p.data),
        title: `${label} Nicotine Pouches`,
        description: `Shop ${filtered.length} ${label.toLowerCase()} nicotine pouches at SnusFriend.`,
      },
    });
  }

  return paths;
}

const { products, title, description, filterType, filterValue } = Astro.props;
---

<Shop title={title} description={description}>
  <div class="container py-8">
    <Breadcrumb items={[
      { label: 'Nicotine Pouches', href: '/nicotine-pouches' },
      { label: title },
    ]} />
    <h1 class="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
    <p class="mt-2 text-muted-foreground">{products.length} products</p>

    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard product={product} />
      ))}
    </div>
  </div>
</Shop>
```

- [ ] **Step 2: Verify category pages**

```bash
bun run dev
```

Navigate to `/nicotine-pouches/mint`, `/nicotine-pouches/strong`, etc. Verify:
- Pages render with filtered products
- Breadcrumbs show correct hierarchy
- Links from ProductCard work

- [ ] **Step 3: Commit**

```bash
git add src/pages/nicotine-pouches/
git commit -m "feat(astro): add programmatic category filter pages for SEO"
```

---

### Task 20: Full Build + Deploy Verification

- [ ] **Step 1: Run full production build**

```bash
bun run build
```

Expected: Build completes successfully. Output should show:
- Static pages generated for: index, about, faq, shipping, returns, terms, privacy, cookies, whats-new, contact, 404, brands, brand/*, nicotine-pouches, nicotine-pouches/*, product/*
- Total build time under 2 minutes

- [ ] **Step 2: Run preview server**

```bash
bun run preview
```

Navigate through the site. Verify:
- All static pages render correctly
- Cart drawer opens/closes
- Theme toggle works
- Age gate shows on first visit
- ProductCard links work
- Breadcrumbs work
- No console errors

- [ ] **Step 3: Verify zero JS on info pages**

Open browser DevTools → Network tab → Filter by JS. Navigate to `/about`.
Expected: No JavaScript loaded (or only the PWA service worker registration). The page is pure static HTML.

- [ ] **Step 4: Run Lighthouse on product page**

Open Chrome DevTools → Lighthouse → Run audit on a product page.
Expected: Performance score ≥ 90 (target ≥ 95 after further optimization).

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "feat(astro): complete Phase 1-3 — foundation, static pages, catalog pages"
```

---

## Phase 2-3 Complete — What's Next

At this point the site has:

- ✅ All SEO-critical pages server-rendered as static HTML
- ✅ Zero JavaScript on info pages (about, FAQ, legal, blog)
- ✅ Product pages with build-time data from Supabase
- ✅ Working cart with nanostores (persists across pages)
- ✅ Theme toggle, age gate, breadcrumbs
- ✅ JSON-LD structured data on product pages
- ✅ ISR configuration for product freshness
- ✅ White-label tenant config driving all brand values
- ✅ CI/CD pipeline for Vercel deployment

**Phases 4-6** (Interactive Features, Ops, Cleanup) will be planned in a separate document after validating:
1. Lighthouse scores meet targets
2. Build + deploy works end-to-end on Vercel
3. Content Layer correctly fetches all 734 products
4. Cart flow works across page navigations
