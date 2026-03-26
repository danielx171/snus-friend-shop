# Competitor Design Research — SnusFriend Redesign

**Date:** 2026-03-26
**Sources:** velo.com, nicokick.com, ritual.com, takearecess.com, drinkolipop.com, athleticbrewing.com, snusbolaget.se, haypp.com, allbirds.com, glossier.com

## Key Color Palettes (Hex References)

| Site | Primary | Accent | Background | Notes |
|------|---------|--------|------------|-------|
| Ritual | #142b6f (navy) | #28a745 (green) | #f8f9fa (off-white) | Medical/clinical premium |
| Recess | #25385b (cloud burst) | #fedab3 (apricot) | #0a0a3a (midnight) | Warm personality |
| Olipop | #3a3a3a (charcoal) | #14433D (hunter green) | #ffffff (white) | Flavor-per-color system |
| Athletic | #003a5d (dark blue) | #ebd923 (golden yellow) | #ffffff (white) | Product-per-color |
| Nicokick | Dark grays | #34a0a4 (teal) | White | Functional e-commerce |

## Top Patterns to Implement

### 1. Three-Axis Filtering (from Nicokick)
- Brand × Flavor × Strength as sidebar pills or filter bar
- Real-time grid update (AJAX, no page reload)
- Active filter chips above grid
- Search within filter lists for 2000+ products

### 2. Pack Size in Card (from Nicokick/Snusbolaget)
- Quantity selector (1, 5, 10, 25, 50) visible on every product card
- Per-unit pricing updates dynamically
- Reduces friction — no detail page needed for bulk buyers

### 3. Cart Drawer + Progress Bar (from Athletic Brewing)
- Free shipping threshold: set 20-30% above current AOV
- Visual progress bar with copy: "You're only €X away from FREE shipping!"
- Horizontal upsell carousel (6-8 products)
- Auto-opens on add-to-cart

### 4. Color-Per-Strength System (from Olipop pattern, adapted)
- Green = Mild (1-4mg)
- Yellow = Regular (5-8mg)
- Orange = Strong (9-14mg)
- Red = Extra Strong (15mg+)
- MUST include text labels for accessibility (don't rely on color alone)

### 5. Flavor-Per-Color (from Olipop)
- CSS custom properties per flavor family
- Mint = cool blue/teal
- Fruit = warm orange/coral
- Berry = purple/magenta
- Citrus = yellow/lime
- Coffee/Tobacco = brown/amber

### 6. Subscription UX
- "Subscribe & Save 10-15%" toggle near Add to Cart
- Frequency dropdown (every 2/4/6/8 weeks)
- Clear auto-renewal disclosure
- Flash subscription discounts increase conversions +41%

## Conversion Benchmarks

| Metric | Benchmark | Source |
|--------|-----------|--------|
| E-commerce conversion rate | 2-4% (avg 1.89%) | Shopify CRO 2026 |
| Add-to-cart rate | 6.34% global avg | Industry data |
| Products with 11-30 reviews | +68% conversion | Social proof studies |
| Sticky CTA mobile | +10-25% lift | The Good / Onilab |
| Cart upsell AOV | +10-15% increase | Growth Suite |
| Free shipping bar | Sets threshold 20-30% above AOV | Growth Suite |
| Site speed (2.4s vs 5.7s) | 1.9% vs 0.6% conversion | Speed studies |
| Price per unit display | 86% of sites DON'T do this | Baymard |

## Accessibility Requirements for Color-Coding

1. Never rely on color alone — always include text labels + icons
2. Color contrast minimum: 4.5:1 for normal text (WCAG AA)
3. Red/green combos inaccessible to 8% of males
4. Use colorblind simulation during design review
5. European Accessibility Act (EAA) now legally required (2025)

## Typography Recommendations

| Use | Font | Weight | Fallback |
|-----|------|--------|----------|
| Display headlines | Space Grotesk or Inter Display | 700-900 | system-ui |
| Body text | Inter | 400-500 | -apple-system, sans-serif |
| Emphasis | Inter | 600-700 | — |
| Price display | Inter Tight or tabular nums | 600 | monospace |

## Mobile-First Patterns

1. Bottom navigation (Home, Categories, Search, Wishlist, Cart)
2. Sticky add-to-cart bar on PDP
3. Bottom sheet for filters (not sidebar)
4. 2-column product grid (not single column)
5. Swipeable product image galleries
6. 48px minimum touch targets
7. Breakpoints: 640px, 768px, 1024px, 1280px

## Age Gate Requirements

- Full-screen verification on site entry
- Database matching (PII against records) for compliance
- Simple DOB entry is NOT sufficient for regulated products
- Delivery verification as secondary gate
