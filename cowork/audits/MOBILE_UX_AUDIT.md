# Mobile UX Deep Audit — snusfriends.com

**Date:** 2026-03-29
**Device:** iPhone 14 simulation (390x844 viewport)
**Tester:** Cowork (Chrome MCP)
**Overlays bypassed:** age gate + cookie consent via localStorage

---

## Task 1: Full Buying Journey

### Step 1 — Homepage Hero
- **Status:** PASS
- Hero renders full-width, dark green gradient with white text
- Stats strip (731+ Products, 57 Brands, Free EU Shipping) visible
- Two CTAs ("Shop All Pouches", "Take the Flavour Quiz") side-by-side, good tap targets
- Brand logo carousel (ZYN, VELO, Siberia, LOOP) shows below

### Step 2 — Best Sellers Grid
- **Status:** PASS (with notes)
- Products display in 3-column grid on this 390px viewport
- Cards show image + brand + name + strength + price + Add to Cart
- **Issue:** 3-column grid is very tight on 390px — product names truncate, text is small (~10px). Consider 2-column for screens <400px
- **Issue:** Some product cards show blank/empty image areas (CLEW Blueberry, CUBA Black Apple Juice). These are lazy-loaded images that haven't scrolled into view — but the placeholder area is a plain white rectangle with no skeleton/shimmer

### Step 3 — /products Filter
- **Status:** PASS
- "Filters" button clearly visible with filter icon
- Filter drawer opens as full-height overlay with X close button
- Brand list is scrollable within the drawer
- Strength and Flavor sections accessible by scrolling
- Sticky "Show results" button at bottom — always visible
- Filter chip ("Mint ×") appears after selection with "Clear all" option
- Count badge ("Filters (1)") updates correctly

### Step 4 — Product Detail Page (PDP)
- **Status:** PASS (with notes)
- Large product image, breadcrumbs, "Popular" badge
- Mint + Normal badges, spec row (Nicotine/Portions/Format)
- Pack Pricing card with 1/3/5/10 can options — per-can prices shown
- Pack Size selector with same 1/3/5/10 options
- **Issue (P2):** Pack Pricing and Pack Size show identical data — creates confusion. Consider removing Pack Pricing card on mobile, or merging them
- Quantity selector (+/-) and "Add to Cart" button have good sizing (44px+ touch targets)
- **Issue (P1):** When user scrolls past Add to Cart button, there's no way to add to cart without scrolling back up — needs sticky bottom bar (see Task 3)

### Step 5 — Cart Drawer
- **Status:** PASS
- Opens as right-side drawer, nearly full-width on mobile
- "Your Cart (1)" header with X close
- Free shipping progress bar ("Add €15.12 more for free shipping") — great motivator
- Product thumbnail, name, 5-pack label, price
- Quantity +/- buttons inline
- "Complete your order" section with cross-sell CTAs ("Browse more pouches", "Take the flavour quiz")
- Subtotal + "View Cart" / "Checkout" buttons visible without scrolling
- Both buttons have good touch targets

### Step 6 — Checkout
- Not tested (requires auth) — visual inspection of /login page showed clean mobile form

---

## Task 2: Mobile-Specific Issues

### 1. Homepage Best Sellers Grid Layout
- **Finding:** Cards display as 3-column grid even at 390px width
- **Impact:** Medium — text is very small, names truncate
- **Recommendation:** Switch to 2-column grid below 400px (`sm:grid-cols-3 grid-cols-2`)
- **Priority:** P1

### 2. Product Images Loading
- **Finding:** Some product images show blank white rectangles before loading. Images use `loading="lazy"` which means offscreen images show nothing until scrolled near
- **Impact:** Low-Medium — affects perceived quality
- **Recommendation:** Add CSS shimmer/skeleton placeholder matching the brand-colored gradient backgrounds already in ProductCard
- **Priority:** P2

### 3. Footer Padding
- **Finding:** CONFIRMED — Footer container has 0px left/right padding on mobile. Text ("SnusFriend", "Premium Nicotine Pouches", all link columns) flush to left edge
- **Impact:** High — looks broken/unprofessional
- **Root cause:** The `container` class in Tailwind v4 doesn't include `px-4` by default. The `.container` in the footer needs explicit `px-4`
- **Fix:** Already addressed in code — Footer.astro now has `class="container px-4"` on the inner div. Will resolve on next deploy
- **Priority:** P0

### 4. Blog Post Readability
- **Finding:** PASS — tested /blog/best-nicotine-pouches-2026
- Text is comfortable at ~16px body, proper line spacing
- Headings are properly sized and spaced
- Blog hero banner renders well with category badge, title, author, date
- Bold text for key stats works well on mobile

### 5. Filter Drawer
- **Finding:** PASS
- Has X close button (top-right)
- Scrollable within the drawer
- Sticky "Show results" button at bottom
- Focus trapping not explicitly tested but drawer covers full viewport
- Brand/Strength/Flavor sections all accessible

### 6. Cart Drawer on Mobile
- **Finding:** PASS
- Takes nearly full width (~60% of viewport, right-aligned)
- Quantity +/- buttons easily tappable
- "View Cart" and "Checkout" buttons visible without scrolling
- Free shipping bar is a nice touch

### 7. Form Inputs (Login)
- **Finding:** PASS
- Email and password fields are full-width with adequate height
- Labels visible above fields
- "Sign In" button is full-width with good height
- Cannot test keyboard push behavior via Chrome MCP (would need real device)

### 8. Horizontal Scroll
- **Finding:** PASS — No horizontal scroll detected on homepage, /products, /brands/zyn, or /login
- JavaScript check: `scrollWidth === clientWidth` on all tested pages

---

## Issue Summary

| # | Issue | Severity | Page | Fix Type |
|---|-------|----------|------|----------|
| 1 | Footer 0px padding on mobile | P0 | All pages | CSS fix (already in code, needs deploy) |
| 2 | Best Sellers 3-col grid too tight at 390px | P1 | Homepage | Tailwind responsive breakpoint |
| 3 | No sticky Add-to-Cart on PDP mobile | P1 | PDP | React island (see Task 3 mockup) |
| 4 | Image placeholders are blank white | P2 | Homepage, brand pages | CSS shimmer skeleton |
| 5 | Pack Pricing + Pack Size duplication | P2 | PDP | Remove Pack Pricing card or merge |
| 6 | Breadcrumb "Home" flush left on /products | P1 | /products | Same container padding fix as footer |

---

## Screenshots Captured

1. `ss_055592uo8` — Homepage hero (390px)
2. `ss_03255vand` — /products page with filters
3. `ss_60701tgdb` — Filtered results (Mint, 295 products)
4. `ss_8645923mx` — PDP top (product image)
5. `ss_97860l3g1` — Cart drawer with 5-pack added
6. `ss_44284wnsm` — Blog readability test
7. `ss_5944yzuc9` — Brand page (ZYN)
8. `ss_8617zqlv1` — Login page form inputs
