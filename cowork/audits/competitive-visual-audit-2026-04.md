# Competitive Visual Audit — Nicotine Pouch E-Commerce Stores

> Audited: 2026-03-31/04-01
> Stores reviewed: 10
> Purpose: Visual design patterns, product card styles, trust signals, and UX inspiration for SnusFriend

---

## Stores Audited

| Store | URL | Market | Platform | Tier |
|-------|-----|--------|----------|------|
| Haypp | haypp.com | EU/Nordic | Custom | Mid-premium |
| Nicokick | nicokick.com | US/EU | Custom | Mid-premium |
| Northerner | northerner.com | US/EU | Custom | Mid-tier |
| SnusDirect | snusdirect.eu | EU | Shopify | Budget |
| SnusBoss | snusboss.com | EU | Shopify | Budget |
| VELO Official | velo.com | Global | Custom | Premium (brand) |
| SnuZone | snuzone.com | EU/Nordic | Custom | Mid-premium |
| SnusHus | snushus.se | Nordic | Custom | Mid-tier |
| EuropeSnus | europesnus.com | EU | Shopify | Mid-tier |
| SnusDaddy | snusdaddy.com | EU | Custom | Mid-tier |

---

## Design Pattern Summary

### Theme & Color

Most stores use **white/light backgrounds** with white product cards (Haypp, Nicokick, Northerner, SnuZone, EuropeSnus, SnusHus). The only store besides SnusFriend running a dark theme is VELO's official brand site (dark navy). Budget stores (SnusDirect, SnusBoss) use minimal styling with generic Shopify themes.

**Takeaway:** Our dark forest theme is distinctive in the market. It differentiates us from the sea of white-background competitors. Keep it — but ensure contrast and readability are polished.

### Product Card Layouts

Three dominant patterns emerged:

1. **Flat white card with centered image** (Haypp, Nicokick, Northerner, SnusHus) — Clean, no gradients, product image is a circular can photo centered in a white box. Info below: brand, name, price, add-to-cart. Minimal color, maximum clarity.

2. **Gradient/branded image background** (VELO official, SnuZone) — The can floats on a color gradient matching the product's branding. More visually premium. VELO uses deep navy-to-blue gradients; SnuZone uses lighter brand tints.

3. **Utilitarian list-style grid** (SnusDirect, SnusBoss, EuropeSnus) — Dense product grids focused on price and pack options. Minimal visual styling. Conversion-focused for repeat buyers who know what they want.

**Our current approach:** Dark card with a subtle brand-color gradient behind the image, `border-l-4` colored by flavor, and a 3px strength strip between image and content. This is closest to approach #2 but the multiple color signals (flavor border + strength strip + brand gradient) compete visually, which is Daniel's core complaint.

### Product Attribute Display

How competitors communicate strength, flavor, format, and nicotine content:

| Approach | Used By | Verdict |
|----------|---------|---------|
| **Strength dots** (filled/unfilled circles) | Nicokick, SnuZone | Clean, intuitive, universal |
| **Strength progress bar** (horizontal bar fill) | EuropeSnus | Visual but takes space |
| **Text labels only** ("Strong", "6mg") | Haypp, Northerner, SnusDirect | Simple but boring |
| **Colored pill badges** (translucent tinted pills) | VELO, SnuZone | Modern, scannable, color-coded |
| **Color-coded card borders** | SnusFriend (current) | Distinctive but looks non-uniform when mixed |

**Best practice observed:** Strength dots + colored pill badges for flavor/mg/format. This is what the premium competitors (VELO, SnuZone, Nicokick) converge on. The dots are universally understood, and the pills let you scan attributes at a glance without dominating the card visually.

### Trust Signals

This is where the gap matters most:

| Signal | Haypp | Nicokick | SnuZone | SnusFriend |
|--------|-------|----------|---------|------------|
| Trustpilot widget | Yes (4.3 stars, prominent) | Yes (4.6 stars) | Yes (header) | No |
| Review count on cards | No | Yes (star + count) | No | No (have DB, no display) |
| Delivery estimate | "Next-day" badge | "Ships today" | Delivery timer | No |
| Payment icons (footer) | Visa/MC/Klarna/PayPal | Full row | Yes | Minimal |
| "Free shipping over X" | Prominent header bar | Banner | Yes | In trust bar (text only) |
| SSL/security badge | Footer | Footer | Header | No |

**Takeaway:** Our competitive audit (from earlier sessions) flagged this — we score B+ on features but have zero external trust signals. Trustpilot integration is the single highest-impact gap. The research doc is already written (`cowork/content/trustpilot-integration-research.md`).

### Wishlist / Favorites

SnuZone, Haypp, and Nicokick all show a heart icon on product cards for wishlisting. We have a wishlist system built (nanostore + WishlistIsland) but the heart doesn't appear on the product card. Adding it would match competitor parity and drive engagement.

### Ratings & Reviews on Cards

Nicokick shows star ratings + review count directly on product cards. This is powerful social proof at the browsing stage. We have a full review system (ProductReviewsIsland + DB) but reviews only appear on the product detail page. Surfacing the aggregate rating (stars + count) on product cards would be a significant conversion lift — the data already exists.

### Hover Effects & Interactivity

Most competitors have **minimal hover effects** — just a subtle shadow lift or a "Quick view" overlay. Nobody does anything particularly impressive here. This is an opportunity: a tasteful hover animation (scale + lift + glow intensification) would make our cards feel more premium than the competition without being gimmicky.

### Price Display

Universal pattern: price in bold, prominent position. Some variations:

- **Haypp:** Shows price per can AND price per pouch — smart for multi-pack comparison
- **SnuZone:** Shows original price with strikethrough when discounted
- **Nicokick:** "Starting from" price when multiple sizes exist
- **EuropeSnus:** Pack size selector directly on the card

We show price with loyalty points ("+ 43 pts"). The points display is unique in the market — nobody else does this on the card. It's a differentiator worth keeping.

---

## What SnusFriend Should Adopt

### High Priority (product card redesign)

1. **Replace `border-l-4` + strength strip with pill badges** — Translucent flavor/mg/format pills. Color comes from the badge fills, not from a border. Fixes the "non-uniform" look Daniel flagged.

2. **Add strength dots to card** — 5-dot system (filled = strength level) in the brand row. Color matches strength tier. Universally understood.

3. **Surface star rating + review count** — Pull aggregate rating from our reviews DB. Display as stars + "(N)" on each card. Massive trust signal at browse stage.

4. **Add wishlist heart to card** — We already have the nanostore. Just add the heart icon (top-right corner, translucent background).

5. **Radial flavor glow behind product image** — Instead of a brand-color gradient, use a subtle radial glow in the flavor color. Intensifies on hover. This is what VELO does and it looks premium.

6. **Gradient CTA button** — Replace flat green add-to-cart with a gradient button (flavor color → brand color). Gives each card a unique feel without clashing.

### Medium Priority (site-wide)

7. **Trustpilot widget** — Header/footer placement. Phase 1 (free plan) is already specced.

8. **Delivery estimate on cards or header** — "Ships in 1-2 days" or a more specific estimate based on location.

9. **Hover animation** — Subtle translateY(-4px) + scale(1.02) + shadow increase on card hover. 300ms transition. No rotation on mobile.

### Lower Priority (nice-to-have)

10. **Pack size selector on card** — If a product has multiple pack sizes, show a mini selector (EuropeSnus pattern). Complex to implement, defer.

11. **Quick view modal** — Some competitors have this. Low priority since our PDPs load fast already.

---

## What SnusFriend Should NOT Copy

- **White theme:** Our dark theme is a differentiator. The market is saturated with white-on-white stores.
- **Dense utilitarian grids:** SnusDirect/SnusBoss approach sacrifices brand feel for density. Not our market position.
- **Age gate interstitials:** Some stores (SnusBoss, SnusDirect) have heavy-handed age gates. Our current approach is fine.
- **Newsletter popups on first visit:** Multiple competitors (SnusDaddy, SnusBoss) hit you with popups immediately. Annoying. Don't do this.

---

## Mockup Deliverable

Interactive mockup created at: `cowork/mockups/product-card-redesign.jsx`

Two variants:
- **Premium Dark** (recommended) — Matches our existing theme. Radial glow, gradient CTA, hover animations, pill badges, strength dots, wishlist heart, star ratings.
- **Clean Light** — Alternative if we ever consider a light theme. White cards, subtle flavor-tinted header, brand-colored CTA.

Both variants use real SnusFriend product images and our existing color system from `brand-colors.ts`.
