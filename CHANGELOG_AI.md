# CHANGELOG_AI

This file is the short AI-facing change log.
It supplements `CHANGELOG.md/CHANGELOG.md` and is meant to keep planning tools in sync.

## 2026-03-13 (session 2 — Claude Code)

- Step 31 ✓ — `LoginPage.tsx` and `RegisterPage.tsx` wired to real `supabase.auth.signInWithPassword` / `signUp`; controlled inputs, loading states, error display, redirect on success, email confirmation fallback.
- Step 32 ✓ — `AccountPage.tsx` replaced `isLoggedIn = useState(true)` with real `getSession` + `onAuthStateChange`; orders fetched from `orders` table by `customer_email`; real sign-out via `useNavigate`; addresses tab shows empty state (no DB table yet).
- Shopify cleanup ✓ — deleted `create-shopify-checkout/index.ts`, `shopify-webhook/index.ts`, `simulate-shopify-order.ts`; removed dead `opsWebhookInbox` from `api.ts`; `WebhookInbox.tsx` now queries `webhook_inbox` directly via React Query; Shopify removed from provider filter.
- Config/docs cleanup ✓ — `config.toml`, `DEPLOYMENT_CHECKLIST.md`, `.env.example` all updated to Nyehandel-only.
- Nyehandel secrets confirmed set: `NYEHANDEL_API_TOKEN`, `NYEHANDEL_X_IDENTIFIER`.
- Context pack stale entries corrected: `CURRENT_PRIORITIES.md`, `ACTIVE_RISKS.md`, `CLAUDE.md` updated to reflect actual completed vs. pending work.

## 2026-03-13 (session 1 — Codex)

- Added `CURRENT_PRIORITIES.md`, `SYSTEM_BOUNDARIES.md`, `ACTIVE_RISKS.md`, and `NYEHANDEL_API.md` as the reusable context pack for ChatGPT, Codex, and Claude workflows.
- Updated `README.md` and `CLAUDE.md` to reflect the March 12, 2026 architecture pivot from Shopify-first checkout toward a Nyehandel-first checkout design.
- Added a workflow-alignment entry to `PROJECT_STATE.md` so the current repo state and AI guidance stay anchored to the same timeline.

## Update rule

Append a dated entry whenever one of these changes happens:

- The active roadmap step changes.
- Architecture direction changes.
- A major feature lands or gets blocked.
- AI-facing docs are corrected to match repo reality.
