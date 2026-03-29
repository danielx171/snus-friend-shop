# SnusFriend.com — Design & UX Audit

**Date:** March 27, 2026
**Site:** www.snusfriends.com
**Tech stack:** Astro (static site generator), Nanostores, PostHog analytics, Sentry error tracking

---

## Overall Impression

The site has a clean, minimal aesthetic with a pleasant forest-green color palette. The layout is well-structured and the brand feels trustworthy. However, there are several visual inconsistencies, content gaps, and UX friction points that undermine the polished foundation. The biggest opportunities are in the hero section (too empty), social proof (absent), and the "Shop by Brand" section (dense wall of text).

---

## Critical Issues

### 1. Hero Section Feels Empty and Generic
The hero area is almost entirely blank — just text on a faint gradient background with no imagery. For an e-commerce site selling physical products, this is a missed opportunity. There's no product photography, no lifestyle imagery, no visual hook.

**Recommendation:** Add a hero image or product collage. Show the actual pouches, a lifestyle shot, or an animated product carousel. This is the first thing visitors see — it needs to sell.

### 2. "Best Sellers" Only Shows One Brand (77 Pouches)
All 8 best-seller products are from the same brand. This makes the selection look narrow despite claiming 700+ products from 91+ brands. It signals that either the inventory is limited or the algorithm is broken.

**Recommendation:** Curate best sellers across at least 4-5 different brands to showcase variety and credibility.

### 3. Brand Count Inconsistency
The hero says "91 leading brands" but the "Why Shop With Us" section and brands page say "139 brands." Pick one and use it everywhere.

**Recommendation:** Audit all copy for the correct number and update globally.

### 4. Missing Product Image Alt Text
Product images appear to lack alt text, which is both an accessibility failure (screen readers can't describe products) and an SEO miss.

**Recommendation:** Add descriptive alt text to every product image (e.g., "77 Apple Mint Medium nicotine pouch can").

---

## Visual / Design Fixes

### 5. "NewPrice" Badge Rendering Issue
On product cards, there's a badge that reads "NewPrice" (no space) overlapping with the "popular" badge. The text appears cut off and looks unfinished.

**Recommendation:** Fix the badge to read "New Price" or "Sale" with proper spacing, and ensure it doesn't overlap the "popular" tag.

### 6. No Visual Hierarchy in "Shop by Brand" Section
The brands page is a dense alphabetical wall of 139 brand names with no logos, no images, and no visual differentiation. On the homepage, brands are listed as text links — again, no logos.

**Recommendation:** Add brand logos/thumbnails. On the brands page, add a search/filter bar and consider grouping by popularity or category in addition to alphabetical.

### 7. "Why Shop With Us" Cards Could Be Stronger
The four benefit cards (Free Shipping, 700+ Products, Fast EU Delivery, Verified Reviews) use generic line icons and feel like placeholder content. They don't stand out visually.

**Recommendation:** Use bolder icons or illustrations, add subtle color backgrounds, or include micro-stats (e.g., "4.8★ avg rating" under Verified Reviews).

### 8. Footer Theme Switcher ("Choose Your Vibe") Is Confusing
The colored dots at the bottom of the footer let you switch themes but have no labels, no tooltips, and no explanation. Most users won't understand what they do.

**Recommendation:** Either add labels/tooltips to the theme dots, or move this feature to a settings/preference area. It's a fun feature but buried and unexplained.

### 9. CTA Buttons Could Use More Contrast
The primary CTA ("Shop All Pouches") uses a dark forest green that blends with the overall color scheme. The secondary CTA ("Browse Brands") has a light outline style that looks clickable but could be more distinct.

**Recommendation:** Make the primary CTA slightly brighter or add a subtle hover animation. Consider a contrasting accent color for key conversion buttons.

### 10. Mobile: Buttons Stack Vertically but Could Be Bigger
On mobile, the hero CTAs stack nicely but the touch targets could be taller. The "Add to Cart" buttons on product cards are also quite small.

**Recommendation:** Increase button height to at least 48px on mobile for comfortable tap targets (WCAG recommendation).

---

## Content & UX Improvements

### 11. No Social Proof Anywhere
There are zero customer testimonials, review counts, trust badges (Trustpilot, Google Reviews), or user-generated content. The site claims "Verified Reviews" as a selling point but shows none.

**Recommendation:** Add a reviews section on the homepage, display star ratings on product cards, and integrate a review platform (Trustpilot, Judge.me, etc.).

### 12. About Page Has No Visuals
The about page is entirely text — no team photos, no warehouse shots, no brand story imagery. For building trust in an age-restricted product category, this matters.

**Recommendation:** Add at least 2-3 images: team/founder photo, warehouse/shipping operation, or product lifestyle shot.

### 13. No Shipping Banner or Urgency Cues
There's no persistent banner showing the free shipping threshold (€29), no "order by X for next-day dispatch" messaging, and no urgency elements.

**Recommendation:** Add a slim top banner: "Free shipping on orders over €29 | Dispatched within 24 hours." This drives conversions.

### 14. Search UX Is Unclear
The search icon exists in the header but there's no search bar visible. Users have to click to discover it exists.

**Recommendation:** On desktop, show an expanded search bar in the header. On mobile, the icon is fine but could benefit from a placeholder text hint.

### 15. Missing "New Arrivals" or "What's Trending" Section
The homepage only has "Best Sellers." Adding a second product section (new arrivals, trending, or staff picks) would increase browsing depth and show the catalog is actively updated.

**Recommendation:** Add a "New Arrivals" or "Trending Now" carousel below best sellers.

### 16. Age Gate Redirects to Google
When a user clicks "I am under 18," they get redirected to google.com. This feels abrupt and unprofessional.

**Recommendation:** Redirect to a custom page explaining why the site is age-restricted, with links to health resources.

---

## Accessibility

### 17. No Skip-to-Content Link
There's no visible skip navigation link for keyboard users.

### 18. Color Contrast on Subtext
The light gray body text on the cream background may not meet WCAG AA contrast ratios (4.5:1 minimum for normal text).

**Recommendation:** Test all text/background combinations and darken the body text color if needed.

### 19. Strength Indicator Dots Lack Labels
The small colored dots showing nicotine strength on product cards have no text labels or aria descriptions. Color alone shouldn't convey information.

**Recommendation:** Add a text label or tooltip that says the strength level (e.g., "Medium - 10.4mg").

---

## Priority Summary

| Priority | Fix | Impact |
|----------|-----|--------|
| 🔴 High | Add social proof / reviews | Trust & conversion |
| 🔴 High | Fix hero section with imagery | First impression |
| 🔴 High | Fix brand count inconsistency | Credibility |
| 🔴 High | Fix "NewPrice" badge overlap | Visual polish |
| 🟡 Medium | Add product image alt text | Accessibility & SEO |
| 🟡 Medium | Add shipping banner | Conversion |
| 🟡 Medium | Diversify best sellers across brands | Perceived selection |
| 🟡 Medium | Add brand logos to brands page | Visual appeal |
| 🟡 Medium | Improve age gate redirect | Professionalism |
| 🟢 Low | Label theme switcher dots | UX clarity |
| 🟢 Low | Expand search bar on desktop | Discoverability |
| 🟢 Low | Add "New Arrivals" section | Engagement |
