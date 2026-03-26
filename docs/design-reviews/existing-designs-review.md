# SnusFriend Design Review — Existing Stitch Designs

**Reviewer:** Claude (Design Director mode)
**Date:** 2026-03-26
**Project:** stitch.withgoogle.com/projects/16747947287080913689
**Model used for originals:** Gemini 3.0 Flash

---

## Design 1: Obsidian Teal — Dark Premium Homepage

**Dimensions:** 1280 × 3132
**Theme:** Dark charcoal (#1A1A2E-ish) with teal (#0F6E56) accents

### What's There
- Sticky header with "SnusFriend" logo, mega-menu nav, search/user/cart icons
- Hero section: "Your Favorite Pouches, Delivered Fast." with illustrated character and pouch product shot
- Horizontal scrolling brand carousel (ZYN, VELO, LOOP, XQS, WHITE FOX)
- "The Essentials" 4-column product grid (Minty Breeze, Citrus Sunshine, Red Chill Haze, Arctic Freeze)
- Product cards with price (€3.00–€4.00 range), colored strength dots, minimal info
- "The Bulk Subscription" CTA section
- Trust badges: Same Day Dispatch, Certified Quality
- Footer with columns

### Scores
- **Visual Impact:** 7/10 — Strong dark aesthetic, the teal accent is effective. The illustrated hero character adds personality but feels slightly generic. Good atmosphere.
- **E-commerce UX:** 5/10 — Product cards are too minimal. No bulk quantity selectors visible. No per-unit pricing. Strength indicators are just small dots — not color-coded badges. Missing "Add to Cart" buttons on cards. No filtering visible on homepage.
- **Brand Consistency:** 7/10 — Cohesive dark+teal palette. "Obsidian Teal" design system is well-defined. The mood is premium and consistent throughout.
- **Implementation Feasibility:** 8/10 — Very standard layout patterns. Hero + carousel + grid + CTA + footer maps cleanly to React components. shadcn/ui Card, Badge, Button all apply.
- **Mobile Readiness:** 6/10 — 4-column grid will need responsive breakpoints. Hero section looks desktop-optimized. Brand carousel should be fine. No visible mobile-specific patterns.
- **OVERALL: 6.6/10**

### Strengths
1. Atmospheric dark theme with premium feel — the navy/charcoal + teal combination is strong
2. Brand carousel establishes credibility immediately
3. "The Bulk Subscription" section is a smart conversion element

### Weaknesses
1. Product cards lack critical e-commerce functionality (no quantity selector pills, no "Add to Cart", no strength badges)
2. Hero illustration feels AI-generated and slightly juvenile for a premium nicotine brand
3. Only 4 products shown — no "View All" or discovery mechanism beyond the essentials grid

### KEEP
- Dark + teal color palette
- Brand carousel concept
- Bulk subscription CTA section
- Overall section rhythm (hero → social proof → products → subscription → footer)

### DISCARD
- Illustrated hero character (replace with product photography or lifestyle imagery)
- Minimal product cards (need to be much more functional)
- Small strength dots (need prominent color-coded badges)

---

## Design 2: Light Premium Homepage

**Theme:** White/off-white background with teal accents and pastel category cards

### What's There
- Clean header: "SnusFriend" logo, nav (All Pouches, Brands, Flavors, Deals), search/user/cart
- Hero: "Discover 2200+ Premium Pouches" with search bar
- Trust badges row: Lab Tested, Tobacco-Free, Same Day Shipping, Rewards Program
- 4 category discovery cards: Mint Flavors (green), Fruit Flavors (orange/coral), Strong Pouches (red/pink), Latest Drops (teal) — each with icons and count
- "Curated For You" section with 4 product cards showing star ratings, prices, "Add to Cart" buttons
- "Master Your Ritual" newsletter CTA section (full-width teal/mint background)
- Footer

### Scores
- **Visual Impact:** 8/10 — This is the Ritual.com inspiration done well. Clean, premium whitespace. The category cards with distinct pastel colors are eye-catching. Typography hierarchy is clear.
- **E-commerce UX:** 6/10 — Better than Design 1: product cards have star ratings, prices, and "Add to Cart" buttons. But still missing quantity selectors, strength badges, and per-unit pricing. Category cards are a great discovery mechanism.
- **Brand Consistency:** 7/10 — Clean and coherent. The mint/teal accent ties everything together. Category cards introduce nice color variation without breaking consistency.
- **Implementation Feasibility:** 9/10 — Very standard patterns. Cards, badges, buttons, input fields — all shadcn/ui native. The category cards are simple Card components with colored backgrounds.
- **Mobile Readiness:** 7/10 — The simpler layout translates better to mobile. Category cards can stack 2×2. Product grid goes to 2-column or single-column easily. Search bar is prominently placed.
- **OVERALL: 7.4/10**

### Strengths
1. Ritual.com-level whitespace and typography — feels genuinely premium and trustworthy
2. Category discovery cards with color coding are an excellent navigation pattern
3. Trust badges row immediately establishes credibility
4. "Add to Cart" buttons present on product cards (unlike Design 1)

### Weaknesses
1. Still missing bulk quantity selectors on product cards
2. No visible strength badges — the key differentiator for nicotine pouches
3. "Master Your Ritual" CTA feels disconnected — the teal background is jarring against the clean white aesthetic
4. Product images are generic 3D renders, not real product photography

### KEEP
- Clean whitespace and typography approach
- Category discovery cards with color system
- Trust badges row
- Star ratings on product cards

### DISCARD
- Full-width colored CTA section (jarring — refine to be more subtle)
- Generic product imagery
- Lack of strength indicators

---

## Design 3: PLP — Dark Product Listing Page

**Theme:** Dark charcoal with teal accents, matching Design 1

### What's There
- Header with "SNUSFRIEND" in caps, category tabs (All Products, Best Sellers, New Arrivals, Strength Guide, Brands)
- "THE COLLECTION" page title
- Left sidebar (approx 200px): Brand filters (checkboxes: VELO, LOOP, XQS, White Fox), Flavor section, Strength section, Format section
- 3-column product grid: COOL MINT SLIM, ICE COOL MINI, HABANERO MINT visible
- Product cards with dark backgrounds, product images, names, prices (€4.50 range)
- Footer

### Scores
- **Visual Impact:** 6/10 — Consistent with the dark theme but feels quite standard. "THE COLLECTION" in serif is a nice touch but the page feels dense and dark without enough visual relief.
- **E-commerce UX:** 7/10 — Good faceted filtering with brand, flavor, strength, format — exactly what's needed. Tab navigation is useful. Product count visible. But only 3 columns with limited card info. No active filter chips. No "showing X products" count.
- **Brand Consistency:** 7/10 — Matches Design 1's dark palette. The all-caps "SNUSFRIEND" in the header is consistent. Teal accents carry through.
- **Implementation Feasibility:** 8/10 — Standard sidebar + grid layout. Checkbox filters, tabs, cards — all straightforward with shadcn/ui. The sidebar can use Accordion for collapsible filter sections.
- **Mobile Readiness:** 5/10 — Sidebar filters won't work on mobile. Needs bottom sheet or full-screen filter overlay. 3-column grid needs to collapse. No visible mobile filter trigger.
- **OVERALL: 6.6/10**

### Strengths
1. Comprehensive faceted filters covering all key axes (brand, flavor, strength, format)
2. Category tabs provide quick pre-filtered views
3. Consistent dark theme with homepage

### Weaknesses
1. Product cards are too minimal — need quantity selectors, strength badges, better pricing display
2. Only 3-column grid feels sparse on a 1280px canvas
3. No active filter chips to show current selections
4. No visible product count or sort options
5. Mobile filter strategy completely absent

### KEEP
- Filter categories: Brand, Flavor, Strength, Format
- Tab navigation for quick category switching
- Dark theme consistency

### DISCARD
- Minimal product cards (need full e-commerce functionality)
- 3-column layout (should be 4-column on desktop)
- Missing sort, filter chips, product count

---

## Design 4: PDP — Dark Product Detail Page

**Theme:** Dark charcoal with teal accents

### What's There
- Breadcrumbs: Home > ZYN > ZYN Cool Mint
- Left: Large product image with thumbnail gallery below
- Right: "ZYN Cool Mint" title, 5-star rating (with review count), strength selector (3mg highlighted), pack size selector (1 Can / 5 Pack / 10 Pack / 30 Pack), price $24.95 with sale indicator, "Subscribe & Save 15%" with pricing, "Deliver every X weeks" selector, teal "ADD TO CART" button
- Below fold: tabbed content (Description, Ingredients, Shipping & Returns, Reviews)
- Product description text with specification grid (mg/Pouch, Weight, Format: Mini Dry)
- Reviews section: 4.7 out of 5 stars
- "You May Also Like" carousel: Ice Cool Mint, Spearmint, Super White 42, Wintergreen
- Footer

### Scores
- **Visual Impact:** 7/10 — Clean PDP layout. Good information hierarchy. The dark background makes the white product pouch image pop. Teal accents guide the eye to CTAs.
- **E-commerce UX:** 8/10 — This is the strongest e-commerce execution of all designs. Strength selector, pack size selector, subscription toggle, clear pricing, review integration — all present. The tabbed content below fold is well-structured.
- **Brand Consistency:** 8/10 — Matches the dark+teal system perfectly. Typography hierarchy is clear. The breadcrumbs and navigation maintain consistency with other pages.
- **Implementation Feasibility:** 8/10 — Maps well to shadcn/ui: ToggleGroup for strength/pack selectors, Tabs for content sections, Card for recommendations, Switch for subscription toggle, Badge for ratings.
- **Mobile Readiness:** 6/10 — Two-column layout will need to stack. Image gallery needs swipe behavior. Pack selector pills might be tight on mobile. Sticky bottom bar mentioned in prompt but not visible.
- **OVERALL: 7.4/10**

### Strengths
1. Most feature-complete e-commerce page — has all the critical purchase decision elements
2. Strength selector and pack size selector are well-designed
3. Tabbed content keeps the page organized without overwhelming
4. "You May Also Like" recommendations drive additional discovery

### Weaknesses
1. Color-coded strength badges not visible (just text toggles)
2. No visible per-unit price breakdown across pack sizes
3. Missing sticky mobile bottom bar with price + Add to Cart
4. Review section could be more prominent — 4.7 stars should be a selling point

### KEEP
- Full PDP layout structure (gallery + info + tabs + recommendations)
- Strength and pack size selectors
- Subscription toggle
- Tabbed content sections

### DISCARD
- Plain text strength selector (needs color-coded badges: green/yellow/orange/red)
- Missing per-unit pricing comparison across pack sizes

---

## Design 5: Cart Drawer

**Theme:** Dark charcoal, slides in from right

### What's There
- Header: "Your Cart (3 items)" + close X
- Free shipping progress bar (teal): "Spend €12.50 more for FREE shipping!"
- Cart items:
  - VELO FREEZE X-STRONG — "EXTRA STRONG" red badge, €15.80/unit, qty 3, line total €47.40
  - ZYN SPEARMINT — "NORMAL" badge, €12.50/unit, qty 1, line total €12.50
- "COMPLETE YOUR ORDER" upsell section: 3 small product cards (Loop Jalapeño €6.90, XQS Citrus €5.50, Skruf Sur €7.20)
- "Subscribe & Save 10%" toggle with description
- Subtotal: €59.90, Shipping: €4.95, Total: €47.50
- Big teal "Checkout — €47.50" button
- Dark overlay behind on left side (homepage visible)

### Scores
- **Visual Impact:** 8/10 — Excellent execution. The dark drawer against the homepage overlay looks premium. Teal progress bar and checkout button create clear visual hierarchy. Strength badges (EXTRA STRONG in red, NORMAL) add functional color.
- **E-commerce UX:** 9/10 — Best UX of all designs. Free shipping progress bar drives AOV. Quantity steppers, per-unit pricing, strength badges, upsell section, subscription toggle — all present. The price breakdown is clear. One issue: the total shows €47.50 but subtotal is €59.90 — math seems off (possibly a Stitch placeholder issue).
- **Brand Consistency:** 8/10 — Consistent with the dark+teal palette. The "EXTRA STRONG" red badge introduces color-coded strength — this is exactly what we want across all pages.
- **Implementation Feasibility:** 9/10 — Perfect shadcn/ui mapping: Sheet component for the drawer, Progress for shipping bar, Badge for strength, Button for checkout, Switch for subscription.
- **Mobile Readiness:** 8/10 — Cart drawer is inherently mobile-friendly. Width just needs to go full-screen on small viewports. All touch targets look adequate. Quantity steppers are finger-friendly.
- **OVERALL: 8.4/10**

### Strengths
1. Free shipping progress bar — proven AOV driver, beautifully executed
2. Strength badges with color coding (red for EXTRA STRONG) — this pattern should propagate everywhere
3. "Complete Your Order" upsell section is perfectly placed
4. Per-unit pricing visible on each item

### Weaknesses
1. Price math doesn't add up (€47.40 + €12.50 = €59.90 subtotal, but total shows €47.50 — looks like a generation bug)
2. Only 2 items in cart — would be good to see how it handles 5+ items with scrolling
3. Missing payment method icons (Visa, Mastercard, Apple Pay, Klarna)
4. Subscribe & Save shows 10% but prompt specified 15%

### KEEP
- Everything — this is the best design. Free shipping bar, upsells, subscription toggle, strength badges, per-unit pricing
- The drawer overlay treatment
- The "COMPLETE YOUR ORDER" upsell section

### DISCARD
- Fix the price math inconsistency
- Add payment method icons below checkout button

---

## Overall Rankings — Existing Designs

| Rank | Design | Overall Score | Best For |
|------|--------|--------------|----------|
| 1 | **Cart Drawer** | **8.4/10** | Best e-commerce UX, most implementation-ready |
| 2 | **Light Homepage** | **7.4/10** | Best visual impact, strongest brand aesthetic |
| 2 | **PDP Dark** | **7.4/10** | Most feature-complete product page |
| 4 | **Dark Homepage (Obsidian Teal)** | **6.6/10** | Good atmosphere but weak product cards |
| 4 | **PLP Dark** | **6.6/10** | Good filter structure but sparse execution |

## Key Takeaways for New Designs

1. **Cart Drawer is the gold standard** — its UX patterns (shipping progress bar, per-unit pricing, strength badges, upsells) should be replicated across all pages
2. **Light theme outperforms dark for homepage** — the whitespace and category cards create a more inviting, trustworthy first impression
3. **Product cards need major upgrades everywhere** — bulk quantity selectors, color-coded strength badges, per-unit pricing, and "Add to Cart" buttons are missing or weak in all grid views
4. **Color-coded strength system is critical** — only the Cart Drawer has it right (red for EXTRA STRONG). This needs to be: green=mild, yellow=regular, orange=strong, red=extra strong across ALL pages
5. **Mobile patterns are the weakest area** — no existing design addresses mobile-first browsing, filter sheets, or sticky bottom bars

## What to Generate Next

The prompt document's Round 1 designs (A-F) should address all these gaps. Priority order:
1. **Prompt A & B (Homepages)** — to get improved versions with full product card functionality
2. **Prompt C (PLP)** — to fix the sparse filtering and add proper product cards
3. **Prompt D (PDP)** — to add color-coded strength and per-unit pricing comparisons
4. **Prompt E (Cart Drawer)** — to iterate on the already-strong drawer
5. **Prompt F (Brand Page)** — new page type not yet generated

---

## Design 0: LIVE SITE — snusfriends.com (Current Production)

**Theme:** Dark navy (#0a0f2e-ish) with lime/teal accents
**Status:** Live at snusfriends.com, Vite SPA on Vercel

### What's There
- **Top bar:** "Fri frakt fr. 349 kr" (free shipping from 349 kr) + user icon + cart with item count + price (≈ 403.10 kr)
- **Nicotine warning banner:** "Denna produkt innehåller nikotin som är ett mycket beroendeframkallande ämne."
- **Header:** SF shield logo, search icon, cart icon (with count badge), hamburger menu
- **Hero carousel:** "New Arrivals — Fresh flavors weekly" with "Shop New" CTA (lime/yellow button)
- **Trust badges:** "Betrodd av tusentals" (Trusted by thousands) + "Fri frakt fr. 349 kr" + "Secure checkout" + "56 brands available"
- **Product carousel:** Horizontal scroll of product cans (VELO Arctic Grapefruit, VELO Blue Raspberry, VELO Bright Peppermint, etc.)
- **Points marquee:** Scrolling "FriendPoints per €1 spent • 🎁 500 points = free mystery box month • ⚡ New drops every..."
- **Category pills:** Horizontal scroll — Pouches, Strong, Extra Strong, Bestsellers, Offers, N...
- **Trust grid (2×2):** Fri frakt fr. 349 kr, Secure checkout, 91 brands, Fast EU shipping
- **Bestsellers section:** Full-width product cards with:
  - Large product can images (very high quality, takes up most of card)
  - Brand name in gray above product name
  - Strength badge with color dot (green for "Extra Stark")
  - Flavor badge ("Frukt", "Bär")
  - mg display (10.4mg)
  - Pack selector pills: 1-pack, 3-pack, 5-pack, 10-pack
  - Per-unit pricing (≈ 28.61 kr/st) + crossed-out original price
  - Stock count ("1667 in stock", "3110 in stock")
  - "Köp" (Buy) button with cart icon — or email notify for out-of-stock
  - Wishlist heart icon
  - "Nytt pris" (New price) + "Populär" badges
- **Discovery cards:** "Strength Guide" with description, "New Drops" with description
- **Special Offers section** (visible at bottom)
- **Easter Off toggle** floating button (seasonal)

### Scores
- **Visual Impact:** 6/10 — The dark navy theme is consistent but feels monotonous. Product can images are the only visual relief — no lifestyle imagery, no color variation between sections. The lime/yellow CTA buttons pop well but the overall page feels like a "dark mode" of a standard e-commerce template rather than a distinctive brand.
- **E-commerce UX:** 8/10 — This is actually the strongest UX of anything I've reviewed. Pack selectors, per-unit pricing, stock counts, strength badges with color dots, mg display, wishlist hearts, notify-me for OOS — all present and functional. The product cards are feature-rich.
- **Brand Consistency:** 5/10 — Mixed signals. Swedish and English are both present ("Köp" vs "Secure checkout", "Fri frakt" vs "Fast EU shipping"). The SF shield logo doesn't feel premium. The "Easter Off" toggle is disruptive. Trust badges repeat in multiple places (top bar + row + grid). No clear brand personality beyond "dark e-commerce site."
- **Implementation Feasibility:** N/A — This IS the implementation. It's live React + Vite + Tailwind + shadcn/ui.
- **Mobile Readiness:** 7/10 — The site is clearly mobile-first in layout. Full-width cards, horizontal scrolling carousels, adequate touch targets. But the single-column product cards make browsing slow — each card takes up almost the full viewport height due to the large product images.
- **OVERALL: 6.5/10**

### Strengths
1. **Product cards are the best of anything reviewed** — pack selectors, per-unit pricing, stock counts, strength badges, mg display, OOS notify, wishlist — all present
2. **Trust signals are comprehensive** — free shipping threshold, secure checkout, brand count, EU shipping, points program, Trustpilot implied
3. **Mobile-first layout** — works well on phones, touch targets are adequate

### Weaknesses
1. **No visual hierarchy or brand personality** — every section looks the same dark navy. No whitespace, no section differentiation, no lifestyle imagery
2. **Language inconsistency** — Swedish/English mix creates confusion for both audiences
3. **Product images dominate too much** — on mobile, each card is almost a full screen. Makes browsing slow and repetitive
4. **No search-first experience** — search is just an icon, not a prominent bar
5. **Category discovery is weak** — tiny scrollable pills vs. the beautiful category cards in the Stitch light homepage
6. **Hero is generic** — "New Arrivals" carousel doesn't communicate brand value proposition

### What the Live Site Does BETTER Than Stitch Designs
- Pack selector pills (1/3/5/10-pack) — Stitch designs mostly lack this
- Per-unit pricing display (kr/st) — absent in most Stitch designs
- Stock counts — not in any Stitch design
- Wishlist hearts — not in Stitch
- OOS notify — not in Stitch
- Points/rewards marquee — not in Stitch

### What Stitch Designs Do BETTER Than the Live Site
- Visual hierarchy and whitespace (Light Homepage especially)
- Category discovery cards with color coding
- Brand carousel for credibility
- "Subscribe & Save" section
- Cart drawer with free shipping progress bar and upsells
- Hero sections with clear value propositions
- Typography hierarchy (the live site uses similar weights everywhere)
- Section differentiation (the live site is a wall of navy)

---

## MASTER RANKINGS — All Designs Compared

| Rank | Design | Score | Key Strength | Key Weakness |
|------|--------|-------|-------------|-------------|
| 1 | **Stitch: Cart Drawer** | **8.4** | Best UX patterns (progress bar, upsells, badges) | Price math error, missing payment icons |
| 2 | **Stitch: Light Homepage** | **7.4** | Best visual impact, Ritual-level whitespace | Missing pack selectors and strength badges |
| 2 | **Stitch: PDP Dark** | **7.4** | Most complete product page | No color-coded strength, no per-unit comparison |
| 4 | **Stitch: Dark Homepage** | **6.6** | Strong atmosphere, good brand carousel | Product cards too minimal |
| 4 | **Stitch: PLP Dark** | **6.6** | Good filter structure | Sparse, missing mobile patterns |
| 6 | **Live Site (snusfriends.com)** | **6.5** | Best product card UX (packs, pricing, stock) | No visual hierarchy, no brand personality |

### The Path Forward: Merge the Best of Both

The ideal design takes:
- **From the live site:** Pack selectors, per-unit pricing, stock counts, OOS notify, points program
- **From Stitch Light Homepage:** Whitespace, category cards, typography, visual hierarchy
- **From Stitch Cart Drawer:** Progress bar, upsells, subscription toggle, strength badges
- **From Stitch PDP:** Image gallery, tabbed content, recommendation carousel
- **From research:** 3-axis filtering, bottom nav mobile, sticky add-to-cart, color-coded strength (with text labels for accessibility)
