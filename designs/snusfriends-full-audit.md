# SnusFriend.com — Comprehensive Site Audit

**Date:** March 27, 2026
**Audited by:** Claude (Design Critique, Accessibility Review, UX Copy, Content Analysis)
**Pages reviewed:** Homepage, Products, Product Detail, Brands, About, FAQ, Shipping, Returns, Contact, Login, Flavor Quiz, Privacy, Terms

---

## Executive Summary

SnusFriend is a well-structured Astro-based e-commerce site selling nicotine pouches across the EU. The foundation is solid — clean design, good tech stack, comprehensive product catalog (731 products, 139 brands). However, there are **critical data integrity issues** (conflicting nicotine values, untranslated descriptions), **missing trust signals** (no reviews despite having a review system), and **several visual polish items** that collectively undermine the professional impression. The quiz feature isn't live yet, and several pages have content gaps.

Below is every finding, organized by severity and category, ready for sprint planning.

---

## 🔴 CRITICAL — Fix Immediately

### 1. Product Description Language Mismatch
**Page:** Product detail pages (e.g., /products/77-apple-mint-medium)
**Issue:** Product descriptions are in **Swedish**, not English. The site is positioned as an English-language EU shop, but descriptions read: *"77 Apple Mint Medium 16mg är en vit nikotinpåse med smak av grönt äpple och mint."*
**Impact:** Confusing for non-Swedish customers. Looks unfinished. Hurts SEO for English keywords.
**Fix:** Translate all product descriptions to English. Consider offering multi-language support later.

### 2. Nicotine Strength Data Conflict
**Page:** Product detail pages
**Issue:** The spec card shows **10.4mg** but the description text says **16mg**. The strength label says **"Extra Strong"** but the product name says **"Medium"**. Three conflicting data points on one page.
**Impact:** Customers making health decisions based on nicotine content. Incorrect data is a serious trust and potentially legal issue.
**Fix:** Audit every product's nicotine value across all data sources (name, description, spec card, strength label). Establish one canonical value per product.

### 3. Brand Count Inconsistency
**Pages:** Homepage hero ("91 brands"), About page ("91 brands"), Why Shop section ("139 brands"), Brands page (139 brands listed)
**Issue:** Two different numbers used across the site.
**Fix:** Pick the accurate number and update globally. If 139 is correct, update hero and about page. If 91 is legacy, update the brands page.

### 4. Flavor Quiz Not Functional
**Page:** /flavor-quiz
**Issue:** Displays "Coming Soon" with no interactive elements. The homepage prominently promotes "Take the Quiz" as a primary CTA.
**Impact:** Broken promise. Users click expecting a quiz and get nothing.
**Fix:** Either launch the quiz or remove/deprioritize the CTA until it's ready. Replace with a working alternative (e.g., curated collections by flavor).

### 5. No Legal Entity in Privacy Policy
**Page:** /privacy
**Issue:** The privacy policy names "SnusFriend" as data controller but provides no registered company name, address, registration number, or VAT number. GDPR requires formal identification of the data controller.
**Impact:** Potential GDPR non-compliance.
**Fix:** Add full legal entity details (company name, registration number, registered address).

### 6. Terms of Service Marked as "Under Review"
**Page:** /terms
**Issue:** The terms state they "are under review by our legal team and may be updated." This undermines legal enforceability.
**Fix:** Finalize the terms with legal counsel and remove the disclaimer.

---

## 🟡 HIGH PRIORITY — Plan for Next Sprint

### 7. Zero Customer Reviews
**Page:** Product detail pages, Homepage
**Issue:** The reviews section exists on product pages but every product shows "No reviews yet." The homepage claims "Verified Reviews" as a selling point.
**Impact:** Major trust gap. Social proof is one of the top conversion drivers in e-commerce.
**Fix:** Implement a post-purchase review request email flow. Consider seeding with early customer reviews. Add aggregate rating to homepage.

### 8. Hero Section Has No Product Imagery
**Page:** Homepage
**Issue:** The hero area is text-only on a faint green gradient. No product photos, no lifestyle imagery, no visual hook.
**Impact:** Weak first impression. E-commerce sites need to show products immediately.
**Fix:** Add a hero image — product arrangement, lifestyle shot, or animated product showcase.

### 9. Best Sellers Only Shows One Brand
**Page:** Homepage
**Issue:** All 8 best-seller products are from "77 Pouches." Despite having 139 brands, the homepage only represents one.
**Impact:** Makes the catalog look limited. Doesn't showcase variety.
**Fix:** Curate best sellers from at least 4-5 brands. Consider a "Staff Picks" or "New Arrivals" section alongside.

### 10. "NewPrice" Badge Visual Bug
**Page:** Homepage product cards, Products page
**Issue:** Badge text reads "NewPrice" (no space) and overlaps with the "popular" badge. Appears clipped.
**Fix:** Fix badge text to "New Price" or "Sale." Add spacing logic to prevent badge overlap.

### 11. Missing Product Image Alt Text
**Page:** Sitewide (product cards, product detail)
**Issue:** Product images lack descriptive alt text.
**Impact:** Accessibility failure (WCAG 1.1.1). Also hurts image SEO.
**Fix:** Generate alt text for all product images programmatically (e.g., "[Brand] [Product Name] [Format] nicotine pouch can").

### 12. No Shipping/Free Delivery Banner
**Page:** Sitewide
**Issue:** The €29 free shipping threshold is buried on the shipping page. No persistent banner or header strip communicates this.
**Impact:** Missed conversion optimization. Free shipping thresholds drive larger orders.
**Fix:** Add a slim top-of-page banner: "Free EU shipping on orders over €29 | Dispatched same day before 2pm CET."

### 13. Brands Page Has No Logos or Visual Identity
**Page:** /brands
**Issue:** 139 brands displayed as plain text with two-letter abbreviations. No brand logos, no product images, no filtering beyond alphabetical.
**Impact:** Looks like a placeholder page. Hard to browse or discover brands.
**Fix:** Add brand logos/thumbnails. Add filter/sort options (popularity, new brands, by country). Add product count per brand.

### 14. Contact Form Missing Confirmation UX
**Page:** /contact
**Issue:** No visible success/error states after form submission. No indication the message was sent.
**Fix:** Add a clear success message, confirmation email, and error handling.

### 15. No Live Chat or Phone Support
**Page:** /contact
**Issue:** Only email and web form. Response time is "within 4 hours" during business hours.
**Impact:** E-commerce customers expect faster support options, especially for order issues.
**Fix:** Consider adding a chatbot or live chat widget (Intercom, Crisp, Tidio).

---

## 🟢 MODERATE — Schedule for Improvement

### 16. About Page Has No Images
**Page:** /about
**Issue:** Entirely text-based. No team photos, warehouse shots, or brand imagery.
**Fix:** Add 2-3 photos showing the team, operations, or product range.

### 17. Theme Switcher Unlabeled
**Page:** Footer (all pages)
**Issue:** "Choose your vibe" color dots have no labels or tooltips. Users don't know what they do.
**Fix:** Add tooltips ("Forest theme," "Copper theme," etc.) or move to a settings page.

### 18. Age Gate Redirects to Google
**Page:** Age verification modal
**Issue:** Clicking "I am under 18" sends users to google.com. Abrupt and unprofessional.
**Fix:** Redirect to a custom page with age-appropriate messaging and health resources.

### 19. Strength Dots Not Accessible
**Page:** Product cards, Product detail
**Issue:** Nicotine strength shown only as colored dots. No text label, no aria description. Color alone shouldn't convey information (WCAG 1.4.1).
**Fix:** Add text labels ("Medium," "Strong," etc.) alongside dots. Add aria-label attributes.

### 20. No Skip-to-Content Link
**Page:** Sitewide
**Issue:** No visible skip navigation for keyboard/screen reader users.
**Fix:** Add a hidden skip link that appears on focus: "Skip to main content."

### 21. Body Text Contrast May Be Low
**Page:** Sitewide
**Issue:** Light gray text (#6b7280 or similar) on cream background (#fdf8f4 or similar) may not meet WCAG AA 4.5:1 contrast ratio.
**Fix:** Test with a contrast checker. Darken body text if needed.

### 22. FAQ Could Use Search
**Page:** /faq
**Issue:** 24 questions across 6 categories with no search. Users must scan all categories.
**Fix:** Add a search bar at the top of the FAQ page.

### 23. Product Card "Add to Cart" Buttons Small on Mobile
**Page:** Products page (mobile)
**Issue:** Tap targets are smaller than the recommended 48x48px minimum.
**Fix:** Increase button height on mobile viewports.

### 24. No "Related Products" on Product Pages
**Page:** Product detail
**Issue:** There are tag-based links ("More Fruit Pouches," etc.) but no visual carousel of related products.
**Fix:** Add a "You might also like" product carousel below the description.

### 25. Missing Meta Description on Some Pages
**Page:** Various
**Issue:** Not all pages have explicit meta descriptions.
**Fix:** Add unique meta descriptions to every page for SEO.

### 26. No Breadcrumb Schema on All Pages
**Page:** Some pages missing
**Issue:** While product pages have breadcrumbs, not all pages include breadcrumb structured data.
**Fix:** Add BreadcrumbList schema to all pages.

### 27. No Social Media Links
**Page:** Footer
**Issue:** No Instagram, TikTok, X, or other social media links.
**Fix:** Add social links if accounts exist. If not, consider creating presence on Instagram/TikTok (strong fit for this product category).

### 28. No Wishlist / Save for Later
**Page:** Product cards, Product detail
**Issue:** No way to bookmark products without adding to cart.
**Fix:** Add a heart/save icon to product cards for logged-in users.

### 29. Missing Sitemap.xml
**Page:** /sitemap.xml
**Issue:** The robots.txt references a sitemap but it returns 404.
**Impact:** Search engines can't efficiently discover all pages.
**Fix:** Generate and deploy a proper XML sitemap.

### 30. Privacy Policy URL Inconsistency
**Page:** Contact form links to /privacy-policy, footer links to /privacy
**Issue:** Different URLs for the same content.
**Fix:** Pick one canonical URL and redirect the other.

---

## What Works Well

These elements should be preserved and built upon:

- **Clean, minimal design language** — the forest green palette is distinctive and calming
- **Excellent product detail page structure** — pack pricing with volume discounts, clear specs (nicotine, portions, format), stock status
- **Good filter system on products page** — brand, strength, flavor, and format filters
- **Breadcrumb navigation** — present and well-structured
- **Mobile responsiveness** — layout adapts well, hamburger menu works
- **Fast page loads** — Astro SSG delivers good performance
- **Comprehensive FAQ** — 24 well-organized questions covering key topics
- **Clear shipping information** — zones, costs, and timelines are transparent
- **Volume discount pricing** — smart e-commerce UX on product pages
- **Age verification** — compliant with regulations
- **Theme customization** — fun differentiator (needs labeling)

---

## Recommended Execution Order

**Week 1 — Critical fixes:**
1. Fix nicotine data conflicts across all products
2. Translate all product descriptions to English
3. Fix brand count to one consistent number
4. Add legal entity to privacy policy
5. Finalize terms of service
6. Fix "NewPrice" badge bug

**Week 2 — Trust & conversion:**
7. Add shipping banner sitewide
8. Add hero section imagery
9. Diversify best sellers
10. Set up review collection flow
11. Fix product image alt text

**Week 3 — Polish & expansion:**
12. Brand logos on brands page
13. About page imagery
14. Contact form success states
15. Quiz launch or CTA removal
16. Social media links
17. Fix sitemap.xml

**Week 4 — Accessibility & SEO:**
18. Skip-to-content link
19. Strength dots text labels
20. Color contrast audit
21. Meta descriptions audit
22. Breadcrumb schema on all pages
23. Mobile tap target sizing
