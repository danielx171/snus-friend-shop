# AGENTS Guide
Operating guide for agentic coding tools in `snus-friend-shop`.

## Project Snapshot
- Stack: React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase.
- Architecture: Nyehandel-first storefront + Supabase Edge Functions. Shopify checkout is being removed as part of an active migration — see ROADMAP.md for transition state.
- Core rule: checkout/order/Nyehandel flows belong in `supabase/functions/`.
- Current toolchain supports npm scripts, but team standard is Bun-first.

## Rule Sources (Checked)
- `.cursorrules`: present and mandatory.
- `.cursor/rules/`: not present in this repository.
- `.github/copilot-instructions.md`: not present in this repository.

## Onboarding Runbook (After `init`)
- Step 1: Run `init`/startup context load, then immediately check repo state (`git status`) and do not revert unrelated changes.
- Step 2: Read in this order: `.cursorrules` -> `AGENTS.md` -> `ROADMAP.md` -> `NYEHANDEL_API_SYNC.md`.
- Step 3: Confirm hard boundaries before coding: checkout/order/Nyehandel logic in `supabase/functions/`, and never edit `src/lib/cart-utils.ts` without explicit permission.
- Step 4: Identify task surface first (frontend page, edge function, migration, or ops tooling) and keep changes in that boundary.
- Step 5: Validate environment assumptions (required env vars/secrets, function auth expectations in `supabase/config.toml`, migration dependencies).
- Step 6: Implement smallest safe change; avoid speculative refactors in dirty worktrees.
- Step 7: Run relevant verification (`bun run lint`, `bun run build`, and scoped tests) before handoff.
- Step 8: For major work, update `ROADMAP.md` and `CHANGELOG.md` per `.cursorrules`.

## Mandatory Constraints From `.cursorrules`
- Keep all order logic, checkout sessions, and Nyehandel integration in `supabase/functions/`.
- Never edit `src/lib/cart-utils.ts` without explicit permission.
- Follow boundaries in `NYEHANDEL_API_SYNC.md` when touching shared integration areas.
- Do not implement or alter Pipedrive, WhatsApp, or Cowork automation code.
- Never hardcode keys or expose real customer data.
- Use TypeScript + functional React components + shadcn UI patterns.
- Read `ROADMAP.md` before complex work and update it when tasks are completed.
- For major refactors/features, update `CHANGELOG.md` (and `EOD_REPORT.md` if requested).

## Collaboration Boundaries (`NYEHANDEL_API_SYNC.md`)
- Daniel ownership: B2C storefront and frontend scope.
- William ownership: B2B automation scope.
- Daniel should not touch Pipedrive/WhatsApp/Cowork automation.
- William should not touch React frontend implementation.
- Shared Nyehandel API logic is allowed in agreed boundaries.

## Cross-Repo Integration Protocol
- When reviewing William's remote repository, work in an isolated review branch (for example `granskning-*`), not on `dev`.
- Never merge, cherry-pick, or otherwise import William's branch into `dev`/`main` without explicit user instruction.
- Treat William's code as a business-logic reference, not a runtime dependency.
- Before implementing logic inspired by William's code, include a short translation spec in handoff notes:
  - source file/function in William repo
  - target file/function in this repo
  - rule/behavior being translated
  - required auth, logging, and idempotency guarantees

## Shared Logic, Separate Runtime
- You may reuse business rules and API mapping ideas from William's Python automation work.
- Do not introduce Python/Flask runtime code paths into this repository's production flow.
- Keep production checkout/order/Nyehandel execution in Supabase Edge Functions (`supabase/functions/`).

## Data Governance for Shared Work
- Never commit real customer/order data artifacts while collaborating across repos.
- Keep operational exports anonymized if examples are needed in documentation.
- When new function secrets are required, update `.env.example` and deployment docs in the same task.

## Rule Externalization Policy
- Avoid hardcoded customer-specific rules (owner filters, skipped IDs, carrier special-cases) in function code.
- Place mutable rules in environment variables or database configuration tables so ops can adjust without code edits.

## Package Manager Policy
- Preferred workflow: Bun only.
- Use `bun install` for dependency installs.
- Use `bun run <script>` for project scripts.
- Avoid lockfile-mixing changes (`bun.lock*` + `package-lock.json`) in one task unless explicitly required.

## Build / Lint / Test Commands
- Install deps: `bun install`
- Dev server: `bun run dev`
- Production build: `bun run build`
- Dev-mode build: `bun run build:dev`
- Preview build: `bun run preview`
- Lint: `bun run lint`
- Run all tests once: `bun run test`
- Test watch mode: `bun run test:watch`

## Single-Test and Scoped-Test Commands (Vitest)
- One test file: `bun run test -- src/test/example.test.ts`
- Multiple specific files: `bun run test -- src/test/a.test.ts src/test/b.test.ts`
- Filter by test name: `bun run test -- -t "should pass"`
- Run by glob: `bunx vitest run "src/**/*checkout*.test.ts"`
- Watch a single file: `bunx vitest src/test/example.test.ts`
- Use config include pattern: `src/**/*.{test,spec}.{ts,tsx}`
- Test environment is `jsdom`; setup file is `src/test/setup.ts`.

## Useful Operational Commands
- Supabase config file: `supabase/config.toml`
- SQL migrations location: `supabase/migrations/*.sql`

## Environment and Secret Handling
- Frontend variables must use `VITE_` prefix (see `.env.example`).
- Server secrets belong in Supabase secrets/env, never in frontend code.
- Never commit API keys, service-role keys, tokens, or customer records.
- Never print sensitive payloads in logs or error objects.

## Repository Layout Quick Map
- Frontend app: `src/`
- UI primitives: `src/components/ui/`
- Route pages: `src/pages/` (wiring in `src/App.tsx`)
- Hooks/context: `src/hooks/`, `src/context/`
- Utilities/API helpers: `src/lib/`
- Edge Functions: `supabase/functions/<function-name>/index.ts`
- Migrations: `supabase/migrations/`
- Operational docs: `ROADMAP.md`, `DEPLOYMENT_CHECKLIST.md`, `NYEHANDEL_API_SYNC.md`

## Code Style Guidelines

### General Formatting and Scope
- Match existing file style (quotes, semicolons, spacing, import shape) in touched files.
- Keep diffs focused; avoid unrelated refactors.
- Prefer small, composable functions over deeply nested logic.
- Add comments only for non-obvious decisions, not obvious mechanics.

### Imports
- Prefer alias imports from `@/` for modules under `src/`.
- Order imports as: external libraries, internal alias imports, relative imports.
- Use `import type` for type-only imports when practical.
- Remove unused imports when editing files.

### React and UI
- Use functional components and hooks only.
- Keep hooks at top level; follow Rules of Hooks.
- Keep reusable UI in `src/components/`; prefer shadcn primitives from `src/components/ui/`.
- Keep route pages in `src/pages/` and avoid embedding route logic in low-level components.

### TypeScript and Types
- Even though `tsconfig` has `strict: false`, write code as if strict typing is expected.
- Prefer explicit domain/request/response types at API boundaries.
- Avoid `any`; if unavoidable, isolate it and narrow immediately.
- Narrow `unknown` before property access.
- Keep shared types near usage boundaries and export intentionally.

### Naming Conventions
- Components, interfaces, types: `PascalCase`.
- Functions, variables, hooks: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Edge Function folder names: kebab-case with `index.ts` entry file.
- Test files: `*.test.ts(x)` or `*.spec.ts(x)`.

### Error Handling
- Fail fast on invalid input with clear 4xx responses.
- In Edge Functions, return JSON errors with machine-readable `error` keys.
- Include trace IDs (`requestId`, `orderId`, `webhookId`) in logs/responses where useful.
- Keep messages actionable but never leak secrets or full sensitive payloads.
- Do not swallow errors silently unless fallback behavior is explicit and intentional.

### Logging Guidelines
- Prefer structured logs in functions (object-shaped payloads / JSON-stringified objects).
- Log lifecycle checkpoints for integrations (receive, validate, push, retry, fail).
- Never log tokens, credentials, or raw customer PII.

## Supabase Edge Function Practices
- Handle `OPTIONS` requests explicitly for CORS.
- Validate HTTP method and payload shape before business logic.
- Use `SUPABASE_SERVICE_ROLE_KEY` only in server-side contexts.
- Make webhook/push handlers idempotent and safe for retries.
- Verify inbound webhook authenticity (signature or shared secret) on raw body before JSON parsing.

## Database and Migration Practices
- Add schema changes as forward-only SQL migrations in `supabase/migrations/`.
- Do not rewrite old migrations that may already be applied.
- Add indexes/constraints to support idempotency and performant lookups.
- Update generated Supabase types when schema changes affect application usage.

## Testing Expectations
- Add tests for new logic paths when feasible.
- Prioritize coverage for checkout creation, webhook validation, idempotency, and Nyehandel push branches.
- For bug fixes, add regression tests when practical.
- Keep tests deterministic and avoid relying on live external systems unless explicitly required.

## Delivery Checklist for Agents
- Confirm no secrets or sensitive data were introduced.
- Run `bun run lint`, `bun run build`, and relevant scoped tests before handoff.
- For major work, align docs: `ROADMAP.md`, `CHANGELOG.md` (and `EOD_REPORT.md` when requested).
- Keep commits scoped by concern (frontend vs function vs migration).
- Preserve unrelated pre-existing changes in a dirty working tree.

## Definition of Done (Typical)
- Changed code compiles and the changed surface area passes lint/tests.
- Inputs and boundary conditions are validated.
- Error responses are machine-readable and operationally actionable.
- Logs include enough context IDs for production diagnosis.
- Required docs are updated when the change is major.

## Lovable Intake Rule
- Lovable output is a **visual reference only**. Never copy edge function code, auth flows, DB schema, or type definitions from Lovable into this repo.
- Safe use: describe a UI component or page layout to Lovable, then rewrite the result from scratch using the repo's shadcn primitives and existing hooks.
- Before integrating any Lovable-derived component, verify it uses no hardcoded data, no inline auth logic, and no direct DB calls.

## MCP Safety Stance
- Read-only MCP tools (file readers, doc fetchers) are acceptable.
- Do not authorize MCP servers with write access to Supabase, the filesystem, or any production endpoint.
- Do not use MCP to execute secrets, run migrations, or deploy edge functions — those actions go through the established CLI workflow.
