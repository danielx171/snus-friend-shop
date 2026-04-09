# SSR Product Grid — /nicotine-pouches Performance Redesign

**Date:** 2026-04-09
**Goal:** Take /nicotine-pouches from Performance 61 → 85+ by server-rendering the first page of products and deferring React to user interaction.

## Problem

`/nicotine-pouches` is the worst-performing page on the site (Performance 61, LCP ~4.3s). The root cause is architectural: the entire product catalog is a React island (`FilterableProductGrid`) that:

1. Renders 24 skeleton cards on first paint (no real content)
2. Fetches `/data/products.json` (276KB) client-side
3. Parses 708 products, computes filters, renders cards — all in JS
4. First meaningful paint requires: hydration → fetch → parse → render

The strength and flavor sub-pages already prove the SSR pattern works — they pass inline JSON to FilterableProductGrid and get instant first paint. But `/nicotine-pouches` is the main catalog entry point and needs the deepest optimization.

## Approach: Static Astro Grid + Lazy React Swap

Render the first 24 products as pure Astro HTML using the existing `ProductCard.astro` component. Defer the full interactive FilterableProductGrid until the user actually interacts with filters, sort, or "Show More".

### First Paint (Zero JS)

- **Product grid:** 24 `ProductCard.astro` cards, sorted by popularity (same logic as homepage best-sellers: products with `popular` badge first, brand diversity max 1 per brand, then by name)
- **Filter sidebar:** Static HTML using `<details>/<summary>` for collapsible sections, real `<input type="checkbox">` elements with counts
- **Sort dropdown:** Static `<select>` with options (Featured, Price Low→High, etc.)
- **"Show More" button:** Static button showing total product count
- **Quick filter pills:** Unchanged (already static `<a>` links)
- **SEO content:** Unchanged (static text below grid)

### Data Embedding

Products data for hydration is embedded in the page:
```html
<script type="application/json" id="products-data">
  {JSON.stringify(slimProductData(allProducts))}
</script>
```

This avoids a network fetch. The HTML payload grows by ~300KB raw, but gzips to ~40KB (structured JSON compresses well). This is faster than a separate fetch because it arrives with the initial HTML response.

### Interaction Trigger → React Swap

A thin React island `ProductGridActivator` (`client:idle`) handles the swap:

1. On mount: checks URL params — if filters are present, triggers swap immediately
2. Listens for clicks on filter checkboxes, sort changes, or "Show More" via event delegation
3. On first interaction:
   - Reads checked state from DOM checkboxes → builds `FilterState`
   - Reads sort value from `<select>`
   - Reads products JSON from `<script id="products-data">`
   - Dynamically imports FilterableProductGrid
   - Swaps static grid for React grid with CSS opacity crossfade (300ms)
4. After swap: removes static grid from DOM, all subsequent interactions are client-side React

### Component Inventory

| Component | Type | Role |
|-----------|------|------|
| `ProductCard.astro` | Existing | SSR product cards (already exists, identical styling) |
| `ProductGridActivator.tsx` | **New** | Thin island: detects interaction, swaps static → React |
| `FilterableProductGrid.tsx` | Existing | Full interactive grid (no changes needed — already supports `productsJson` prop) |
| `slimProductData()` | Existing | Shapes product data for client consumption |
| `filterProducts()` | Existing | Sorting/filtering logic in `src/lib/search.ts` |

### Static Filter Sidebar

Computed at build time in Astro frontmatter:
- **Brands:** Extract unique brands from all products, sorted alphabetically, with product counts
- **Strengths:** Fixed list (Light, Normal, Strong, Extra Strong, Super Strong) with counts
- **Flavors:** Fixed list (Mint, Berry, Citrus, etc.) with counts
- **Formats:** Fixed list (Slim, Mini, Regular, Large) with counts

Rendered as:
```html
<aside id="static-filters">
  <details open>
    <summary>Strength</summary>
    <label><input type="checkbox" name="strength" value="strong"> Strong (142)</label>
    ...
  </details>
  ...
</aside>
```

On swap, activator reads all `input[type=checkbox]:checked` elements to capture user's selections.

### The Swap Moment

```
User clicks checkbox/sort/show-more
  → Activator intercepts (event delegation on sidebar + grid containers)
  → Dynamic import: FilterableProductGrid
  → Read products from <script id="products-data">
  → Read checked filters + sort from DOM
  → Fade out static grid (opacity: 0, 300ms)
  → Mount React grid with productsJson + initialFilters
  → Fade in React grid (opacity: 1, 300ms)
  → Remove static grid from DOM
```

### Edge Cases

- **JS disabled:** Static grid stays visible permanently. Quick filter pills (static `<a>` links to `/products/strength/strong` etc.) provide navigation without JS.
- **URL params on load:** If user arrives with `?brand=zyn`, activator triggers swap on mount since filters are active. Brief flash of unfiltered static grid → filtered React grid.
- **Slow hydration:** Static grid is real content with real product links. Users can browse and click products before React loads.
- **Empty filter results:** Handled by existing FilterableProductGrid "No products match" state.
- **Astro ProductCard 3D tilt:** The SSR `ProductCard.astro` has a JS-powered 3D tilt effect that initializes via IntersectionObserver + requestIdleCallback. This runs independently of the React swap and doesn't affect first paint.

### Performance Expectations

| Metric | Current | Expected |
|--------|---------|----------|
| LCP | ~4.3s | <1.5s (real product cards in first HTML response) |
| CLS | 0 (already fixed) | 0 (static grid has stable dimensions) |
| FCP | ~2s | <0.8s (no JS needed for first paint) |
| Performance score | 61 | 85+ |

### Files to Modify

| File | Change |
|------|--------|
| `src/pages/nicotine-pouches.astro` | Replace FilterableProductGrid with static grid + activator |
| `src/components/react/ProductGridActivator.tsx` | **New** — thin swap island |
| `src/components/react/FilterableProductGrid.tsx` | No changes (already supports inline JSON) |
| `src/components/astro/ProductCard.astro` | No changes (already exists) |
| `src/lib/product-json.ts` | No changes |

### What This Does NOT Change

- FilterableProductGrid internals (no refactor)
- Product data pipeline (Supabase → content layer → slimProductData)
- URL-based filter state management
- Mobile filter sheet UX
- Strength/flavor sub-pages (already SSR)
- Homepage product grid
- Product detail pages
