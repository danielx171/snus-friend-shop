# Phase 4: SEO Launch Readiness — Design Spec

> **Date:** 2026-03-26
> **Status:** Ready for implementation
> **Depends on:** `2026-03-26-astro-migration-design.md` (Phases 1-3 complete)
> **Branch:** `feat/astro-migration` (continue existing branch)
> **Goal:** Make the catalog fully browsable, crawlable, and rankable by Google. Checkout remains in preview mode.

---

## Table of Contents

1. [Programmatic Category Pages](#1-programmatic-category-pages)
2. [Product Filtering & Sorting Island](#2-product-filtering--sorting-island)
3. [Search Island](#3-search-island)
4. [Cart Drawer](#4-cart-drawer)
5. [Mobile Navigation](#5-mobile-navigation)
6. [Cookie Consent Banner](#6-cookie-consent-banner)
7. [Toast Notifications](#7-toast-notifications)
8. [SEO Fixes](#8-seo-fixes)
9. [Architecture Notes](#9-architecture-notes)
10. [File Structure](#10-file-structure)
11. [Success Criteria](#11-success-criteria)

---

## Current State (after Phase 3)

- **22 Astro pages:** 18 SSG + 2 SSR + 2 dynamic `[slug]`
- **5 React islands:** `ProductCard`, `CartIsland`, `HeaderCartButton`, `AddToCartButton`, `WishlistIsland`
- **7 nanostores:** cart, theme, auth, wishlist, easter, cookie-consent, language
- **Content Layer:** products + brands loaded from Supabase at build time via `src/content.config.ts`
- **Layouts:** `Base.astro` (HTML shell + SEO + View Transitions) and `Shop.astro` (Header + Footer + AgeGate)
- **Products page:** `/products/index.astro` with static filter placeholders (disabled checkboxes, disabled sort dropdown)
- **Search page:** `/search.astro` with form submission to `?q=` but no client-side results — shows "No results" always
- **Cart:** `$cartOpen` atom exists in `src/stores/cart.ts` but no drawer component reads it
- **Header:** Hamburger button exists (`data-mobile-menu-toggle`) but no mobile menu component
- **Cookie consent:** Store and helpers exist in `src/stores/cookie-consent.ts` but no banner component
- **Sonner:** Already in `package.json` (`sonner@^1.7.4`) but not wired up

This phase replaces all placeholders with working implementations.

---

## 1. Programmatic Category Pages

### Purpose

Generate static HTML pages for every strength level and flavor category so Google can index long-tail keywords like "strong nicotine pouches" and "mint nicotine pouches". Each page targets a distinct search intent.

### Pages to Create

#### Strength Categories — `src/pages/products/strength/[key].astro`

| URL Path | `key` | H1 | Meta Title | Meta Description |
|----------|-------|-----|-----------|-----------------|
| `/products/strength/light` | `light` | Light Nicotine Pouches | Light Nicotine Pouches (1-4mg) \| SnusFriend | Shop light nicotine pouches (1-4mg) for beginners. Gentle satisfaction from top brands. Free EU delivery on qualifying orders. |
| `/products/strength/normal` | `normal` | Normal Strength Nicotine Pouches | Normal Strength Nicotine Pouches (4-6mg) \| SnusFriend | Browse normal strength nicotine pouches (4-6mg). The most popular strength for everyday use. Fast EU shipping. |
| `/products/strength/strong` | `strong` | Strong Nicotine Pouches | Strong Nicotine Pouches (6-12mg) \| SnusFriend | Shop strong nicotine pouches (6-12mg) from top brands. Satisfying kick with fast EU delivery. |
| `/products/strength/extra-strong` | `extra-strong` | Extra Strong Nicotine Pouches | Extra Strong Nicotine Pouches (12-20mg) \| SnusFriend | Shop extra strong nicotine pouches (12-20mg) for experienced users. Premium brands, fast EU delivery. |
| `/products/strength/super-strong` | `super-strong` | Super Strong Nicotine Pouches | Super Strong Nicotine Pouches (20mg+) \| SnusFriend | Shop super strong nicotine pouches (20mg+). Maximum strength from brands like Siberia and PABLO. Free EU shipping. |

#### Flavor Categories — `src/pages/products/flavor/[key].astro`

| URL Path | `key` | H1 | Meta Title | Meta Description |
|----------|-------|-----|-----------|-----------------|
| `/products/flavor/mint` | `mint` | Mint Nicotine Pouches | Mint Nicotine Pouches \| SnusFriend | Shop mint nicotine pouches from VELO, ZYN, LOOP and more. Cool, refreshing flavour. Free EU delivery on qualifying orders. |
| `/products/flavor/citrus` | `citrus` | Citrus Nicotine Pouches | Citrus Nicotine Pouches \| SnusFriend | Browse citrus-flavoured nicotine pouches. Zesty lemon, lime and orange from top brands. Fast EU shipping. |
| `/products/flavor/berry` | `berry` | Berry Nicotine Pouches | Berry Nicotine Pouches \| SnusFriend | Shop berry nicotine pouches. Strawberry, blueberry, mixed berry flavours from premium brands. Free EU delivery. |
| `/products/flavor/coffee` | `coffee` | Coffee Nicotine Pouches | Coffee Nicotine Pouches \| SnusFriend | Browse coffee-flavoured nicotine pouches. Rich espresso and mocha from top brands. Fast EU shipping. |
| `/products/flavor/tobacco` | `tobacco` | Tobacco Flavour Nicotine Pouches | Tobacco Flavour Nicotine Pouches \| SnusFriend | Shop tobacco-flavoured nicotine pouches. Classic taste without the tobacco leaf. Free EU delivery. |
| `/products/flavor/exotic` | `exotic` | Exotic Flavour Nicotine Pouches | Exotic Nicotine Pouches \| SnusFriend | Browse exotic nicotine pouches. Tropical, cola, vanilla and unique flavours from premium brands. Fast EU shipping. |
| `/products/flavor/unflavored` | `unflavored` | Unflavoured Nicotine Pouches | Unflavoured Nicotine Pouches \| SnusFriend | Shop unflavoured nicotine pouches. Pure nicotine experience without added flavour. Free EU delivery. |

### Implementation — `src/pages/products/strength/[key].astro`

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import FilterableProductGrid from '@/components/react/FilterableProductGrid';
import { getCollection } from 'astro:content';

const STRENGTH_META: Record<string, { h1: string; title: string; description: string; mgRange: string }> = {
  light:         { h1: 'Light Nicotine Pouches',          title: 'Light Nicotine Pouches (1-4mg) | SnusFriend',          description: 'Shop light nicotine pouches (1-4mg) for beginners. Gentle satisfaction from top brands. Free EU delivery on qualifying orders.', mgRange: '1-4mg' },
  normal:        { h1: 'Normal Strength Nicotine Pouches', title: 'Normal Strength Nicotine Pouches (4-6mg) | SnusFriend', description: 'Browse normal strength nicotine pouches (4-6mg). The most popular strength for everyday use. Fast EU shipping.', mgRange: '4-6mg' },
  strong:        { h1: 'Strong Nicotine Pouches',          title: 'Strong Nicotine Pouches (6-12mg) | SnusFriend',         description: 'Shop strong nicotine pouches (6-12mg) from top brands. Satisfying kick with fast EU delivery.', mgRange: '6-12mg' },
  'extra-strong': { h1: 'Extra Strong Nicotine Pouches',   title: 'Extra Strong Nicotine Pouches (12-20mg) | SnusFriend',  description: 'Shop extra strong nicotine pouches (12-20mg) for experienced users. Premium brands, fast EU delivery.', mgRange: '12-20mg' },
  'super-strong': { h1: 'Super Strong Nicotine Pouches',   title: 'Super Strong Nicotine Pouches (20mg+) | SnusFriend',    description: 'Shop super strong nicotine pouches (20mg+). Maximum strength from brands like Siberia and PABLO. Free EU shipping.', mgRange: '20mg+' },
};

export async function getStaticPaths() {
  return Object.keys(STRENGTH_META).map((key) => ({ params: { key } }));
}

const { key } = Astro.params;
const meta = STRENGTH_META[key]!;

const allProducts = await getCollection('products');
const products = allProducts.filter((p) => p.data.strengthKey === key);

// Serialize for the React island
const serializedProducts = JSON.stringify(products.map((p) => ({
  id: p.id,
  ...p.data,
})));

// JSON-LD ItemList
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: meta.h1,
  numberOfItems: products.length,
  itemListElement: products.slice(0, 50).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://snusfriends.com/products/${p.id}`,
    name: p.data.name,
  })),
};
---

<Shop title={meta.title} description={meta.description} canonical={`/products/strength/${key}`}>
  <script type="application/ld+json" set:html={JSON.stringify(itemListSchema)} />

  <div class="mx-auto max-w-7xl px-4 py-8">
    <Breadcrumb items={[
      { label: 'Products', href: '/products' },
      { label: meta.h1 },
    ]} />

    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {meta.h1}
      </h1>
      <p class="mt-2 text-lg text-muted-foreground">
        {products.length} pouches in the {meta.mgRange} nicotine range
      </p>
    </div>

    <!-- Related categories -->
    <nav class="mb-8 flex flex-wrap gap-2" aria-label="Strength categories">
      {Object.entries(STRENGTH_META).map(([k, v]) => (
        <a
          href={`/products/strength/${k}`}
          class:list={[
            'rounded-full border px-4 py-1.5 text-sm font-medium transition',
            k === key
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground',
          ]}
        >
          {v.h1.replace(' Nicotine Pouches', '')}
        </a>
      ))}
    </nav>

    <FilterableProductGrid
      client:visible
      productsJson={serializedProducts}
      initialFilters={{ strength: [key] }}
    />
  </div>
</Shop>
```

The **flavor** variant (`src/pages/products/flavor/[key].astro`) follows the same pattern but filters on `p.data.flavorKey` and uses `FLAVOR_META` instead. The "exotic" key maps to multiple flavorKeys: `['tropical', 'cola', 'vanilla']`. The "unflavored" key maps to `['original', 'unflavored']`.

### Flavor-to-flavorKey Mapping

The content layer uses fine-grained flavorKeys from the database (`mint`, `citrus`, `berry`, `coffee`, `cola`, `tropical`, `vanilla`, `original`, `ice`, `menthol`, `wintergreen`, `fruit`). Category pages group them into broader SEO-friendly buckets:

```typescript
const FLAVOR_GROUP_MAP: Record<string, string[]> = {
  mint:       ['mint', 'menthol', 'wintergreen', 'ice'],
  citrus:     ['citrus'],
  berry:      ['berry', 'fruit'],
  coffee:     ['coffee'],
  tobacco:    ['tobacco', 'original'],
  exotic:     ['tropical', 'cola', 'vanilla'],
  unflavored: ['unflavored'],
};
```

The filter on flavor pages uses: `products.filter((p) => groupKeys.includes(p.data.flavorKey))`.

### Internal Linking

Each category page includes:
1. **Sibling category links** — pill-style nav bar linking to all other categories of the same type (shown in the code example above)
2. **Cross-type links** — at the bottom of strength pages, link to popular flavor pages and vice versa, e.g. "Browse by Flavor: Mint | Berry | Citrus"
3. **Product cards** link to individual product pages via `href="/products/{slug}"`
4. **Breadcrumbs** link back to `/products`

---

## 2. Product Filtering & Sorting Island

### File: `src/components/react/FilterableProductGrid.tsx`

### Props Interface

```typescript
interface FilterableProductGridProps {
  /** JSON-serialized array of products (parsed on mount) */
  productsJson: string;
  /** Pre-applied filters from category pages, e.g. { strength: ['strong'] } */
  initialFilters?: Partial<FilterState>;
}

interface FilterState {
  brand: string[];       // Multi-select: ['velo', 'zyn']
  strength: string[];    // Multi-select: ['strong', 'extra-strong']
  flavor: string[];      // Multi-select: ['mint', 'berry']
  format: string[];      // Multi-select: ['slim', 'mini']
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'strength' | 'name-az' | 'newest';
```

### Behavior

1. **Parse products** from `productsJson` on mount (single `JSON.parse`)
2. **Derive available filter options** from the product list (only show brands/strengths/flavors/formats that exist in the current dataset)
3. **Apply `initialFilters`** on mount — category pages pre-set one filter dimension
4. **Client-side filtering** — filter products using AND across dimensions, OR within a dimension:
   - If `brand: ['velo', 'zyn']` AND `strength: ['strong']` → products that are (VELO OR ZYN) AND strong
5. **Client-side sorting** — apply sort after filtering:
   - `featured`: default order from the content layer (preserves Supabase query order)
   - `price-asc` / `price-desc`: sort by `prices.pack1`
   - `strength`: sort by strength level (light=1 → super-strong=5)
   - `name-az`: alphabetical by `name`
   - `newest`: reverse of default (newest products first, assuming Supabase orders by creation)
6. **Active filter chips** — show selected filters as removable chips above the grid
7. **Product count** — "Showing X of Y products" updates reactively
8. **URL sync** — push filter + sort state to query params: `?brand=velo,zyn&strength=strong&sort=price-asc`
   - On mount, read from URL params and merge with `initialFilters`
   - On filter change, update URL via `window.history.replaceState()` (no navigation)
   - This enables shareable filtered URLs and back-button support
9. **Debounce** — 150ms debounce on filter changes before re-rendering the grid (prevents jank when clicking rapidly)

### Layout

**Desktop (lg+):**
```
┌─────────────────────────────────────────────────┐
│  Active filters: [VELO ×] [Strong ×]  Clear all │
│  Showing 42 of 712 products     Sort: [dropdown] │
├──────────┬──────────────────────────────────────┤
│ Filters  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│          │  │Card 1│ │Card 2│ │Card 3│ │Card 4││
│ ▼ Brand  │  └──────┘ └──────┘ └──────┘ └──────┘│
│ □ VELO   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ □ ZYN    │  │Card 5│ │Card 6│ │Card 7│ │Card 8││
│ □ LOOP   │  └──────┘ └──────┘ └──────┘ └──────┘│
│ ...      │                                      │
│          │                                      │
│ ▼ Strength│                                     │
│ □ Light  │                                      │
│ ■ Strong │                                      │
│ ...      │                                      │
│          │                                      │
│ ▼ Flavor │                                      │
│ □ Mint   │                                      │
│ ...      │                                      │
│          │                                      │
│ ▼ Format │                                      │
│ □ Slim   │                                      │
│ ...      │                                      │
├──────────┴──────────────────────────────────────┤
```

**Mobile (<lg):**
```
┌─────────────────────────┐
│ [Filter ▼]  Sort: [▼]  │
│ Showing 42 of 712       │
├─────────────────────────┤
│ ┌──────┐ ┌──────┐      │
│ │Card 1│ │Card 2│      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │Card 3│ │Card 4│      │
│ └──────┘ └──────┘      │
└─────────────────────────┘

Filter button opens a Sheet (slide-up panel)
with the same filter groups as the sidebar.
```

### Filter Sidebar Component (internal)

Each filter group is a `<Collapsible>` (from Radix `@radix-ui/react-collapsible`, already installed):

```typescript
function FilterGroup({ title, options, selected, onToggle }: {
  title: string;
  options: Array<{ key: string; label: string; count: number }>;
  selected: string[];
  onToggle: (key: string) => void;
}) {
  // Collapsible with checkbox list
  // Shows count of products matching each option
  // Highlights selected options
}
```

### Integration with Astro Pages

Used on:
- `/products/index.astro` — no `initialFilters`, all products
- `/products/strength/[key].astro` — `initialFilters={{ strength: [key] }}`
- `/products/flavor/[key].astro` — `initialFilters={{ flavor: [key] }}`

The island receives products as inline JSON and renders `ProductCard` for each filtered result. It imports `ProductCard` directly (both are React, no island boundary needed between them).

### Product Card Reuse

`FilterableProductGrid` renders `<ProductCard>` for each result, passing the same props that `/products/index.astro` currently passes. The grid CSS class matches the current layout: `grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6`.

---

## 3. Search Island

### File: `src/components/react/SearchIsland.tsx`

### Props Interface

```typescript
interface SearchIslandProps {
  /** JSON-serialized array of all products */
  productsJson: string;
  /** Initial query from URL ?q= parameter */
  initialQuery?: string;
}
```

### Search Scoring Algorithm

Port from legacy `SearchResults.tsx` with improvements. Create `src/lib/search.ts` for reusability:

```typescript
// src/lib/search.ts

export interface SearchableProduct {
  id: string;
  name: string;
  brand: string;
  flavorKey: string;
  strengthKey: string;
  description: string;
  // ... other fields from content layer
}

export interface ScoredResult {
  product: SearchableProduct;
  score: number;
}

/**
 * Normalize text for matching: lowercase, remove accents, trim.
 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Score a product against a search query.
 * Returns 0 for no match, higher values for better matches.
 */
export function scoreProduct(product: SearchableProduct, query: string): number {
  const q = normalize(query);
  if (!q) return 0;

  const name = normalize(product.name);
  const brand = normalize(product.brand);
  const flavor = normalize(product.flavorKey);
  const desc = normalize(product.description);

  let score = 0;

  // Exact name match (highest)
  if (name === q) score += 100;
  // Name starts with query
  else if (name.startsWith(q)) score += 80;
  // Name contains query as substring
  else if (name.includes(q)) score += 60;

  // Brand exact match
  if (brand === q) score += 70;
  // Brand starts with query
  else if (brand.startsWith(q)) score += 50;
  // Brand contains query
  else if (brand.includes(q)) score += 30;

  // Flavor match
  if (flavor.includes(q)) score += 25;

  // Description partial match
  if (desc.includes(q)) score += 10;

  // Word-level matching: split query into words, score each
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allFields = `${name} ${brand} ${flavor} ${desc}`;
    const matchedWords = words.filter((w) => allFields.includes(w));
    score += matchedWords.length * 15;
  }

  return score;
}

/**
 * Search products and return scored, sorted results.
 */
export function searchProducts(
  products: SearchableProduct[],
  query: string,
  limit = 50,
): ScoredResult[] {
  if (!query.trim()) return [];

  return products
    .map((product) => ({ product, score: scoreProduct(product, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

### Behavior

1. **Parse products** from `productsJson` on mount
2. **Read initial query** from `initialQuery` prop (set from `Astro.url.searchParams.get('q')`)
3. **Debounced search** — 300ms debounce after typing before running `searchProducts()`
4. **Display results** in a `ProductCard` grid (same layout as products page)
5. **Result count** — "X results for 'query'"
6. **No results state** — shows suggestions: "Try searching for a brand name like VELO or ZYN, or a flavour like mint or berry." with a "Browse All Products" link
7. **Empty state** (no query) — shows search prompt text, same as current
8. **URL sync** — `window.history.replaceState()` updates `?q=` on input change (debounced)
9. **Form submission** — pressing Enter submits the `<form>` which triggers a full page load with `?q=` — this is the SSG fallback for users without JS

### Astro Page Update — `src/pages/search.astro`

```astro
---
import Shop from '@/layouts/Shop.astro';
import Breadcrumb from '@/components/astro/Breadcrumb.astro';
import SearchIsland from '@/components/react/SearchIsland';
import { getCollection } from 'astro:content';
import { tenant } from '@/config/tenant';

const query = Astro.url.searchParams.get('q')?.trim() ?? '';
const allProducts = await getCollection('products');

const serializedProducts = JSON.stringify(allProducts.map((p) => ({
  id: p.id,
  ...p.data,
})));
---

<Shop
  title={query ? `Search: ${query} | ${tenant.name}` : `Search | ${tenant.name}`}
  description={`Search nicotine pouches, brands, and flavours on ${tenant.name}.`}
  noindex={true}
>
  <section class="bg-background text-foreground">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Search' }]} />
      <h1 class="text-4xl font-bold tracking-tight mb-8">Search</h1>

      <SearchIsland
        client:load
        productsJson={serializedProducts}
        initialQuery={query}
      />
    </div>
  </section>
</Shop>
```

The `SearchIsland` renders its own `<input>` (replacing the current Astro `<form>`) plus the results grid. It wraps the input in a `<form action="/search" method="get">` so the non-JS fallback still works.

---

## 4. Cart Drawer

### File: `src/components/react/CartDrawer.tsx`

### State

Reads from existing nanostores — no new stores needed:

- `$cartOpen` — boolean atom (already in `src/stores/cart.ts`)
- `$cartItems` — persistent atom with cart contents
- `$cartTotal` — computed total
- `$cartCount` — computed item count
- `$freeShippingProgress` — computed shipping progress

### Behavior

1. **Opens** when `$cartOpen` becomes `true` — triggered by:
   - `addToCart()` → calls `openCart()` (already in ProductCard)
   - `HeaderCartButton` click → calls `openCart()`
2. **Closes** on:
   - Clicking the X button → calls `closeCart()`
   - Pressing Escape → calls `closeCart()`
   - Clicking the backdrop overlay → calls `closeCart()`
3. **Slides in from the right** — uses Radix Dialog (`@radix-ui/react-dialog`, already installed) with custom positioning:
   - Overlay: `fixed inset-0 bg-background/80 backdrop-blur-sm`
   - Content: `fixed inset-y-0 right-0 w-full max-w-md border-l border-border bg-background shadow-xl`
4. **Renders cart items** — each item shows:
   - Product image (thumbnail)
   - Product name (linked to PDP)
   - Pack size label
   - Quantity controls (- / count / +) using `updateCartQuantity()`
   - Line total (price x quantity)
   - Remove button using `removeFromCart()`
5. **Free shipping progress bar** — below items:
   - If not reached: "Add EUR X.XX more for free shipping" with progress bar
   - If reached: "You've unlocked free shipping!" with full green bar
6. **Subtotal** — displayed below progress bar
7. **Action buttons:**
   - "View Cart" → navigates to `/cart`
   - "Checkout" → navigates to `/checkout` (preview mode message shown there)
8. **Empty state** — "Your cart is empty" with "Continue Shopping" link to `/products`
9. **Transition:persist** — the drawer is placed in `Shop.astro` layout so it persists across View Transitions

### Implementation Notes

Use `@radix-ui/react-dialog` in controlled mode:

```typescript
import * as Dialog from '@radix-ui/react-dialog';
import { useStore } from '@nanostores/react';
import { $cartOpen, $cartItems, $cartTotal, $freeShippingProgress, closeCart, updateCartQuantity, removeFromCart } from '@/stores/cart';

export default function CartDrawer() {
  const isOpen = useStore($cartOpen);
  const items = useStore($cartItems);
  const total = useStore($cartTotal);
  const shipping = useStore($freeShippingProgress);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl">
          <Dialog.Title className="...">Your Cart ({items.length})</Dialog.Title>
          {/* ... cart contents ... */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### Placement in Layout

In `src/layouts/Shop.astro`, add after the Footer:

```astro
<CartDrawer client:load />
```

Use `client:load` because the cart drawer must respond immediately to `openCart()` calls from any island.

---

## 5. Mobile Navigation

### File: `src/components/react/MobileMenu.tsx`

### New Store: `src/stores/ui.ts`

```typescript
// src/stores/ui.ts
import { atom } from 'nanostores';

export const $mobileMenuOpen = atom(false);
export function openMobileMenu() { $mobileMenuOpen.set(true); }
export function closeMobileMenu() { $mobileMenuOpen.set(false); }
```

Note: `$cartOpen` stays in `src/stores/cart.ts` since it's tightly coupled with cart logic. Only the new mobile menu atom goes in `ui.ts`.

### Behavior

1. **Opens** when the hamburger button is clicked in `Header.astro`
2. **Closes** on:
   - Clicking the X button
   - Pressing Escape
   - Clicking the backdrop
   - Clicking any nav link (auto-close on navigation)
3. **Slides in from the left** — mirrors the cart drawer but from the opposite side
4. **Uses Radix Dialog** in the same pattern as CartDrawer

### Nav Structure

```
┌─────────────────────────┐
│  ✕                      │  ← Close button
├─────────────────────────┤
│                         │
│  Shop All Products →    │  ← /products
│  Brands →               │  ← /brands
│                         │
│  ── By Strength ──      │  ← Section header
│  Light                  │  ← /products/strength/light
│  Normal                 │
│  Strong                 │
│  Extra Strong           │
│  Super Strong           │
│                         │
│  ── By Flavour ──       │  ← Section header
│  Mint                   │  ← /products/flavor/mint
│  Citrus                 │
│  Berry                  │
│  Coffee                 │
│  Exotic                 │
│                         │
│  ── More ──             │
│  Community              │  ← /community
│  Rewards                │  ← /rewards
│  Blog                   │  ← /blog
│  FAQ                    │  ← /faq
│  About                  │  ← /about
│  Contact                │  ← /contact
│                         │
│  ── Account ──          │
│  Login                  │  ← /login
│  Register               │  ← /register
├─────────────────────────┤
│  🔍 Search              │  ← /search
└─────────────────────────┘
```

### Wiring to Header.astro

The hamburger button in `Header.astro` currently has `data-mobile-menu-toggle` but no handler. Two options:

**Option A (chosen): Astro inline script that imports the store:**

Add to the bottom of `Header.astro`:

```astro
<script>
  import { openMobileMenu } from '@/stores/ui';

  document.addEventListener('astro:page-load', () => {
    const btn = document.querySelector('[data-mobile-menu-toggle]');
    btn?.addEventListener('click', () => openMobileMenu());
  });
</script>
```

This works because nanostores are shared across islands and Astro scripts.

### Placement in Layout

In `src/layouts/Shop.astro`, add alongside CartDrawer:

```astro
<MobileMenu client:load />
```

---

## 6. Cookie Consent Banner

### File: `src/components/react/CookieConsentBanner.tsx`

### State

Uses existing store in `src/stores/cookie-consent.ts`:

- `$cookieConsent` — persistent atom with `{ analytics: boolean; marketing: boolean; answered: boolean }`
- `acceptAll()`, `rejectAll()`, `setConsent()` — existing helper functions

### Behavior

1. **Renders only when `answered === false`** — once consent is given, the banner disappears permanently (persisted in localStorage)
2. **Fixed position** at the bottom of the viewport, full width
3. **Two-stage UI:**

   **Stage 1 — Simple bar:**
   ```
   ┌─────────────────────────────────────────────────────┐
   │  🍪 We use cookies to improve your experience.     │
   │                                                     │
   │  [Manage Preferences]  [Reject All]  [Accept All]  │
   └─────────────────────────────────────────────────────┘
   ```

   **Stage 2 — Expanded preferences (when "Manage Preferences" is clicked):**
   ```
   ┌─────────────────────────────────────────────────────┐
   │  Cookie Preferences                                 │
   │                                                     │
   │  ■ Essential cookies (always on)                    │
   │    Required for the site to function.               │
   │                                                     │
   │  □ Analytics cookies                                │
   │    Help us understand how you use the site.         │
   │                                                     │
   │  □ Marketing cookies                                │
   │    Used to show relevant ads and measure campaigns. │
   │                                                     │
   │                    [Save Preferences]               │
   └─────────────────────────────────────────────────────┘
   ```

4. **Styling:** Glass-panel aesthetic consistent with the theme:
   - `bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl`
   - `z-[60]` (above the sticky header at z-50)
5. **Animation:** Slide up from bottom on mount, slide down on dismiss
6. **Accessibility:** Focus trap when preferences panel is open, proper ARIA labels on toggle switches

### Placement in Layout

In `src/layouts/Shop.astro`:

```astro
<CookieConsentBanner client:idle />
```

Use `client:idle` because the banner is not time-critical — it can wait until the main thread is idle. This avoids blocking initial page interaction.

---

## 7. Toast Notifications

### Files

- `src/components/react/ToastProvider.tsx` — renders `<Toaster />` from sonner
- `src/lib/toast.ts` — exports helper functions

### `src/components/react/ToastProvider.tsx`

```typescript
import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: 'bg-card border-border text-foreground',
        duration: 3000,
      }}
      richColors
    />
  );
}
```

### `src/lib/toast.ts`

```typescript
import { toast } from 'sonner';

export function showAddedToCart(productName: string) {
  toast.success(`${productName} added to cart`, {
    description: 'Click the cart icon to view your items.',
    duration: 2500,
  });
}

export function showRemovedFromCart(productName: string) {
  toast(`${productName} removed from cart`, { duration: 2000 });
}

export function showWishlistToggle(productName: string, added: boolean) {
  toast(added ? `${productName} added to wishlist` : `${productName} removed from wishlist`, {
    duration: 2000,
  });
}

export function showError(message: string) {
  toast.error(message, { duration: 4000 });
}

export function showSuccess(message: string) {
  toast.success(message, { duration: 3000 });
}
```

### Wiring

1. **Add `<ToastProvider client:load />` to `Shop.astro`** — needs `client:load` so toasts appear immediately
2. **Import `showAddedToCart` in `ProductCard.tsx`** — call after `addToCart()`:
   ```typescript
   addToCart(product, 'pack1');
   openCart();
   showAddedToCart(name);
   ```
3. **Import `showWishlistToggle` in `WishlistIsland.tsx`** — call after `toggleWishlist()`
4. **Import `showError` in form islands** — call on validation/submission errors

### Placement in Layout

In `src/layouts/Shop.astro`, alongside other global islands:

```astro
<ToastProvider client:load />
```

---

## 8. SEO Fixes

### 8a. JSON-LD Schemas

#### FAQPage — `src/pages/faq.astro`

Add a `<script type="application/ld+json">` block in the frontmatter section. Extract each `<details>` Q&A pair into the schema:

```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are nicotine pouches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nicotine pouches are small, tobacco-free pouches that you place between your gum and upper lip...',
      },
    },
    // ... all FAQ items
  ],
};
```

This must be hand-maintained when FAQ content changes. Keep the `faqSchema` array in the frontmatter, not in a separate file, to make it obvious when content and schema drift apart.

#### ItemList — `/products/index.astro` and all category pages

```typescript
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Shop All Nicotine Pouches',
  numberOfItems: products.length,
  itemListElement: products.slice(0, 50).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `https://snusfriends.com/products/${p.id}`,
    name: p.data.name,
  })),
};
```

Cap at 50 items to keep the schema payload reasonable. Google does not require all items to be listed.

#### BreadcrumbList

The existing `Breadcrumb.astro` component already includes Microdata (`itemscope itemtype="https://schema.org/BreadcrumbList"`). No additional JSON-LD needed — the Microdata is sufficient and already valid.

#### Organization — Homepage `src/pages/index.astro`

```typescript
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SnusFriend',
  url: 'https://snusfriends.com',
  logo: 'https://snusfriends.com/og-image.png',
  description: 'Europe\'s premium nicotine pouch shop. 700+ products from 91 brands with fast EU delivery.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@snusfriends.com',
    contactType: 'customer service',
  },
};
```

### 8b. Font Preloading — `src/layouts/Base.astro`

Add to the `<head>` section, before the `<SEO>` component:

```html
<!-- Font preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload Inter (primary font) -->
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
</noscript>
```

If Inter is already bundled locally (check `src/index.css` for `@font-face`), skip the Google Fonts approach and add `<link rel="preload">` for the local `.woff2` files instead.

### 8c. Sitemap Verification

The `@astrojs/sitemap` integration auto-generates the sitemap from all non-noindexed pages. Verify that after adding category pages, the sitemap includes:

- `/products/strength/light` through `/products/strength/super-strong`
- `/products/flavor/mint` through `/products/flavor/unflavored`
- All existing pages

**Check for URL mismatches:** The header nav currently links `/nicotine-pouches` for "Products" but the actual page is at `/products`. Verify these resolve correctly or update the nav link to `/products`.

Header.astro nav link to fix:
```typescript
// Current (line 6):
{ href: '/nicotine-pouches', label: 'Products' },
// Should be:
{ href: '/products', label: 'Products' },
```

### 8d. Legacy `vercel.json` Cleanup

If a `vercel.json` with SPA rewrites (`{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}`) still exists in the repo root, delete it. Astro handles routing natively and the SPA rewrite would intercept Astro's static pages.

### 8e. Unique Titles and Descriptions Audit

Every page must have a unique `<title>` and `<meta name="description">`. Verify:

| Page | Title Pattern | Notes |
|------|--------------|-------|
| `/` | `SnusFriend \| Premium Nicotine Pouches` | From `tenant.seo.defaultTitle` |
| `/products` | `Shop All Nicotine Pouches \| SnusFriend` | Set directly |
| `/products/[slug]` | `{Product Name} \| SnusFriend` | Dynamic from content |
| `/products/strength/[key]` | `{Strength} Nicotine Pouches ({mg}) \| SnusFriend` | From `STRENGTH_META` |
| `/products/flavor/[key]` | `{Flavor} Nicotine Pouches \| SnusFriend` | From `FLAVOR_META` |
| `/brands` | `Nicotine Pouch Brands \| SnusFriend` | Set directly |
| `/brands/[slug]` | `{Brand Name} Nicotine Pouches \| SnusFriend` | Dynamic from content |
| `/faq` | `FAQ \| SnusFriend` | Set directly |
| `/about` | `About Us \| SnusFriend` | Set directly |
| `/contact` | `Contact Us \| SnusFriend` | Set directly |
| `/search` | `Search \| SnusFriend` | noindex=true |
| `/cart` | `Cart \| SnusFriend` | noindex=true |
| `/checkout` | `Checkout \| SnusFriend` | noindex=true |

Pages with `noindex={true}`: search, cart, checkout, login, register, forgot-password, order-confirmation, wishlist.

---

## 9. Architecture Notes

### Data Flow

```
Build time (astro build):
  content.config.ts → Supabase query → products collection → getCollection('products')
                                                                    ↓
  [key].astro (getStaticPaths) → filter products → serialize to JSON → pass as prop
                                                                    ↓
  React island (FilterableProductGrid / SearchIsland) → JSON.parse on mount → client-side state
```

### Product Data Serialization

Products are passed to React islands as inline JSON via a `productsJson` string prop. This is the Astro-recommended pattern for passing data to `client:*` components.

**Size estimate for ~700 products:**
- Raw JSON: ~80-100KB
- Gzip compressed: ~12-18KB
- Brotli compressed: ~10-15KB

This is well within acceptable limits for an SSG page. The JSON is embedded in the HTML and loaded with the page — no additional network request.

**Fields included in serialization:**
Only include fields needed for display and filtering. Exclude long descriptions from the grid JSON to reduce size:

```typescript
const serializedProducts = JSON.stringify(allProducts.map((p) => ({
  id: p.id,
  name: p.data.name,
  brand: p.data.brand,
  brandSlug: p.data.brandSlug,
  imageUrl: p.data.imageUrl,
  prices: p.data.prices,
  stock: p.data.stock,
  nicotineContent: p.data.nicotineContent,
  strengthKey: p.data.strengthKey,
  flavorKey: p.data.flavorKey,
  formatKey: p.data.formatKey,
  ratings: p.data.ratings,
  badgeKeys: p.data.badgeKeys,
})));
```

For search, add `description` to the serialized fields since the search algorithm scores against it.

### State Architecture

All interactive state uses nanostores, shared across islands without prop drilling:

```
┌──────────────────────────────────────────────────┐
│                  Nanostores                       │
│                                                   │
│  src/stores/cart.ts                               │
│    $cartItems (persistentAtom)                    │
│    $cartOpen (atom)                               │
│    $cartTotal, $cartCount (computed)              │
│    $freeShippingProgress (computed)               │
│                                                   │
│  src/stores/ui.ts (NEW)                           │
│    $mobileMenuOpen (atom)                         │
│                                                   │
│  src/stores/cookie-consent.ts (existing)          │
│    $cookieConsent (persistentAtom)                │
│                                                   │
│  src/stores/wishlist.ts (existing)                │
│    $wishlistIds (persistentAtom)                  │
│                                                   │
│  src/stores/theme.ts (existing)                   │
│    $theme (persistentAtom)                        │
└───────┬───────────┬───────────┬──────────────────┘
        │           │           │
   ┌────┴───┐  ┌────┴───┐  ┌───┴────┐
   │CartDraw│  │MobileMn│  │CookieCn│
   │ProductC│  │HeaderCt│  │ToastPrv│
   │AddToCtB│  │WishList│  │SearchIs│
   └────────┘  └────────┘  └────────┘
```

### Overlay Components

CartDrawer and MobileMenu are both slide-out overlay patterns. They should not conflict:

- **CartDrawer**: slides from right, z-50
- **MobileMenu**: slides from left, z-50
- **CookieConsentBanner**: fixed bottom, z-60
- **ToastProvider (sonner)**: fixed bottom-right, z-[100] (sonner default)

If both CartDrawer and MobileMenu are somehow open simultaneously, opening one should close the other. Implement in their respective open functions:

```typescript
// In cart.ts
import { closeMobileMenu } from '@/stores/ui';
export function openCart() {
  closeMobileMenu();
  $cartOpen.set(true);
}

// In ui.ts
import { closeCart } from '@/stores/cart';
export function openMobileMenu() {
  closeCart();
  $mobileMenuOpen.set(true);
}
```

Beware of circular imports: if `cart.ts` imports from `ui.ts` and vice versa, extract the mutual-exclusion logic into a separate `src/stores/overlay.ts` module that imports from both.

### View Transitions Compatibility

All overlay islands (`CartDrawer`, `MobileMenu`, `CookieConsentBanner`, `ToastProvider`) are rendered in `Shop.astro` layout. They persist across View Transitions because the layout wraps every page.

The `transition:persist="header"` attribute is already on the `<header>` element in `Header.astro`, which keeps the header stable during transitions. Consider adding `transition:persist` to the Cart Drawer and Mobile Menu containers if they flash during navigation.

---

## 10. File Structure

```
src/
  components/
    react/
      FilterableProductGrid.tsx    # Filter sidebar + sort dropdown + ProductCard grid
      SearchIsland.tsx             # Search input + fuzzy results + ProductCard grid
      CartDrawer.tsx               # Slide-out cart panel (right side)
      MobileMenu.tsx               # Mobile navigation drawer (left side)
      CookieConsentBanner.tsx      # Fixed-bottom cookie consent bar
      ToastProvider.tsx             # Sonner <Toaster /> wrapper
      ProductCard.tsx              # (existing) — no changes needed
      HeaderCartButton.tsx         # (existing) — no changes needed
      AddToCartButton.tsx          # (existing) — add toast call
      CartIsland.tsx               # (existing) — may share logic with CartDrawer
      WishlistIsland.tsx           # (existing) — add toast call
  stores/
    cart.ts                        # (existing) — add mutual exclusion with ui.ts
    ui.ts                          # NEW: $mobileMenuOpen atom
    cookie-consent.ts              # (existing) — no changes
    theme.ts                       # (existing) — no changes
    wishlist.ts                    # (existing) — no changes
    auth.ts                        # (existing) — no changes
    easter.ts                      # (existing) — no changes
    language.ts                    # (existing) — no changes
  lib/
    toast.ts                       # NEW: showAddedToCart(), showError(), etc.
    search.ts                      # NEW: normalize(), scoreProduct(), searchProducts()
  pages/
    products/
      index.astro                  # UPDATE: replace placeholder filters with FilterableProductGrid island
      [slug].astro                 # (existing) — no changes
      strength/
        [key].astro                # NEW: 5 strength category pages
      flavor/
        [key].astro                # NEW: 7 flavor category pages
    search.astro                   # UPDATE: add SearchIsland with products JSON
    faq.astro                      # UPDATE: add FAQPage JSON-LD
    index.astro                    # UPDATE: add Organization JSON-LD
  layouts/
    Base.astro                     # UPDATE: add font preconnect/preload
    Shop.astro                     # UPDATE: add CartDrawer, MobileMenu, CookieConsentBanner, ToastProvider
  content.config.ts                # (existing) — no changes
  config/
    tenant.ts                      # (existing) — no changes
```

**New files: 9** (6 React islands + 2 lib modules + 1 store)
**Modified files: 8** (5 Astro pages + 1 layout + 2 existing React islands)

---

## 11. Success Criteria

### Crawlability
1. Google can discover and index: homepage, `/products`, all `/products/strength/*`, all `/products/flavor/*`, all `/products/*` (PDPs), all `/brands/*`
2. Every category page renders a full HTML grid of product cards with names, prices, and links — visible in View Source without JavaScript
3. Sitemap includes all new category page URLs

### SEO Quality
4. Each category page has a unique H1, `<title>`, and `<meta name="description">`
5. Each category page includes a valid JSON-LD `ItemList` schema
6. FAQ page includes valid JSON-LD `FAQPage` schema
7. Homepage includes valid JSON-LD `Organization` schema
8. Product detail pages retain their existing `Product` schema
9. All structured data passes [Google Rich Results Test](https://search.google.com/test/rich-results)
10. Lighthouse SEO score >= 95 on homepage, `/products`, and one category page

### Functionality
11. Users can filter products by brand, strength, flavor, and format on `/products` and category pages
12. Filters update the URL query params for shareable links
13. Search returns relevant results with fuzzy matching (scoring algorithm works for brand names, product names, flavors)
14. Cart drawer opens when adding to cart and from header icon
15. Cart drawer shows items, quantity controls, shipping progress, and totals
16. Mobile menu opens from hamburger and provides full site navigation
17. Cookie consent banner appears on first visit and respects saved preferences
18. Toast feedback appears on add-to-cart, wishlist toggle, and form errors

### Performance
19. Category pages load in under 2s on 3G (Lighthouse performance >= 80)
20. Product JSON payload is under 120KB uncompressed per page
21. No layout shift from island hydration (CLS < 0.1)
22. Filter interactions respond in under 100ms (no API calls)

### Regression Safety
23. Existing ProductCard, AddToCartButton, HeaderCartButton, WishlistIsland continue to work unchanged
24. Existing cart store behavior (add, remove, update, persist) is preserved
25. View Transitions remain smooth — no flash on navigation between pages
26. Age gate still appears on first visit

---

## Appendix A: Dependency Inventory

| Package | Status | Purpose |
|---------|--------|---------|
| `nanostores` | Installed | State atoms |
| `@nanostores/persistent` | Installed | localStorage persistence |
| `@nanostores/react` | Installed | React bindings (`useStore`) |
| `@radix-ui/react-dialog` | Installed | Cart drawer + mobile menu overlays |
| `@radix-ui/react-collapsible` | Installed | Filter group expand/collapse |
| `@radix-ui/react-checkbox` | Installed | Filter checkboxes |
| `@radix-ui/react-select` | Installed | Sort dropdown |
| `sonner` | Installed | Toast notifications |

**No new packages required.** All dependencies are already in `package.json`.

---

## Appendix B: Implementation Order

Recommended task sequence for the writing-plans skill:

1. **`src/stores/ui.ts`** + **`src/lib/toast.ts`** + **`src/lib/search.ts`** — Foundation modules (no UI, just logic)
2. **`ToastProvider.tsx`** + wire into `Shop.astro` — Get toasts working first (other tasks depend on it)
3. **`CookieConsentBanner.tsx`** + wire into `Shop.astro` — Independent, no dependencies on other new code
4. **`CartDrawer.tsx`** + wire into `Shop.astro` + update `ProductCard.tsx` toast — Core shopping UX
5. **`MobileMenu.tsx`** + wire into `Shop.astro` + update `Header.astro` — Mobile UX
6. **`FilterableProductGrid.tsx`** — Largest island, depends on ProductCard
7. **`/products/strength/[key].astro`** + **`/products/flavor/[key].astro`** — Category pages using FilterableProductGrid
8. **Update `/products/index.astro`** — Replace placeholder filters with FilterableProductGrid
9. **`SearchIsland.tsx`** + update `/search.astro` — Search depends on `src/lib/search.ts`
10. **SEO fixes** — JSON-LD schemas, font preloading, sitemap verification, title audit, `vercel.json` cleanup
11. **Integration testing** — Cross-island state, URL sync, View Transitions, mobile responsiveness

Each task should be independently deployable and testable. Tasks 1-5 can be parallelized. Tasks 6-8 are sequential. Tasks 9-11 are independent of each other.
