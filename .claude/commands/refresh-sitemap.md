# Refresh Sitemap

Regenerate the sitemap from the live Supabase catalog and verify it.

## Steps

1. **Run generator:** `bun run sitemap`
2. **Verify output:**
   - Check `public/sitemap.xml` starts with `https://snusfriends.com`
   - Count products and brands
   - Verify static pages are included
3. **Report:** product count, brand count, total URLs
4. **Stage for commit:** `git add public/sitemap.xml`

## When to Run
- After catalog sync (new products added)
- After domain changes
- After adding new static pages
- Weekly maintenance
