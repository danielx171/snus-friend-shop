# Sync Supabase Types

Lovable frequently overwrites `src/integrations/supabase/types.ts` during its merges,
removing tables we've manually added. This skill detects and fixes that.

## Steps

1. **Try auto-generation first** — use Supabase MCP `generate_typescript_types` tool:
   - project_id: `bozdnoctcszbhemdjsek`
   - Save output to a temp variable for comparison

2. **If MCP is unavailable**, fall back to manual approach:
   - Use Supabase MCP `list_tables` (project: bozdnoctcszbhemdjsek, schemas: ["public"], verbose: true) to get current schema
   - Manually construct type definitions from table info

3. **Read current types file:** `src/integrations/supabase/types.ts`

4. **Check for all required tables** — every one of these must be present:
   - `orders`
   - `ops_alerts`
   - `points_balances`
   - `points_transactions`
   - `waitlist_emails`
   - `newsletter_subscribers`
   - `sync_config`
   - `daily_spins`
   - `vouchers`
   - `spin_config`
   - `product_reviews`
   - `user_profiles`
   - `avatars`
   - `user_avatar_unlocks`
   - `quests`
   - `user_quest_progress`
   - `community_posts`
   - `community_post_likes`
   - `community_post_tags`
   - `community_polls`
   - `community_poll_options`
   - `community_poll_votes`

5. **Check for required RPCs:**
   - `cast_poll_vote`
   - `flag_review`

6. **Diff the generated output** against the current `types.ts`:
   - Report tables that are NEW (in generated but not in current)
   - Report tables that are MISSING (in current but not in generated — possibly dropped)
   - Report tables with CHANGED columns (column added/removed/type changed)
   - Show a summary of changes

7. **Warn if any of the 22 required tables are missing** from the generated output —
   this likely means the table was dropped or renamed in a migration.

8. **If tables are missing from current types.ts:**
   - Add the missing table definitions with Row/Insert/Update interfaces
   - Preserve everything Lovable added — only ADD missing tables

9. **Search codebase for `(supabase as any)` casts** — these indicate missing types:
   ```
   grep -rn "(supabase as any)" src/
   ```
   If found, add the referenced tables to types.ts.

10. **Report what was added/fixed** — include a summary table:

    | Table | Status |
    |-------|--------|
    | orders | OK / ADDED / UPDATED |
    | ... | ... |

## When to run
- After any Lovable merge (`git pull`)
- If you see `(supabase as any)` in code review
- After running database migrations
- Periodically to catch schema drift
