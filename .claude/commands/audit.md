# Pre-Launch Code Audit

Run a comprehensive 3-agent parallel audit of the entire codebase.

## Steps

1. Launch **3 Explore agents in parallel** (single message, multiple tool calls):

### Agent 1: Frontend Audit
- Check all Astro pages (`src/pages/*.astro`) for broken wiring, empty sections, missing data
- Check React islands (`src/components/react/`) for QueryProvider wrapping, hydration guards
- Check `src/layouts/Shop.astro` for correct meta tags and JSON-LD schemas
- Check navigation for duplicate elements and color consistency
- Check filter system comprehensiveness
- Check footer and header text visibility on dark backgrounds
- Check for hardcoded URLs (should use `tenant.url` from `@/config/tenant`)
- Check for missing React.memo on expensive list components
- Report every issue with file paths and line numbers

### Agent 2: Backend Audit
- Read every edge function in supabase/functions/*/index.ts
- Check CORS configuration (must fail closed)
- Check authentication on every endpoint
- Check input validation (especially email regex)
- Check for race conditions and unsafe data access
- Check for `as any` type casts in hooks
- Verify supabase/config.toml matches function auth requirements
- Report every issue with file paths and line numbers

### Agent 3: Data Wiring Audit
- Trace checkout flow end-to-end (frontend → edge function → Nyehandel)
- Trace rewards flow (spin wheel → prizes → vouchers → points)
- Trace product data flow (Supabase → hooks → components)
- Check cart flow and price calculations
- Check search for SQL injection risks
- Verify .env.example documents all required secrets
- Report every issue with file paths and line numbers

2. **Compile findings** by priority:
   - P0: Critical (must fix before showing anyone)
   - P1: Important (fix before launch)
   - P2: Nice-to-have (post-launch)

3. **Write plan** to `.claude/plans/` with all findings and fixes

4. **Ask user** whether to proceed with fixing P0 + P1 issues

## Also check Supabase advisors
- Run security advisors via MCP `get_advisors` (type: security)
- Run performance advisors via MCP `get_advisors` (type: performance)
- Include findings in the report
