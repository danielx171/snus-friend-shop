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

7. **SPA-specific checks** (this is a Vite SPA):
   - Warn that most content is client-rendered and invisible to crawlers without JS
   - Check if `index.html` has hardcoded meta tags (it should)
   - Check if `<noscript>` fallback exists
   - Verify the `<div id="root">` is present

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
   | Noscript fallback | PASS/WARN | present/missing |

9. **Flag critical issues:**
   - Missing title or description = FAIL
   - Missing canonical = WARN
   - Missing OG tags = WARN
   - No JSON-LD = WARN
   - Different content for bots = FAIL (possible cloaking)
   - Empty body for bots = expected for SPA, but WARN

## Notes
- This is a Vite SPA, so crawlers only see the initial HTML shell — not rendered React content
- SEO meta tags must be in `index.html` or set via `<SEO>` component with `react-helmet-async`
- For full rendered content checking, use `/lighthouse` which runs with JS enabled
