# Ship to Production

Build, commit, push to GitHub, and verify the Vercel production deployment.

## Steps

1. **Build** — Run `bun run build` to verify TypeScript compiles
   - If build fails: stop and report errors
2. **Check status** — Run `git status --porcelain` to see what changed
   - Skip `.claude/` and `.superpowers/` directories
   - If no source changes: report "nothing to ship" and stop
3. **Stage** — `git add` only the relevant source files (not .claude/ or .superpowers/)
4. **Commit** — Create a descriptive commit message based on what changed
   - End with `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
5. **Pull** — `git pull --no-rebase` (merge Lovable's commits first)
   - If conflicts in `types.ts` or `brand-overrides.ts`: use `--ours`
   - Other conflicts: merge manually
6. **Push** — `git push`
7. **Verify deploy** — Use Vercel MCP to check latest deployment:
   - Team: `team_XQWRrVSs1VyB3Amh1YlLuGHo`
   - Project: `prj_S1ZMJ4TStqkAyynwDmFr3mG3Z6N2`
   - Wait for status = READY
   - Scan runtime logs for errors (level: error, since: 5m)
8. **Report** — Show deploy URL, commit SHA, status, and any errors found
