# Phase 1: Quick Wins — Design Spec

**Date:** 2026-03-24
**Scope:** 4 frontend-only features, no backend changes
**Dependencies:** None — all use existing data and localStorage

---

## 1. Recently Viewed Products

### Purpose
Show products the user has browsed, encouraging return visits and reducing decision fatigue.

### Data Flow
```
ProductDetail mount
  -> useRecentlyViewed().add(product.id)
  -> localStorage "snusfriend_recently_viewed" = JSON array of IDs (max 12, newest first, deduped)

HomePage / ProductDetail render
  -> useRecentlyViewed().ids
  -> useCatalogProducts() filtered by those IDs
  -> <RecentlyViewed /> horizontal scroll row
```

### localStorage Schema
```json
{
  "key": "snusfriend_recently_viewed",
  "value": ["uuid-1", "uuid-2", "uuid-3"],
  "max": 12,
  "order": "newest first"
}
```

### Hook: `src/hooks/useRecentlyViewed.ts`
```typescript
interface UseRecentlyViewed {
  ids: string[];
  add: (productId: string) => void;
  clear: () => void;
}
```
- Uses lazy useState initializer with try/catch (matching CartContext pattern at lines 36-45)
- `loadFromStorage()` reads localStorage, parses JSON, returns `string[]` or `[]` on error
- `saveToStorage()` wraps `localStorage.setItem` in try/catch (handles QuotaExceededError silently)
- Deduplicates: if product already in list, move to front
- Caps at 12 items, drops oldest

### Component: `src/components/product/RecentlyViewed.tsx`
- Props: `excludeId?: string` (to hide current product on PDP)
- Renders nothing if filtered ids.length === 0
- **Horizontal scroll layout** (new pattern — not a grid like FeaturedProducts):
  ```
  flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory
  ```
  Each card: `flex-shrink-0 w-[200px] snap-start`
- Title: "Recently Viewed"
- No "View All" link (personal data, not a category)

### Integration Points
- `src/pages/ProductDetail.tsx` — call `add(product.id)` in useEffect on product load
- `src/pages/HomePage.tsx` — render `<RecentlyViewed />` after New Arrivals section
- `src/pages/ProductDetail.tsx` — render `<RecentlyViewed excludeId={product.id} />` below product info

---

## 2. Wishlist / Favorites

### Purpose
Let users save products they want to buy later. Increases return visits and conversion.

### Data Flow
```
ProductCard heart icon click
  -> useWishlist().toggle(product.id)
  -> localStorage "snusfriend_wishlist" = JSON array of IDs
  -> Heart icon fills/unfills

WishlistPage render
  -> useWishlist().ids
  -> useCatalogProducts() filtered by those IDs
  -> Product grid
```

### localStorage Schema
```json
{
  "key": "snusfriend_wishlist",
  "value": ["uuid-1", "uuid-2"]
}
```
No max cap — localStorage can easily hold hundreds of UUIDs (~2KB for 50).

### Context: `src/context/WishlistContext.tsx`
```typescript
interface WishlistContextValue {
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
}
```
- **Provider nesting:** Insert as sibling of CartProvider, inside QueryClientProvider (App.tsx ~line 86)
- Uses lazy useState initializer with try/catch (matching CartContext pattern)
- `saveToStorage()` wraps `localStorage.setItem` in try/catch (handles QuotaExceededError)
- Persists to localStorage on every toggle

### Component Changes
- **ProductCard.tsx** — Heart icon overlay (top-right of image area)
  - Un-wishlisted: `<Heart className="text-muted-foreground" />` (outline)
  - Wishlisted: `<Heart className="fill-current text-red-500" />` (filled red)
  - `onClick` calls `toggle(product.id)` with `stopPropagation()` (don't navigate to PDP)
  - Subtle scale animation on toggle

- **Header.tsx** — Heart icon in utility area (between search and cart)
  - Links to `/wishlist`
  - Badge showing count (same pattern as cart badge)

### New Page: `src/pages/WishlistPage.tsx`
- Grid of wishlisted products (reuse ProductCard)
- Empty state: "No saved products yet. Browse our collection and tap the heart icon."
- Link back to shop
- SEO: `metaRobots="noindex,follow"` (personal page)

### Route
- `src/App.tsx` — add `<Route path="/wishlist" element={<WishlistPage />} />`

---

## 3. Stock Count Display

### Purpose
Show actual inventory count on products for transparency.

### Data Source
`product.stock` already exists from `useCatalog.ts` — summed from all variant inventory rows.

### Existing Behavior (DO NOT duplicate)
ProductCard.tsx already has:
- `isOutOfStock` (stock === 0): grayed card, "Out of Stock" badge, disabled CTA, "Notify Me" form
- `isLowStock` (stock > 0 && stock <= 20): amber "Low Stock" badge overlay
- `LOW_STOCK_THRESHOLD = 20` (line 13)

ProductDetail.tsx already has:
- Out-of-stock: disabled "Add to Cart" button, "Out of Stock" text, notify-me flow

### New Addition (stock count text only)
| Stock | Display | Color | Where |
|-------|---------|-------|-------|
| > LOW_STOCK_THRESHOLD | "X in stock" | `text-emerald-400` | ProductCard + ProductDetail |
| 1 to LOW_STOCK_THRESHOLD | "Only X left" | (existing amber badge handles this) | ProductDetail only (card has badge) |
| 0 | (existing OOS handling) | (existing red handling) | No change needed |
| null/undefined | (show nothing) | — | — |

### Component Changes
- **ProductCard.tsx** — Add `text-xs text-emerald-400` count below price ONLY when stock > LOW_STOCK_THRESHOLD
  - Do NOT add anything for low stock or out of stock (already handled by badges)
- **ProductDetail.tsx** — Add stock count text (`text-sm`) near Add to Cart button
  - Green for normal stock, amber for low stock (1-20)
  - Out of stock already handled — no changes needed

### No New Files
All changes are in existing components.

---

## 4. Dark/Light Mode Toggle

### Purpose
Allow users to switch between dark and light themes. Dark is default (current).

### Architecture
The app already uses `next-themes` ThemeProvider in App.tsx, currently locked to `themes={['velo']}`.

**IMPORTANT:** A light theme already exists in `src/index.css` as the `.light` class (lines 95-153, "Scandinavian Premium Light Glacier"). No new CSS class needs to be created.

### Changes

**`src/index.css`** — No changes needed. The `.light` theme already has all CSS variables defined.

**`src/App.tsx`** — Update ThemeProvider
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="velo"
  enableSystem={false}
  themes={['velo', 'light']}
>
```

**`src/components/layout/UtilityBar.tsx`** — Add toggle button
- Sun icon (when dark/velo) / Moon icon (when light)
- Position: before "Log in" link
- Uses `useTheme()` from `next-themes`
- `onClick`: toggle between `'velo'` and `'light'`
- Persists via next-themes localStorage

### Theme Persistence
- next-themes handles localStorage automatically (key: `theme`)
- First visit: defaults to `velo` (dark)
- Subsequent visits: reads stored preference

---

## Files Summary

| Action | File | Feature |
|--------|------|---------|
| Create | `src/hooks/useRecentlyViewed.ts` | Recently Viewed |
| Create | `src/components/product/RecentlyViewed.tsx` | Recently Viewed |
| Create | `src/context/WishlistContext.tsx` | Wishlist |
| Create | `src/pages/WishlistPage.tsx` | Wishlist |
| Modify | `src/pages/ProductDetail.tsx` | Recently Viewed + Stock |
| Modify | `src/pages/HomePage.tsx` | Recently Viewed |
| Modify | `src/components/product/ProductCard.tsx` | Wishlist + Stock |
| Modify | `src/components/layout/Header.tsx` | Wishlist badge |
| Modify | `src/components/layout/UtilityBar.tsx` | Theme toggle |
| Modify | `src/App.tsx` | Wishlist route + context + theme |

**NOT modified:** `src/index.css` (light theme already exists)

---

## Testing

1. **Recently Viewed:**
   - Visit 3 products → homepage shows all 3 in horizontal scroll row
   - Visit same product twice → only appears once (deduped, moved to front)
   - On PDP: current product excluded from row
   - Clear localStorage → section disappears

2. **Wishlist:**
   - Heart a product → heart fills red, count badge appears in header
   - Visit /wishlist → product appears in grid
   - Unheart → removed from grid, count decreases
   - Clear localStorage → wishlist empty

3. **Stock Count:**
   - Product with stock > 20 → green "X in stock" text
   - Product with stock 1-20 → existing amber badge (no duplicate indicator)
   - Product with stock 0 → existing OOS handling (no duplicate indicator)

4. **Dark/Light Mode:**
   - Click sun icon → theme switches to `.light`, icon becomes moon
   - Refresh page → theme persists (light)
   - Click moon icon → back to `.velo` (dark)
   - All pages render correctly in both themes

5. **Build:** `bun run build` passes with zero errors
