# SEO Health Check

Quick scan of SEO elements across all pages.

## Steps

1. **Check every page component** for SEO usage:
   ```
   grep -rn "<SEO" src/pages/
   ```
   Every page in src/pages/ should have a `<SEO>` component with:
   - Unique title (not generic)
   - Unique description (not generic)
   - Canonical URL (for indexable pages)
   - metaRobots="noindex,follow" (for transient pages: cart, checkout, search, account)

2. **Check JSON-LD structured data:**
   - HomePage: WebSite + SearchAction schema
   - ProductDetail: Product schema with price, brand, availability
   - BrandHub: BreadcrumbList + FAQPage schema
   - FaqPage: FAQPage schema
   - All pages: OrganizationSchema (via App.tsx)

3. **Check meta in index.html:**
   - Title tag present
   - Meta description present
   - OG tags (title, description, image, type)
   - Twitter card tags
   - Viewport meta

4. **Check robots.txt:**
   - Correct domain in Sitemap reference
   - AI crawlers allowed (GPTBot, ClaudeBot, PerplexityBot)
   - Cart/checkout/ops disallowed

5. **Check llms.txt:**
   - Product count accurate
   - Brand count accurate
   - Domain references correct

6. **Report** any missing or incorrect SEO elements

## Scoring
Rate each area: PASS / WARN / FAIL
Provide overall SEO score out of 100.
