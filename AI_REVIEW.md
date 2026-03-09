# AI Review - Arkitektur och kodgranskning

Datum: 2026-03-09  
Projekt: `snus-friend-shop`

## Omfattning

Denna granskning fokuserar pa tre explicita fragor:

1. Om `src/lib/cart-utils.ts` ar korrekt anvand i alla varukorgs- och checkout-komponenter.
2. Om `CheckoutPage.tsx` ar rensad fran teater-kod (falska success-states) och redo for riktig API-integration.
3. Om orders-migrationen finns pa plats i Supabase-mappen pa ett deploybart satt.

Jag har dessutom listat filer med kvarvarande slop/legacy/mock-kod och vad som saknas for en faktisk Shopify-integration.

---

## Exekutiv slutsats

- **Status: Inte produktionsredo.**
- `cart-utils` ar **inte konsekvent anvand** i aktiv checkout-vag (`/checkout` pekar pa `CheckoutHandoff`, som har hardkodad logik).
- `CheckoutPage.tsx` innehaller fortfarande teater/legacy-rester och ar dessutom syntaktiskt trasig.
- Orders-migration finns som SQL-fil, men **ligger felplacerad** och kommer inte med i normal Supabase migrationskedja.
- Shopify-integrationen saknar kritiska delar i bade frontend och backend (checkout session creation, webhook/order-flode, persistence).

---

## 1) Anvandning av `src/lib/cart-utils.ts`

### Vad som fungerar

- `CartPage` anvander `getCartTotals(...)` korrekt for subtotal/frakt/total/progress.
  - Referens: `src/pages/CartPage.tsx:27`
- `CheckoutPage` (legacy-routen) anvander `getCartTotals(...)` for rabatt/frakt/slutsumma.
  - Referens: `src/pages/CheckoutPage.tsx:88`

### Brister

- **Aktiv checkout-sida (`/checkout`) ar `CheckoutHandoff`, inte `CheckoutPage`.**
  - Referens: `src/App.tsx:56`
- `CheckoutHandoff` anvander **inte** `cart-utils`; den har hardkodad frigrans/frakt:
  - `hasFreeShipping = totalPrice >= 25`
  - `shippingCost = hasFreeShipping ? 0 : 3.99`
  - Referenser: `src/pages/CheckoutHandoff.tsx:27`, `src/pages/CheckoutHandoff.tsx:28`
- Detta skapar risk for divergens mot marknadslogiken i `market` + `cart-utils` (valuta, trasklar, leveransalternativ).

### Extra observation

- `CartDrawer` importerar och anvander `getCartTotals`, men filen innehaller en olost merge-markor (`<<<<<<< HEAD`) och ar darfor i ett trasigt tillstand.
  - Referenser: `src/components/cart/CartDrawer.tsx:11`, `src/components/cart/CartDrawer.tsx:17`

**Svar pa fraga 1:** **Nej**, `cart-utils` ar inte korrekt/konsekvent anvand i alla varukorgs- och checkout-komponenter i aktiv flodesvag.

---

## 2) `CheckoutPage.tsx`: teater-kod och API-beredskap

### Teater-kod / legacy-rester

- Filen innehaller fortfarande en lokal "complete"-state och tack-sida med pseudo-ordernummer:
  - `type CheckoutStep = 'shipping' | 'payment' | 'complete'`
  - Rendergren for `currentStep === 'complete'`
  - `Order #SF{Date.now()}`
  - Referenser: `src/pages/CheckoutPage.tsx:25`, `src/pages/CheckoutPage.tsx:144`, `src/pages/CheckoutPage.tsx:155`
- Kommentaren i place-order-flodet visar att riktig checkout-redirect inte ar implementerad:
  - `TODO: Fetch Shopify Checkout URL ...`
  - Referens: `src/pages/CheckoutPage.tsx:107`

### API-beredskap

- `handlePlaceOrder` anropar `apiFetch('sync-nyehandel', ...)`.
  - Referens: `src/pages/CheckoutPage.tsx:108`
- `sync-nyehandel`-funktionen ar byggd for **adminstyrd katalog/lagersynk**, inte kundcheckout:
  - Kraver bearer token
  - Verifierar admin-roll mot `user_roles`
  - Referenser: `supabase/functions/sync-nyehandel/index.ts:18`, `supabase/functions/sync-nyehandel/index.ts:40`
- Detta betyder att checkout-anropet i praktiken ar felriktat for normal kundtrafik.

### Kritisk kodhygien

- `CheckoutPage.tsx` ar syntaktiskt trasig (ofullstandig `useTranslation(...)` rad), vilket blockerar tillforlitlig exekvering.
  - Referens: `src/pages/CheckoutPage.tsx:43`

**Svar pa fraga 2:** **Nej**. `CheckoutPage.tsx` ar inte fullt rensad fran teater/legacy och ar inte redo for riktig API-integration i nuvarande skick.

---

## 3) Orders-migration i Supabase

### Vad som finns

- En orders-migration existerar:
  - `supabase/20260309_create_orders_table.sql`
  - Skapar `public.orders`, policy, index.

### Problem

- Filen ligger **inte** i `supabase/migrations/`.
- Sokning i `supabase/migrations/*.sql` visar ingen orders-tabell.
- Konsekvens: migrationen riskerar att inte appliceras via standardflodet (`supabase db push` / migration history).

Ytterligare signal:

- Genererade typer innehaller ingen `orders`-tabell.
  - Referens: `src/integrations/supabase/types.ts` (ingen `orders` under `public.Tables`)

**Svar pa fraga 3:** **Delvis**. SQL finns, men migrationen ar inte korrekt placerad i migrationskedjan och ar darfor inte robust "pa plats".

---

## Filer som fortfarande ser ut att innehalla slop/legacy/mock

- `src/components/cart/CartDrawer.tsx`
  - Olosd merge-markor (`<<<<<<< HEAD`) -> akut hygien/byggproblem.
- `src/pages/CheckoutPage.tsx`
  - Legacy "complete"-gren, TODO om Shopify redirect, samt syntaktisk skada.
- `src/pages/CheckoutHandoff.tsx`
  - Hardkodad checkout-logik (frigrans/frakt), CTA utan riktig checkout-integration.
- `src/pages/OrderConfirmation.tsx`
  - Uttalad mock-orderdata (`mockOrder`).
- `src/pages/AccountPage.tsx`
  - Mock-order/mock-adressdata (`mockOrders`, `mockAddresses`).

Obs: Jag kunde inte verifiera build i denna miljo eftersom `vite` saknades i PATH/dependencies-installation (`bun run build` -> `vite: command not found`).

---

## Vad som saknas for Shopify-integration (gap-analys)

### Backend (maste finnas)

1. En dedikerad checkout-funktion (t.ex. Supabase Edge Function) som:
   - Tar emot validerad cart payload.
   - Mapper produkter/varianter till Shopify variant IDs/SKUs.
   - Skapar Shopify checkout/session (Storefront API eller Admin-baserad strategi).
   - Returnerar `checkoutUrl`/`paymentUrl`.
2. Webhook-flode for order-livscykel:
   - Verifiering av Shopify-signatur.
   - Persistens i `orders` och uppdatering av sync-status till 3PL.
3. Korrekt migration i `supabase/migrations/` + uppdaterade typer.
4. Felhantering/idempotens (sarskilt for webhook retries).

### Frontend (maste bytas till riktig handoff)

1. Checkout-knapp ska anropa riktig Shopify-checkout-endpoint (inte `sync-nyehandel`).
2. Redirect till extern checkout URL, med success/cancel-return URLer.
3. Rensa ut pseudo-success UI i klienten (ingen `Date.now()`-order som primar bekraftelse).
4. Konsolidera totals-logik till `cart-utils` i **alla** checkout-vyer (inklusive `CheckoutHandoff`).
5. Tydlig state for `loading/error/redirecting` i checkoutflodet.

### Arkitekturrekommendation (kort)

- Gor `CheckoutHandoff` till den enda checkout-UI:n och koppla den till riktig backend-funktion.
- Lat `CheckoutPage` antingen tas bort eller ersattas av samma handoff-komponent (for att undvika dubbla implementationer).
- Flytta orders SQL till `supabase/migrations/<timestamp>_create_orders_table.sql` och regen `src/integrations/supabase/types.ts`.

---

## Prioriterad atgardslista

1. Fixa kodhygien: los merge-markor i `CartDrawer` och syntaktiskt fel i `CheckoutPage`.
2. Flytta orders-migrationen till `supabase/migrations/` och applicera den.
3. Implementera Shopify checkout edge function och byt frontend-anrop.
4. Standardisera totals i checkout med `getCartTotals(...)` i aktiv route (`CheckoutHandoff`).
5. Ta bort/isolera mock- och legacy-vyer innan produktionssattning.
