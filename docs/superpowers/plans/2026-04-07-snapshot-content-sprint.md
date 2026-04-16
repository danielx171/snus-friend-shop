# Snapshot Contract + Content Integration Sprint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the broken `line_items_snapshot` contract so all order-related features work correctly, then integrate pending Cowork content (blog product cards, reduction guide cards, SVG cleanup).

**Architecture:** Define a single canonical `LineItemSnapshot` TypeScript interface. Update all 6 consumers to use it with no fallback chains (no real orders exist yet). Then add `BlogProductCard` components to 24 blog articles and the reduction guide using the established `find(slug)` pattern.

**Tech Stack:** Astro 6, TypeScript, Supabase Edge Functions (Deno), React islands, nanostores

**Spec:** `docs/superpowers/specs/2026-04-07-snapshot-content-sprint-design.md`

---

## Task 1: Define Canonical LineItemSnapshot Interface

**Files:**
- Create: `src/types/order.ts`

- [ ] **Step 1: Create the type file**

```ts
// src/types/order.ts

/**
 * Canonical shape for items stored in orders.line_items_snapshot.
 * All producers MUST write this shape. All consumers MUST read these field names.
 * No fallback chains — if a field is missing, it's a bug in the producer.
 */
export interface LineItemSnapshot {
  sku: string;
  slug: string;
  product_name: string;
  brand: string;
  image_url: string;
  pack_label: string;
  unit_price: number;
  quantity: number;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && npx tsc --noEmit src/types/order.ts 2>&1 || echo "Check with astro instead" && bun run check 2>&1 | tail -5`

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/types/order.ts
git commit -m "feat: add canonical LineItemSnapshot interface"
```

---

## Task 2: Fix order-confirmation.astro

**Files:**
- Modify: `src/pages/order-confirmation.astro` (lines ~97-156)

- [ ] **Step 1: Remove fallback chains in subtotal computation**

Find and replace the subtotal computation (around line 97-101):

```astro
// OLD
const subtotal = lineItems.reduce((sum: number, item: any) => {
  const price = item.price ?? item.unit_price ?? 0;
  const qty = item.quantity ?? 1;
  return sum + (price * qty);
}, 0);
```

Replace with:

```astro
// NEW
const subtotal = lineItems.reduce((sum: number, item: any) => {
  return sum + (item.unit_price * item.quantity);
}, 0);
```

- [ ] **Step 2: Remove fallback chains in item rendering**

Find and replace the item property access (around lines 152-156):

```astro
// OLD
{lineItems.map((item: any) => {
  const itemName = item.name ?? item.product_name ?? 'Product';
  const itemPrice = item.price ?? item.unit_price ?? 0;
  const itemQty = item.quantity ?? 1;
  const itemImage = item.image_url ?? item.imageUrl ?? null;
```

Replace with:

```astro
// NEW
{lineItems.map((item: any) => {
  const itemName = item.product_name;
  const itemPrice = item.unit_price;
  const itemQty = item.quantity;
  const itemImage = item.image_url;
```

- [ ] **Step 3: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/pages/order-confirmation.astro
git commit -m "fix: order-confirmation uses canonical snapshot fields"
```

---

## Task 3: Fix push-order-to-nyehandel Edge Function

**Files:**
- Modify: `supabase/functions/push-order-to-nyehandel/index.ts` (lines ~256-264)

- [ ] **Step 1: Fix email line items mapping**

Find and replace the email line items block (around lines 256-264):

```typescript
// OLD
const lineItems = (Array.isArray(order.line_items_snapshot) ? order.line_items_snapshot as LineItem[] : []).map((item: LineItem) => ({
  name: (item as Record<string, unknown>).product_name as string ?? item.sku ?? "Product",
  qty: item.quantity ?? 1,
  price: `€${(typeof (item as Record<string, unknown>).unit_price === 'number'
    ? ((item as Record<string, unknown>).unit_price as number)
    : typeof (item as Record<string, unknown>).price === 'number'
    ? ((item as Record<string, unknown>).price as number)
    : 0).toFixed(2)}`,
}));
```

Replace with:

```typescript
// NEW
const lineItems = (Array.isArray(order.line_items_snapshot) ? order.line_items_snapshot as LineItem[] : []).map((item: LineItem) => ({
  name: (item as Record<string, unknown>).product_name as string ?? "Product",
  qty: item.quantity ?? 1,
  price: `€${((item as Record<string, unknown>).unit_price as number ?? 0).toFixed(2)}`,
}));
```

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/push-order-to-nyehandel/index.ts
git commit -m "fix: NYE push uses canonical snapshot fields (product_name, unit_price)"
```

---

## Task 4: Fix send-review-request-emails Edge Function

**Files:**
- Modify: `supabase/functions/send-review-request-emails/index.ts` (lines ~48-56)

- [ ] **Step 1: Remove fallback chains**

Find and replace (around lines 51-55):

```typescript
// OLD
const productName = firstItem.product_name || firstItem.name || "your recent purchase";
const productSlug = firstItem.slug || firstItem.product_id || "";
const productImageUrl = firstItem.image_url || firstItem.imageUrl || "";
```

Replace with:

```typescript
// NEW
const productName = firstItem.product_name || "your recent purchase";
const productSlug = firstItem.slug || "";
const productImageUrl = firstItem.image_url || "";
```

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/send-review-request-emails/index.ts
git commit -m "fix: review emails use canonical snapshot fields"
```

---

## Task 5: Fix useOrders Hook

**Files:**
- Modify: `src/hooks/useOrders.ts` (lines ~38-51)

- [ ] **Step 1: Remove fallback chains in snapshot mapping**

Find and replace (around lines 43-49):

```typescript
// OLD
items.push({
  slug: item.slug ?? item.product_slug ?? item.sku ?? '',
  name: item.name ?? item.product_name ?? '',
  brand: item.brand ?? '',
  quantity: item.quantity ?? 1,
});
```

Replace with:

```typescript
// NEW
items.push({
  slug: item.slug,
  name: item.product_name,
  brand: item.brand,
  quantity: item.quantity,
});
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useOrders.ts
git commit -m "fix: useOrders uses canonical snapshot fields directly"
```

---

## Task 6: Fix useProductReviews Hook

**Files:**
- Modify: `src/hooks/useProductReviews.ts` (lines ~148-153)

- [ ] **Step 1: Simplify verified buyer check to use slug only**

Find and replace (around lines 149-152):

```typescript
// OLD
const hasProduct = items.some(
  (item: Record<string, unknown>) =>
    item && (item.slug === productId || item.product_id === productId || item.id === productId),
);
```

Replace with:

```typescript
// NEW
const hasProduct = items.some(
  (item: Record<string, unknown>) =>
    item && item.slug === productId,
);
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useProductReviews.ts
git commit -m "fix: verified buyer check uses canonical slug field"
```

---

## Task 7: Delete Dead Blog SVGs

**Files:**
- Delete: `public/images/blog/*.svg` (already deleted in working tree)

- [ ] **Step 1: Verify no illustrationSrc references remain**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && grep -r "illustrationSrc" src/pages/blog/ 2>/dev/null; echo "Exit: $?"`

Expected: No matches (already cleaned up)

- [ ] **Step 2: Stage and commit the SVG deletions**

```bash
git add public/images/blog/
git commit -m "chore: remove AI-generated blog SVG illustrations"
```

---

## Task 8: Add BlogProductCards to 24 Blog Articles

**Files:**
- Modify: 24 files in `src/pages/blog/` (list below)
- Reference: `cowork/content/blog-product-card-selections.json`

The pattern for every file is identical:

1. If the file doesn't already import `BlogProductCard` and `getCollection`, add them
2. If the file doesn't have a `find()` helper, add it
3. Insert a product card grid at the appropriate location in the article

- [ ] **Step 1: Verify [VERIFY] slugs for Nordic Spirit and Pablo**

Run:
```bash
cd /Users/Daniel/Projects/snus-friend-shop
# Check Nordic Spirit slugs
grep -r '"nordic-spirit' src/data/brand-descriptions.ts src/content.config.ts 2>/dev/null
# Search for actual Nordic Spirit product IDs in the content collection
node -e "
const fs = require('fs');
const glob = require('glob');
// Check if there's a products data source
" 2>/dev/null || echo "Check via build"

# Better: search the actual product data
grep -ri "nordic-spirit" src/data/ 2>/dev/null | head -20
```

If Nordic Spirit and Pablo slugs can't be verified, skip those 2 articles (articles 19 and 23 in the JSON) and add a TODO comment.

- [ ] **Step 2: For each of the 24 articles, apply this pattern**

For articles that already have `BlogProductCard` imported and `find()` defined (check first!), only add the card grid. For articles that don't, add the full setup.

**Add to frontmatter (if not already present):**
```astro
import BlogProductCard from '@/components/astro/BlogProductCard.astro';
import { getCollection } from 'astro:content';

const allProducts = await getCollection('products');
const find = (slug: string) => allProducts.find(p => p.id === slug);
```

**Add card grid at bottom of article (before FAQ section if one exists):**
```astro
<h2>Recommended Products</h2>
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-8">
  {find('slug-1') && <BlogProductCard product={find('slug-1')} />}
  {find('slug-2') && <BlogProductCard product={find('slug-2')} />}
  {find('slug-3') && <BlogProductCard product={find('slug-3')} />}
  {find('slug-4') && <BlogProductCard product={find('slug-4')} />}
</div>
```

**Full article list (from blog-product-card-selections.json):**

| # | Article file | Slugs |
|---|-------------|-------|
| 1 | best-nicotine-pouches-2026.astro | zyn-cool-mint-ice-slim-s6, velo-crispy-peppermint-es, white-fox-double-mint, loop-jalapeno-lime-mini, skruf-fresh-mint-s4, helwit-menthol-strong |
| 2 | best-nicotine-pouches-for-beginners-2026.astro | zyn-gentle-mint-mini-s1, zyn-spearmint-mini, velo-bright-spearmint-mini-es, helwit-blueberry-medium, on-mint, velo-bright-peppermint-zero |
| 3 | best-mint-nicotine-pouches-2026.astro | white-fox-double-mint, velo-crispy-peppermint-es, skruf-fresh-mint-s4, zyn-cool-mint-ice-slim-s6, loop-fresh-peppermint-hyper, velo-green-spearmint |
| 4 | best-berry-nicotine-pouches.astro | zyn-red-fruits-fizz-slim-s4, velo-blue-raspberry, velo-dark-blackcurrant, helwit-acai-slim, skruf-purple-cassic-s3, loop-blueberry-ice-strong |
| 5 | best-citrus-nicotine-pouches.astro | zyn-citrus-slim-extra-strong, velo-lime-flame, velo-arctic-grapefruit-normal, zyn-lemon-spritz-slim, loop-jalapeno-lime-mini |
| 6 | best-strong-nicotine-pouches.astro | white-fox-full-charge, loop-habanero-mint-hyper-strong, siberia-slim, zyn-cool-mint-ice-slim-s6, velo-freezing-peppermint-ultra-es, skruf-intense-peppermint-ice-s4 |
| 7 | best-slim-nicotine-pouches.astro | zyn-cool-mint-ice-slim-s6, velo-crispy-peppermint-es, loop-smooth-mint-extra-strong, skruf-frozen-mint-superslim-s4, white-fox-peppered-mint, helwit-menthol-strong |
| 8 | best-budget-nicotine-pouches.astro | helwit-blueberry-medium, helwit-menthol-strong, on-mint-strong, skruf-aloe-fresh-s2, velo-green-spearmint |
| 9 | best-nicotine-pouches-for-quitting-smoking.astro | zyn-citrus-slim-extra-strong, velo-crispy-peppermint-es, on-mint-extra-strong, loop-smooth-mint-extra-strong, zyn-gentle-mint-mini-s1 |
| 10 | best-nicotine-pouches-for-women.astro | zyn-gentle-mint-mini-s1, velo-bright-spearmint-mini-es, helwit-acai-slim, on-mint, zyn-lemon-spritz-slim |
| 11 | best-nicotine-pouches-all-day-use.astro | zyn-cool-mint-ice-slim-s6, velo-green-spearmint, skruf-fresh-mint-s4, helwit-menthol-strong, loop-smooth-mint-extra-strong |
| 12 | best-nicotine-pouches-no-aftertaste.astro | zyn-gentle-mint-mini-s1, helwit-blueberry-medium, velo-bright-spearmint-mini-es, on-mint, skruf-aloe-fresh-s2 |
| 13 | top-10-mint-flavours.astro | zyn-cool-mint-ice-slim-s6, velo-crispy-peppermint-es, loop-fresh-peppermint-hyper, white-fox-double-mint, skruf-frozen-mint-superslim-s4, helwit-menthol-strong |
| 14 | strongest-nicotine-pouches-ranked-2026.astro | siberia-slim, white-fox-full-charge, loop-red-chili-melon-hyper-strong, loop-habanero-mint-hyper-strong, velo-freezing-peppermint-ultra-es, white-fox-black-edition |
| 15 | strongest-snus-brands-compared-beginners-warning.astro | siberia-slim, siberia-portion, white-fox-full-charge, loop-spicy-apple-hyper-strong, skruf-intense-peppermint-ice-s4 |
| 16 | zyn-nicotine-pouches-complete-guide.astro | ALREADY HAS CARDS — skip |
| 17 | velo-nicotine-pouches-complete-guide.astro | velo-crispy-peppermint-es, velo-blue-raspberry, velo-lime-flame, velo-bright-spearmint-mini-es |
| 18 | loop-nicotine-pouches-complete-guide.astro | loop-jalapeno-lime-mini, loop-fresh-peppermint-hyper, loop-red-chili-melon-hyper-strong, loop-creamy-cappuccino-mini |
| 19 | nordic-spirit-nicotine-pouches-complete-guide.astro | [VERIFY] — skip if slugs don't match catalog |
| 20 | on-nicotine-pouches-complete-guide.astro | on-mint, on-mint-strong, on-mint-extra-strong, on-coffee-strong |
| 21 | skruf-nicotine-pouches-complete-guide.astro | skruf-fresh-mint-s4, skruf-nordic-liqourice-s4, skruf-frozen-mint-superslim-s4, skruf-purple-cassic-s3 |
| 22 | white-fox-nicotine-pouches-complete-guide.astro | white-fox-double-mint, white-fox-full-charge, white-fox-peppered-mint, white-fox-black-edition |
| 23 | pablo-nicotine-pouches-complete-guide.astro | [VERIFY] — skip if slugs don't match catalog |
| 24 | siberia-nicotine-pouches-complete-guide.astro | siberia-slim, siberia-portion, siberia-all-white-mini, siberia-super-slim |

- [ ] **Step 3: Check that some already have cards and skip those**

Before modifying each file, check:
```bash
grep -l "BlogProductCard" src/pages/blog/<filename>.astro
```

If the file already imports BlogProductCard, check whether it already has the slugs from the JSON. If yes, skip. If it has cards but different slugs, add the missing ones.

- [ ] **Step 4: Verify build after all changes**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -20`

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add BlogProductCard components to 22+ blog articles"
```

---

## Task 9: Add BlogProductCards to Reduction Guide

**Files:**
- Modify: `src/pages/nicotine-reduction-guide.astro`

- [ ] **Step 1: Add imports to frontmatter (if not present)**

Add after existing imports:

```astro
import BlogProductCard from '@/components/astro/BlogProductCard.astro';
import { getCollection } from 'astro:content';

const allProducts = await getCollection('products');
const find = (slug: string) => allProducts.find(p => p.id === slug);
```

- [ ] **Step 2: Replace Tier 1 text links with cards**

Find (around lines 173-188):
```astro
<ul>
  <li><a href="/brands/siberia">Siberia Slim</a> (43 mg/g)</li>
  <li><a href="/brands/white-fox">White Fox Full Charge</a> (16.5 mg)</li>
  <li><a href="/brands/loop">LOOP Habanero Mint Hyper Strong</a> (15 mg)</li>
</ul>
```

Replace with:
```astro
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
  {find('siberia-slim') && <BlogProductCard product={find('siberia-slim')} />}
  {find('white-fox-full-charge') && <BlogProductCard product={find('white-fox-full-charge')} />}
  {find('loop-habanero-mint-hyper-strong') && <BlogProductCard product={find('loop-habanero-mint-hyper-strong')} />}
</div>
```

- [ ] **Step 3: Replace Tier 2 text links with cards**

Find (around lines 199-206):
```astro
<ul>
  <li><a href="/brands/zyn">ZYN Black Cherry Mini S4</a> (9.5 mg)</li>
  <li><a href="/brands/velo">VELO Crispy Peppermint Extra Strong</a> (9.8 mg)</li>
  <li><a href="/brands/loop">LOOP Jalapeno Lime Strong</a> (9.4 mg)</li>
</ul>
```

Replace with:
```astro
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
  {find('zyn-cool-mint-ice-slim-s6') && <BlogProductCard product={find('zyn-cool-mint-ice-slim-s6')} />}
  {find('velo-crispy-peppermint-es') && <BlogProductCard product={find('velo-crispy-peppermint-es')} />}
  {find('loop-jalapeno-lime-mini') && <BlogProductCard product={find('loop-jalapeno-lime-mini')} />}
</div>
```

Note: The Cowork brief suggested ZYN Black Cherry but that slug may not exist. Use verified slugs from the product card selections JSON instead. The `find()` conditional pattern means missing slugs just won't render — no crash.

- [ ] **Step 4: Replace Tier 3 text links with cards**

```astro
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
  {find('zyn-cool-mint-ice-slim-s6') && <BlogProductCard product={find('zyn-cool-mint-ice-slim-s6')} />}
  {find('skruf-fresh-mint-s4') && <BlogProductCard product={find('skruf-fresh-mint-s4')} />}
  {find('velo-green-spearmint') && <BlogProductCard product={find('velo-green-spearmint')} />}
</div>
```

- [ ] **Step 5: Replace Tier 4 text links with cards**

```astro
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
  {find('zyn-gentle-mint-mini-s1') && <BlogProductCard product={find('zyn-gentle-mint-mini-s1')} />}
  {find('helwit-blueberry-medium') && <BlogProductCard product={find('helwit-blueberry-medium')} />}
  {find('on-mint') && <BlogProductCard product={find('on-mint')} />}
</div>
```

- [ ] **Step 6: Replace Tier 5 text links with cards**

```astro
<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
  {find('velo-bright-peppermint-zero') && <BlogProductCard product={find('velo-bright-peppermint-zero')} />}
</div>
```

Note: Only 1 card for Tier 5 because zero-nicotine products may have limited slugs. The `find()` guard handles missing products gracefully.

- [ ] **Step 7: Verify build**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run check 2>&1 | tail -10`

Expected: No errors

- [ ] **Step 8: Commit**

```bash
git add src/pages/nicotine-reduction-guide.astro
git commit -m "feat: replace text product links with BlogProductCard in reduction guide"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full build check**

Run: `cd /Users/Daniel/Projects/snus-friend-shop && bun run build 2>&1 | tail -30`

Expected: Build succeeds with no errors

- [ ] **Step 2: Verify snapshot contract — grep for old field patterns**

Run:
```bash
cd /Users/Daniel/Projects/snus-friend-shop
# Should find ZERO matches for old field names in snapshot consumers
grep -n "item\.name\b" src/pages/order-confirmation.astro src/hooks/useOrders.ts 2>/dev/null
grep -n "item\.price\b" src/pages/order-confirmation.astro supabase/functions/push-order-to-nyehandel/index.ts 2>/dev/null
grep -n "item\.product_id\|item\.id" src/hooks/useProductReviews.ts 2>/dev/null
grep -n "item\.imageUrl" src/pages/order-confirmation.astro supabase/functions/send-review-request-emails/index.ts 2>/dev/null
echo "---"
echo "All checks above should return empty (no matches)"
```

- [ ] **Step 3: Verify BlogProductCard coverage**

Run:
```bash
cd /Users/Daniel/Projects/snus-friend-shop
echo "Blog pages WITH BlogProductCard:"
grep -rl "BlogProductCard" src/pages/blog/ | wc -l
echo "Blog pages total:"
ls src/pages/blog/*.astro | wc -l
```

Expected: ~54+ out of 63 blog pages now have product cards

- [ ] **Step 4: Commit any remaining changes and tag**

```bash
git add -A
git status
# If there are unstaged changes, commit them
git commit -m "chore: final verification pass for snapshot + content sprint"
```
