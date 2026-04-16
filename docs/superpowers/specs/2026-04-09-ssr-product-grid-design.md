# /nicotine-pouches Performance Redesign — Phased Approach

**Date:** 2026-04-09
**Goal:** Take /nicotine-pouches from Performance ~78-81 → 85+ through phased improvements.
**Success criteria:** Median of 3 mobile PageSpeed runs. Track LCP and visual first paint, not just headline score.

## Problem

`/nicotine-pouches` is the lowest-performing page on the site (Performance 78-81 after recent fixes, down from 61). The root cause is architectural: the product catalog is a React island (`FilterableProductGrid`) that fetches `/data/products.json` (276KB) client-side before rendering any real content.

The strength and flavor sub-pages already prove a better pattern — they pass inline JSON to FilterableProductGrid and get instant first paint. `/nicotine-pouches` is the only major page still using the client-fetch path.

## Two-Phase Rollout

### Phase 1: Inline productsJson (do first, measure, then decide)

Swap `/nicotine-pouches` from `productsJsonUrl="/data/products.json"` (client fetch) to `productsJson={productsJson}` (inline data). This is the same pattern already working on `/products`, `/products/strength/[key]`, and `/products/flavor/[key]`.

**What changes:**
```diff
- <FilterableProductGrid client:idle productsJsonUrl="/data/products.json" />
+ <FilterableProductGrid client:idle productsJson={productsJson} />
```

Plus in the frontmatter:
```ts
const productsJson = JSON.stringify(slimProductData(products));
```

**Why this should help:**
- Eliminates the fetch waterfall (hydration → fetch → parse → render becomes hydration → render)
- Products data arrives with the initial HTML (gzips to ~40KB, faster than a separate request)
- No new components, no swap logic, no architectural change
- 15-minute implementation

**What it does NOT fix:**
- First paint is still skeleton cards until React hydrates
- Full 708-product JSON still parsed client-side

**After deploy:** Run 3 mobile PageSpeed tests, record median Performance + LCP. If 85+, stop here. If not, proceed to Phase 2.

### Phase 2: Static Astro Grid + Lazy React Swap (only if Phase 1 misses target)

Server-render the first 24 products as pure Astro HTML using `ProductCard.astro`. Defer the full interactive FilterableProductGrid until user interaction.

**First paint (real catalog content before grid hydration):**
- 24 `ProductCard.astro` cards, using a shared featured ordering helper
- Static filter sidebar using `<details>/<summary>` + real checkboxes
- Static sort `<select>` and "Show More" button
- Note: `ProductCard.astro` includes `CardAddToCart client:visible` and a tilt init script, so this is "real content first" not "zero JS"

**Shared featured ordering helper:**
Both the static shell and FilterableProductGrid's `featured` sort must use the same ordering function. Extract to `src/lib/catalog-order.ts`:
```ts
export function featuredOrder(products: SlimProduct[]): SlimProduct[] {
  // popular badge first, brand diversity (max 1 per brand in top 24), then alphabetical
}
```
This prevents the grid reshuffling when the swap happens.

**Interaction trigger → React swap:**
A thin `ProductGridActivator.tsx` island (`client:idle`):
1. On mount: if URL params or beginner mode active → mount React grid immediately (no static shell flash)
2. On filter/sort/show-more interaction → dynamically import FilterableProductGrid, swap with CSS crossfade

**Skip-static rules (no flash of unfiltered content):**
- If URL has filter params (`?brand=`, `?strength=`, etc.) → mount React grid immediately
- If beginner mode is active (read from localStorage/nanostore) → mount React grid immediately
- Only show static shell for clean `/nicotine-pouches` visits with no active filters

**Mobile pre-hydration:**
- Static filter sidebar hidden on mobile (same as current React behavior)
- Mobile "Filters" button is inert until React mounts
- Mobile filter sheet lives entirely in FilterableProductGrid (no static equivalent needed)

**FilterableProductGrid changes (Phase 2 only):**
- Extract shared facet definitions (brand list, strength labels, etc.) to a shared module
- Extract shared featured ordering helper
- Accept `initialVisibleCount` prop to match static shell's 24-card count
- Ensure dynamic import doesn't eagerly pull the full grid into the initial bundle

### Data Embedding (both phases)

Phase 1: Inline JSON as component prop (same as `/products` pattern).
Phase 2: Additionally embed in `<script type="application/json" id="products-data">` for the activator to read without parsing the prop.

HTML payload grows ~300KB raw but gzips to ~40KB. Faster than a separate fetch.

## Component Inventory

| Component | Phase | Status |
|-----------|-------|--------|
| `FilterableProductGrid.tsx` | 1 | Existing, no changes (already supports `productsJson`) |
| `slimProductData()` in `src/lib/product-json.ts` | 1 | Existing, no changes |
| `nicotine-pouches.astro` | 1 | Modify: swap `productsJsonUrl` → `productsJson` |
| `ProductCard.astro` | 2 | Existing, no changes |
| `ProductGridActivator.tsx` | 2 | **New** — thin swap island |
| `src/lib/catalog-order.ts` | 2 | **New** — shared featured ordering helper |
| `FilterableProductGrid.tsx` | 2 | Minor changes (shared ordering, initialVisibleCount) |

## Performance Expectations

| Metric | Before fixes | After Phase 1 (est.) | After Phase 2 (est.) |
|--------|-------------|----------------------|----------------------|
| Performance | 61-63 | 82-88 | 88-92 |
| LCP | ~4.3s | ~2.5s | <1.5s |
| CLS | 0.587 → 0 (fixed) | 0 | 0 |

**Note:** 90+ may require global asset tuning beyond grid architecture. Current non-grid overhead includes Sentry (~74KB), Plus Jakarta Sans (~49KB), Space Grotesk (~43KB). Those are separate optimization targets.

## Verification

After each phase:
1. `bun run build` succeeds
2. Deploy + promote to production
3. Run 3 mobile PageSpeed tests on `/nicotine-pouches`, record median
4. Codex visual verification: product cards visible on first paint, no skeleton flash (Phase 2)
5. Filter interaction works: click a filter → grid updates correctly
6. Beginner mode: toggle on → products filter to low-strength
7. URL params: `/nicotine-pouches?strength=strong` → shows filtered results

## What This Does NOT Change

- Product data pipeline (Supabase → content layer → slimProductData)
- URL-based filter state management
- Strength/flavor sub-pages (already SSR)
- Homepage product grid
- Product detail pages
- Mobile filter sheet UX (lives in FilterableProductGrid)
