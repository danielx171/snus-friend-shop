# Shopping UX Features — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 shopping UX features (recently viewed, wishlist, recommendations, bundle builder, checkout upsells, reorder) to increase conversion and repeat purchases.

**Architecture:** Frontend-first approach — 4 of 6 features are purely client-side (localStorage + React state). Two features need small Supabase tables (wishlists, checkout upsells). All hooks follow existing React Query patterns. Components use shadcn/ui + Tailwind.

**Tech Stack:** React, TypeScript, React Query, shadcn/ui, Tailwind CSS, Supabase, localStorage

**Spec:** `docs/superpowers/specs/2026-03-24-shopping-ux-design.md`

---

## File Structure

### New Files
```
supabase/migrations/20260324210000_shopping_ux.sql
src/hooks/useRecentlyViewed.ts
src/hooks/useWishlist.ts
src/hooks/useRecommendations.ts
src/hooks/useReorder.ts
src/components/shop/RecentlyViewed.tsx
src/components/shop/CheckoutUpsell.tsx
src/components/shop/ReorderButton.tsx
src/pages/WishlistPage.tsx
src/pages/BundleBuilder.tsx
```

### Modified Files
```
src/integrations/supabase/types.ts
src/pages/ProductDetail.tsx
src/pages/HomePage.tsx
src/pages/CheckoutHandoff.tsx
src/pages/AccountPage.tsx
src/components/product/ProductCard.tsx
src/App.tsx
```

---

### Task 1: Database — Wishlists + Checkout Upsells

**Files:**
- Create: `supabase/migrations/20260324210000_shopping_ux.sql`
- Modify: `src/integrations/supabase/types.ts`

- [ ] **Step 1: Apply migration via Supabase MCP**

```sql
-- Wishlist for logged-in users
CREATE TABLE public.user_wishlists (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

ALTER TABLE public.user_wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own wishlist" ON public.user_wishlists FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users insert own wishlist" ON public.user_wishlists FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users delete own wishlist" ON public.user_wishlists FOR DELETE USING (user_id = (select auth.uid()));

-- Checkout upsell products (admin-configured)
CREATE TABLE public.checkout_upsells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  display_name TEXT NOT NULL,
  price_override NUMERIC NOT NULL DEFAULT 0.99,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0
);

ALTER TABLE public.checkout_upsells ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active upsells" ON public.checkout_upsells FOR SELECT USING (active);

-- Seed 6 upsell products (placeholder SKUs — update with real ones later)
INSERT INTO public.checkout_upsells (sku, display_name, price_override, sort_order) VALUES
  ('stng16', 'STNG Berry Seltzer', 0.99, 1),
  ('xr01', 'XR Catch Mint', 0.99, 2),
  ('vel01', 'VELO Freeze Max', 0.99, 3),
  ('zyn01', 'ZYN Cool Mint', 0.99, 4),
  ('loop01', 'LOOP Mint Mania', 0.99, 5),
  ('cuba01', 'Cuba Banana', 0.99, 6);
```

- [ ] **Step 2: Verify tables exist**

Run: `execute_sql` — `SELECT count(*) FROM public.checkout_upsells;` (expect 6)

- [ ] **Step 3: Add types to types.ts**

Add Row/Insert/Update interfaces for `user_wishlists` and `checkout_upsells` following the existing pattern in the file.

- [ ] **Step 4: Write migration file locally + commit**

```bash
git add supabase/migrations/20260324210000_shopping_ux.sql src/integrations/supabase/types.ts
git commit -m "feat: add user_wishlists and checkout_upsells tables"
```

---

### Task 2: Recently Viewed Hook + Component

**Files:**
- Create: `src/hooks/useRecentlyViewed.ts`
- Create: `src/components/shop/RecentlyViewed.tsx`

- [ ] **Step 1: Create useRecentlyViewed hook**

localStorage key: `snusfriend_recently_viewed`. Stores array of product IDs (max 20). Hook:
- `addViewed(productId)` — prepends ID, dedupes, trims to 20
- `products` — fetches product data from Supabase for stored IDs
- `clearHistory()` — clears localStorage
- Uses React Query to fetch product data for the IDs

- [ ] **Step 2: Create RecentlyViewed component**

Horizontal scroll carousel of product cards. Uses existing product card component pattern. Props: `products`, `title` (default "Recently Viewed"). Hidden when products array is empty.

- [ ] **Step 3: Run `bun run build`**
- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRecentlyViewed.ts src/components/shop/RecentlyViewed.tsx
git commit -m "feat: add recently viewed products hook and carousel"
```

---

### Task 3: Wire Recently Viewed to Pages

**Files:**
- Modify: `src/pages/ProductDetail.tsx` — call `addViewed(product.id)` in useEffect
- Modify: `src/pages/HomePage.tsx` — add RecentlyViewed carousel below bestsellers

- [ ] **Step 1: Track views on ProductDetail**

Read `src/pages/ProductDetail.tsx`. Add `useEffect` that calls `addViewed(product.id)` when product loads. Use the hook from Task 2.

- [ ] **Step 2: Show carousel on HomePage**

Read `src/pages/HomePage.tsx`. Add `<RecentlyViewed />` section below the bestsellers section. Only renders when user has viewed products.

- [ ] **Step 3: Run `bun run build`**
- [ ] **Step 4: Commit**

```bash
git add src/pages/ProductDetail.tsx src/pages/HomePage.tsx
git commit -m "feat: track recently viewed on product pages, show carousel on homepage"
```

---

### Task 4: Wishlist Hook

**Files:**
- Create: `src/hooks/useWishlist.ts`

- [ ] **Step 1: Create useWishlist hook**

Dual-layer storage:
- **Anonymous:** localStorage key `snusfriend_wishlist` (array of product IDs)
- **Logged-in:** `user_wishlists` Supabase table

Hook returns:
- `wishlistIds: string[]` — all wishlisted product IDs
- `isWishlisted(productId): boolean`
- `toggleWishlist(productId): void` — add or remove
- `count: number`
- `products` — full product data for wishlist page

On login detection (auth state change), merge localStorage items into Supabase, then clear localStorage.

- [ ] **Step 2: Run `bun run build`**
- [ ] **Step 3: Commit**

```bash
git add src/hooks/useWishlist.ts
git commit -m "feat: add wishlist hook with localStorage + Supabase sync"
```

---

### Task 5: Wishlist UI — Heart Icons + Page

**Files:**
- Modify: `src/components/product/ProductCard.tsx` — wire heart icon to wishlist
- Create: `src/pages/WishlistPage.tsx`
- Modify: `src/App.tsx` — add /wishlist route

- [ ] **Step 1: Wire heart icon on ProductCard**

Read `src/components/product/ProductCard.tsx`. Find the existing heart/wishlist button. Wire it to `useWishlist().toggleWishlist(product.id)`. Fill heart when `isWishlisted(product.id)`.

- [ ] **Step 2: Create WishlistPage**

Grid of wishlisted products using existing product card component. "Add to Cart" button per item. Empty state: "No favorites yet". Link in header utility bar with badge count.

- [ ] **Step 3: Add route to App.tsx**

Add `<Route path="/wishlist" element={<WishlistPage />} />`.

- [ ] **Step 4: Run `bun run build`**
- [ ] **Step 5: Commit**

```bash
git add src/components/product/ProductCard.tsx src/pages/WishlistPage.tsx src/App.tsx
git commit -m "feat: wire wishlist heart icons, add /wishlist page"
```

---

### Task 6: Product Recommendations

**Files:**
- Create: `src/hooks/useRecommendations.ts`
- Modify: `src/pages/ProductDetail.tsx`

- [ ] **Step 1: Create useRecommendations hook**

Takes current product object. Fetches recommendations:
1. Same brand, different product (max 2)
2. Same flavor_key, different brand (max 2)
3. If fewer than 4 results, fill with popular products in same strength range

Returns `{ recommendations, isLoading }`.

- [ ] **Step 2: Add recommendations section to ProductDetail**

Read `src/pages/ProductDetail.tsx`. Add "You might also like" section between product info and reviews. 4-product horizontal scroll using existing card component.

- [ ] **Step 3: Run `bun run build`**
- [ ] **Step 4: Commit**

```bash
git add src/hooks/useRecommendations.ts src/pages/ProductDetail.tsx
git commit -m "feat: add product recommendations on detail pages"
```

---

### Task 7: Bundle Builder Page

**Files:**
- Create: `src/pages/BundleBuilder.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create BundleBuilder page**

Full-page experience:
1. **Size selector:** 3-pack (5% off), 5-pack (10% off), 10-pack (15% off) — use shadcn RadioGroup or ToggleGroup
2. **Product browser:** Search/filter existing products. Uses existing product data hooks.
3. **Bundle slots:** Visual grid showing filled/empty positions with product images
4. **Running total:** Shows original price, discount amount, final price
5. **"Add Bundle to Cart" button:** Adds individual items to cart with `bundle_id` and `bundle_discount` in item metadata

- [ ] **Step 2: Add route to App.tsx**

Add `<Route path="/bundle-builder" element={<BundleBuilder />} />`. Add navigation link.

- [ ] **Step 3: Run `bun run build`**
- [ ] **Step 4: Commit**

```bash
git add src/pages/BundleBuilder.tsx src/App.tsx
git commit -m "feat: add build-your-own bundle page with tiered discounts"
```

---

### Task 8: Checkout Upsell Component

**Files:**
- Create: `src/components/shop/CheckoutUpsell.tsx`
- Modify: `src/pages/CheckoutHandoff.tsx`

- [ ] **Step 1: Create CheckoutUpsell component**

Fetches active upsells from `checkout_upsells` table. Shows 6 products at override price (99 cents). Toggle/checkbox per item, max 3 selectable. Updates parent's upsell state.

Props: `onUpsellChange: (items: UpsellItem[]) => void`

- [ ] **Step 2: Wire into CheckoutHandoff**

Read `src/pages/CheckoutHandoff.tsx`. Add `<CheckoutUpsell />` between the cart summary and the "Place Order" button. Selected upsells get added to the order's line items with override prices.

- [ ] **Step 3: Run `bun run build`**
- [ ] **Step 4: Commit**

```bash
git add src/components/shop/CheckoutUpsell.tsx src/pages/CheckoutHandoff.tsx
git commit -m "feat: add 99-cent checkout upsell section"
```

---

### Task 9: Reorder Button

**Files:**
- Create: `src/hooks/useReorder.ts`
- Create: `src/components/shop/ReorderButton.tsx`
- Modify: `src/pages/AccountPage.tsx`

- [ ] **Step 1: Create useReorder hook**

Takes `lineItemsSnapshot` (from order). Returns `{ reorder, isReordering }`. The `reorder()` function:
1. Parses line items for SKUs
2. Fetches current products matching those SKUs
3. Adds matched items to cart via CartContext
4. Returns { added: number, unavailable: number }

- [ ] **Step 2: Create ReorderButton component**

Button that calls `reorder()`, shows loading state, then toast with result ("3 of 4 items added to cart"). Navigates to /cart on success.

- [ ] **Step 3: Add to AccountPage order rows**

Read `src/pages/AccountPage.tsx`. Add `<ReorderButton />` to each order row in the Orders tab.

- [ ] **Step 4: Run `bun run build`**
- [ ] **Step 5: Commit**

```bash
git add src/hooks/useReorder.ts src/components/shop/ReorderButton.tsx src/pages/AccountPage.tsx
git commit -m "feat: add reorder button on past orders"
```

---

### Task 10: Final Build + Push

**Files:** None new — verification only.

- [ ] **Step 1: Run `bun run build`**

Verify zero TypeScript errors.

- [ ] **Step 2: Full commit + push**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
feat: Shopping UX — recently viewed, wishlist, recommendations, bundles, upsells, reorder

Database:
- user_wishlists table for logged-in wishlist sync
- checkout_upsells table with 6 seed products at €0.99

Frontend:
- Recently viewed products (localStorage, carousel on homepage + PDP)
- Wishlist with heart toggle (localStorage + Supabase sync on login)
- /wishlist page with saved products
- "You might also like" recommendations on product pages
- /bundle-builder with tiered discounts (5%/10%/15%)
- Checkout upsell section (99-cent add-ons, max 3)
- Reorder button on past orders in Account page

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

- [ ] **Step 3: Verify Vercel deployment**
- [ ] **Step 4: Check runtime logs for errors**
