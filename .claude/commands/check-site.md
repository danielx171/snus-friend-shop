# Check Live Site Health

Quick smoke test of the production site at snusfriends.com (Astro 6 + Supabase).

## Steps

1. **Vercel deployment status** — Check latest deployment via MCP:
   - Team: `team_XQWRrVSs1VyB3Amh1YlLuGHo`
   - Project: `prj_S1ZMJ4TStqkAyynwDmFr3mG3Z6N2`
   - Report: status, commit, build duration

2. **Runtime errors** — Check Vercel runtime logs:
   - Filter: level=error, since=24h
   - Check both SSR pages and serverless function errors
   - Report any errors found

3. **Supabase health** — Check via MCP:
   - `get_project` for status (project: bozdnoctcszbhemdjsek)
   - `get_advisors` (security) for new warnings
   - `get_logs` (edge-function) for recent errors

4. **Edge function status** — List all deployed functions:
   - Report version numbers and any errors
   - Check gamification functions: spin-wheel, update-quest-progress, redeem-points

5. **Key pages** — Verify critical routes return 200:
   - `/` (homepage, SSG)
   - `/products` (product catalog, SSG)
   - `/rewards` (gamification, SSG with islands)
   - `/account` (auth, SSR)

6. **Summary table:**

| Check | Status | Details |
|-------|--------|---------|
| Vercel deploy | ? | |
| Runtime errors | ? | |
| Supabase status | ? | |
| Edge functions | ? | |
| Security advisors | ? | |
| Key pages | ? | |
