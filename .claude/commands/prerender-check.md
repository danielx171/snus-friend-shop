# Prerender / Crawler Check

Check how search engine crawlers see a page — verify SEO elements render correctly.

## Usage
- `/prerender-check` — check https://snusfriends.com
- `/prerender-check https://snusfriends.com/shop` — check a specific page

## Steps

1. **Determine target URL:**
   - Use `$ARGUMENTS` if provided
   - Default to `https://snusfriends.com`

2. **Fetch as Googlebot:**
   ```bash
   curl -s -L \
     -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
     "$URL" -o /tmp/prerender-googlebot.html
   ```

3. **Fetch as generic bot:**
   ```bash
   curl -s -L \
     -H "User-Agent: Mozilla/5.0 (compatible; bot)" \
     "$URL" -o /tmp/prerender-generic-bot.html
   ```

4. **Fetch as browser:**
   ```bash
   curl -s -L \
     -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
     "$URL" -o /tmp/prerender-browser.html
   ```

5. **Check SEO elements** in each response:

   | Element | Present? | Content |
   |---------|----------|---------|
   | `<title>` | ? | extracted text |
   | `<meta name="description">` | ? | extracted content |
   | `<link rel="canonical">` | ? | extracted href |
   | `<meta property="og:title">` | ? | extracted content |
   | `<meta property="og:description">` | ? | extracted content |
   | `<meta property="og:image">` | ? | extracted content |
   | `<meta property="og:type">` | ? | extracted content |
   | `<meta name="robots">` | ? | extracted content |
   | JSON-LD `<script type="application/ld+json">` | ? | schema type(s) |

6. **Compare responses:**
   - Do all three user-agents get the same HTML?
   - Is there cloaking (different content for bots vs browsers)?
   - File size comparison between responses

7. **Astro SSG/SSR checks:**
   - Verify full HTML content is present in the response (Astro pre-renders at build time)
   - Check that React island placeholders have `astro-island` markers
   - Verify structured data is in the static HTML, not injected by JS
   - Check `<link rel="sitemap">` points to `/sitemap-index.xml`
   - Verify `llms.txt` is accessible at `/llms.txt`

8. **Report:**

   | Check | Status | Details |
   |-------|--------|---------|
   | Title tag | PASS/FAIL | "Snus Friends — ..." |
   | Meta description | PASS/FAIL | present/missing |
   | Canonical URL | PASS/FAIL | correct/missing |
   | OG tags | PASS/FAIL | complete/partial/missing |
   | JSON-LD | PASS/FAIL | schema types found |
   | robots meta | PASS/WARN | content directive |
   | Bot vs Browser parity | PASS/WARN | same/different |
   | Static HTML content | PASS/FAIL | product/page content in HTML |
   | Sitemap link | PASS/WARN | present/missing |

9. **Flag critical issues:**
   - Missing title or description = FAIL
   - Missing canonical = WARN
   - Missing OG tags = WARN
   - No JSON-LD = WARN
   - Different content for bots = FAIL (possible cloaking)
   - Empty body for bots = FAIL (Astro should always serve full HTML)
   - Missing static content = FAIL (SSG pages must have content without JS)

## Notes
- This is an Astro 6 site (SSG + SSR hybrid) — crawlers receive fully-rendered HTML
- SEO meta tags are set per-page in `.astro` layouts via `<head>` — no client-side injection needed
- React islands hydrate interactivity but the static HTML is always present
- For full rendered content checking, use `/lighthouse` which runs with JS enabled
