# SnusFriends.com Comprehensive Site Audit
**Date:** March 27, 2026
**Scope:** Full site audit covering design, UX, SEO, content, accessibility, legal compliance, and data quality

---

## CRITICAL ISSUES (Fix Before Anything Else)

### 1. Legal Pages Are All 404s
The footer links to Terms of Service, Privacy Policy, and Cookie Policy — **all three return 404**. For an EU e-commerce store selling age-restricted products, this is a legal compliance risk. These pages must exist to comply with GDPR, the Consumer Rights Directive, and the EU ePrivacy Directive.

**Broken URLs:**
- /terms-of-service → 404
- /privacy-policy → 404
- /cookie-policy → 404

**Action:** Create and publish all three legal pages immediately. Include: registered company name, VAT number, registered address, data protection officer contact.

---

### 2. No Legal Entity Disclosed Anywhere
Not a single page on the site identifies the operating company, registered business address, VAT number, or company registration number. EU Distance Selling Regulations require this. The footer just says "SnusFriend" with no legal details.

**Action:** Add company information to the About page and footer. Required: full legal name, business registration number, VAT number, registered office address, contact email.

---

### 3. Brand Count Is Wildly Inconsistent
Three different numbers appear across the site:

| Location | Claimed | Actual |
|---|---|---|
| Homepage hero | 91 brands | 57 brands |
| Homepage USP card | 139 brands | 57 brands |
| About page "Our Mission" | 139 brands | 57 brands |
| Brands page heading | 139 brands | 57 brands |

The product database contains exactly **57 brands** with products. The brands page lists 139 brand entries, but **82 of them have zero products** and show "No products found yet. Check back soon." — these empty brand pages hurt SEO and credibility.

**Action:** Update all brand count references to match reality (57), or clearly mark upcoming brands as "Coming Soon." Remove or hide empty brand pages from the index.

---

### 4. Sitemap Returns 404
`/sitemap.xml` returns a 404 error. Google and other search engines cannot discover your 731 product pages efficiently.

**Action:** Generate and deploy a sitemap.xml. For an Astro site, use `@astrojs/sitemap`. Submit it to Google Search Console.

---

### 5. Two Broken Internal Links on Homepage
The homepage "Take the Quiz" button links to `/quiz` — **404**. The products page text links to `/nicotine-pouches-guide` — also **404**. Both are prominent CTAs that lead to dead ends.

**Action:** Either build these pages or remove the links.

---

### 6. Product Descriptions Still Incomplete on Site
While we generated 731 English SEO descriptions (delivered as xlsx), the live site data shows:
- **486 products (66.5%)** have NO description at all
- **187 products (25.6%)** still show Swedish descriptions
- **Only 51 products (7%)** have English descriptions

**Action:** Import the 731 descriptions from the xlsx we generated into the product database.

---

## HIGH PRIORITY (Fix This Week)

### 7. No Meta Descriptions on Any Page
None of the key pages (homepage, products, brands, about, FAQ, shipping, returns, contact) have meta description tags. Google will auto-generate snippets, reducing click-through rates.

**Action:** Add unique meta descriptions (150-160 chars) to every page template.

---

### 8. Missing Open Graph & Twitter Card Tags
No Open Graph or Twitter Card meta tags exist on any page. When anyone shares a product or page link on social media, it shows a generic preview with no image.

**Action:** Add og:title, og:description, og:image, og:url, and twitter:card tags to all page templates. Product pages should use the product image.

---

### 9. Missing Canonical URLs
No canonical URLs are declared, which means filtered/sorted product page variations (e.g., `?sort=price&strength=strong`) can be treated as duplicate content by Google.

**Action:** Add self-referencing canonical tags to all pages. For filtered product pages, canonical should point to the base `/products` URL.

---

### 10. Brands Page Has Blank Cards
When scrolling down the /brands page, many brand cards render as completely empty white boxes — no text, no initials, no logo. This appears to be a lazy-loading or rendering bug.

**Action:** Debug the brand card rendering. Likely a JS hydration issue with Astro islands for brands that have incomplete data.

---

### 11. No Brand Logos Anywhere
All brand cards (even working ones) show grey circles with letter initials instead of actual brand logos. For a premium e-commerce experience, this looks unfinished.

**Action:** Source and add brand logos for all 57 active brands. Use the grey initials only as a fallback.

---

### 12. Zero Customer Reviews
The review system exists on every product page (with star rating bars and "Write a Review" button), but every single product shows 0 reviews across all ratings. This hurts conversion — showing empty reviews is worse than showing no review section at all.

**Action:** Either seed initial reviews, hide the review section until there are reviews, or implement a post-purchase review request email flow.

---

### 13. Missing Product Alt Text
Product images lack descriptive alt text, hurting both SEO and accessibility.

**Action:** Set alt text to `{Brand} {Product Name} nicotine pouches` for all product images.

---

### 14. Best Sellers Section Only Shows 77 Pouches + ACE
The homepage "Best Sellers" carousel appears to show products only from 77 Pouches and ACE. For "most popular pouches this week," this seems like hardcoded data rather than actual sales data.

**Action:** Connect best sellers to real order data, or manually curate a diverse brand mix.

---

## MEDIUM PRIORITY (Fix This Month)

### 15. No Product Schema Markup on Listing Page
The `/products` listing page has no Product schema markup. Individual product pages have Organization and WebSite schema but may be missing complete Product schema (price, availability, reviews).

**Action:** Add JSON-LD Product schema to product detail pages. Add ItemList schema to the products listing page.

---

### 16. Missing BreadcrumbList Schema
Breadcrumbs are visible on pages (Home / Products / Brand Name) but lack BreadcrumbList structured data, missing a rich snippet opportunity.

**Action:** Add BreadcrumbList JSON-LD schema matching the visible breadcrumb navigation.

---

### 17. FAQ Page Missing Schema on Some Questions
FAQ page has accordion items but FAQ schema may not cover all questions. Proper FAQPage schema enables rich results in Google.

**Action:** Ensure every FAQ accordion item is included in the FAQPage schema markup.

---

### 18. Large Empty Whitespace on Mobile Homepage
On mobile viewport (375px), there's a large blank area below the Best Sellers section before the content continues. This wastes valuable above-the-fold space.

**Action:** Debug mobile layout — likely a CSS issue with the best sellers carousel or the section below it.

---

### 19. No hreflang Tags
Site serves English content but has Swedish product descriptions mixed in. No hreflang tags indicate language targeting.

**Action:** If the site is English-only, add `<html lang="en">` and ensure all content is English. If multilingual is planned, implement hreflang properly.

---

### 20. "Choose Your Vibe" Theme Switcher Has No Labels
The footer theme color circles have no tooltips, labels, or accessible names. Users don't know what the colors mean.

**Action:** Add aria-labels and tooltips to theme switcher buttons (e.g., "Forest theme," "Velo theme").

---

### 21. Age Gate Uses Only localStorage
The 18+ age verification gate relies on localStorage, meaning it can be trivially bypassed and doesn't persist across browsers/devices. For selling nicotine products in the EU, you may need a more robust solution.

**Action:** Evaluate whether a server-side age verification is needed for compliance. At minimum, add session-level verification.

---

### 22. Render-Blocking JavaScript
Sentry error tracking and theme initialization scripts load early and can block page rendering. This impacts Core Web Vitals (LCP, FID).

**Action:** Defer Sentry loading. Load theme script asynchronously or inline the critical theme CSS.

---

### 23. No WebP Images
Product images appear to be JPEG/PNG only. WebP format can reduce image size by 25-35% with no visible quality loss.

**Action:** Serve images in WebP format with JPEG fallback. Astro's `<Image>` component supports this natively.

---

## LOW PRIORITY (Backlog)

### 24. "What's New" Page Is Developer-Facing
The /whats-new page reads like release notes (v1.5.0, v1.4.0, etc.) rather than customer-facing content. Most users don't care about version numbers.

**Action:** Rename to "Updates" and rewrite in customer-friendly language ("We just made the site faster!" vs "Rebuilt on Astro").

---

### 25. Newsletter Subscribe Has No Incentive
The footer newsletter signup says "New drops, deals & guides — no spam." but offers no discount or specific incentive. For e-commerce, a 10% first-order discount typically converts 3-5x better.

**Action:** Add a first-order discount incentive to the newsletter signup.

---

### 26. No Social Media Links
The footer has no links to any social media profiles (Instagram, TikTok, etc.).

**Action:** Add social media profile links to the footer if profiles exist.

---

### 27. Search Functionality Not Tested
The search icon is present in the header but search behavior and results quality haven't been verified in this audit.

**Action:** Test search for common queries (brand names, flavors, "strong mint") and ensure results are relevant.

---

### 28. "Unknown" Brand Exists in Data
One product is categorized under brand name "Unknown" with no manufacturer. This should be corrected.

**Action:** Identify the product (slug: check products.json for brand="Unknown") and assign it to the correct brand.

---

### 29. All Products Show stock=999
Every product shows stock level 999, which suggests inventory isn't being tracked or is permanently set to "in stock." This could cause overselling.

**Action:** If inventory tracking is important, connect real stock data. If not, the current approach is fine.

---

### 30. No robots.txt Sitemap Reference
robots.txt exists but may not reference the sitemap URL (which is also 404).

**Action:** After creating sitemap.xml, add `Sitemap: https://www.snusfriends.com/sitemap.xml` to robots.txt.

---

## WHAT'S WORKING WELL

- Clean, modern design with consistent forest-green brand identity
- Responsive mobile layout adapts well (products grid collapses to 2-col)
- Fast Astro-based static site with good perceived performance
- Product detail pages are well-structured (image, specs, pricing tiers, description, reviews section)
- Breadcrumb navigation on all inner pages
- Free shipping banner is prominent and clear
- Shipping and Returns pages are thorough and EU-compliant
- FAQ page has proper accordion UI with good questions
- Multi-pack pricing with per-can breakdown is excellent UX
- Filter sidebar on products page works well
- Product data quality is excellent (zero missing fields, 100% image coverage, no duplicates)
- Age verification gate is present
- Contact page has clear response time expectations

---

## EXECUTION PLAN

### Week 1: Legal & Critical Fixes
1. Create Terms of Service, Privacy Policy, Cookie Policy pages
2. Add company legal entity information
3. Fix brand count to say "57 brands" everywhere
4. Deploy sitemap.xml
5. Remove or fix "Take the Quiz" and "nicotine pouches guide" broken links
6. Import the 731 English product descriptions

### Week 2: SEO Foundation
7. Add meta descriptions to all page templates
8. Add Open Graph + Twitter Card tags
9. Add canonical URLs
10. Add Product schema markup to product pages
11. Add BreadcrumbList schema
12. Fix alt text on all product images

### Week 3: UX & Design Polish
13. Fix blank brand cards on brands page
14. Add brand logos (source from manufacturers)
15. Fix mobile homepage whitespace
16. Label the theme switcher
17. Curate diverse best sellers
18. Add social media links

### Week 4: Performance & Optimization
19. Convert images to WebP
20. Defer render-blocking scripts
21. Implement review request flow
22. Add newsletter discount incentive
23. Clean up "Unknown" brand
24. Add hreflang if needed
