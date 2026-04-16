# Mobile UX Audit Report: SnusFriend
**Date:** 2026-03-29
**Viewport:** 390×844 (iPhone SE / Mobile Web Standard)
**Site:** snusfriends.com
**Status:** LIVE — Astro 6 Migration (Production)

---

## Executive Summary

SnusFriend's mobile experience is **functionally strong but has critical gaps in discoverability and navigation**. The Product Detail Page (PDP) is class-leading, but the Product Listing Page (PLP) has a blocking issue with missing product images that kills conversion. Mobile navigation lacks standard patterns (sticky bottom nav, persistent search) expected by modern e-commerce users.

**Critical Issue Count:** 1
**High-Priority Issues:** 2
**Medium-Priority Issues:** 3
**Low-Priority Issues:** 4

---

## Critical Issues

### 1. **P0: Product Images Missing on PLP (/products)**
**Severity:** CRITICAL — Conversion Killer
**Pages Affected:** Shop All Nicotine Pouches (filterable product grid)
**Evidence:** Product card images render blank/white on PLP, while identical images load correctly on homepage Best Sellers section.

**Symptoms:**
- Product card structure renders (image placeholder, brand name, product name, strength dots, flavor tags, price, "Add to Cart" button all visible)
- Image `<img>` element or `<picture>` source is empty or broken
- "Popular" badges render correctly, so card structure is intact
- **Same product with same image source loads fine on homepage** — suggests lazy-loading or different image path on PLP

**User Impact:**
- Users cannot evaluate products before purchase
- Decision friction increases significantly
- Likely high cart abandonment on PLP
- Creates false perception of broken site

**Potential Root Causes:**
1. PLP uses different image loader than homepage (e.g., `<Image />` component vs. `<img>`)
2. Lazy-loading threshold not triggering on PLP grid layout
3. Image path differs between homepage and PLP data source
4. `srcset` or responsive image breakpoint missing for 390px viewport
5. Image optimization pipeline (Astro Image, Vercel Image Optimization) has conditional logic that fails on PLP

**Recommended Investigation:**
- Compare homepage Best Sellers grid component with PLP FilterableProductGrid in browser DevTools
- Check network tab for 404 errors or missing image requests
- Verify image `src` and `srcset` attributes in both contexts
- Check if PLP uses different product data structure than homepage loader
- Confirm image CDN (Vercel Image Optimization vs. raw S3) serves both contexts

**Recommended Fix:**
- Normalize image source across all product grid contexts (homepage, PLP, search results)
- If using `<Image />` component, ensure `alt`, `width`, `height` are always provided
- Add fallback image if product image unavailable
- Test image loading on slow 3G network (DevTools throttling)
- Add Sentry error boundary around product cards to catch missing images

---

## High-Priority Issues

### 2. **P1: No Sticky Bottom Navigation**
**Severity:** HIGH — UX Friction
**Pages Affected:** All pages
**Standard Pattern:** iOS-style bottom tab bar (Home, Search, Cart, Account) or Android-style persistent navigation

**Current State:**
- Navigation only available in:
  - Top header (hamburger menu, cart icon)
  - Hamburger panel (left drawer, text-only, must scroll to see)
- Users must scroll entire page length to access navigation
- On 6-7 section pages (homepage), this requires ~3-4 scroll swipes

**Competitor Benchmarks:**
- **Haypp** (competitor): Sticky bottom bar with Home, Search, Cart, Account icons + unread count badges
- **Snus.se** (competitor): Bottom navigation with visual icons
- **Nicopods.com** (competitor): Top sticky header + persistent search bar

**User Impact:**
- Increased friction for cart access (users expect cart icon, not hamburger)
- Search discovery reduced (hidden behind icon in top header)
- Account/login access unclear (only visible in hamburger)
- Higher bounce rate on long pages

**Recommended Fix:**
1. Add sticky bottom navigation bar (iPhone-style)
   - 5 tabs: Home, Search, Brands, Cart (with badge), Account
   - ~50–60px height, dark forest background with white/light icons
   - Tabs use 24–32px icons from `lucide-react`
   - Cart tab shows badge with item count
   - Account tab shows user initial or login prompt
2. Adjust main content bottom padding to prevent overlap
3. Hide bottom nav on:
   - Checkout pages (CheckoutForm, CheckoutHandoff)
   - Auth pages (login, register)
   - Admin/ops pages
4. Test on iOS Safari (sticky positioning) and Android Chrome (safe area insets)

---

### 3. **P1: Mobile Hamburger Menu Lacks Visual Hierarchy**
**Severity:** HIGH — Limited Feature Discoverability
**Pages Affected:** All pages (accessible via hamburger icon in header)

**Current State:**
- Left drawer panel opens with text-only links:
  - SHOP (Products, Brands)
  - BY STRENGTH (Light, Normal, Strong, Extra Strong, Super Strong)
  - BY FLAVOR (Mint, Citrus, Berry, Coffee, Tobacco, Tropical)
  - COMMUNITY
- No icons, no images, no visual grouping
- Flat list structure with minimal contrast
- No quick-access features (wishlist, profile, settings)

**User Impact:**
- Menu is functional but feels basic compared to competitors
- Strength/flavor categories are hard to scan
- Community section not visually distinct
- Gamification features (quests, points, leaderboard) buried

**Competitor Benchmarks:**
- **Haypp:** Menu with category icons, featured product carousel, community links with icons
- **Snus.se:** Menu with color-coded strength levels, brand carousel, user account status visible

**Recommended Fix:**
1. Add icons to all menu sections
   - SHOP → shopping-bag icon
   - BY STRENGTH → strength-level icons or colored squares
   - BY FLAVOR → flavor-specific icons (mint leaf, citrus, etc.)
   - COMMUNITY → users/trophy icons
2. Add user section at top if logged in
   - Profile name/email
   - Points balance
   - Recent orders link
3. Add featured brand carousel below main menu (2–3 top brands)
4. Separate gamification links (Leaderboard, Daily Spin, Quests) into dedicated section with icons
5. Add Settings + Theme Picker to menu (instead of buried in footer)

---

## Medium-Priority Issues

### 4. **P2: Brands Page Has Text-Heavy Mobile Layout**
**Severity:** MEDIUM — Low Engagement on Brands Page
**Pages Affected:** `/brands`

**Current State:**
- Three full paragraphs of SEO copy at top (~600px on mobile before brand grid is visible)
- Brand grid appears only after user scrolls past all text
- SEO content is important for organic search but delays visual engagement

**User Impact:**
- Users expect to see brands immediately
- Organic traffic landing on `/brands` (from "Best Nicotine Pouch Brands" search) sees text wall first
- Bounce rate likely high if grid is not immediately visible

**Recommended Fix:**
1. On mobile (≤768px breakpoint):
   - Collapse SEO text into accordion: `<summary>Why Choose SnusFriend Brands? (Learn More)</summary>`
   - Keep accordion closed by default
   - Display brand grid immediately below collapsed accordion
   - On desktop, display full text above grid (existing layout)
2. Alternatively, move SEO text to below the grid on mobile
3. Add count badge to collapsed section: "(Learn More — 3 reasons)"

---

### 5. **P2: Hero Section Text-Heavy on Mobile**
**Severity:** MEDIUM — Above-Fold Optimization
**Pages Affected:** Homepage (`/`)

**Current State:**
- Hero includes:
  1. Trust bar with rotating messages (good)
  2. Subtitle: "EUROPE'S NICOTINE POUCH SHOP" (small, light)
  3. Headline: "Premium Nicotine Pouches" (large)
  4. Description paragraph (~60 words)
  5. Stats row (708+ Cans, 55 Brands, Free EU Shipping)
  6. Two CTAs: "Shop All Pouches" + "Take the Flavour Quiz"
  7. Brand logo carousel
- Significant vertical scroll required before Best Sellers visible on 390px viewport

**User Impact:**
- Below-the-fold content starts ~400–500px down (Best Sellers not visible without scroll)
- Mobile users may not reach key conversion points without scrolling
- Text-heavy approach less impactful than visual hierarchy

**Recommended Fix:**
1. On mobile (≤640px):
   - Keep subtitle, headline, stats row
   - Shorten description to 1–2 sentences (remove sentence 3–4)
   - Stack CTAs vertically instead of side-by-side
   - Move brand logo carousel below Best Sellers (less critical)
2. Consider making hero image more prominent:
   - Current: text-over-gradient
   - Consider: hero image with overlay text (more visual)
3. Ensure Best Sellers grid is visible within first viewport (no scroll)

---

### 6. **P3: No "Back to Top" Floating Button**
**Severity:** LOW — QoL Enhancement
**Pages Affected:** Homepage (especially), any long-form pages (Brands, Blog articles)

**Current State:**
- Homepage is 8–10 sections long (~2000–2400px total)
- User reaching footer must manually scroll back to top to access different section
- Hamburger menu provides navigation but Back to Top is faster UX

**User Impact:**
- Minor friction on long pages
- Not critical, but standard on mobile e-commerce sites

**Recommended Fix:**
1. Add floating button that appears after user scrolls past hero (e.g., 400px down)
2. Position bottom-right, above sticky navigation bar (60px from bottom on mobile)
3. Use arrow-up icon, click scrolls to top smoothly
4. Hide when user is already at top

---

## Low-Priority Issues

### 7. **P3: Theme Picker Buried in Footer**
**Severity:** LOW — Discoverability (Temporary Issue)
**Pages Affected:** All pages (footer)

**Current State:**
- "Choose your vibe" with 5 colored circles (forest/dark/light/cyberpunk/minimalist themes)
- Located at absolute bottom of footer
- Small circles, no labels visible until hover
- Most users will never discover this feature

**Context:**
Per `CURRENT_PRIORITIES.md`, theme cleanup is planned (reduce from 5 to 2 themes: forest + dark). Once completed, this becomes a simple toggle.

**Recommended Fix (Post-Theme-Cleanup):**
1. After consolidating to 2 themes, promote toggle to header or sticky nav
2. Use sun/moon icon toggle instead of color circles
3. Store preference in localStorage (already done)
4. For now, keep footer placement but add labels on mobile

---

### 8. **P3: Search Bar Not Persistent on Homepage**
**Severity:** LOW — Minor Discoverability
**Pages Affected:** Homepage (`/`)

**Current State:**
- Search icon in top header (magnifying glass)
- Tapping icon opens search interface
- No persistent search bar on homepage (unlike competitors)

**User Impact:**
- Users may not realize search exists
- Extra tap required vs. always-visible search bar

**Recommended Fix:**
1. Consider persistent search bar below hero on homepage
2. Make sticky when scrolling (stays below header)
3. On search results page, keep sticky at top
4. On other pages (PDP, Brands), keep as header icon only
5. Track search usage metrics before prioritizing this

---

### 9. **P3: Breadcrumb Navigation Not Visible on All Pages**
**Severity:** LOW — SEO/Navigation Helper
**Pages Affected:** Brand pages, potentially PDP

**Current State:**
- Breadcrumbs visible on some pages (PDP confirmed)
- May not be present on all category/filter pages

**User Impact:**
- Users unsure of current location in hierarchy
- Minor usability friction

**Recommended Fix:**
1. Ensure breadcrumbs present on: PDP, category pages, brand pages, search results
2. Keep implementation lightweight on mobile (single-line, no wrapping)
3. Use ">" separator for clarity

---

### 10. **P3: Cart Icon Badge Could Be More Prominent**
**Severity:** LOW — Enhancement
**Pages Affected:** All pages (header)

**Current State:**
- Cart icon with white badge showing item count (e.g., "1")
- Badge is visible and functional
- Works well

**User Impact:**
- None (currently adequate)

**Recommendation:**
- Keep as-is; working correctly

---

## Strengths: What Works Well ✅

### Pages with Strong Mobile UX

#### **Product Detail Page (PDP)**
- Large, clear product image with multiple views
- Sticky bottom bar with "Add to Cart" + price (always accessible)
- Clean 2×2 grid for product specs (nicotine mg, portions, format, price/pouch)
- Pack size selector (1/3/5/10) with clear visual distinction
- Description section with key info
- Customer Reviews section present
- **Overall:** Best-designed page on mobile — conversion-optimized layout

#### **Homepage Best Sellers & New Arrivals Grids**
- 2-column responsive grid works well at 390px
- Product cards are compact but show all key info:
  - Brand name
  - Product name
  - Strength dots (visual indicator)
  - Flavor tags
  - Price
  - "Add to Cart" button
- Image loading works correctly (unlike PLP)
- Good use of space without cramping

#### **Trust Bar**
- Rotating messages at very top ("Trusted by EU customers", "Same-Day Dispatch", "Free EU Shipping Over €29")
- Sets trust tone immediately
- Doesn't take excessive vertical space
- Auto-rotation keeps fresh

#### **Brand Tin Lid Icons**
- Visual brand identity via tin circle icons
- Distinctive and memorable
- Works well on both homepage carousel and brands page grid

#### **Header**
- Compact and functional: Logo left, Search + Login + Cart + Hamburger right
- Icon-based approach saves space
- Cart badge with count
- Clear visual hierarchy

#### **Stats Row**
- "708+ Cans | 55 Brands | Free EU Shipping"
- Builds trust without text-heavy paragraphs
- Good use of numbers to quantify offering
- Positioned well below headline

---

## Summary by Page

| Page | Strengths | Issues | Priority |
|------|-----------|--------|----------|
| **Homepage** | Trust bar, hero stats, Best Sellers grid, brand carousel, gamification CTAs | Hero text-heavy, long page, no back-to-top, theme picker buried | P2 (hero), P3 (back-to-top) |
| **PDP** | Sticky cart bar, large image, specs grid, pack selector, reviews | None | ✅ No changes needed |
| **PLP (/products)** | Card structure correct, filters work | **Blank product images** | **P0 CRITICAL** |
| **Brands (/brands)** | Brand grid, visual tin icons, SEO content | SEO text wall blocks grid, menu feels flat | P1 (menu), P2 (text layout) |
| **Mobile Menu** | Accessible, text links correct | No icons, no visual hierarchy, missing account section | P1 |
| **Navigation** | Header icons clear, hamburger accessible | No sticky bottom nav, search not persistent | P1 |

---

## Recommended Implementation Order

### Phase 1: Critical (This Sprint)
1. **Fix blank PLP images** — Unblock conversion immediately
   - Investigate image source/loader mismatch
   - Test with DevTools, compare homepage vs. PLP
   - Deploy fix and verify on staging

### Phase 2: High-Impact (Next Sprint)
2. **Add sticky bottom navigation** — Standard UX pattern
   - Design 5-tab bar (Home, Search, Brands, Cart, Account)
   - Implement in Astro layout wrapper
   - Hide on checkout/auth pages
3. **Enhance mobile hamburger menu** — Visual upgrades
   - Add icons to all menu sections
   - Add user section (if logged in)
   - Add gamification section with icons

### Phase 3: Polish (Following Sprint)
4. **Collapse SEO text on Brands mobile** — Improve UX flow
5. **Optimize hero for mobile** — Reduce text-heavy feel
6. **Add back-to-top button** — QoL enhancement

### Phase 4: Future
7. Persistent search bar (post-analytics review)
8. Theme picker redesign (post-theme-cleanup from 5→2)

---

## Testing Checklist for Fixes

- [ ] Test images load on 390×844 at 3G throttle (DevTools)
- [ ] Verify sticky bottom nav appears/hides at correct breakpoints
- [ ] Test bottom nav on iOS Safari + Android Chrome
- [ ] Confirm bottom nav hidden on checkout/auth/ops pages
- [ ] Check hamburger menu icons render correctly
- [ ] Test Brands page accordion open/close on mobile
- [ ] Verify back-to-top button appears after scroll threshold
- [ ] Test all CTAs still accessible with bottom nav in place
- [ ] Lighthouse performance score remains >75 on mobile
- [ ] No CLS (Cumulative Layout Shift) from new elements

---

## Appendix: Viewport & Device Context

**Testing Device:** iPhone SE (390×844, 2nd gen 2020)
**Breakpoints Relevant to Audit:**
- Mobile: 0–640px
- Tablet: 640–1024px
- Desktop: 1024px+

**Current Astro config:** `src/pages/` (SSG + SSR hybrid), Tailwind v4 responsive, React islands for interactive components

---

## Related Documentation

- `ROADMAP.md` — Overall progress and next steps
- `CURRENT_PRIORITIES.md` — Active workstreams
- `docs/superpowers/specs/2026-03-28-visual-upgrade-design.md` — Visual design strategy
- `cowork/README.md` — Cowork audit summary

---

**Report prepared:** 2026-03-29
**Next review recommended:** After Phase 1 fixes deployed (approx. 1 week)
