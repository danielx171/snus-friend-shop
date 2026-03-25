# Lighthouse Audit

Run a Lighthouse performance audit on snusfriends.com or a specified URL.

## Usage
- `/lighthouse` — audit https://snusfriends.com
- `/lighthouse https://snusfriends.com/shop` — audit a specific page
- `/lighthouse http://localhost:5173` — audit local dev server

## Steps

1. **Determine target URL:**
   - Use `$ARGUMENTS` if provided
   - Default to `https://snusfriends.com`

2. **Try Chrome DevTools MCP first** (preferred):
   - Use `lighthouse_audit` tool with the target URL
   - Categories: performance, accessibility, best-practices, seo

3. **If MCP is unavailable**, fall back to CLI:
   ```bash
   npx lighthouse "$URL" \
     --output=json --output=html \
     --output-path=/Users/Daniel/Projects/snus-friend-shop/lighthouse-report \
     --chrome-flags="--headless --no-sandbox" \
     --only-categories=performance,accessibility,best-practices,seo
   ```

4. **Report scores:**

   | Category | Score | Status |
   |----------|-------|--------|
   | Performance | ? | PASS (>=90) / WARN (70-89) / FAIL (<70) |
   | Accessibility | ? | PASS (>=90) / WARN (70-89) / FAIL (<70) |
   | Best Practices | ? | PASS (>=90) / WARN (70-89) / FAIL (<70) |
   | SEO | ? | PASS (>=90) / WARN (70-89) / FAIL (<70) |

5. **Show top 3 improvement opportunities** — sorted by estimated savings:
   - Name of the audit
   - Estimated time/size savings
   - Brief fix suggestion

6. **Flag any score below 90** with specific recommendations:
   - Performance: check LCP, CLS, FID metrics individually
   - Accessibility: list failing WCAG checks
   - Best Practices: list deprecations or security issues
   - SEO: list missing meta tags or crawlability issues

7. **Compare with known baselines** (from CLAUDE.md):
   - Homepage target: Lighthouse 100 (accessibility)
   - Flag regressions from known scores

## Notes
- For local URLs, the dev server must be running (`bun run dev`)
- HTML report will be saved to `lighthouse-report.html` for detailed review
- JSON report at `lighthouse-report.json` for programmatic analysis
