# Plan: Dynamic Brands & Discovery UX Overhaul

## Problem

The database has **139 brands** with **2,097+ products** synced from Nyehandel.
The frontend hardcodes **10 brands** in `src/data/brands.ts` and `src/data/products.ts`.
The navigation dropdown shows only **8 brands**.
Product filters only offer those 10 brands as checkboxes.

129 brands are invisible to customers — they can only find them via direct search.

## Design Principles

1. **Don't overwhelm** — 139 brands shown flat is noise. Group, tier, and progressively reveal.
2. **Engagement over lists** — featured brands get hero treatment, the rest are discoverable via alphabet/search.
3. **Dynamic everything** — no more hardcoded brand lists. All data comes from Supabase.
4. **Search-first for power users** — let people type a brand name and find it instantly.

---

## Architecture Changes

### New hook: `useBrands()`

**File:** `src/hooks/useBrands.ts` (new)

Fetches all brands from Supabase with product counts:
```ts
const { data: brands } = useQuery({
  queryKey: ['brands'],
  queryFn: async () => {
    const { data } = await supabase
      .from('brands')
      .select('id, name, slug, manufacturer, product_count:products(count)')
      .order('name');
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 min cache
});
```

This replaces all reads from `src/data/brands.ts` and `src/data/products.ts` brand arrays.

---

## Task 1: Create `useBrands()` hook

**Files:** `src/hooks/useBrands.ts` (new)

**What:**
- React Query hook fetching from `brands` table with product counts
- Returns `{ brands, topBrands, brandsByLetter, isLoading }`
- `topBrands`: top 12 by product count (for nav dropdown + featured section)
- `brandsByLetter`: grouped `{ A: [...], B: [...] }` for alphabetical browsing

**Acceptance:** Hook returns all 139 brands from DB with counts.

---

## Task 2: Dynamic navigation dropdown

**File:** `src/components/layout/MainNav.tsx`

**Current:** Hardcoded `brandsList.slice(0, 8)` in 2-column grid.

**New design:**
- Show **top 8 brands** by product count (dynamic from `useBrands().topBrands`)
- Each brand shows name + product count badge
- "View all 139 brands →" link at bottom
- Keep 2-column grid layout

**What changes:**
- Replace `import { brands } from '@/data/products'` with `useBrands()`
- Line 22: `brandsList.slice(0, 8)` → `topBrands.slice(0, 8)`
- Add count badge: `<span className="text-xs text-muted-foreground">(139)</span>`

**Acceptance:** Dropdown shows top 8 brands dynamically with product counts.

---

## Task 3: Redesign BrandsIndex page — tiered discovery

**File:** `src/pages/BrandsIndex.tsx`

**Current:** 10 hardcoded brand cards in a simple grid.

**New design — 3 tiers:**

### Tier 1: Featured Brands (top 8-12 by product count)
- Large cards with brand initial, name, product count, tagline
- 2-3 column grid, visually prominent
- Links to `/nicotine-pouches?brand={name}`

### Tier 2: Alphabetical directory (all 139 brands)
- Alphabet letter bar at top (A B C D ... Z) — click to jump
- Grouped by first letter
- Each entry: brand name + product count
- Compact list format (not cards) — efficient for scanning
- Sticky letter headers as you scroll

### Tier 3: Brand search
- Search input at top of page: "Search brands..."
- Instant filter as you type
- Shows matching brands inline

**Implementation:**
- Remove dependency on `src/data/brands.ts` entirely
- Use `useBrands()` hook for all data
- Remove hardcoded `brandAccents` map — use generated colors from brand name hash
- Remove `getBrandBySlug()` calls — fetch from DB

**Acceptance:** Page shows all 139 brands, searchable, with alphabetical navigation.

---

## Task 4: Dynamic product filters

**File:** `src/components/product/ProductFilters.tsx`

**Current:** Hardcoded 10 brands at line 56.

**New design:**
- Fetch brand list from `useBrands()` (only brands with products > 0)
- Show top 10 brands by default with "Show all brands" expand
- Brand search within the filter (for 139 brands, checkboxes alone won't work)
- Add count next to each brand checkbox: `VELO (139)`

**What changes:**
- Replace hardcoded brands array with dynamic data
- Add search input within brands filter section
- Add "Show more" / "Show less" toggle (show top 10 → expand to all)
- Sort by product count descending (most products first)

**Acceptance:** Filter sidebar shows all brands dynamically with counts and search.

---

## Task 5: Dynamic BrandHub pages

**File:** `src/pages/BrandHub.tsx`

**Current:** Uses `getBrandBySlug()` from static data — only works for 10 brands.
Returns 404-like state for ICEBERG, CUBA, etc.

**New design:**
- Fetch brand info from Supabase `brands` table by slug
- Remove dependency on `src/data/brands.ts`
- Generate description dynamically if not in static data: "Explore {count} {brand} nicotine pouches"
- Keep FAQ section but make it optional (only show if brand has FAQ data)
- Show full product grid (not just top 4), with pagination

**What changes:**
- Replace `getBrandBySlug()` with Supabase query
- Fetch products by brand_id instead of filtering all products client-side
- Add proper 404 handling for invalid brand slugs

**Acceptance:** `/brand/iceberg` works and shows all 85 ICEBERG products.

---

## Task 6: Improved search scoring

**File:** `src/lib/search.ts`

**Current:** Basic scoring — exact name match > starts with > contains > brand > flavor.

**Enhancements:**
- Add brand-first search: typing "VELO" should surface the brand hub first, then products
- Add fuzzy matching for typos (simple Levenshtein or n-gram)
- Add search suggestions/autocomplete for brand names
- Consider adding search to the brand filter panel too

**What changes:**
- Boost brand-exact-match score higher
- Add brand suggestions to search results header: "Did you mean: VELO? Browse all 139 VELO products →"

**Acceptance:** Searching "iceberg" shows ICEBERG products ranked first with brand link.

---

## Task 7: Cleanup hardcoded brand data

**Files to modify:**
- `src/data/brands.ts` — keep only for FAQ/tagline overrides, not as source of truth
- `src/data/products.ts` — remove brands array (line 66-77)
- `src/components/product/ProductFilters.tsx` — remove hardcoded brands
- `src/components/layout/MainNav.tsx` — remove hardcoded brand import
- `src/pages/BrandsIndex.tsx` — remove hardcoded brandAccents
- `src/pages/BrandHub.tsx` — remove getBrandBySlug dependency

**What:**
- Rename `src/data/brands.ts` to `src/data/brand-overrides.ts`
- Keep taglines and FAQs for the 10 brands that have them
- All other brand data comes from DB
- Generate accent colors dynamically from brand name hash

**Acceptance:** Removing `src/data/brands.ts` doesn't break the site (after migration).

---

## Task 8: ProductListing featured brands boost

**File:** `src/pages/ProductListing.tsx`

**Current:** Line 25 hardcodes `['VELO', 'Sting', 'ZYN', 'LOOP']` as featured brands.

**New:** Fetch top 4-6 brands by product count from `useBrands()` and use those for sort boosting.

**Acceptance:** Featured brands in "Most Popular" sort are dynamic.

---

## Execution Order

1. **Task 1** — `useBrands()` hook (foundation, everything depends on this)
2. **Task 4** — Dynamic filters (highest impact for product discovery)
3. **Task 2** — Dynamic nav dropdown
4. **Task 3** — BrandsIndex redesign (biggest visual change)
5. **Task 5** — BrandHub dynamic pages
6. **Task 8** — Featured brands boost
7. **Task 6** — Search improvements
8. **Task 7** — Cleanup hardcoded data (last, after everything is wired)

## Estimated scope

- Tasks 1-2, 4: Small-medium (hook + wiring)
- Task 3: Medium (new UI design for alphabetical directory)
- Task 5: Medium (DB queries + product grid)
- Tasks 6-8: Small (refinements)

## Notes

- The `brands` table already has `name`, `slug`, `manufacturer` columns
- Product counts can be computed via JOIN or stored as a materialized view for performance
- 25 products have brand "Unknown" — these need brand assignment or filtering
- Brand slugs with special chars (e.g. `apr-s` for Après, `fr-kens-nikotin` for Frökens Nikotin) need URL encoding handling
