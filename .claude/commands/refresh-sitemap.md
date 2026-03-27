# Refresh Sitemap

Rebuild to regenerate the sitemap via `@astrojs/sitemap` and verify it.

## Context
Sitemap is auto-generated at build time by `@astrojs/sitemap` (configured in `astro.config.mjs`).
No manual `public/sitemap.xml` exists — the build outputs `dist/client/sitemap-index.xml`.

## Steps

1. **Build:** `bun run build`
2. **Verify output:**
   ```bash
   cat dist/client/sitemap-index.xml
   ls dist/client/sitemap-*.xml
   ```
   - Check sitemap-index references `https://snusfriends.com`
   - Count product URLs, brand URLs, and static pages
   - Verify auth/checkout pages are EXCLUDED (cart, checkout, login, register, account, ops)
3. **Check filter config** in `astro.config.mjs` sitemap integration:
   - Ensure all transient pages are filtered out
4. **Report:** product count, brand count, total URLs, excluded paths

## When to Run
- After adding new pages
- After changing sitemap filter config
- After domain changes
- Weekly maintenance
