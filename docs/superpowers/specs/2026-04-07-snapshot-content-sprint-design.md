# Sprint Design: Snapshot Contract Fix + Content Integration

**Date:** 2026-04-07
**Branch:** astro-migration-clean
**Scope:** Code fix (snapshot contract) + content integration (Cowork deliverables) + Cowork next-batch brief

---

## Phase 1: Snapshot Contract Fix

### Problem

The `line_items_snapshot` JSON stored in the `orders` table has no canonical shape. The CheckoutForm writes one set of field names, but 6 consumers read different names — causing silent failures across order confirmation, NYE fulfillment, review emails, verified badges, and quest progress.

### Current State (what CheckoutForm stores)

```ts
{ sku, slug, product_name, brand, pack_label, unit_price, quantity, image_url }
```

### Mismatches by Consumer

| Consumer | Reads | Should Read | Impact |
|----------|-------|-------------|--------|
| `order-confirmation.astro` | `item.name`, `item.price`, `item.imageUrl` | `item.product_name`, `item.unit_price`, `item.image_url` | Broken product names, prices, thumbnails |
| `push-order-to-nyehandel/index.ts` | `item.price`, maps `name: item.sku` | `item.unit_price`, `item.product_name` | NYE receives SKU as product name, €0.00 prices |
| `send-review-request-emails/index.ts` | `firstItem.name`, `firstItem.slug` | `firstItem.product_name`, `firstItem.slug` | Review emails show undefined product names |
| `useOrders.ts` | Fallback chains: `slug || product_slug || sku` | `item.slug` directly | Works but fragile |
| `useProductReviews.ts` | `item.product_id || item.id` | `item.slug` | Verified buyer badges never match |
| `update-quest-progress/index.ts` | `item.brand` (correct) | `item.brand` | Already correct |

### Solution

Since no real orders exist yet, no backward compatibility needed.

1. **Define canonical interface** in `src/types/order.ts`:

```ts
export interface LineItemSnapshot {
  sku: string
  slug: string
  product_name: string
  brand: string
  image_url: string
  pack_label: string
  unit_price: number
  quantity: number
}
```

2. **Update all 6 consumers** to use canonical field names directly (no fallbacks).

### Files to Modify

| File | Change |
|------|--------|
| `src/types/order.ts` | New file — canonical `LineItemSnapshot` interface |
| `src/pages/order-confirmation.astro` | Use `product_name`, `unit_price`, `image_url` |
| `supabase/functions/push-order-to-nyehandel/index.ts` | Use `product_name` for name, `unit_price` for price |
| `supabase/functions/send-review-request-emails/index.ts` | Use `product_name`, `slug`, `image_url` |
| `src/hooks/useOrders.ts` | Remove fallback chains, use `slug`, `product_name` directly |
| `src/hooks/useProductReviews.ts` | Use `item.slug` for verified buyer matching |

### What This Unblocks

- Order confirmation page shows real product names, prices, thumbnails
- Nyehandel receives correct product names and prices
- Review request emails link to correct products
- Verified buyer badges actually work
- Product recommendations based on order history

---

## Phase 2: Content Integration

### 2a. Blog Product Cards (24 articles)

Add `BlogProductCard` components to 24 blog articles using verified slugs from `cowork/content/blog-product-card-selections.json`.

- 22 articles have confirmed slugs ready to use
- 2 articles (Nordic Spirit, Pablo) have `[VERIFY]` flags — verify against catalog before integrating
- Pattern: use existing `find()` + `<BlogProductCard>` pattern already established in 32 other blog pages

### 2b. Reduction Guide Product Cards

Current `nicotine-reduction-guide.astro` has product recommendations as text links. Upgrade to `BlogProductCard` components for each tier's recommendations:

- Tier 1 (Heavy): 3 products
- Tier 2 (Strong): 3 products
- Tier 3 (Medium): 3 products
- Tier 4 (Light): 3 products
- Tier 5 (Zero): 3 products
- Total: 15 BlogProductCard instances

Content from Cowork's `reduction-guide-content-v2.md` should be compared with existing page content. The page already has good structure + FAQ schema; the main value-add from Cowork's v2 is the research citations and craving management tips.

### 2c. Brand Descriptions (28 brands)

Write descriptions from `cowork/content/brand-descriptions-batch.json` to brand pages. These are intro paragraphs on `/brands/[slug]` pages.

### 2d. Delete Dead SVGs + References

- Blog SVG illustrations already deleted from `public/images/blog/` in working tree
- Remove any remaining `illustrationSrc` prop references from blog pages
- Commit the deletions

---

## Phase 3: Cowork Next-Batch Brief

Separate deliverable: `cowork/content/cowork-sprint-brief-april-8.md`

Two workstreams:
1. **Country guide articles** — 5 standalone blog posts (not the existing country page data, which is already enriched)
2. **New comparison articles** — brand-vs-brand posts targeting high-intent "vs" keywords

---

## Execution Order

```
Phase 1 (snapshot contract) — pure code, highest leverage
  ↓
Phase 2d (delete SVGs) — cleanup
  ↓
Phase 2a (blog product cards) — mechanical integration
  ↓
Phase 2b (reduction guide cards) — content comparison + cards
  ↓
Phase 2c (brand descriptions) — content integration
  ↓
Phase 3 (Cowork brief) — markdown deliverable
```

---

## Success Criteria

- [ ] All 6 snapshot consumers use canonical `LineItemSnapshot` field names
- [ ] No fallback chains in snapshot readers
- [ ] 24 blog articles gain BlogProductCard components
- [ ] Reduction guide has 15 product cards across 5 tiers
- [ ] 28 brand pages have description paragraphs
- [ ] Dead SVGs and references fully removed
- [ ] Cowork brief committed and ready to send
