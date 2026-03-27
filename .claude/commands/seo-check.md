# SEO Health Check

Quick scan of SEO elements across all pages.

## Steps

1. **Check every Astro page** for SEO elements:
   ```
   grep -rn "title=" src/pages/*.astro src/pages/**/*.astro
   ```
   Every page should use `<Shop>` layout with:
   - Unique `title` prop (not generic)
   - Unique `description` prop (not generic)
   - Transient pages (cart, checkout, account) should have noindex meta

2. **Check JSON-LD structured data:**
   ```
   grep -rn "application/ld+json" src/pages/ src/layouts/
   ```
   - HomePage: WebSite + SearchAction schema
   - Product pages: Product schema with price, brand, availability
   - Brand pages: BreadcrumbList schema
   - FAQ page: FAQPage schema
   - Blog posts: Article schema
   - Category pages: CollectionPage schema
   - All pages: Organization schema (via `src/layouts/Shop.astro`)

3. **Check rendered HTML** (build first with `bun run build`):
   - `<title>` tag present and unique per page
   - `<meta name="description">` present and unique
   - OG tags in `<head>` (title, description, image, type)
   - Canonical URL tag

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
