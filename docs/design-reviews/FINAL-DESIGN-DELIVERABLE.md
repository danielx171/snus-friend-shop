# SnusFriend Design Deliverable — Complete Review, Rankings & Next Steps

**Date:** 2026-03-26
**Reviewer:** Claude (Design Director mode)
**Stitch Project:** stitch.withgoogle.com/projects/16747947287080913689
**Live Site:** snusfriends.com

---

## EXECUTIVE SUMMARY

I reviewed 5 existing Stitch designs + the live snusfriends.com site, ran competitive research across 10+ premium e-commerce sites, and compiled conversion optimization data from Baymard Institute and industry sources. Here's what I found:

**The Cart Drawer design is the strongest individual page (8.4/10)** — but the live site has better product card UX than any Stitch design. The path forward is clear: merge the live site's functional product cards with the Stitch designs' visual hierarchy and premium aesthetics.

**Key insight from research:** 86% of e-commerce sites don't display price-per-unit for bulk items (Baymard). SnusFriend already does this on the live site — this is a competitive advantage to double down on.

---

## PART 1: MASTER RANKINGS

### All Designs Ranked

| Rank | Design | Score | Best Element | Worst Element |
|------|--------|-------|-------------|--------------|
| 1 | **Stitch: Cart Drawer** | **8.4/10** | Free shipping progress bar + upsells + strength badges | Price math error |
| 2 | **Stitch: Light Homepage** | **7.4/10** | Ritual-level whitespace + category discovery cards | Missing pack selectors |
| 2 | **Stitch: PDP Dark** | **7.4/10** | Strength selector + pack sizes + subscription toggle | No color-coded badges |
| 4 | **Stitch: Dark Homepage** | **6.6/10** | Dark+teal atmosphere + brand carousel | Product cards too minimal |
| 4 | **Stitch: PLP Dark** | **6.6/10** | 4-axis filter structure | Sparse grid, no mobile strategy |
| 6 | **Live Site** | **6.5/10** | Pack selectors + per-unit pricing + stock counts | No visual hierarchy, no brand personality |

### Score Breakdown

| Design | Visual | UX | Brand | Feasibility | Mobile | AVG |
|--------|--------|-----|-------|------------|--------|-----|
| Cart Drawer | 8 | 9 | 8 | 9 | 8 | **8.4** |
| Light Homepage | 8 | 6 | 7 | 9 | 7 | **7.4** |
| PDP Dark | 7 | 8 | 8 | 8 | 6 | **7.4** |
| Dark Homepage | 7 | 5 | 7 | 8 | 6 | **6.6** |
| PLP Dark | 6 | 7 | 7 | 8 | 5 | **6.6** |
| Live Site | 6 | 8 | 5 | N/A | 7 | **6.5** |

---

## PART 2: WHAT TO BUILD (Priority Order)

### Priority 1: Hybrid Homepage (Light base + Dark accents)

**Why light wins for homepage:** Research shows minimalist white backgrounds with restrained accents (Ritual pattern) communicate premium trust. The live site's all-dark-navy creates visual monotony. The Stitch Light Homepage scored highest on visual impact.

**The winning formula:**
- Light/off-white (#FAFAF8) base with navy (#1A1A2E) header and teal (#0F6E56) accents
- Category discovery cards from Stitch Light Homepage
- Product cards from live site (pack selectors, per-unit pricing, strength badges)
- Brand carousel from Stitch Dark Homepage
- Cart drawer from Stitch Cart Drawer design

### Priority 2: Product Cards (The Critical Component)

Every Stitch design has weak product cards. The live site has strong ones. The new design needs cards that combine:

**From live site (keep):** Pack selector pills (1/3/5/10), per-unit pricing (€X.XX/unit), strength badges with color dots, stock count, OOS notify, wishlist hearts

**From research (add):** Color-coded strength badges (green/yellow/orange/red) with TEXT labels (not just color — WCAG compliance), "Add to Cart" button (the live site says "Köp"), star ratings (products with 11-30 reviews convert 68% higher)

**From Stitch Cart Drawer (adopt):** The "EXTRA STRONG" red badge pattern — propagate this across ALL pages

### Priority 3: Mobile-First Redesign

73% of e-commerce sales occur on mobile (2025). Current weaknesses:
- Live site: Single-column cards too tall (each card = full viewport)
- Stitch PLP: No mobile filter strategy
- No sticky add-to-cart bar on PDP

**Mobile must-haves from research:**
- Bottom navigation (Home, Categories, Search, Wishlist, Cart)
- 2-column product grid (not single column)
- Bottom sheet for filters
- Sticky add-to-cart bar on PDP (+10-25% mobile conversion lift)
- 48px minimum touch targets

---

## PART 3: IMPROVED STITCH PROMPTS (Research-Informed)

These prompts incorporate findings from the competitor research and Baymard conversion data. They're ready to paste into Stitch.

### Prompt A-v2 — Hybrid Premium Homepage (RECOMMENDED FIRST)

```
Create a premium e-commerce homepage for "SnusFriend" — an online nicotine pouch marketplace with 2200+ products across 139 brands.

LAYOUT: Off-white (#FAFAF8) background with navy (#1A1A2E) sticky header and teal (#0F6E56) accent color. Inter font throughout.

HEADER: Navy background. Left: "SnusFriend" logo in white. Center: mega-menu nav (All Pouches, Brands, Flavors, Strength Guide, Deals). Right: search icon, user icon, cart icon with teal count badge. Above header: teal progress bar "Free shipping on orders over €49 — you're €X away!"

HERO: Clean white section. Large headline "Discover 2200+ Premium Pouches" in navy. Subtitle "From 139 brands. Lab-tested. Delivered fast." Prominent search bar (full width, rounded, teal border on focus) with placeholder "Search by brand, flavor, or strength..."

TRUST BAR: Horizontal row of 5 badges on subtle gray (#F5F5F0) background: "Lab Tested" with flask icon, "Tobacco-Free" with leaf icon, "139 Brands" with grid icon, "Free EU Shipping" with truck icon, "Rewards Program" with star icon.

CATEGORY CARDS: 4 rounded cards in a row. "Mint Flavors" (cool blue #E3F2FD bg, mint leaf icon, "234 products"), "Fruit Flavors" (warm coral #FFF3E0 bg, fruit icon, "189 products"), "Strong Pouches" (red #FFEBEE bg, lightning icon, "156 products"), "New Arrivals" (teal #E0F2F1 bg, sparkle icon, "Updated weekly"). Each card has subtle shadow on hover.

BRAND CAROUSEL: Horizontal scrolling logos on white: ZYN, VELO, LOOP, XQS, White Fox, 77 Pouches, Skruf, Siberia. Grayscale logos that colorize on hover.

PRODUCT GRID: "Bestsellers" section header with "View All →" link. 4-column grid on dark navy (#1A1A2E) section. Each product card shows:
- Product can image on dark card (#252545) background
- Brand name in gray above
- Product name bold in white
- Strength badge: color-coded pill (green "MILD 4mg", yellow "REGULAR 8mg", orange "STRONG 12mg", or red "EXTRA STRONG 16mg")
- Flavor badge: small gray pill ("Mint", "Berry", "Citrus")
- Pack selector pills: 1-pack (selected/teal), 3-pack, 5-pack, 10-pack
- Per-unit price: "€2.85/can" with crossed-out original "€3.20/can"
- Stock indicator: green dot + "In Stock"
- Teal "Add to Cart" button with cart icon
- Wishlist heart icon top-right

SUBSCRIPTION CTA: Full-width section with subtle gradient. "Subscribe & Save 15%" headline, "Never run out. Cancel anytime." subtext. Toggle comparison showing one-time vs subscription pricing.

FOOTER: Navy (#1A1A2E) with 4 columns: Shop (All Pouches, Brands, New Arrivals, Deals), Support (FAQ, Shipping, Returns, Contact), Legal (Terms, Privacy, Cookies, Age Policy), Newsletter signup with teal button.

Style inspired by ritual.com whitespace discipline, nicokick.com product card functionality, velo.com navigation. Target audience: adult nicotine pouch users in Europe.
```

### Prompt B-v2 — Product Listing Page with Advanced Filters

```
Create a product listing page for "SnusFriend" nicotine pouch store.

LAYOUT: Off-white (#FAFAF8) background for filters, navy (#1A1A2E) background for product grid.

HEADER: Same as homepage — navy with SnusFriend logo, mega-menu, search, cart.

BREADCRUMBS: "Home > All Pouches > Mint Flavors" on off-white background.

TOP BAR: "Showing 234 products" left-aligned. Sort dropdown right-aligned (Popularity, Price Low-High, Price High-Low, Newest, Strength). Active filter chips below: removable teal pills like "× Mint" "× Strong" "× ZYN".

LEFT SIDEBAR (240px, off-white):
- BRAND section: Search input + scrollable checkboxes with product counts: ZYN (45), VELO (38), LOOP (24), XQS (18), White Fox (12), 77 Pouches (8), Skruf (6). "Show all 139 brands" expandable.
- FLAVOR section: Pill buttons (multi-select): Mint, Fruit, Berry, Citrus, Coffee, Liquorice, Tobacco, Exotic. Active pills highlighted teal.
- STRENGTH section: Color-coded pill badges (multi-select): "Mild" green, "Regular" yellow, "Strong" orange, "Extra Strong" red. Each shows count.
- FORMAT section: Checkboxes: Slim (180), Mini (45), Large (9).
- PRICE RANGE: Dual slider €1 - €15 per can.
- "Clear All Filters" link at bottom.

PRODUCT GRID (4 columns on navy background):
Same card design as homepage product grid — can image, brand, name, strength badge with mg, flavor badge, pack selector pills (1/3/5/10), per-unit price with savings, stock status, "Add to Cart" teal button, wishlist heart.

PAGINATION: "Load More" teal button (not numbered pages).

MOBILE: Filters collapse into a "Filter & Sort" sticky bottom button that opens a full-screen bottom sheet. Grid becomes 2-column. Sticky "X results" bar at top.

Style: nicokick.com three-axis filtering meets ritual.com clean layout. Product count shown in filter options. Real-time grid update on filter change.
```

### Prompt C-v2 — Product Detail Page

```
Create a product detail page for "SnusFriend" showing "ZYN Cool Mint" product.

LAYOUT: Off-white (#FAFAF8) top section, navy (#1A1A2E) bottom sections.

BREADCRUMBS: "Home > ZYN > ZYN Cool Mint" on off-white.

TOP SECTION (off-white, two columns):
LEFT (50%): Large product image gallery. Main image 500x500px showing ZYN Cool Mint can. 4 thumbnail images below (front, back, open can, lifestyle shot). Click to enlarge. Swipeable on mobile.

RIGHT (50%):
- Brand: "ZYN" in small teal text with brand logo
- Product: "ZYN Cool Mint" in large navy heading
- Rating: 4.7 stars (128 reviews) — stars in teal, clickable to jump to reviews
- Strength selector: Toggle group with color-coded pills:
  - "3mg MILD" green outline
  - "6mg REGULAR" yellow outline (selected, filled)
  - "9mg STRONG" orange outline
- Pack size selector: Segmented control showing per-unit price under each:
  - "1 Can" — €3.20/can
  - "5 Pack" — €2.95/can (selected, teal)
  - "10 Pack" — €2.75/can
  - "30 Pack" — €2.50/can
  Savings badge: "Save 22%" on 30 Pack
- Price: Large "€14.75" with crossed-out "€16.00" and green "Save €1.25" badge
- Subscribe & Save toggle: "Subscribe & Save 15%" with frequency dropdown (Every 2 weeks / Monthly / Every 6 weeks). Shows subscription price "€12.54" when toggled on.
- Add to Cart: Large teal (#0F6E56) button full-width "Add to Cart — €14.75" with cart icon
- Delivery: "Order before 2pm for same-day dispatch" with truck icon
- Stock: Green dot "2,450 in stock"

BELOW FOLD (navy background):
TABS: Description | Ingredients | Shipping | Reviews (128)
- Description tab: Product description text, specs grid (mg/Pouch: 6mg, Pouches/Can: 20, Weight: 8g, Format: Slim, Flavor: Cool Mint)
- Reviews tab: 4.7 overall, star distribution bar chart, individual reviews with user name + star rating + date + text

"YOU MAY ALSO LIKE" carousel: 6 product cards on navy, same format as PLP cards.

MOBILE: Image gallery becomes swipeable full-width. Product info stacks below. STICKY BOTTOM BAR: Shows price + "Add to Cart" button always visible while scrolling.

Style: Clean product photography focus with functional pricing. velo.com strength selection meets ritual.com whitespace.
```

### Prompt D-v2 — Cart Drawer (Refined from #1 Design)

```
Create a slide-out cart drawer for "SnusFriend" overlaying the homepage.

DRAWER: 440px wide from right side. Dark navy (#1A1A2E) background. Semi-transparent dark overlay on rest of page.

HEADER: "Your Cart (3 items)" in white bold + close X icon. Below: teal (#0F6E56) progress bar at 75% fill. "Spend €12.50 more for FREE shipping!" in small white text.

CART ITEMS (scrollable):
Item 1:
- Thumbnail (60x60) of VELO Freeze X-Strong can
- "VELO Freeze X-Strong" name
- "EXTRA STRONG" red badge + "16mg" gray badge
- "5-Pack" gray pill
- Quantity: [-] 3 [+] stepper buttons
- Per-unit: "€15.80/can"
- Line total: "€47.40" right-aligned
- Trash icon to remove

Item 2:
- ZYN Spearmint thumbnail
- "ZYN Spearmint" name
- "REGULAR" yellow badge + "6mg" gray badge
- "1-Pack" gray pill
- Quantity: [-] 1 [+]
- Per-unit: "€3.20/can"
- Line total: "€3.20"
- Trash icon

UPSELL SECTION: "Complete Your Order" header. 3 small product cards in a row:
- LOOP Jalapeño — €6.90 — "Add" teal button
- XQS Citrus — €5.50 — "Add" teal button
- Skruf Superwhite — €7.20 — "Add" teal button

SUBSCRIPTION: Toggle switch "Subscribe & Save 15%" with description "Never run out of pouches again. Cancel anytime." Shows savings: "You'd save €7.59/order"

SUMMARY:
- Subtotal: €50.60
- Shipping: €4.95 (or "FREE" if over threshold)
- FriendPoints earned: "+50 points"
- Total: €55.55 in large white bold

CHECKOUT BUTTON: Full-width teal "Checkout — €55.55 →" button.

PAYMENT ICONS: Row below button showing Visa, Mastercard, Apple Pay, Google Pay, Klarna logos in muted gray.

TRUST: Small text "Secure checkout · Free returns · 24h support"

Style: Premium dark drawer with clear visual hierarchy. Athletic Brewing cart drawer engineering meets nicokick.com bulk pricing.
```

### Prompt E-v2 — Brand Page (ZYN)

```
Create a brand showcase page for "SnusFriend" featuring the ZYN brand.

HERO BANNER: Full-width gradient from purple (#6C3483) to teal (#0F6E56). ZYN logo large and centered in white. Below: "America's #1 Nicotine Pouch — Now in Europe" tagline. Stats row: "12 Flavors · 3 Strengths · 4.8★ Rating · 2M+ Cans Sold" in white with subtle icons.

NAVIGATION: Horizontal tabs below hero on white background:
"All Products (45)" | "Mint (12)" | "Fruit (8)" | "Citrus (6)" | "Coffee (4)" | "By Strength ▾"

STRENGTH QUICK-FILTER: Three toggle pills:
- "3mg MILD" green
- "6mg REGULAR" yellow
- "9mg STRONG" orange
All selected by default. Click to filter.

PRODUCT GRID: 4-column grid on off-white background. Same card format with can images, strength badges, pack selectors, per-unit pricing, "Add to Cart" buttons.

SIDEBAR (right, 280px):
- "About ZYN" card: Brief brand description, "Since 2016" established date, "Made in Sweden" origin badge
- "ZYN Flavor Guide" CTA card with teal button
- "ZYN Strength Guide" card: Visual guide showing 3mg/6mg/9mg with descriptions
- "Related Brands" mini-carousel: VELO, LOOP, XQS logos

REVIEWS SECTION: "What Customers Say About ZYN" with 3 featured review cards.

SUBSCRIBE BANNER: "Get ZYN Delivered Monthly" with subscription CTA.

Style: Brand-focused with strong hero. Purple-to-teal gradient is unique to ZYN page (each brand gets its own gradient). Clean grid below.
```

### Prompt F-v2 — Mobile Product Browsing (375px viewport)

```
Create a mobile-first product browsing experience for "SnusFriend" at 375px width.

STICKY HEADER (56px): SnusFriend shield logo left, search icon, cart icon with red count badge (3).

SEARCH EXPANDED: When search icon tapped, full-width search bar slides down with "Search 2200+ pouches..." placeholder. Autocomplete suggestions: "ZYN Cool Mint", "VELO Freeze", "Strong Mint".

CATEGORY PILLS: Horizontally scrollable row: All, Mint, Fruit, Strong, Extra Strong, New, Deals. Selected pill is teal filled.

PRODUCT GRID: 2-column grid. Compact cards:
- Product can image (fills card width)
- Brand name small gray
- Product name bold white (on navy card bg)
- Strength: Color badge "STRONG 12mg" in orange
- Pack selector: Small pills "1 · 3 · 5 · 10"
- Price: "€2.85/can" bold + strikethrough original
- "Add" teal button (compact)
- Heart icon overlay on image

FILTER TRIGGER: Sticky button at bottom "Filter & Sort (3 active)" — opens full-screen bottom sheet:
- Sort options at top (Most Popular, Price, Newest, Strength)
- Expandable accordion sections: Brand, Flavor, Strength, Format, Price
- "Show 234 Results" teal button at bottom
- "Clear All" link

BOTTOM NAVIGATION BAR (56px): 5 icons with labels:
- Home (house icon)
- Browse (grid icon) — active/teal
- Search (magnifying glass)
- Wishlist (heart icon, badge "2")
- Cart (bag icon, badge "3")

SWIPEABLE PRODUCT DETAIL PREVIEW: Long-press or swipe up on any product card to show a quick-view sheet (half-screen from bottom) with larger image, full name, strength selector, pack selector, price, "Add to Cart" button.

Style: Thumb-friendly, fast-browsing mobile experience. Large touch targets (48px min). Smooth animations. Bottom nav in the natural thumb zone.
```

### Prompt G-v2 — "Find Your Pouch" Quiz Landing Page

```
Create an interactive quiz page for "SnusFriend": "Find Your Perfect Pouch"

HERO: Navy (#1A1A2E) full-screen hero. Large white headline "What's Your Perfect Pouch?" Subtext "Answer 4 quick questions and we'll recommend pouches matched to your taste." Teal "Start Quiz →" button. Decorative: subtle floating pouch can illustrations in background.

STEP 1 (after clicking Start):
"Are you new to nicotine pouches?"
- "Complete beginner" → icon of seedling
- "Switching from smoking/vaping" → icon of swap arrows
- "Experienced user" → icon of lightning bolt
White card on navy bg, progress bar at top (1/4 teal).

STEP 2:
"What flavors do you enjoy?"
Multi-select flavor cards (2x3 grid):
- Mint (cool blue card, snowflake icon)
- Fruit (coral card, apple icon)
- Berry (purple card, berry icon)
- Citrus (yellow card, lemon icon)
- Coffee (brown card, coffee icon)
- Surprise Me (teal card, dice icon)
Progress bar (2/4).

STEP 3:
"How strong do you like it?"
Visual strength slider with 4 stops:
- Mild (green, "Gentle buzz, great for beginners")
- Regular (yellow, "Noticeable kick, most popular")
- Strong (orange, "Serious strength for experienced users")
- Extra Strong (red, "Maximum intensity")
Progress bar (3/4).

STEP 4:
"How often do you use pouches?"
- "Daily ritual" → recommended: 10-pack subscription
- "A few times a week" → recommended: 5-pack
- "Occasionally" → recommended: single cans
- "Trying for the first time" → recommended: starter variety pack
Progress bar (4/4).

RESULTS PAGE:
"Your Perfect Pouches" headline with confetti animation.
3 personalized product recommendations as large cards with:
- "98% Match" teal badge
- Product image, name, strength badge
- "Why we picked this: You love mint and prefer regular strength"
- Pack selector + price + "Add to Cart"

Below: "Try a Starter Pack" — curated 5-pack bundle based on quiz answers with special price.

"Retake Quiz" link at bottom.

Style: Engaging, modern, interactive. Smooth transitions between steps. Each step animates in from right. Dark theme throughout.
```

---

## PART 4: COMPONENT MAP (shadcn/ui → Design Elements)

| Design Element | shadcn/ui Component | Notes |
|---------------|---------------------|-------|
| Cart drawer | `Sheet` (side="right") | 440px width, dark bg |
| Strength selector | `ToggleGroup` | Color-coded items |
| Pack size selector | `ToggleGroup` variant="outline" | With price labels |
| Search bar | `Command` | With autocomplete popover |
| Strength badges | `Badge` variant="secondary" | Custom color per strength |
| Product cards | `Card` | Custom dark variant |
| Mobile filters | `Sheet` (side="bottom") + `Accordion` | Full-screen bottom sheet |
| PDP tabs | `Tabs` | Description/Ingredients/Reviews |
| Free shipping bar | `Progress` | Teal color, with text overlay |
| Subscription toggle | `Switch` + `Select` | Toggle + frequency dropdown |
| Star ratings | Custom `StarRating` | 5 teal stars |
| Quantity stepper | Custom `QuantityStepper` | [-] N [+] pattern |
| Filter checkboxes | `Checkbox` | With product counts |
| Flavor pills | `ToggleGroup` | Multi-select, colored |
| Brand carousel | Custom `BrandCarousel` | Horizontal scroll, grayscale→color |
| Navigation | Custom `MegaMenu` | Desktop; `Sheet` for mobile |
| Bottom nav (mobile) | Custom `BottomNav` | Fixed, 5 icons |
| Category cards | `Card` | Colored backgrounds, hover shadow |
| Trust badges | Custom `TrustBadge` | Icon + text row |
| Toast notifications | `Toast` (sonner) | "Added to cart" feedback |
| Price display | Custom `PriceDisplay` | Per-unit + savings |
| Filter chips | `Badge` variant="outline" | With X remove button |
| Quiz steps | Custom `QuizStep` | Animated transitions |

---

## PART 5: DESIGN TOKENS (CSS Custom Properties)

```css
/* Backgrounds */
--bg-primary: #FAFAF8;      /* Off-white (light sections) */
--bg-dark: #1A1A2E;          /* Navy (header, product grid, footer) */
--bg-card-dark: #252545;     /* Dark card background */
--bg-subtle: #F5F5F0;        /* Subtle gray (trust bar) */

/* Brand */
--brand-teal: #0F6E56;       /* Primary accent, CTAs */
--brand-teal-light: #E0F2F1; /* Teal tint for backgrounds */
--brand-navy: #1A1A2E;       /* Header, dark sections */

/* Strength System */
--strength-mild: #4CAF50;    /* Green — 1-4mg */
--strength-regular: #FFC107; /* Yellow — 5-8mg */
--strength-strong: #FF9800;  /* Orange — 9-14mg */
--strength-extra: #F44336;   /* Red — 15mg+ */

/* Flavor System */
--flavor-mint: #E3F2FD;      /* Cool blue */
--flavor-fruit: #FFF3E0;     /* Warm coral */
--flavor-berry: #F3E5F5;     /* Purple */
--flavor-citrus: #FFFDE7;    /* Warm yellow */
--flavor-coffee: #EFEBE9;    /* Warm brown */

/* Typography */
--font-display: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', -apple-system, sans-serif;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Spacing */
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;       /* Pills and badges */

/* Shadows */
--shadow-card: 0 1px 3px rgba(0,0,0,0.1);
--shadow-hover: 0 4px 12px rgba(0,0,0,0.15);
```

---

## PART 6: KEY RESEARCH FINDINGS

### Conversion Benchmarks to Target

| Metric | Industry Avg | Target | How |
|--------|-------------|--------|-----|
| Conversion rate | 1.89% | 3-4% | Better product cards + filtering |
| Add-to-cart rate | 6.34% | 8-10% | Pack selectors in cards + sticky CTA |
| Cart AOV | varies | +15% | Free shipping bar + upsells |
| Mobile conversion | low | +25% | Bottom nav + sticky bar + 2-col grid |
| Subscription opt-in | 5.8% | 10%+ | Inline toggle near Add to Cart |

### Top 5 Quick Wins (from Research)

1. **Show price-per-unit everywhere** — 86% of sites don't. We already do. Double down.
2. **Add sticky add-to-cart on mobile PDP** — +10-25% mobile conversion lift.
3. **Set free shipping threshold 20-30% above current AOV** — drives cart value up.
4. **Add star ratings to product cards** — products with 11-30 reviews convert 68% higher.
5. **2-column mobile grid** — current single-column makes browsing painfully slow.

### Accessibility Requirements (Non-Negotiable)

- All strength color badges MUST have text labels ("STRONG 12mg" not just orange dot)
- Color contrast minimum 4.5:1 (WCAG AA)
- Don't rely on red/green alone (colorblind: 8% of males)
- European Accessibility Act (EAA) is now law — legal requirement

---

## PART 7: NEXT STEPS

### Immediate (When You Wake Up)

1. **Approve computer-use access** so I can submit prompts to Stitch
2. **I'll generate all 7 prompts** (A-G) using 3.1 Pro model with Obsidian Teal design system
3. **I'll screenshot, score, and rank** each generation
4. **Round 2:** Combine the best elements from Round 1 into refined prompts

### After Design Selection

1. **Export winning designs** from Stitch
2. **Map to shadcn/ui components** using the component map above
3. **Implement design tokens** (CSS custom properties above)
4. **Start with homepage** → PLP → PDP → Cart Drawer → Brand Page
5. **Mobile-first** — implement responsive breakpoints from the start

### Files Created

| File | Contents |
|------|----------|
| `docs/design-reviews/FINAL-DESIGN-DELIVERABLE.md` | This document (rankings + prompts + component map) |
| `docs/design-reviews/existing-designs-review.md` | Detailed review of all 5 Stitch designs + live site |
| `docs/design-reviews/competitor-research.md` | Research data from 10+ competitor sites |
