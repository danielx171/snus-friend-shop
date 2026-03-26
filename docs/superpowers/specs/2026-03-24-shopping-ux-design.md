# Shopping UX Features — Design Spec

**Date:** 2026-03-24
**Status:** Approved
**Scope:** 6 features to improve conversion and shopping experience

## Goal

Add core shopping UX features that increase conversion, average order value, and repeat purchases: recently viewed products, wishlist/favorites, product recommendations, build-your-own bundles, checkout upsells, and reorder from past orders.

## Features

### 1. Recently Viewed Products

**Storage:** localStorage array of last 20 product IDs, updated on each product page visit.

**Hook:** `useRecentlyViewed()` — reads localStorage, fetches product data from Supabase for the stored IDs. Returns `{ products, addViewed, clearHistory }`.

**UI:**
- "Recently Viewed" carousel on homepage (below bestsellers)
- "Recently Viewed" section on product detail page (below reviews)
- Uses existing product card component
- Hidden when empty (first-time visitors see nothing)

**No Supabase table needed** — purely client-side.

### 2. Wishlist / Favorites

**Storage:** Dual-layer — localStorage for anonymous users, `user_wishlists` Supabase table for logged-in users.

**Database: `user_wishlists`**
- `user_id` UUID FK → auth.users
- `product_id` UUID FK → products
- `created_at` TIMESTAMPTZ
- PRIMARY KEY (user_id, product_id)
- RLS: Users read/insert/delete own rows only.

**Hook:** `useWishlist()` — manages localStorage + Supabase sync. On login, merges localStorage items into Supabase table, then clears localStorage. Returns `{ wishlistIds, isWishlisted(id), toggleWishlist(id), count }`.

**UI:**
- Heart icon on every product card (existing button, wire it up)
- Heart icon filled when product is wishlisted
- `/wishlist` page with grid of wishlisted products + "Add to Cart" per item
- Badge count on heart icon in header utility bar
- Empty state: "No favorites yet — browse products to start"

### 3. "Customers Also Bought" Recommendations

**Algorithm (V1 — catalog-based, no purchase data):**
1. Same brand, different product (max 2)
2. Same flavor_key, different brand (max 2)
3. Fill remaining slots from popular products in same strength tier

**Hook:** `useRecommendations(product)` — fetches from products table with filters. Returns `{ recommendations, isLoading }`.

**UI:**
- "You might also like" section on product detail page
- 4-product horizontal scroll with existing product card component
- Positioned between product info and reviews

### 4. Build-Your-Own Bundle

**Page:** `/bundle-builder`

**Flow:**
1. Choose bundle size: 3-pack (5% off), 5-pack (10% off), 10-pack (15% off)
2. Browse/search products — add to bundle slots
3. Visual slot display showing filled/empty positions
4. Running total with discount applied
5. "Add Bundle to Cart" — adds individual items with bundle discount metadata

**Cart integration:** Each item added with `bundle_id` (timestamp-based) and `bundle_discount` percentage in cart metadata. Checkout displays bundle grouping.

**No Supabase table needed** — bundle state lives in React state during building, then goes to cart context.

### 5. Checkout Upsell (99-cent Add-ons)

**Display:** On checkout page, between cart summary and "Place Order" button.

**Configuration: `checkout_upsells` Supabase table**
- `id` UUID PK
- `sku` TEXT (must match a product_variants SKU)
- `display_name` TEXT
- `price_override` NUMERIC (e.g. 0.99)
- `active` BOOLEAN default true
- `sort_order` INT
- RLS: Public read active. No client writes.

**UI:**
- "Add to your order" section with 6 product cards at 99 cents
- Toggle/checkbox on each (max 3 selectable)
- Selected items visually highlighted
- Updates order total in real-time

**Integration:** Selected upsells added to `line_items` in the checkout payload with `price_override` instead of catalog price.

### 6. Reorder Button

**Location:** Account page → Orders tab → each order row.

**Logic:**
1. Read `line_items_snapshot` from the order
2. For each item, find matching product by SKU in current catalog
3. Add matched items to cart with original quantities
4. Show toast: "X of Y items added to cart" (unavailable items noted)
5. Navigate to /cart

**Hook:** `useReorder()` — takes an order's line_items_snapshot, returns `{ reorder, isReordering }`.

**UI:** "Reorder" button on each order row (desktop) and order card (mobile) in AccountPage.

## Database Changes

| Table | Action | Purpose |
|-------|--------|---------|
| `user_wishlists` | CREATE | Wishlist sync for logged-in users |
| `checkout_upsells` | CREATE | Admin-configured 99-cent add-ons |

## Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/useRecentlyViewed.ts` | Recently viewed localStorage hook |
| `src/hooks/useWishlist.ts` | Wishlist with localStorage + Supabase sync |
| `src/hooks/useRecommendations.ts` | Product recommendations hook |
| `src/hooks/useReorder.ts` | Reorder from past order hook |
| `src/pages/WishlistPage.tsx` | Dedicated wishlist page |
| `src/pages/BundleBuilder.tsx` | Build-your-own bundle page |
| `src/components/shop/RecentlyViewed.tsx` | Recently viewed carousel |
| `src/components/shop/CheckoutUpsell.tsx` | 99-cent upsell section |
| `src/components/shop/ReorderButton.tsx` | Reorder button component |
| `supabase/migrations/YYYYMMDD_shopping_ux.sql` | user_wishlists + checkout_upsells tables |

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/ProductDetail.tsx` | Add recently viewed tracking + recommendations section |
| `src/pages/HomePage.tsx` | Add recently viewed carousel |
| `src/pages/CheckoutHandoff.tsx` | Add upsell section |
| `src/pages/AccountPage.tsx` | Add reorder button to order rows |
| `src/components/product/ProductCard.tsx` | Wire heart icon to wishlist toggle |
| `src/App.tsx` | Add /wishlist and /bundle-builder routes |
| `src/integrations/supabase/types.ts` | Add user_wishlists + checkout_upsells types |

## Success Criteria

1. Recently viewed shows last products user browsed (persists across page loads)
2. Wishlist heart toggles and persists (localStorage for anon, Supabase for logged-in)
3. Product detail shows relevant recommendations
4. Bundle builder lets user pick N products with tiered discount
5. Checkout shows 99-cent upsells (max 3 selectable)
6. Reorder button populates cart from past order
