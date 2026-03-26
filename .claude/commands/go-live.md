# Go-Live Checklist

Final pre-launch verification before disabling preview mode and going live.

## Pre-Conditions (must ALL be true)
- [ ] CEO has confirmed test order works in Nyehandel admin
- [ ] Legal pages have solicitor sign-off (Terms, Privacy, Cookies)
- [ ] Product images reviewed and approved
- [ ] Retail pricing confirmed

## Technical Checks

### 1. Security
- Run `/audit` — must pass with zero P0 issues
- Verify ALLOWED_ORIGIN is set in Supabase secrets
- Verify DELIVERY_WEBHOOK_SECRET is set
- Verify service role key was rotated (check CLAUDE.md)
- Verify no secrets in git history (`git log --all -p | grep -i "service_role" | head -5`)

### 2. SEO
- Run `/seo-check` — must score 85+
- Run `/verify-urls` — must find zero stale domains
- Run `/refresh-sitemap` — verify product/brand counts
- Check og:image.jpg exists in public/

### 3. Edge Functions
- Run `/check-site` — all functions ACTIVE, zero errors
- Verify create-nyehandel-checkout accepts test order
- Verify spin-wheel works for authenticated user

### 4. Frontend
- Build passes: `bun run build`
- No console errors on homepage, product page, brand page, cart, checkout
- Mobile responsive (test at 375px width)
- Cookie consent banner works

### 5. DNS & Domain
- snusfriends.com resolves correctly
- SSL certificate valid
- www.snusfriends.com redirects to snusfriends.com
- Supabase auth Site URL = https://snusfriends.com

## Go-Live Steps (in order)
1. Set `VITE_PREVIEW_MODE=false` in Vercel env vars
2. Redeploy: `vercel --prod` or push to trigger auto-deploy
3. Verify checkout page shows real form (not "coming soon")
4. Place one real test order
5. Submit sitemap to Google Search Console
6. Submit sitemap to Bing Webmaster Tools
7. Monitor Vercel runtime logs for 1 hour

## Post-Launch
- Set up Google Search Console alerts
- Set up Supabase monitoring alerts
- Schedule weekly `/check-site` runs
- Begin blog content pipeline
