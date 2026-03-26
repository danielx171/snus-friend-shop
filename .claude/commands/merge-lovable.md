# Merge Lovable Changes

Safely merge changes from Lovable (which pushes directly to main) without losing our work.

## Steps

1. **Pull with merge** — `git pull --no-rebase` (never rebase — causes conflicts)
2. **Auto-resolve known conflicts:**
   - `src/integrations/supabase/types.ts` → use `--ours` (our version has extra tables)
   - `src/data/brand-overrides.ts` → use `--ours` (our version has real NordicPouch data)
   - Everything else → merge manually, preserving both sides
3. **Check for Lovable regressions:**
   - Run `grep -r "as any" src/` — Lovable may reintroduce `as any` casts
   - Run `grep -r "snus-friend-shop.lovable.app" src/` — Lovable may reintroduce old URLs
   - Check if `types.ts` still has our custom tables (run `/sync-types`)
4. **Build** — `bun run build` to verify nothing broke
5. **Report** what Lovable changed and what we preserved

## Conflict Resolution Reference

| File | Strategy | Reason |
|------|----------|--------|
| `types.ts` | --ours | Our version has 9+ extra tables |
| `brand-overrides.ts` | --ours | Real product data from NordicPouch CSV |
| `index.css` | Manual | Both sides may add theme vars |
| Everything else | Manual | Preserve both changes |
