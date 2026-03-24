# Sync Supabase Types

Lovable frequently overwrites `src/integrations/supabase/types.ts` during its merges,
removing tables we've manually added. This skill detects and fixes that.

## Steps

1. Read `src/integrations/supabase/types.ts`
2. Check for these required tables that Lovable doesn't know about:
   - `orders`
   - `ops_alerts`
   - `points_balances`
   - `points_transactions`
   - `waitlist_emails`
   - `sync_config`
   - `daily_spins`
   - `vouchers`
   - `spin_config`
3. If any are missing:
   - Use Supabase MCP `list_tables` (project: bozdnoctcszbhemdjsek, schemas: ["public"], verbose: true) to get current schema
   - Add the missing table definitions with Row/Insert/Update interfaces
   - Preserve everything Lovable added — only ADD missing tables
4. Search codebase for `(supabase as any)` casts — these indicate missing types
5. Report what was added/fixed

## When to run
- After any Lovable merge (`git pull`)
- If you see `(supabase as any)` in code review
- After running database migrations
