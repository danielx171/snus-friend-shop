# EOD Report (2026-03-09)

## 1) Vad vi faktiskt fick gjort

Genomgang gjordes via `git status --short` och `git diff --name-only`. Repon ar i stort "dirty" med manga andringar, sa denna rapport fokuserar pa Shopify -> checkout -> webhook -> Nyehandel-kedjan vi byggt idag.

Fardigt idag (funktionellt):

- Checkout handoff ar kopplad till backend:
  - `src/pages/CheckoutHandoff.tsx` anropar `create-shopify-checkout`, mappar `{ shopifyVariantId, quantity }`, har loading/error state, och redirectar till `checkoutUrl`.
- Legacy checkout-path borttagen fran routing:
  - `src/App.tsx` route `/checkout/legacy` och import av `CheckoutPage` bort.
- Produktdata uppdaterad med Shopify-variant-id for mockflode:
  - `src/data/products.ts` fick `shopifyVariantId?: string` i typen och `shopifyVariantId` pa varje produkt.
- Ny checkout edge function finns och anvands:
  - `supabase/functions/create-shopify-checkout/index.ts` validerar payload, skapar Shopify cart via Storefront API, sparar pre-checkout order, sparar idempotency key + checkout id.
- Shopify paid webhook-flode implementerat:
  - `supabase/functions/shopify-webhook/index.ts` verifierar HMAC pa raw body, sparar `webhook_inbox`, upsertar `orders`, idempotency-guard, triggar push till Nyehandel.
- Push till 3PL implementerat:
  - `supabase/functions/push-order-to-nyehandel/index.ts` hamtar paid order, postar till Nyehandel, uppdaterar `nyehandel_sync_status`, `nyehandel_order_id`, `last_sync_error`.
- Retry-funktion finns:
  - `supabase/functions/retry-failed-nyehandel-orders/index.ts` retryar failed paid-orders i batch.
- Databas och konfig uppdaterad:
  - `supabase/migrations/20260309130000_add_shipping_address_to_orders.sql`
  - `supabase/config.toml` har entries for nya functions.
- Operativt underlag tillagt:
  - `scripts/smoke-tests/shopify-nyehandel-flow.sh`
  - `DEPLOYMENT_CHECKLIST.md`
  - `ROADMAP.md` uppdaterad med faktisk status och tydlig startordning till nasta pass.

## 2) Senior Code Review pa dagens kod

### Kritiska saker (bor fixas fore UAT/go-live)

- **Interna function-endpoints ar fortfarande publika (`verify_jwt = false`)**
  - Galler framforallt `push-order-to-nyehandel` och `retry-failed-nyehandel-orders` i `supabase/config.toml`.
  - Risk: endpointen kan missbrukas om URL upptacks.
  - Rekommendation: krav pa intern secret/header + shop/domain allowlist, alternativt privat intern invocation med strikt auth.

- **Frontend skickar `totalPrice` till backend som sparas i order**
  - I `create-shopify-checkout` accepteras klientens total.
  - Risk: klientmanipulation av belopp i pre-checkout record.
  - Rekommendation: berakna totals server-side eller skriv over med Shopify-responsens verifierade totals efter cartCreate/paid webhook.

### Viktiga forbattringar (nasta steg)

- **Webhook hardening ar inte komplett**
  - HMAC ar bra, men shop-domain allowlist saknas (header `x-shopify-shop-domain` verifieras inte).
  - Rekommendation: krav pa exakt match mot `SHOPIFY_STORE_DOMAIN`.

- **Step 19 ar endast delvis klar**
  - Retry-function ar byggd, men scheduler/cron-wiring saknas fortfarande.
  - Rekommendation: satt upp schemalagd invocation + secret i produktion.

- **Smoke-test script saknar riktiga assertioner**
  - `scripts/smoke-tests/shopify-nyehandel-flow.sh` ar bra start men validerar inte automatiskt DB-resultat.
  - Rekommendation: lagg till exit-on-failure assertions for expected fields/statuser.

### Kodkvalitet/slop att stada imorgon

- **Legacyfil med syntaktiskt fel finns kvar**
  - `src/pages/CheckoutPage.tsx:43` har trasig `useTranslation(`-rad.
  - Filen ar inte routad langre, men bor tas bort eller repareras for att undvika build/TS-problem.

- **Type-sakerhet i checkout-mapping kan bli striktare**
  - `CheckoutHandoff` anvander `unknown as Record<string, unknown>` for variant-id lookup.
  - Rekommendation: lagg falt pa `Product`-typen pa ett konsekvent satt (helst pack-size aware mapping om det behovs).

## 3) Roadmap-uppdatering (vad vi bor borja med nasta gang)

`ROADMAP.md` ar uppdaterad och satta som startordning:

- Starta med **Step 23** (security hardening pass)
- Fortsatt med **Step 19** (riktig scheduler/cron wiring)
- Darefter **Step 24** (E2E UAT)
- Avsluta med **Step 25** (ta bort kvarvarande mock/legacy)

Praktiskt forsta arbetsblock nasta pass:

1. Lasa interna endpoints (`push-order-to-nyehandel`, `retry-failed-nyehandel-orders`) med strikt auth.
2. Validera `x-shopify-shop-domain` i webhook.
3. Koppla scheduler till retry-function med hemlighet.
