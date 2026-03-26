# Phase 4: SEO Launch Readiness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Make the catalog fully browsable, crawlable, and rankable — cart drawer, mobile menu, search, filters, category pages, cookie consent, toast, and SEO structured data.

**Architecture:** Astro 6 SSG pages with React islands for interactivity. Products loaded via Content Layer at build time, passed to islands as serialized JSON. State shared via nanostores.

**Tech Stack:** Astro 6, React 18, Tailwind v4, nanostores, Radix UI, sonner, @astrojs/vercel

---

## Existing Codebase Reference

### Key Files

| File | Role |
|------|------|
| `src/stores/cart.ts` | Cart state: `$cartItems`, `$cartOpen`, `$cartTotal`, `$cartCount`, `$freeShippingProgress`, `addToCart()`, `removeFromCart()`, `updateCartQuantity()`, `clearCart()`, `openCart()`, `closeCart()` |
| `src/stores/cookie-consent.ts` | Consent state: `$cookieConsent` persistent atom, `acceptAll()`, `rejectAll()`, `setConsent()` |
| `src/stores/theme.ts` | Theme state: `$theme` persistent atom (`'velo'` or `'light'`), `setTheme()`, `toggleTheme()` |
| `src/config/tenant.ts` | `tenant` config object — name, domain, seo, storage keys, freeShippingThreshold (29), features, theme |
| `src/data/products.ts` | `Product` interface, `PackSize`, `FlavorKey`, `StrengthKey`, `FormatKey`, `BadgeKey` types |
| `src/content.config.ts` | Content Layer loader — fetches from Supabase `products` table with brands join, returns objects with `{id, slug, name, brand, brandSlug, ...}` |
| `src/layouts/Shop.astro` | Shell: `Base > AgeGate > Header > main(slot) > Footer` |
| `src/layouts/Base.astro` | HTML document with SEO component, ClientRouter, theme script |
| `src/components/astro/Header.astro` | Sticky header with nav links (currently /nicotine-pouches — WRONG), search icon, HeaderCartButton island, hamburger button |
| `src/components/astro/Footer.astro` | Footer with shop/company/legal links (also has /nicotine-pouches — WRONG) |
| `src/components/astro/Breadcrumb.astro` | Breadcrumb nav with Schema.org BreadcrumbList markup |
| `src/components/react/ProductCard.tsx` | Product card React component — renders name, brand, strength dots, flavor tag, price, Add to Cart button |
| `src/components/react/HeaderCartButton.tsx` | Cart icon button with badge count, calls `openCart()` |
| `src/pages/products/index.astro` | Products listing page — uses `getCollection('products')`, renders disabled filter sidebar + product grid |
| `src/pages/search.astro` | Search page — has form but no client-side search logic |
| `src/pages/faq.astro` | FAQ page with `<details>` accordion for 14 Q&A pairs |
| `src/pages/index.astro` | Homepage with hero, placeholder best sellers, trust signals, brand marquee |
| `src/components/astro/SEO.astro` | Head meta tags: title (via template), description, canonical, OG, Twitter |
| `package.json` | Has sonner, all @radix-ui packages, nanostores, @nanostores/react, @nanostores/persistent |
| `astro.config.mjs` | output: 'static', @astrojs/vercel adapter with ISR, @astrojs/sitemap, Tailwind v4 via vite plugin |
| `vercel.json` | Legacy SPA rewrite `/(.*) -> /index.html` — needs deletion |

### Content Layer Product Shape (from content.config.ts loader)

```typescript
{
  id: string;        // = slug
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  manufacturer: string;
  categoryKey: string;
  flavorKey: string;      // 'mint' | 'citrus' | 'berry' | 'coffee' | 'tobacco' | 'exotic' | 'unflavored'
  strengthKey: string;    // 'light' | 'normal' | 'strong' | 'extra-strong' | 'super-strong'  (HYPHENATED)
  formatKey: string;      // 'slim' | 'mini' | 'original' | 'large'
  nicotineContent: number;
  portionsPerCan: number;
  description: string;
  descriptionKey: string;
  comparePrice?: number;
  imageUrl: string;
  ratings: number;
  badgeKeys: string[];
  prices: Record<string, number>;   // { pack1: 5.10, pack3: 14.54, ... }
  stock: number;
}
```

### ProductCard Props Interface (from src/components/react/ProductCard.tsx)

```typescript
interface ProductCardProps {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
}
```

### Cart Store API (from src/stores/cart.ts)

```typescript
import { $cartItems, $cartOpen, $cartTotal, $cartCount, $freeShippingProgress,
         addToCart, removeFromCart, updateCartQuantity, clearCart, openCart, closeCart
       } from '@/stores/cart';
import type { CartItem } from '@/stores/cart';
import type { Product, PackSize } from '@/data/products';

// addToCart requires a full Product object + PackSize
// Product.image (not imageUrl) — the cart store uses Product type from src/data/products.ts
// ProductCard.tsx already builds a minimal Product for addToCart (see lines 69-86)
```

### Styling Tokens

- Glass panel: `bg-card/60 backdrop-blur-sm border border-border rounded-xl`
- Background: `bg-background`, Card: `bg-card`, Border: `border-border`
- Text: `text-foreground`, Muted: `text-muted-foreground`, Primary: `text-primary`
- Buttons: `bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg`
- Dark mode class: `velo` (applied to `<html>`)

---

## Task 1: Foundation — UI Store + Toast Helper + Search Util

**Creates:** `src/stores/ui.ts`, `src/lib/toast.ts`, `src/lib/search.ts`
**Modifies:** Nothing
**Dependencies:** None

### 1a. Create `src/stores/ui.ts`

```typescript
// src/stores/ui.ts
import { atom } from 'nanostores';
import { $cartOpen } from '@/stores/cart';

/** Mobile navigation drawer open state */
export const $mobileMenuOpen = atom(false);

/** Alias for cart drawer — reads/writes the same atom from cart store */
export const $cartDrawerOpen = $cartOpen;
```

### 1b. Create `src/lib/toast.ts`

```typescript
// src/lib/toast.ts
import { toast as sonnerToast, type ExternalToast } from 'sonner';

const defaults: ExternalToast = {
  position: 'bottom-right',
  duration: 3000,
};

export const toast = {
  success(message: string, opts?: ExternalToast) {
    return sonnerToast.success(message, { ...defaults, ...opts });
  },
  error(message: string, opts?: ExternalToast) {
    return sonnerToast.error(message, { ...defaults, ...opts });
  },
  info(message: string, opts?: ExternalToast) {
    return sonnerToast.info(message, { ...defaults, ...opts });
  },
  warning(message: string, opts?: ExternalToast) {
    return sonnerToast.warning(message, { ...defaults, ...opts });
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
};
```

### 1c. Create `src/lib/search.ts`

```typescript
// src/lib/search.ts

/** Shape matching ProductCardProps — the data passed from Astro to React islands */
export interface SearchableProduct {
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  imageUrl: string;
  prices: Record<string, number>;
  stock: number;
  nicotineContent: number;
  strengthKey: string;
  flavorKey: string;
  ratings: number;
  badgeKeys: string[];
  description?: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'strength' | 'name-asc' | 'newest';

export interface FilterState {
  brands: string[];
  strengths: string[];
  flavors: string[];
  formats: string[];
  sort: SortOption;
  query?: string;
}

export const emptyFilters: FilterState = {
  brands: [],
  strengths: [],
  flavors: [],
  formats: [],
  sort: 'featured',
  query: '',
};

/** Normalize text for matching: lowercase, strip accents */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const strengthOrder: Record<string, number> = {
  light: 1,
  normal: 2,
  strong: 3,
  'extra-strong': 4,
  'super-strong': 5,
};

/**
 * Score a product against a search query.
 * Returns 0 if no match, higher is better.
 */
export function scoreProduct(product: SearchableProduct, query: string): number {
  if (!query) return 1; // no query = everything matches equally

  const q = normalize(query);
  if (!q) return 1;

  const name = normalize(product.name);
  const brand = normalize(product.brand);
  const flavor = normalize(product.flavorKey);
  const description = normalize(product.description ?? '');

  // Exact name match
  if (name === q) return 100;

  let score = 0;

  // Name contains query
  if (name.includes(q)) score += 80;

  // Brand exact match
  if (brand === q) score += 80;

  // Brand contains query
  else if (brand.includes(q)) score += 60;

  // Flavor match
  if (flavor === q || flavor.includes(q)) score += 50;

  // Description partial match
  if (description.includes(q)) score += 30;

  // Individual query words
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    for (const word of words) {
      if (name.includes(word)) score += 15;
      if (brand.includes(word)) score += 10;
      if (flavor.includes(word)) score += 8;
      if (description.includes(word)) score += 5;
    }
  }

  return score;
}

/**
 * Filter and sort products based on a FilterState.
 */
export function filterProducts(
  products: SearchableProduct[],
  filters: FilterState,
): SearchableProduct[] {
  let result = [...products];

  // Text search
  if (filters.query) {
    const scored = result
      .map((p) => ({ product: p, score: scoreProduct(p, filters.query!) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
    result = scored.map((s) => s.product);

    // If sorting by relevance (featured), return search-scored order
    if (filters.sort === 'featured') {
      return applyFacetFilters(result, filters);
    }
  }

  result = applyFacetFilters(result, filters);

  // Sort
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => (a.prices.pack1 ?? 0) - (b.prices.pack1 ?? 0));
      break;
    case 'price-desc':
      result.sort((a, b) => (b.prices.pack1 ?? 0) - (a.prices.pack1 ?? 0));
      break;
    case 'strength':
      result.sort(
        (a, b) => (strengthOrder[a.strengthKey] ?? 0) - (strengthOrder[b.strengthKey] ?? 0),
      );
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      // No created_at in the data — keep original order (newest first from DB)
      break;
    case 'featured':
    default:
      // Keep original order
      break;
  }

  return result;
}

function applyFacetFilters(products: SearchableProduct[], filters: FilterState): SearchableProduct[] {
  let result = products;

  if (filters.brands.length > 0) {
    const brandSet = new Set(filters.brands.map(normalize));
    result = result.filter((p) => brandSet.has(normalize(p.brand)));
  }

  if (filters.strengths.length > 0) {
    const strengthSet = new Set(filters.strengths);
    result = result.filter((p) => strengthSet.has(p.strengthKey));
  }

  if (filters.flavors.length > 0) {
    const flavorSet = new Set(filters.flavors);
    result = result.filter((p) => flavorSet.has(p.flavorKey));
  }

  if (filters.formats.length > 0) {
    const formatSet = new Set(filters.formats);
    result = result.filter((p) => formatSet.has(p.formatKey));
  }

  return result;
}
```

### Verification

```bash
bun run build   # Should compile with no errors — new files are not imported yet
```

### Commit

```bash
git add src/stores/ui.ts src/lib/toast.ts src/lib/search.ts
git commit -m "feat: add ui store, toast helper, and search util (phase 4 foundation)"
```

---

## Task 2: ToastProvider Island + Wire into Shop.astro

**Creates:** `src/components/react/ToastProvider.tsx`
**Modifies:** `src/layouts/Shop.astro`
**Dependencies:** Task 1 (toast.ts)

### 2a. Create `src/components/react/ToastProvider.tsx`

```tsx
// src/components/react/ToastProvider.tsx
import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className:
          'bg-card border-border text-foreground',
        style: {
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
      }}
      gap={8}
      expand={false}
      richColors
    />
  );
}
```

### 2b. Modify `src/layouts/Shop.astro`

Add the ToastProvider import and island. The full file should become:

```astro
---
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';
import ToastProvider from '@/components/react/ToastProvider';

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
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
  <ToastProvider client:load />
</Base>
```

**What changed:** Added `import ToastProvider` and `<ToastProvider client:load />` after the closing `</div>`.

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/components/react/ToastProvider.tsx src/layouts/Shop.astro
git commit -m "feat: add ToastProvider island to Shop layout"
```

---

## Task 3: CookieConsentBanner Island + Wire into Shop.astro

**Creates:** `src/components/react/CookieConsentBanner.tsx`
**Modifies:** `src/layouts/Shop.astro`
**Dependencies:** Task 2 (Shop.astro already has ToastProvider)

### 3a. Create `src/components/react/CookieConsentBanner.tsx`

```tsx
// src/components/react/CookieConsentBanner.tsx
import React, { useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $cookieConsent, acceptAll, rejectAll, setConsent } from '@/stores/cookie-consent';

const CookieConsentBanner = React.memo(function CookieConsentBanner() {
  const consent = useStore($cookieConsent);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleAcceptAll = useCallback(() => {
    acceptAll();
  }, []);

  const handleRejectAll = useCallback(() => {
    rejectAll();
  }, []);

  const handleSavePreferences = useCallback(() => {
    setConsent(analytics, marketing);
  }, [analytics, marketing]);

  const handleManagePreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  // Don't render if user already answered
  if (consent.answered) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] p-4"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl">
        {!showPreferences ? (
          <>
            <h2 className="mb-2 text-base font-semibold text-foreground">
              We value your privacy
            </h2>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalised content, and
              analyse our traffic. You can choose to accept all cookies or manage your preferences.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={handleManagePreferences}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Accept All
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Cookie Preferences
            </h2>
            <div className="space-y-4 mb-6">
              {/* Essential — always on */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Essential</p>
                  <p className="text-xs text-muted-foreground">
                    Required for the site to function. Cannot be disabled.
                  </p>
                </div>
                <div
                  className="h-5 w-9 rounded-full bg-primary/60 cursor-not-allowed relative"
                  aria-label="Essential cookies always enabled"
                >
                  <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-primary-foreground" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Help us understand how visitors use our site.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`h-5 w-9 rounded-full relative transition-colors ${
                    analytics ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label="Toggle analytics cookies"
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform ${
                      analytics ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Marketing</p>
                  <p className="text-xs text-muted-foreground">
                    Used to deliver relevant ads and measure campaigns.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketing}
                  onClick={() => setMarketing(!marketing)}
                  className={`h-5 w-9 rounded-full relative transition-colors ${
                    marketing ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  aria-label="Toggle marketing cookies"
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-primary-foreground transition-transform ${
                      marketing ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Save Preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default CookieConsentBanner;
```

### 3b. Modify `src/layouts/Shop.astro`

Add the CookieConsentBanner import and island. The full file should become:

```astro
---
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';
import ToastProvider from '@/components/react/ToastProvider';
import CookieConsentBanner from '@/components/react/CookieConsentBanner';

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
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
  <ToastProvider client:load />
  <CookieConsentBanner client:idle />
</Base>
```

**What changed:** Added `import CookieConsentBanner` and `<CookieConsentBanner client:idle />` after ToastProvider.

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/components/react/CookieConsentBanner.tsx src/layouts/Shop.astro
git commit -m "feat: add cookie consent banner with preferences (GDPR)"
```

---

## Task 4: CartDrawer Island + Wire into Shop.astro + Toast on Add

**Creates:** `src/components/react/CartDrawer.tsx`
**Modifies:** `src/layouts/Shop.astro`, `src/components/react/ProductCard.tsx`
**Dependencies:** Task 2 (ToastProvider wired), Task 1 (toast.ts)

### 4a. Create `src/components/react/CartDrawer.tsx`

```tsx
// src/components/react/CartDrawer.tsx
import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  $cartOpen,
  $cartItems,
  $cartTotal,
  $cartCount,
  $freeShippingProgress,
  closeCart,
  updateCartQuantity,
  removeFromCart,
} from '@/stores/cart';
import type { CartItem } from '@/stores/cart';
import type { PackSize } from '@/data/products';
import { tenant } from '@/config/tenant';

const packSizeLabels: Record<string, string> = {
  pack1: '1 can',
  pack3: '3 cans',
  pack5: '5 cans',
  pack10: '10 cans',
  pack30: '30 cans',
};

const CartItemRow = React.memo(function CartItemRow({ item }: { item: CartItem }) {
  const price = item.product.prices[item.packSize];

  const handleDecrement = useCallback(() => {
    updateCartQuantity(item.product.id, item.packSize, item.quantity - 1);
  }, [item.product.id, item.packSize, item.quantity]);

  const handleIncrement = useCallback(() => {
    updateCartQuantity(item.product.id, item.packSize, item.quantity + 1);
  }, [item.product.id, item.packSize, item.quantity]);

  const handleRemove = useCallback(() => {
    removeFromCart(item.product.id, item.packSize);
  }, [item.product.id, item.packSize]);

  return (
    <div className="flex gap-3 py-3 border-b border-border/50 last:border-0">
      {/* Image */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <svg viewBox="0 0 64 64" fill="none" className="h-8 w-8" aria-hidden="true">
              <ellipse cx="32" cy="32" rx="28" ry="10" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{item.product.name}</p>
        <p className="text-xs text-muted-foreground">{packSizeLabels[item.packSize] ?? item.packSize}</p>

        <div className="mt-auto flex items-center justify-between">
          {/* Qty controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDecrement}
              aria-label={`Decrease quantity of ${item.product.name}`}
              className="flex h-6 w-6 items-center justify-center rounded border border-border text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              aria-label={`Increase quantity of ${item.product.name}`}
              className="flex h-6 w-6 items-center justify-center rounded border border-border text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              +
            </button>
          </div>

          {/* Line total */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              &euro;{(price * item.quantity).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${item.product.name} from cart`}
              className="text-muted-foreground/60 hover:text-destructive transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

const CartDrawer = React.memo(function CartDrawer() {
  const open = useStore($cartOpen);
  const items = useStore($cartItems);
  const total = useStore($cartTotal);
  const count = useStore($cartCount);
  const shipping = useStore($freeShippingProgress);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!nextOpen) closeCart();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-[91] w-full max-w-md border-l border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 flex flex-col"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Dialog.Title className="text-lg font-bold text-foreground">
              Cart{count > 0 ? ` (${count})` : ''}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-center text-sm text-muted-foreground">Your cart is empty</p>
              <a
                href="/products"
                onClick={() => closeCart()}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <>
              {/* Free shipping bar */}
              <div className="border-b border-border px-6 py-3">
                {shipping.reached ? (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="font-medium">Free shipping unlocked!</span>
                  </div>
                ) : (
                  <div>
                    <p className="mb-1.5 text-xs text-muted-foreground">
                      Add &euro;{shipping.remaining.toFixed(2)} more for free shipping
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min(100, ((shipping.threshold - shipping.remaining) / shipping.threshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                {items.map((item) => (
                  <CartItemRow key={`${item.product.id}-${item.packSize}`} item={item} />
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-foreground">
                    &euro;{total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes calculated at checkout
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="/checkout"
                    onClick={() => closeCart()}
                    className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Checkout
                  </a>
                  <a
                    href="/cart"
                    onClick={() => closeCart()}
                    className="flex h-11 items-center justify-center rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    View Cart
                  </a>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export default CartDrawer;
```

### 4b. Modify `src/layouts/Shop.astro`

Add the CartDrawer import and island. The full file should become:

```astro
---
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';
import ToastProvider from '@/components/react/ToastProvider';
import CookieConsentBanner from '@/components/react/CookieConsentBanner';
import CartDrawer from '@/components/react/CartDrawer';

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
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
  <CartDrawer client:load />
  <ToastProvider client:load />
  <CookieConsentBanner client:idle />
</Base>
```

**What changed:** Added `import CartDrawer` and `<CartDrawer client:load />` before ToastProvider.

### 4c. Modify `src/components/react/ProductCard.tsx`

Add toast notification when adding to cart. Two changes:

**Change 1:** Add toast import at the top of the file, after the existing imports:

Find this line:
```typescript
import type { Product } from '@/data/products';
```

Add after it:
```typescript
import { toast } from '@/lib/toast';
```

**Change 2:** In the `handleAddToCart` callback, add `toast.success` after `openCart()`:

Find these two lines inside `handleAddToCart`:
```typescript
      addToCart(product, 'pack1');
      openCart();
```

Replace with:
```typescript
      addToCart(product, 'pack1');
      openCart();
      toast.success(`${name} added to cart`);
```

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/components/react/CartDrawer.tsx src/layouts/Shop.astro src/components/react/ProductCard.tsx
git commit -m "feat: add cart drawer with qty controls, free shipping bar, and toast on add"
```

---

## Task 5: MobileMenu Island + Wire into Shop.astro + Fix Header Nav

**Creates:** `src/components/react/MobileMenu.tsx`
**Modifies:** `src/layouts/Shop.astro`, `src/components/astro/Header.astro`, `src/components/astro/Footer.astro`
**Dependencies:** Task 1 (ui.ts with $mobileMenuOpen)

### 5a. Create `src/components/react/MobileMenu.tsx`

```tsx
// src/components/react/MobileMenu.tsx
import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import * as Dialog from '@radix-ui/react-dialog';
import { $mobileMenuOpen } from '@/stores/ui';

const strengthLinks = [
  { key: 'light', label: 'Light', href: '/products/strength/light' },
  { key: 'normal', label: 'Normal', href: '/products/strength/normal' },
  { key: 'strong', label: 'Strong', href: '/products/strength/strong' },
  { key: 'extra-strong', label: 'Extra Strong', href: '/products/strength/extra-strong' },
  { key: 'super-strong', label: 'Super Strong', href: '/products/strength/super-strong' },
];

const flavorLinks = [
  { key: 'mint', label: 'Mint', href: '/products/flavor/mint' },
  { key: 'citrus', label: 'Citrus', href: '/products/flavor/citrus' },
  { key: 'berry', label: 'Berry', href: '/products/flavor/berry' },
  { key: 'coffee', label: 'Coffee', href: '/products/flavor/coffee' },
  { key: 'tobacco', label: 'Tobacco', href: '/products/flavor/tobacco' },
  { key: 'exotic', label: 'Exotic', href: '/products/flavor/exotic' },
  { key: 'unflavored', label: 'Unflavored', href: '/products/flavor/unflavored' },
];

const mainLinks = [
  { href: '/products', label: 'Shop All' },
  { href: '/brands', label: 'Brands' },
  { href: '/community', label: 'Community' },
  { href: '/rewards', label: 'Rewards' },
  { href: '/blog', label: 'Blog' },
];

const MobileMenu = React.memo(function MobileMenu() {
  const open = useStore($mobileMenuOpen);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    $mobileMenuOpen.set(nextOpen);
  }, []);

  const handleLinkClick = useCallback(() => {
    $mobileMenuOpen.set(false);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 z-[91] w-full max-w-xs border-r border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left duration-300 flex flex-col overflow-y-auto"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <Dialog.Title className="text-lg font-bold text-primary">
              Menu
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          {/* Main nav */}
          <nav className="px-5 py-4" aria-label="Mobile navigation">
            <ul className="space-y-1">
              {mainLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={handleLinkClick}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* By Strength */}
          <div className="border-t border-border px-5 py-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              By Strength
            </h3>
            <ul className="space-y-0.5">
              {strengthLinks.map(({ key, label, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    onClick={handleLinkClick}
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* By Flavor */}
          <div className="border-t border-border px-5 py-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              By Flavour
            </h3>
            <ul className="space-y-0.5">
              {flavorLinks.map(({ key, label, href }) => (
                <li key={key}>
                  <a
                    href={href}
                    onClick={handleLinkClick}
                    className="flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="mt-auto border-t border-border px-5 py-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account
            </h3>
            <ul className="space-y-0.5">
              <li>
                <a
                  href="/login"
                  onClick={handleLinkClick}
                  className="flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Log In
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  onClick={handleLinkClick}
                  className="flex items-center rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Create Account
                </a>
              </li>
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

export default MobileMenu;
```

### 5b. Modify `src/layouts/Shop.astro`

Add MobileMenu import and island. The full file should become:

```astro
---
import Base from './Base.astro';
import Header from '@/components/astro/Header.astro';
import Footer from '@/components/astro/Footer.astro';
import AgeGate from '@/components/astro/AgeGate.astro';
import ToastProvider from '@/components/react/ToastProvider';
import CookieConsentBanner from '@/components/react/CookieConsentBanner';
import CartDrawer from '@/components/react/CartDrawer';
import MobileMenu from '@/components/react/MobileMenu';

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
  <div class="flex min-h-screen flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </div>
  <CartDrawer client:load />
  <MobileMenu client:load />
  <ToastProvider client:load />
  <CookieConsentBanner client:idle />
</Base>
```

### 5c. Modify `src/components/astro/Header.astro`

Two changes:

**Change 1:** Fix the nav link from `/nicotine-pouches` to `/products`.

Find:
```typescript
const navLinks = [
  { href: '/nicotine-pouches', label: 'Products' },
```

Replace with:
```typescript
const navLinks = [
  { href: '/products', label: 'Products' },
```

**Change 2:** Wire the hamburger button to open `$mobileMenuOpen`. Replace the entire `<button>` with `data-mobile-menu-toggle` with this:

Find this block:
```html
      <button
        class="md:hidden text-muted-foreground hover:text-foreground"
        aria-label="Open menu"
        data-mobile-menu-toggle
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
```

Replace with:
```html
      <button
        class="md:hidden text-muted-foreground hover:text-foreground"
        aria-label="Open menu"
        id="mobile-menu-toggle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
```

Then add this script block at the very end of the file (after `</header>`):

```html
<script>
  import { $mobileMenuOpen } from '@/stores/ui';

  document.addEventListener('astro:page-load', () => {
    const btn = document.getElementById('mobile-menu-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        $mobileMenuOpen.set(true);
      });
    }
  });
</script>
```

### 5d. Modify `src/components/astro/Footer.astro`

Fix the nav link from `/nicotine-pouches` to `/products`.

Find:
```typescript
    { href: '/nicotine-pouches', label: 'All Products' },
```

Replace with:
```typescript
    { href: '/products', label: 'All Products' },
```

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/components/react/MobileMenu.tsx src/layouts/Shop.astro src/components/astro/Header.astro src/components/astro/Footer.astro
git commit -m "feat: add mobile menu drawer, fix /nicotine-pouches nav links to /products"
```

---

## Task 6: FilterableProductGrid Island

**Creates:** `src/components/react/FilterableProductGrid.tsx`
**Modifies:** Nothing
**Dependencies:** Task 1 (search.ts)

### 6a. Create `src/components/react/FilterableProductGrid.tsx`

```tsx
// src/components/react/FilterableProductGrid.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import ProductCard from '@/components/react/ProductCard';
import {
  filterProducts,
  emptyFilters,
  type SearchableProduct,
  type FilterState,
  type SortOption,
} from '@/lib/search';

interface FilterableProductGridProps {
  /** JSON-serialized SearchableProduct[] — serialized for Astro/React boundary */
  products: string;
  /** Pre-applied filters (e.g. from category pages) */
  initialFilters?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'strength', label: 'Strength: Low to High' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'newest', label: 'Newest' },
];

const strengthOptions = [
  { key: 'light', label: 'Light' },
  { key: 'normal', label: 'Normal' },
  { key: 'strong', label: 'Strong' },
  { key: 'extra-strong', label: 'Extra Strong' },
  { key: 'super-strong', label: 'Super Strong' },
];

const flavorOptions = [
  { key: 'mint', label: 'Mint' },
  { key: 'citrus', label: 'Citrus' },
  { key: 'berry', label: 'Berry' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'tobacco', label: 'Tobacco' },
  { key: 'exotic', label: 'Exotic' },
  { key: 'unflavored', label: 'Unflavored' },
];

const formatOptions = [
  { key: 'slim', label: 'Slim' },
  { key: 'mini', label: 'Mini' },
  { key: 'original', label: 'Original' },
  { key: 'large', label: 'Large' },
];

function parseFiltersFromURL(): Partial<FilterState> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const filters: Partial<FilterState> = {};
  const brands = params.get('brand');
  if (brands) filters.brands = brands.split(',').filter(Boolean);
  const strengths = params.get('strength');
  if (strengths) filters.strengths = strengths.split(',').filter(Boolean);
  const flavors = params.get('flavor');
  if (flavors) filters.flavors = flavors.split(',').filter(Boolean);
  const formats = params.get('format');
  if (formats) filters.formats = formats.split(',').filter(Boolean);
  const sort = params.get('sort');
  if (sort) filters.sort = sort as SortOption;
  return filters;
}

function pushFiltersToURL(filters: FilterState) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams();
  if (filters.brands.length) params.set('brand', filters.brands.join(','));
  if (filters.strengths.length) params.set('strength', filters.strengths.join(','));
  if (filters.flavors.length) params.set('flavor', filters.flavors.join(','));
  if (filters.formats.length) params.set('format', filters.formats.join(','));
  if (filters.sort !== 'featured') params.set('sort', filters.sort);
  const search = params.toString();
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

function CheckboxItem({
  checked,
  onCheckedChange,
  label,
  id,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  id: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
      <Checkbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="flex h-4 w-4 items-center justify-center rounded border border-border bg-background transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary"
      >
        <Checkbox.Indicator>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5l2.5 2.5L8 3" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </label>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  idPrefix,
}: {
  title: string;
  options: { key: string; label: string }[];
  selected: string[];
  onToggle: (key: string) => void;
  idPrefix: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur">
        <Collapsible.Trigger asChild>
          <button type="button" className="flex w-full items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content className="mt-3 space-y-2">
          {options.map((opt) => (
            <CheckboxItem
              key={opt.key}
              id={`${idPrefix}-${opt.key}`}
              checked={selected.includes(opt.key)}
              onCheckedChange={() => onToggle(opt.key)}
              label={opt.label}
            />
          ))}
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}

const FilterableProductGrid = React.memo(function FilterableProductGrid({
  products: productsJson,
  initialFilters: initialFiltersJson,
}: FilterableProductGridProps) {
  const allProducts: SearchableProduct[] = useMemo(
    () => JSON.parse(productsJson),
    [productsJson],
  );

  // Compute unique brands from products
  const brandOptions = useMemo(() => {
    const brands = new Map<string, string>();
    for (const p of allProducts) {
      if (!brands.has(p.brand)) brands.set(p.brand, p.brand);
    }
    return Array.from(brands.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allProducts]);

  // Build initial filter state from initialFilters prop + URL params
  const initialState = useMemo((): FilterState => {
    const base = initialFiltersJson ? JSON.parse(initialFiltersJson) : {};
    const urlFilters = parseFiltersFromURL();
    return {
      ...emptyFilters,
      ...base,
      ...urlFilters,
    };
  }, [initialFiltersJson]);

  const [filters, setFilters] = useState<FilterState>(initialState);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Push filter changes to URL
  useEffect(() => {
    pushFiltersToURL(filters);
  }, [filters]);

  const filtered = useMemo(
    () => filterProducts(allProducts, filters),
    [allProducts, filters],
  );

  const toggleArrayFilter = useCallback(
    (field: 'brands' | 'strengths' | 'flavors' | 'formats', key: string) => {
      setFilters((prev) => {
        const arr = prev[field];
        const next = arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key];
        return { ...prev, [field]: next };
      });
    },
    [],
  );

  const handleSortChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, sort: value as SortOption }));
  }, []);

  const removeFilter = useCallback((field: 'brands' | 'strengths' | 'flavors' | 'formats', key: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].filter((k) => k !== key),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters(emptyFilters);
  }, []);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.strengths.length > 0 ||
    filters.flavors.length > 0 ||
    filters.formats.length > 0;

  const filterContent = (
    <div className="space-y-4">
      <FilterGroup
        title="Brand"
        options={brandOptions}
        selected={filters.brands}
        onToggle={(k) => toggleArrayFilter('brands', k)}
        idPrefix="brand"
      />
      <FilterGroup
        title="Strength"
        options={strengthOptions}
        selected={filters.strengths}
        onToggle={(k) => toggleArrayFilter('strengths', k)}
        idPrefix="strength"
      />
      <FilterGroup
        title="Flavour"
        options={flavorOptions}
        selected={filters.flavors}
        onToggle={(k) => toggleArrayFilter('flavors', k)}
        idPrefix="flavor"
      />
      <FilterGroup
        title="Format"
        options={formatOptions}
        selected={filters.formats}
        onToggle={(k) => toggleArrayFilter('formats', k)}
        idPrefix="format"
      />
    </div>
  );

  return (
    <div>
      {/* Top bar: count + sort + mobile filter toggle */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {allProducts.length} products
        </p>
        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground lg:hidden transition-colors hover:bg-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {filters.brands.length + filters.strengths.length + filters.flavors.length + filters.formats.length}
              </span>
            )}
          </button>

          {/* Sort dropdown */}
          <Select.Root value={filters.sort} onValueChange={handleSortChange}>
            <Select.Trigger
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 text-sm text-foreground backdrop-blur transition-colors hover:bg-secondary"
              aria-label="Sort products"
            >
              <Select.Value />
              <Select.Icon>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="z-[100] overflow-hidden rounded-xl border border-border bg-card shadow-xl backdrop-blur"
                position="popper"
                sideOffset={4}
              >
                <Select.Viewport className="p-1">
                  {sortOptions.map((opt) => (
                    <Select.Item
                      key={opt.value}
                      value={opt.value}
                      className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-secondary data-[highlighted]:bg-secondary"
                    >
                      <Select.ItemText>{opt.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {filters.brands.map((b) => (
            <button key={`chip-brand-${b}`} type="button" onClick={() => removeFilter('brands', b)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              {b}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          ))}
          {filters.strengths.map((s) => (
            <button key={`chip-str-${s}`} type="button" onClick={() => removeFilter('strengths', s)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              {strengthOptions.find((o) => o.key === s)?.label ?? s}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          ))}
          {filters.flavors.map((f) => (
            <button key={`chip-flav-${f}`} type="button" onClick={() => removeFilter('flavors', f)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              {flavorOptions.find((o) => o.key === f)?.label ?? f}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          ))}
          {filters.formats.map((f) => (
            <button key={`chip-fmt-${f}`} type="button" onClick={() => removeFilter('formats', f)} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              {formatOptions.find((o) => o.key === f)?.label ?? f}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          ))}
          <button type="button" onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
            Clear all
          </button>
        </div>
      )}

      {/* Main grid: desktop sidebar + products */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Filters</h2>
            {filterContent}
          </div>
        </aside>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              name={product.name}
              brand={product.brand}
              brandSlug={product.brandSlug}
              imageUrl={product.imageUrl}
              prices={product.prices}
              stock={product.stock}
              nicotineContent={product.nicotineContent}
              strengthKey={product.strengthKey}
              flavorKey={product.flavorKey}
              ratings={product.ratings}
              badgeKeys={product.badgeKeys}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-lg text-muted-foreground mb-4">No products match your filters</p>
              <button type="button" onClick={clearAll} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Dialog.Root open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed inset-x-0 bottom-0 z-[91] max-h-[85vh] rounded-t-2xl border-t border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 flex flex-col"
            aria-describedby={undefined}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <Dialog.Title className="text-lg font-bold text-foreground">Filters</Dialog.Title>
              <Dialog.Close asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close filters">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {filterContent}
            </div>
            <div className="border-t border-border px-6 py-4 flex gap-3">
              <button type="button" onClick={clearAll} className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                Clear All
              </button>
              <button type="button" onClick={() => setMobileFilterOpen(false)} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Show {filtered.length} Results
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
});

export default FilterableProductGrid;
```

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/components/react/FilterableProductGrid.tsx
git commit -m "feat: add FilterableProductGrid island with facets, sort, URL sync, and mobile sheet"
```

---

## Task 7: Category Pages (Strength + Flavor)

**Creates:** `src/pages/products/strength/[key].astro`, `src/pages/products/flavor/[key].astro`
**Modifies:** Nothing
**Dependencies:** Task 6 (FilterableProductGrid)

### 7a. Create `src/pages/products/strength/[key].astro`

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import FilterableProductGrid from '@/components/react/FilterableProductGrid';
import { getCollection } from 'astro:content';
import { tenant } from '@/config/tenant';

interface StrengthMeta {
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}

const strengthMeta: Record<string, StrengthMeta> = {
  light: {
    label: 'Light',
    title: `Light Nicotine Pouches | ${tenant.name}`,
    description: 'Shop light nicotine pouches (2-4 mg) — perfect for beginners or those who prefer a mild buzz. Free EU shipping on qualifying orders.',
    h1: 'Light Nicotine Pouches',
    intro: 'Mild and smooth pouches with 2-4 mg of nicotine per portion. Ideal for newcomers or anyone who prefers a gentle experience.',
  },
  normal: {
    label: 'Normal',
    title: `Normal Strength Nicotine Pouches | ${tenant.name}`,
    description: 'Browse normal strength nicotine pouches (4-8 mg) — the most popular choice for everyday use. Fast delivery across the EU.',
    h1: 'Normal Strength Nicotine Pouches',
    intro: 'The sweet spot for most users. Normal strength pouches deliver 4-8 mg of nicotine per portion for balanced, satisfying sessions.',
  },
  strong: {
    label: 'Strong',
    title: `Strong Nicotine Pouches | ${tenant.name}`,
    description: 'Discover strong nicotine pouches (8-12 mg) for experienced users who want a more intense kick. Shop 700+ products.',
    h1: 'Strong Nicotine Pouches',
    intro: 'A step up for experienced users. Strong pouches deliver 8-12 mg of nicotine per portion — noticeable yet controlled.',
  },
  'extra-strong': {
    label: 'Extra Strong',
    title: `Extra Strong Nicotine Pouches | ${tenant.name}`,
    description: 'Shop extra strong nicotine pouches (12-16 mg) — intense satisfaction for heavy users transitioning from tobacco. Free EU delivery.',
    h1: 'Extra Strong Nicotine Pouches',
    intro: 'Serious strength for seasoned users. Extra strong pouches pack 12-16 mg of nicotine per portion — powerful and long-lasting.',
  },
  'super-strong': {
    label: 'Super Strong',
    title: `Super Strong Nicotine Pouches | ${tenant.name}`,
    description: 'The most powerful nicotine pouches available (16+ mg). Ultra-high strength for experienced users only. Browse our full selection.',
    h1: 'Super Strong Nicotine Pouches',
    intro: 'Maximum intensity. Super strong pouches deliver 16+ mg per portion — strictly for experienced users who demand the highest potency.',
  },
};

export function getStaticPaths() {
  return Object.keys(strengthMeta).map((key) => ({
    params: { key },
  }));
}

const { key } = Astro.params;
const meta = strengthMeta[key!];

if (!meta) {
  return Astro.redirect('/products');
}

const allProducts = await getCollection('products');
const filtered = allProducts.filter((p) => p.data.strengthKey === key);

const serializedProducts = JSON.stringify(
  filtered.map((p) => ({
    slug: p.id,
    name: p.data.name,
    brand: p.data.brand,
    brandSlug: p.data.brandSlug,
    imageUrl: p.data.imageUrl,
    prices: p.data.prices,
    stock: p.data.stock ?? 0,
    nicotineContent: p.data.nicotineContent,
    strengthKey: p.data.strengthKey,
    flavorKey: p.data.flavorKey,
    ratings: p.data.ratings ?? 0,
    badgeKeys: p.data.badgeKeys ?? [],
    formatKey: p.data.formatKey ?? 'slim',
    description: p.data.description ?? '',
  })),
);

// JSON-LD ItemList
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: meta.h1,
  numberOfItems: filtered.length,
  itemListElement: filtered.slice(0, 50).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://${tenant.domain}/products/${p.id}`,
    name: p.data.name,
  })),
};
---

<Shop
  title={meta.title}
  description={meta.description}
  canonical={`/products/strength/${key}`}
>
  <Breadcrumb items={[
    { label: 'Products', href: '/products' },
    { label: meta.label },
  ]} />

  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {meta.h1}
      </h1>
      <p class="mt-2 text-lg text-muted-foreground max-w-2xl">
        {meta.intro}
      </p>
      <p class="mt-1 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
      </p>
    </div>

    <FilterableProductGrid
      client:load
      products={serializedProducts}
    />
  </div>

  <script type="application/ld+json" set:html={JSON.stringify(itemListSchema)} />
</Shop>
```

### 7b. Create `src/pages/products/flavor/[key].astro`

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import FilterableProductGrid from '@/components/react/FilterableProductGrid';
import { getCollection } from 'astro:content';
import { tenant } from '@/config/tenant';

interface FlavorMeta {
  label: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}

const flavorMeta: Record<string, FlavorMeta> = {
  mint: {
    label: 'Mint',
    title: `Mint Nicotine Pouches | ${tenant.name}`,
    description: 'Shop the best mint-flavoured nicotine pouches. Cool, refreshing, and smooth — the most popular flavour category. Free EU shipping.',
    h1: 'Mint Nicotine Pouches',
    intro: 'Cool and refreshing — mint is the world\'s most popular nicotine pouch flavour. From spearmint to peppermint to icy menthol, find your favourite.',
  },
  citrus: {
    label: 'Citrus',
    title: `Citrus Nicotine Pouches | ${tenant.name}`,
    description: 'Browse citrus-flavoured nicotine pouches — tangy lemon, orange, and grapefruit blends. Zesty freshness in every portion.',
    h1: 'Citrus Nicotine Pouches',
    intro: 'Bright and zesty. Citrus pouches burst with tangy lemon, orange, and grapefruit notes — a refreshing alternative to mint.',
  },
  berry: {
    label: 'Berry',
    title: `Berry Nicotine Pouches | ${tenant.name}`,
    description: 'Discover berry-flavoured nicotine pouches — sweet and fruity blends with blueberry, strawberry, and mixed berry. Shop 700+ products.',
    h1: 'Berry Nicotine Pouches',
    intro: 'Sweet, fruity, and satisfying. Berry pouches feature blueberry, strawberry, raspberry, and mixed berry flavour profiles.',
  },
  coffee: {
    label: 'Coffee',
    title: `Coffee Nicotine Pouches | ${tenant.name}`,
    description: 'Shop coffee-flavoured nicotine pouches — rich espresso and mocha blends for the caffeine lover. Free delivery on qualifying orders.',
    h1: 'Coffee Nicotine Pouches',
    intro: 'Rich and bold. Coffee-flavoured pouches deliver deep espresso and mocha notes — the perfect companion for your morning ritual.',
  },
  tobacco: {
    label: 'Tobacco',
    title: `Tobacco-Flavoured Nicotine Pouches | ${tenant.name}`,
    description: 'Browse tobacco-flavoured nicotine pouches — classic taste without the smoke. Familiar warmth in a tobacco-free format.',
    h1: 'Tobacco-Flavoured Nicotine Pouches',
    intro: 'Classic warmth without the leaf. Tobacco-flavoured pouches recreate familiar smoky, earthy notes in a clean, tobacco-free format.',
  },
  exotic: {
    label: 'Exotic',
    title: `Exotic Nicotine Pouches | ${tenant.name}`,
    description: 'Explore exotic-flavoured nicotine pouches — tropical fruits, spices, and unique blends you won\'t find anywhere else.',
    h1: 'Exotic Nicotine Pouches',
    intro: 'Something different. Exotic pouches feature tropical fruits, spices, and inventive blends — for the adventurous palate.',
  },
  unflavored: {
    label: 'Unflavored',
    title: `Unflavored Nicotine Pouches | ${tenant.name}`,
    description: 'Shop unflavored nicotine pouches — pure nicotine with no added taste. Minimal and clean for purists.',
    h1: 'Unflavored Nicotine Pouches',
    intro: 'Pure and simple. Unflavored pouches deliver nicotine without any added taste — the minimalist choice for purists.',
  },
};

export function getStaticPaths() {
  return Object.keys(flavorMeta).map((key) => ({
    params: { key },
  }));
}

const { key } = Astro.params;
const meta = flavorMeta[key!];

if (!meta) {
  return Astro.redirect('/products');
}

const allProducts = await getCollection('products');
const filtered = allProducts.filter((p) => p.data.flavorKey === key);

const serializedProducts = JSON.stringify(
  filtered.map((p) => ({
    slug: p.id,
    name: p.data.name,
    brand: p.data.brand,
    brandSlug: p.data.brandSlug,
    imageUrl: p.data.imageUrl,
    prices: p.data.prices,
    stock: p.data.stock ?? 0,
    nicotineContent: p.data.nicotineContent,
    strengthKey: p.data.strengthKey,
    flavorKey: p.data.flavorKey,
    ratings: p.data.ratings ?? 0,
    badgeKeys: p.data.badgeKeys ?? [],
    formatKey: p.data.formatKey ?? 'slim',
    description: p.data.description ?? '',
  })),
);

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: meta.h1,
  numberOfItems: filtered.length,
  itemListElement: filtered.slice(0, 50).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://${tenant.domain}/products/${p.id}`,
    name: p.data.name,
  })),
};
---

<Shop
  title={meta.title}
  description={meta.description}
  canonical={`/products/flavor/${key}`}
>
  <Breadcrumb items={[
    { label: 'Products', href: '/products' },
    { label: meta.label },
  ]} />

  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {meta.h1}
      </h1>
      <p class="mt-2 text-lg text-muted-foreground max-w-2xl">
        {meta.intro}
      </p>
      <p class="mt-1 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
      </p>
    </div>

    <FilterableProductGrid
      client:load
      products={serializedProducts}
    />
  </div>

  <script type="application/ld+json" set:html={JSON.stringify(itemListSchema)} />
</Shop>
```

### Verification

```bash
bun run build
# Should see strength/light, strength/normal, etc. and flavor/mint, etc. in output
```

### Commit

```bash
git add src/pages/products/strength/ src/pages/products/flavor/
git commit -m "feat: add 5 strength + 7 flavor category pages with SEO meta and JSON-LD"
```

---

## Task 8: Wire FilterableProductGrid into products/index.astro

**Creates:** Nothing
**Modifies:** `src/pages/products/index.astro`
**Dependencies:** Task 6 (FilterableProductGrid)

### 8a. Replace `src/pages/products/index.astro`

Replace the **entire file** with:

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import FilterableProductGrid from '@/components/react/FilterableProductGrid';
import { getCollection } from 'astro:content';
import { tenant } from '@/config/tenant';

const products = await getCollection('products');

const serializedProducts = JSON.stringify(
  products.map((p) => ({
    slug: p.id,
    name: p.data.name,
    brand: p.data.brand,
    brandSlug: p.data.brandSlug,
    imageUrl: p.data.imageUrl,
    prices: p.data.prices,
    stock: p.data.stock ?? 0,
    nicotineContent: p.data.nicotineContent,
    strengthKey: p.data.strengthKey,
    flavorKey: p.data.flavorKey,
    ratings: p.data.ratings ?? 0,
    badgeKeys: p.data.badgeKeys ?? [],
    formatKey: p.data.formatKey ?? 'slim',
    description: p.data.description ?? '',
  })),
);
---

<Shop
  title="Shop All Nicotine Pouches"
  description="Browse our full collection of 700+ premium nicotine pouches from 91 top brands. Filter by strength, flavour, brand and format. Free EU shipping on qualifying orders."
  canonical="/products"
>
  <Breadcrumb items={[{ label: 'Products' }]} />

  <div class="mx-auto max-w-7xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Shop All Nicotine Pouches
      </h1>
      <p class="mt-2 text-lg text-muted-foreground">
        Browse our collection of {products.length > 0 ? `${products.length}+` : '700+'} premium nicotine pouches
      </p>
    </div>

    <FilterableProductGrid
      client:load
      products={serializedProducts}
    />
  </div>
</Shop>
```

**What changed:** Removed the entire disabled filter sidebar, static sort dropdown, and manual product grid. Replaced with a single `<FilterableProductGrid client:load />` island that receives all products as a JSON string prop. The old `ProductCard` import, `strengthDots` map, and inline grid are all gone.

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/pages/products/index.astro
git commit -m "feat: replace static product grid with FilterableProductGrid island"
```

---

## Task 9: SearchIsland + Update search.astro

**Creates:** `src/components/react/SearchIsland.tsx`
**Modifies:** `src/pages/search.astro`
**Dependencies:** Task 1 (search.ts), Task 6 (has ProductCard)

### 9a. Create `src/components/react/SearchIsland.tsx`

```tsx
// src/components/react/SearchIsland.tsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ProductCard from '@/components/react/ProductCard';
import { scoreProduct, type SearchableProduct } from '@/lib/search';

interface SearchIslandProps {
  /** JSON-serialized SearchableProduct[] */
  products: string;
  initialQuery?: string;
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const SearchIsland = React.memo(function SearchIsland({
  products: productsJson,
  initialQuery = '',
}: SearchIslandProps) {
  const allProducts: SearchableProduct[] = useMemo(
    () => JSON.parse(productsJson),
    [productsJson],
  );

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    const search = params.toString();
    const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
    window.history.replaceState(null, '', url);
  }, [debouncedQuery]);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return allProducts
      .map((p) => ({ product: p, score: scoreProduct(p, debouncedQuery) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.product);
  }, [allProducts, debouncedQuery]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const showResults = debouncedQuery.trim().length > 0;

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-10">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          placeholder="Search pouches, brands, flavours..."
          autoComplete="off"
          className="w-full rounded-xl border border-border bg-card/60 px-5 py-3.5 pr-20 text-foreground backdrop-blur-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          )}
          <div className="flex h-8 w-8 items-center justify-center text-muted-foreground">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {showResults ? (
        results.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {results.map((product) => (
                <ProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand}
                  brandSlug={product.brandSlug}
                  imageUrl={product.imageUrl}
                  prices={product.prices}
                  stock={product.stock}
                  nicotineContent={product.nicotineContent}
                  strengthKey={product.strengthKey}
                  flavorKey={product.flavorKey}
                  ratings={product.ratings}
                  badgeKeys={product.badgeKeys}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-10 w-10 text-muted-foreground/50" aria-hidden="true">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No results for &ldquo;{debouncedQuery}&rdquo;</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
              Try a different search term, or browse by category:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <a href="/products/flavor/mint" className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary">Mint</a>
              <a href="/products/flavor/berry" className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary">Berry</a>
              <a href="/products/flavor/citrus" className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary">Citrus</a>
              <a href="/products/strength/strong" className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary">Strong</a>
              <a href="/products/strength/extra-strong" className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-foreground transition-colors hover:border-primary/30 hover:text-primary">Extra Strong</a>
            </div>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse All Products
            </a>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-10 w-10 text-muted-foreground/50" aria-hidden="true">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Search our catalogue</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Type a product name, brand, or flavour above to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
});

export default SearchIsland;
```

### 9b. Replace `src/pages/search.astro`

Replace the **entire file** with:

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import SearchIsland from '@/components/react/SearchIsland';
import { getCollection } from 'astro:content';
import { tenant } from '@/config/tenant';

const query = Astro.url.searchParams.get('q')?.trim() ?? '';

const products = await getCollection('products');
const serializedProducts = JSON.stringify(
  products.map((p) => ({
    slug: p.id,
    name: p.data.name,
    brand: p.data.brand,
    brandSlug: p.data.brandSlug,
    imageUrl: p.data.imageUrl,
    prices: p.data.prices,
    stock: p.data.stock ?? 0,
    nicotineContent: p.data.nicotineContent,
    strengthKey: p.data.strengthKey,
    flavorKey: p.data.flavorKey,
    ratings: p.data.ratings ?? 0,
    badgeKeys: p.data.badgeKeys ?? [],
    formatKey: p.data.formatKey ?? 'slim',
    description: p.data.description ?? '',
  })),
);
---

<Shop
  title={query ? `Search: ${query}` : 'Search'}
  description={`Search nicotine pouches, brands, and flavours on ${tenant.name}.`}
  noindex={true}
>
  <section class="bg-background text-foreground">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Search' }]} />
      <h1 class="text-4xl font-bold tracking-tight mb-8">Search</h1>

      <SearchIsland
        client:load
        products={serializedProducts}
        initialQuery={query}
      />
    </div>
  </section>
</Shop>
```

**What changed:** Removed the static `<form>` and placeholder result areas. Replaced with `<SearchIsland client:load />` that receives all products and the initial query from the URL.

### Verification

```bash
bun run build
```

### Commit

```bash
git add src/components/react/SearchIsland.tsx src/pages/search.astro
git commit -m "feat: add client-side search island with scoring, debounce, and category suggestions"
```

---

## Task 10: SEO Fixes

**Creates:** Nothing
**Modifies:** `src/pages/faq.astro`, `src/pages/index.astro`, `src/layouts/Base.astro`
**Deletes:** `vercel.json`
**Dependencies:** None (can run in parallel with Tasks 6-9)

### 10a. Modify `src/pages/faq.astro` — Add FAQPage JSON-LD

Add a JSON-LD `<script>` block just before the closing `</Shop>` tag (after the last `</div>` of the section).

Add this block immediately before `</Shop>`:

```html
  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are nicotine pouches?',
        acceptedAnswer: { '@type': 'Answer', text: 'Nicotine pouches are small, tobacco-free pouches that you place between your gum and upper lip. They deliver nicotine through the oral mucosa without smoke, vapour, or tobacco leaf. Each pouch lasts roughly 20-40 minutes depending on the brand and strength.' },
      },
      {
        '@type': 'Question',
        name: 'How do I choose the right strength?',
        acceptedAnswer: { '@type': 'Answer', text: 'Nicotine strengths typically range from 2 mg to 20 mg per pouch. If you are new to nicotine pouches, start with a low strength (2-6 mg) and work your way up. Experienced users often prefer 8-12 mg for regular use. Ultra-strong products (14 mg+) are best suited for heavy users transitioning from smoking or other tobacco products.' },
      },
      {
        '@type': 'Question',
        name: 'Are nicotine pouches safer than smoking?',
        acceptedAnswer: { '@type': 'Answer', text: 'Nicotine pouches do not involve combustion or tobacco leaf, which eliminates exposure to tar and many harmful chemicals found in cigarette smoke. While nicotine itself is addictive, public health agencies generally consider tobacco-free nicotine products a lower-risk alternative to smoking.' },
      },
      {
        '@type': 'Question',
        name: 'How many pouches come in a can?',
        acceptedAnswer: { '@type': 'Answer', text: 'Most cans contain 20 pouches, though some brands offer 15 or 24. The product page always lists the exact count. Multi-pack rolls (typically 10 cans) are available for popular products at a discounted per-can price.' },
      },
      {
        '@type': 'Question',
        name: 'Where do you ship?',
        acceptedAnswer: { '@type': 'Answer', text: 'We ship to most EU countries. Shipping availability and delivery times vary by destination. During checkout you will see the available shipping options and estimated delivery dates for your address.' },
      },
      {
        '@type': 'Question',
        name: 'How much does shipping cost?',
        acceptedAnswer: { '@type': 'Answer', text: 'Orders over \u20AC29 qualify for free standard shipping. Below that threshold, a flat-rate shipping fee applies and is shown at checkout before you pay.' },
      },
      {
        '@type': 'Question',
        name: 'How long does delivery take?',
        acceptedAnswer: { '@type': 'Answer', text: 'We dispatch orders the same or next business day. Standard delivery within the EU typically takes 2-5 business days. You will receive a tracking link by email once your order is shipped.' },
      },
      {
        '@type': 'Question',
        name: 'Can I track my order?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. Once your order ships, we send a tracking link to the email address you used at checkout. You can also view order status by logging into your account.' },
      },
      {
        '@type': 'Question',
        name: 'What payment methods do you accept?',
        acceptedAnswer: { '@type': 'Answer', text: 'We accept major credit and debit cards (Visa, Mastercard), as well as popular EU payment methods available through our payment provider. All transactions are processed securely via encrypted checkout.' },
      },
      {
        '@type': 'Question',
        name: 'What is your return policy?',
        acceptedAnswer: { '@type': 'Answer', text: 'Due to the nature of nicotine products, we cannot accept returns on opened items. If you receive a damaged or incorrect product, contact us within 14 days of delivery and we will arrange a replacement or refund.' },
      },
      {
        '@type': 'Question',
        name: 'Why do you verify my age?',
        acceptedAnswer: { '@type': 'Answer', text: 'Nicotine products are intended for adults only. EU regulations require us to verify that all customers meet the minimum legal age in their country of residence before completing a purchase.' },
      },
      {
        '@type': 'Question',
        name: 'What is the minimum age to purchase?',
        acceptedAnswer: { '@type': 'Answer', text: 'The minimum age is 18 in most EU countries. Some countries may set a higher threshold. You must confirm that you meet the legal age requirement in your country when placing an order.' },
      },
      {
        '@type': 'Question',
        name: 'Do I need an account to order?',
        acceptedAnswer: { '@type': 'Answer', text: 'No \u2014 you can check out as a guest. However, creating a free account lets you track orders, earn loyalty points, leave reviews, and access members-only deals.' },
      },
    ],
  })} />
```

### 10b. Modify `src/pages/index.astro` — Add Organization JSON-LD

Add this block immediately before `</Shop>`:

```html
  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SnusFriend',
    url: 'https://snusfriends.com',
    logo: 'https://snusfriends.com/images/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@snusfriends.com',
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
    sameAs: [],
  })} />
```

### 10c. Modify `src/layouts/Base.astro` — Add font preconnect/preload

Add these three lines inside `<head>`, after the `<meta name="theme-color" ...>` line and before the `<SEO>` component:

```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
```

So the `<head>` block should contain (in order):
```html
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="generator" content={Astro.generator} />
  <link rel="icon" type="image/png" href={tenant.assets.favicon} />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
  <meta name="theme-color" content="#121620" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />

  <SEO ... />
```

### 10d. Delete `vercel.json`

```bash
rm /Users/Daniel/Projects/snus-friend-shop/vercel.json
```

This file contains a legacy SPA rewrite (`/(.*) -> /index.html`) that is incompatible with Astro's static output. The Astro Vercel adapter handles routing automatically.

### 10e. Verify Header nav fix

If Task 5 has not yet been executed, the Header.astro nav link `/nicotine-pouches` still needs to be changed to `/products`. Check and apply the fix from Task 5c if needed.

### Verification

```bash
bun run build
# Verify vercel.json is gone:
ls vercel.json 2>/dev/null || echo "vercel.json deleted - OK"
```

### Commit

```bash
git add src/pages/faq.astro src/pages/index.astro src/layouts/Base.astro
git rm vercel.json
git commit -m "feat: add FAQPage + Organization JSON-LD, font preload, remove legacy vercel.json"
```

---

## Task 11: Build Verification + Final Commit

**Creates:** Nothing
**Modifies:** Nothing (unless build errors require fixes)
**Dependencies:** All previous tasks (1-10)

### 11a. Full Build

```bash
cd /Users/Daniel/Projects/snus-friend-shop
bun run build
```

### 11b. Count Static Pages

After build, count the generated pages:

```bash
find dist -name '*.html' | wc -l
```

**Expected:** At least 30 pages:
- Base pages: index, products, search, faq, about, contact, brands, rewards, community, login, register, shipping, returns, terms, privacy, cookies, whats-new, cart, checkout, etc.
- 5 strength category pages: light, normal, strong, extra-strong, super-strong
- 7 flavor category pages: mint, citrus, berry, coffee, tobacco, exotic, unflavored
- Individual product pages (if they exist)

### 11c. Dev Server Smoke Test

```bash
bun run dev
```

Manually verify in browser at `http://localhost:8080`:

1. **Homepage** (`/`) — loads, hero displays, Organization JSON-LD in source
2. **Products** (`/products`) — FilterableProductGrid loads, filters work, sort works, URL updates
3. **Category page** (`/products/strength/strong`) — filtered products display, breadcrumb shows "Home / Products / Strong"
4. **Flavor page** (`/products/flavor/mint`) — filtered products display, JSON-LD in source
5. **Search** (`/search`) — type "VELO", results appear after debounce, URL updates to `?q=VELO`
6. **Cart drawer** — click "Add to Cart" on any product, drawer slides in from right, toast appears, qty controls work, free shipping bar shows
7. **Mobile menu** — resize to mobile width, tap hamburger, menu slides in from left, links navigate correctly
8. **Cookie consent** — clear localStorage `cookie-consent` key, refresh, banner appears at bottom, "Accept All" dismisses it, "Manage Preferences" shows toggles
9. **FAQ** (`/faq`) — page loads, FAQPage JSON-LD in page source
10. **Font preload** — check `<head>` for preconnect and preload tags
11. **No /nicotine-pouches links** — header nav says "Products" linking to `/products`, footer "All Products" links to `/products`

### 11d. Lint Check

```bash
bun run lint
```

Fix any lint errors.

### 11e. Final Commit

Only if there were any remaining fixes from the smoke test:

```bash
git add -A
git commit -m "fix: address build/lint issues from phase 4 smoke test"
```

---

## File Summary

### New Files (8)

| File | Task |
|------|------|
| `src/stores/ui.ts` | 1 |
| `src/lib/toast.ts` | 1 |
| `src/lib/search.ts` | 1 |
| `src/components/react/ToastProvider.tsx` | 2 |
| `src/components/react/CookieConsentBanner.tsx` | 3 |
| `src/components/react/CartDrawer.tsx` | 4 |
| `src/components/react/MobileMenu.tsx` | 5 |
| `src/components/react/FilterableProductGrid.tsx` | 6 |
| `src/components/react/SearchIsland.tsx` | 9 |
| `src/pages/products/strength/[key].astro` | 7 |
| `src/pages/products/flavor/[key].astro` | 7 |

### Modified Files (8)

| File | Tasks |
|------|-------|
| `src/layouts/Shop.astro` | 2, 3, 4, 5 |
| `src/components/react/ProductCard.tsx` | 4 |
| `src/components/astro/Header.astro` | 5 |
| `src/components/astro/Footer.astro` | 5 |
| `src/pages/products/index.astro` | 8 |
| `src/pages/search.astro` | 9 |
| `src/pages/faq.astro` | 10 |
| `src/pages/index.astro` | 10 |
| `src/layouts/Base.astro` | 10 |

### Deleted Files (1)

| File | Task |
|------|------|
| `vercel.json` | 10 |

---

## Dependency Graph

```
Task 1 (foundation)
  |
  +-- Task 2 (toast provider)
  |     |
  |     +-- Task 3 (cookie consent)
  |     |     |
  |     |     +-- Task 4 (cart drawer + toast on add)
  |     |
  |     +-- Task 5 (mobile menu + nav fix)
  |
  +-- Task 6 (filterable product grid)
  |     |
  |     +-- Task 7 (category pages)
  |     +-- Task 8 (products/index.astro)
  |
  +-- Task 9 (search island)

Task 10 (SEO fixes) — independent, can run in parallel

Task 11 (build verification) — depends on all
```
