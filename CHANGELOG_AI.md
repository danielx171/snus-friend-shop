# CHANGELOG_AI

This file is the short AI-facing change log.
It supplements `CHANGELOG.md/CHANGELOG.md` and is meant to keep planning tools in sync.

## 2026-03-13 (session 5 — Claude Code)

- Step 37 ✓ — `DbProduct` interface moved from `src/hooks/useCatalog.ts` to `src/integrations/supabase/types.ts`; `useCatalog.ts` imports and re-exports it so no call-site changes needed. Build clean.
- Step 38 ✓ — `vite.config.ts`: added `build.rollupOptions.output.manualChunks`; splits `recharts`+d3 → `charts`, `@supabase/*` → `supabase`, `@radix-ui/*` → `radix`, `lucide-react` → `icons`, remaining `node_modules` → `vendor`. Single 874 kB chunk replaced by largest chunk of 301 kB; chunk-size warning eliminated.
- Step 38b ✓ — `ProductListing.tsx`: removed `SITE_ORIGIN = ... ?? ''` fallback; replaced with `SITE_URL` (raw `VITE_SITE_URL` env var, `undefined` when absent) and `listingUrl = SITE_URL ? SITE_URL + '/nicotine-pouches' : undefined`; `canonical` passes `listingUrl` (omitted when `undefined`); breadcrumb `item` fields are spread-conditional (`...(SITE_URL && { item })`) so no empty-string URLs are emitted. Build clean.

## 2026-03-13 (session 4 — Claude Code)

- Step 35 ✓ — `ProductListing.tsx`: `isError` added to `useCatalogProducts()` destructure; explicit error branch inserted between loading skeleton and products/empty-state; toolbar count text guarded on `isError`.
- Step 36 ✓ — `ProductDetail.tsx`: `products as mockProducts` import removed; `isError` added to `useCatalogProduct()` destructure; `isError` early-return added before `!product` not-found guard; hardcoded 4-filled+1-empty star row replaced with `★ {product.ratings}` (neutral, no invented label); related-products `<h2>` fixed from `{t('detail.aboutBrand')} {brand}` to `"More from {brand}"` (no correct i18n key exists for this heading).

## 2026-03-13 (session 3 — Claude Code)

- Step 33 ✓ — `OrderConfirmation.tsx` fully replaced: reads `orderId` from `/order-confirmation/:orderId` param, fetches order from DB with `customer_email` session guard, calls `clearCart()` once via `useRef`, discriminated union states, defensive normalisers for `line_items_snapshot` and `shipping_address`. Route added in `App.tsx`.
- Step 34 ✓ — `UpdatePasswordPage.tsx` added at `/update-password`: recovery context gated on `type=recovery` URL hash captured before Supabase strips it; `onAuthStateChange` handles both sync (`INITIAL_SESSION`) and async (`PASSWORD_RECOVERY`) token-exchange paths; explicit `no-recovery`, `expired`, `init-error` states; `supabase.auth.updateUser({ password })` called only after confirmed recovery. `ForgotPasswordPage.tsx` `redirectTo` updated to `/update-password`. Manually verified end-to-end via WSL dev URL.
- `vite.config.ts` ✓ — `lovable-tagger` import and plugin entry removed; was causing dev-server stack overflow via Vite's dev-only transform path.

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
