# Update Project Documentation

Sync CLAUDE.md and project docs with the current state of the codebase.

## Steps

1. **Read current docs:**
   - `CLAUDE.md`
   - `CURRENT_PRIORITIES.md`
   - `ROADMAP.md`
   - `DEPLOYMENT_CHECKLIST.md`

2. **Scan for changes since last update:**
   - `git log --oneline -20` — recent commits
   - Check edge function versions via Supabase MCP
   - Check Vercel deployment status
   - Check for new tables/migrations

3. **Update each file:**
   - `CLAUDE.md` "Where Things Stand" section — update statuses, add new items
   - `CURRENT_PRIORITIES.md` — move completed items, add new priorities
   - `ROADMAP.md` — check off completed steps
   - `DEPLOYMENT_CHECKLIST.md` — add any new secrets or deploy steps

4. **Check for contradictions:**
   - Ensure all docs agree on what's done vs pending
   - Ensure edge function versions match what's actually deployed
   - Ensure env var lists are complete

5. **Commit** with message: `docs: sync project docs with current state`
