# Wave 2: SEO/Conversion Advantage — Design Spec

**Date:** 2026-04-10
**Goal:** Improve conversion rate and SEO quality across brand pages, product discovery, and content modules.

---

## 2A. Brand Page Identity — Product Cans as Hero

**Problem:** Brand pages open with a plain letter-circle monogram (e.g., "Z" for ZYN). Feels generic.

**Solution:** Use the existing product image mosaic as the hero identity. The page already renders a 5-product mosaic grid at the top — enlarge it, add the brand-colored gradient backdrop, and make the first 3-5 product cans the visual "logo" of the brand.

**Changes:**
- Remove the letter-circle monogram fallback in `src/pages/brands/[slug].astro`
- Enlarge the mosaic grid from thumbnail size to hero size
- Add brand-colored gradient overlay behind the mosaic
- The brand name in large type overlays the mosaic

**No external assets needed.** Product images from the catalog ARE the brand identity.

---

## 2B. Flavour Quiz → ProductCard Results

**Problem:** `FlavorQuizIsland.tsx` uses its own custom result cards that look different from the catalog grid cards. Misses the conversion opportunity.

**Solution:** Replace quiz result cards with the same `ProductCard` component used in `FilterableProductGrid`. When the quiz completes, render 3-5 matching products as real cards with prices, add-to-cart buttons, and full styling.

**Changes:**
- `src/components/react/FlavorQuizIsland.tsx` — replace the result rendering section
- Import the React `ProductCard` component (already exists at `src/components/react/ProductCard.tsx`)
- Match quiz answers to products using the existing filtering logic (`strengthKey`, `flavorKey`)
- Result section shows: "Your perfect pouches" heading + 3-5 ProductCards in a grid

**Data flow:** Quiz answers → filter products by strength + flavor preference → sort by popularity → take top 5 → render as ProductCards

---

## 2C. Blog Product Module Upgrade

**Problem:** `BlogProductCard.astro` is visually weaker than the main `ProductCard.astro` — missing price, strength dots, flavor badge, and add-to-cart.

**Solution:** Enrich `BlogProductCard.astro` to include the key purchase signals from the main card.

**Changes to `src/components/astro/BlogProductCard.astro`:**
- Add price display (€X.XX from `product.data.prices.pack1`)
- Add strength dots (1-5, colored by strength level)
- Add flavor badge pill
- Add `CardAddToCart client:visible` for add-to-cart functionality
- Keep the card compact (it sits inside article prose, not a full grid)

**Reuse:** Import `strengthColors`, `flavorColors` from `src/data/brand-colors.ts` (same as main ProductCard)

---

## 2D. Contextual Product Suggestions on PDP

**Problem:** `RecommendationsIsland.tsx` exists but isn't surfaced prominently enough. No "same flavour, cheaper" or "same strength, different format" rows.

**Solution:** Add labeled suggestion rows below the main product on PDP pages.

**Changes to `src/pages/products/[slug].astro`:**
- After the main product section, add 2 suggestion rows:
  1. "Same flavour, different brand" — products matching the same `flavorKey` from other brands
  2. "Similar strength, better value" — products in the same `strengthKey` bracket, sorted by price ascending
- Each row: horizontal scroll of 4-6 `ProductCard.astro` cards
- Data available at build time from `getCollection('products')` — no new API needed

**Reuse:** The `relatedProducts` prop already exists in the page's `getStaticPaths` — extend it with the new filtered sets.

---

## 2E. Membership Page Premium Feel

**Problem:** Membership page reads like a feature list, not an aspirational club page.

**Solution:** Restructure with a premium visual hierarchy.

**Changes to `src/pages/membership.astro`:**
- Hero: large "The Circles" heading with a visual tier progression (horizontal dots/line showing Explorer → Founder)
- Each tier gets its own card with the tier color, perks list, and "You're here" indicator for logged-in users
- Add a "Your Journey" progress section for authenticated users showing current tier, next tier, and coins needed
- For logged-out users: the existing preview (already implemented) with CTA

**Tone:** Airline lounge, not arcade. Status-driven, not points-driven.

---

## Files Modified

| File | Change |
|------|--------|
| `src/pages/brands/[slug].astro` | Hero mosaic enlargement, remove monogram |
| `src/components/react/FlavorQuizIsland.tsx` | Replace result cards with ProductCard |
| `src/components/astro/BlogProductCard.astro` | Add price, strength dots, flavor badge, add-to-cart |
| `src/pages/products/[slug].astro` | Add suggestion rows |
| `src/pages/membership.astro` | Premium visual restructure |

## Success Criteria

- Brand pages feel visually distinctive (no generic monograms)
- Quiz completion shows real ProductCards with add-to-cart
- Blog product cards show prices and purchase signals
- PDP has 2 relevant suggestion rows
- Membership page feels aspirational, not feature-listy
