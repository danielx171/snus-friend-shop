# Astro Performance & SEO Best Practices

Rules for building fast, SEO-optimised Astro sites. Follow these when working on
snusfriends.com and the white-label multi-site platform.

---

## Golden Rules

### 1. Default to Static (SSG)

Every page should use `export const prerender = true` unless it needs auth or
real-time data. Static pages are served from CDN with zero server compute.

```astro
---
export const prerender = true; // <-- always start with this
---
```

Only use SSR (`prerender = false`) for:
- Pages behind auth (account, checkout)
- Pages that depend on cookies/headers at request time
- API endpoints that accept POST

### 2. Minimise Client JavaScript

Every `client:*` directive ships a JS bundle. The more islands you add, the
heavier the page.

| Directive | When to Use | JS Impact |
|-----------|-------------|-----------|
| `client:load` | Above-fold interactive (cart button, header) | Loads immediately |
| `client:idle` | Below-fold, needed soon (cookie banner) | Loads after main thread idle |
| `client:visible` | Below-fold, optional (reviews, product cards) | Loads when scrolled into view |
| `client:only="react"` | Never SSR (auth-dependent components) | Loads immediately, no SSR HTML |
| No directive | Static display only | Zero JS |

**Rules:**
- If a component only displays data (no click handlers), skip `client:*` entirely
- Push `client:visible` as far down the page as possible
- Never use `client:load` for below-fold content
- Maximum 3-4 `client:load` islands per page

### 3. No Layout Shifts (CLS)

Layout shifts destroy both UX and Core Web Vitals scores.

- Set explicit `width` and `height` on all `<img>` tags
- Use `aspect-ratio` CSS for responsive containers
- Reserve space for dynamic content (skeletons with fixed dimensions)
- Never insert content above existing content after page load

### 4. Font Loading

- Self-host fonts (never load from Google Fonts CDN — it adds a DNS lookup + render-blocking request)
- Maximum 2 font weights per family (e.g. 400 and 700)
- Use `font-display: swap` so text is visible during load
- Preload the primary font in `<head>`:
  ```html
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin />
  ```

### 5. Image Optimisation

- Use Astro's `<Image>` component for automatic WebP/AVIF conversion and srcset
- For product images from external URLs, set explicit `width`/`height` and `loading="lazy"`
- Only use `loading="eager"` for the single above-fold hero/product image
- Maximum hero image size: 200KB after compression
- Always include descriptive `alt` text

### 6. CSS

- Tailwind v4 tree-shakes automatically — unused classes are removed at build
- Avoid `@apply` in component `<style>` blocks (prevents tree-shaking)
- Use Tailwind classes directly in markup
- Never hardcode colours — use theme CSS custom properties (`bg-primary`, `text-foreground`, etc.)

---

## What Slows Sites Down

| Thing | Impact | Rule |
|-------|--------|------|
| Many `client:load` islands | +50-200KB JS per island, blocks hydration | Use `client:idle` or `client:visible` |
| CSS animations on layout properties | Layout thrashing, jank on mobile | Only animate `transform` and `opacity` |
| Large hero images | LCP killer (biggest single factor) | Max 200KB, use `loading="eager"` only for above-fold |
| Third-party scripts (analytics, pixels) | Render-blocking if in `<head>` | Load via `<script async>` or `client:idle` island |
| Custom fonts > 2 weights | +100-300KB network, FOIT/FOUT | Max 2 weights, `font-display: swap` |
| Unoptimised SVGs | DOM bloat, slow paint | Run through SVGO, add `aria-hidden="true"` |
| Large npm packages in islands | Bundle bloat | Check bundlephobia.com before adding |
| Blocking API calls in SSR | TTFB spike (server waits for API) | Use SSG with content layer, or stream |
| Inline `<style>` per component | Duplicate CSS across pages | Use Tailwind classes (deduplicated by compiler) |
| DOM size > 1500 nodes | Slow rendering, high memory | Simplify markup, virtualise long lists |

### Animations — Safe vs Dangerous

**Safe to animate (GPU-composited, no layout recalc):**
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness)

**Dangerous to animate (triggers layout/paint):**
- `width`, `height`, `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-width`
- `font-size`

**Rule:** Use `transition-transform` and `transition-opacity` for hover/scroll effects.
Never animate geometry properties.

---

## Astro-Specific SEO Checklist

### Structured Data (JSON-LD)
Every page type needs its own schema:

| Page Type | Schema | Required Fields |
|-----------|--------|-----------------|
| Homepage | Organization + WebSite + SearchAction | name, url, logo, search target |
| Product | Product + AggregateOffer | name, image, price, availability, brand |
| Brand | CollectionPage | name, description, number of items |
| Blog post | Article | headline, datePublished, author, image |
| FAQ | FAQPage | question/answer pairs |
| All pages | BreadcrumbList | position, name, item URL |

### Meta Tags
Every page must have:
- `<title>` — unique, under 60 characters
- `<meta name="description">` — unique, under 160 characters
- `<link rel="canonical">` — absolute URL
- Open Graph: `og:title`, `og:description`, `og:image`, `og:type`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`

### Technical SEO
- `sitemap.xml` — auto-generated by `@astrojs/sitemap`
- `robots.txt` — allow all crawlers, include sitemap URL, allow AI bots
- `llms.txt` — structured site description for AI crawlers (GEO)
- Internal links: every product links to its brand, every brand links to its products
- Breadcrumbs on every page (visible UI + BreadcrumbList JSON-LD)
- Image `alt` text on every product image
- No orphan pages (every page reachable from navigation or internal links)

---

## White-Label Architecture Rules

### Tenant Configuration
- All branding (colours, fonts, features) comes from `src/config/tenant.ts`
- Never hardcode brand names, colours, or copy — always reference tenant config
- Feature flags (`tenant.features.*`) control which islands render

### Theme System
- CSS custom properties in `src/index.css` define all colours
- Theme switching via `data-theme` attribute on `<html>`
- Components use Tailwind theme tokens (`bg-primary`, `text-foreground`)
- Never use Tailwind palette colours (`bg-emerald-500`) — they don't respect themes

### Content Layer
- Product and brand data loads from Supabase at build time via content layer
- No runtime database calls for catalogue pages (SSG)
- Content updates deploy via rebuild (Vercel webhook on Supabase changes)

### Multi-Site Deployment
- One Astro codebase, multiple Vercel projects
- Each Vercel project has different env vars (tenant ID, Supabase URL, etc.)
- `tenant.ts` reads env vars to determine which tenant config to use
- Static pages are per-tenant at build time — no runtime tenant resolution needed

---

## Performance Budget

Target scores for every page:

| Metric | Target | Notes |
|--------|--------|-------|
| Lighthouse Performance | >= 90 | Mobile, throttled 4G |
| LCP | < 2.5s | Largest image or text block |
| FID / INP | < 200ms | Time to first interaction |
| CLS | < 0.1 | No layout shifts |
| Total JS | < 200KB | All islands combined (gzipped) |
| Total CSS | < 50KB | Tailwind output (gzipped) |
| Time to First Byte | < 200ms | SSG pages from CDN |

### How to Measure
```bash
# Local Lighthouse audit
bunx lighthouse https://snusfriends.com --output=json --chrome-flags="--headless"

# Build size analysis
bun run build  # check output for page sizes
```

---

## Quick Reference: Component Decision Tree

```
Need interactivity?
  No  -> Plain Astro component (zero JS)
  Yes -> Is it above the fold?
    Yes -> client:load (cart button, header menu)
    No  -> Is it needed soon after page load?
      Yes -> client:idle (cookie banner, toast)
      No  -> client:visible (product cards, reviews, gamification)
```
