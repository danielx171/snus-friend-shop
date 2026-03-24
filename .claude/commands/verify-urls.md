# Verify All URL References

Scan the entire codebase for hardcoded URLs that should use VITE_SITE_URL or the production domain.

## Context
This has been a recurring issue — the domain changed from lovable.app → snusfriend.co.uk → snusfriends.com, and stale URLs keep appearing in SEO metadata, JSON-LD, sitemap, robots.txt, and canonical links.

## Steps

1. **Grep for stale domains:**
   ```
   grep -r "lovable.app" src/ public/ scripts/
   grep -r "snusfriend.co.uk" src/ public/ scripts/
   grep -r "snus-friend-shop.vercel.app" src/ public/ scripts/
   ```

2. **Check correct domain usage:**
   ```
   grep -r "snusfriends.com" src/ public/ scripts/ | head -20
   ```

3. **Verify VITE_SITE_URL usage:**
   - All SEO canonical URLs should use `SITE_URL` from `@/config/brand`
   - JSON-LD breadcrumbs should use `VITE_SITE_URL`
   - sitemap.xml should reference `https://snusfriends.com`
   - robots.txt should reference `https://snusfriends.com`

4. **Report** any stale URLs with file paths and line numbers

## Production Domain
The canonical production domain is: `https://snusfriends.com`
