# Senior System Audit

Datum: 2026-03-09

Scope: `.cursorrules`, `.gitignore`, `.env/.env.example`, `ROADMAP.md`, samt dagens implementation i `supabase/functions/`.

## Snabb slutsats

Checkout -> Shopify -> webhook -> Nyehandel-kedjan finns nu, men projektet ar **inte go-live-sakert** annu. De storsta gapen ar auth-hardening pa interna functions, webhook source validation, och config/secret-disciplin.

## Missar / risker (checklista)

### Kritiska

- [ ] **Lasa interna functions (fail-closed)**: `push-order-to-nyehandel` ar publik i praktiken (`verify_jwt = false` och ingen obligatorisk intern secret-check i funktionen).
  - Fil: `supabase/functions/push-order-to-nyehandel/index.ts`
  - Fil: `supabase/config.toml`
- [ ] **Retry endpoint maste fail-closed**: `retry-failed-nyehandel-orders` validerar `x-cron-secret` endast om secret finns; om secret saknas ar endpointen oppen.
  - Fil: `supabase/functions/retry-failed-nyehandel-orders/index.ts`
- [ ] **Webhook source allowlist saknas**: HMAC verifieras, men `x-shopify-shop-domain` jamfors inte mot tillaten shop-domain.
  - Fil: `supabase/functions/shopify-webhook/index.ts`

### Hoga

- [ ] **Prissanning pa backend saknas i checkout-create**: `totalPrice` och `currency` tas fran klientpayload och sparas i `orders` innan verifiering.
  - Fil: `supabase/functions/create-shopify-checkout/index.ts`
- [ ] **Cron migration hardkodar prod URL**: scheduler-jobbet ar bundet till ett specifikt project-id i SQL, vilket riskerar fel i andra miljoer.
  - Fil: `supabase/migrations/20260309143000_setup_retry_cron.sql`
- [ ] **Step 19 markerad klar, men driftberoenden kvar**: ROADMAP visar done, men scheduler + vault secret maste verifieras i faktisk miljo.
  - Fil: `ROADMAP.md`

### Medium

- [ ] **Miljokonfig i `.env.example` ar ofullstandig** for nya floden (saknar t.ex. `SHOPIFY_WEBHOOK_SECRET`, `RETRY_FAILED_ORDERS_SECRET`, `SHOPIFY_API_VERSION`, ev. `NYEHANDEL_API_URL`).
  - Fil: `.env.example`
- [ ] **.env kvalitet**: lokal `.env` innehaller en trasig kommentarsrad/strangkombination som riskerar forvirring vid lokal felsokning.
  - Fil: `.env`
- [ ] **Legacy artifacts kvar**: `CheckoutPage.tsx` finns kvar och innehaller trasigt legacyinnehall trots att route ar borttagen.
  - Fil: `src/pages/CheckoutPage.tsx`

### Process / styrning

- [ ] **Boundary-dokument saknas**: `NYEHANDEL_API_SYNC.md` kunde inte hittas i repot, trots att `.cursorrules` gor den obligatorisk for integrationsarbete.
  - Referens: `.cursorrules`
- [ ] **Changelog-regel i `.cursorrules` ej uppfylld**: flera stora features lades till utan verifierad `CHANGELOG.md`-uppdatering.
  - Referens: `.cursorrules`

## Rekommenderad fixordning (kort)

- [ ] 1) Hardena function-auth (internal secret/JWT), gor endpoints fail-closed.
- [ ] 2) Lagg till Shopify shop-domain allowlist i webhook.
- [ ] 3) Flytta pris-sanning till backend/Shopify-verifierad data.
- [ ] 4) Gor cron-jobb miljo-neutralt (ingen hardkodad URL) och verifiera vault secret i target-miljo.
- [ ] 5) Uppdatera `.env.example`, aterlagg/skap `NYEHANDEL_API_SYNC.md`, och stada legacy `CheckoutPage.tsx`.
