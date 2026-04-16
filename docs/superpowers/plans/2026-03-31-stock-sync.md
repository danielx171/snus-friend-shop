# Stock Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync product stock levels from Nyehandel every 10 minutes so customers see accurate availability.

**Architecture:** New Deno edge function fetches all NYE products (paginated), extracts variant stock, batch-updates the `inventory` table. Triggered by pg_cron. Same auth/header pattern as existing `sync-nyehandel`.

**Tech Stack:** Deno (Supabase Edge Functions), Supabase JS client, pg_cron + pg_net

---

### Task 1: DB Migration — Add stock_synced_at column

**Files:**
- Create: `supabase/migrations/20260331180000_add_stock_synced_at.sql`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260331180000_add_stock_synced_at.sql`:

```sql
-- Track when each variant's stock was last synced from Nyehandel
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS stock_synced_at timestamptz;

-- Index for finding stale variants
CREATE INDEX IF NOT EXISTS idx_product_variants_stock_synced_at
  ON product_variants (stock_synced_at);
```

- [ ] **Step 2: Apply migration via Supabase MCP**

Use the Supabase MCP `apply_migration` tool or `execute_sql` to run the migration.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260331180000_add_stock_synced_at.sql
git commit -m "migration: add stock_synced_at to product_variants

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Create sync-nyehandel-stock Edge Function

**Files:**
- Create: `supabase/functions/sync-nyehandel-stock/index.ts`

- [ ] **Step 1: Create the edge function**

Create `supabase/functions/sync-nyehandel-stock/index.ts`:

```typescript
declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore: Deno file import
import { corsHeaders } from "../_shared/cors.ts";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface NyeVariant {
  sku?: string;
  stock?: number;
}

interface NyeProduct {
  id?: number;
  variants?: NyeVariant[];
}

interface NyeResponse {
  data?: NyeProduct[];
  meta?: { last_page?: number; total?: number };
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed", requestId }, 405);

  // Auth: same cron secret as sync-nyehandel
  const cronSecret = Deno.env.get("SYNC_CRON_SECRET");
  const provided = req.headers.get("x-cron-secret");
  if (!cronSecret || !provided || provided !== cronSecret) {
    return jsonResponse({ error: "unauthorized", requestId }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const nyeToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyeBaseUrl =
    Deno.env.get("NYEHANDEL_API_BASE_URL") ||
    Deno.env.get("NYEHANDEL_API_URL") ||
    "https://api.nyehandel.se/api/v1";
  const nyeXIdentifier = Deno.env.get("NYEHANDEL_X_IDENTIFIER") ?? "";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }
  if (!nyeToken) {
    return jsonResponse({ error: "nyehandel_not_configured", requestId }, 503);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const startTime = Date.now();
  let totalUpdated = 0;
  let totalSkipped = 0;
  let errors = 0;
  const errorDetails: string[] = [];

  try {
    // Fetch all pages from NYE
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage) {
      const resp = await fetch(
        `${nyeBaseUrl}/products?status=published&per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${nyeToken}`,
            Accept: "application/json",
            "X-Language": "en",
            "X-identifier": nyeXIdentifier,
          },
        },
      );

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        errorDetails.push(`Page ${page}: HTTP ${resp.status} — ${errText.slice(0, 200)}`);
        errors++;
        break; // Stop on API error — don't overwrite good data with partial sync
      }

      const body = (await resp.json()) as NyeResponse;
      const products = body.data ?? [];
      lastPage = body.meta?.last_page ?? 1;

      // Collect all SKU→stock pairs from this page
      const stockUpdates: Array<{ sku: string; stock: number }> = [];
      for (const product of products) {
        for (const variant of product.variants ?? []) {
          if (variant.sku) {
            stockUpdates.push({
              sku: variant.sku,
              stock: variant.stock ?? 0,
            });
          }
        }
      }

      // Batch update inventory via RPC or individual updates
      for (const update of stockUpdates) {
        // Find the variant_id for this SKU
        const { data: variant } = await adminClient
          .from("product_variants")
          .select("id")
          .eq("sku", update.sku)
          .maybeSingle();

        if (!variant) {
          totalSkipped++;
          continue;
        }

        // Upsert inventory
        const { data: existing } = await adminClient
          .from("inventory")
          .select("id")
          .eq("variant_id", variant.id)
          .maybeSingle();

        if (existing) {
          await adminClient
            .from("inventory")
            .update({ quantity: update.stock, updated_at: new Date().toISOString() })
            .eq("variant_id", variant.id);
        } else {
          await adminClient
            .from("inventory")
            .insert({
              variant_id: variant.id,
              quantity: update.stock,
              warehouse: "nordicpouch",
            });
        }

        // Update stock_synced_at
        await adminClient
          .from("product_variants")
          .update({ stock_synced_at: new Date().toISOString() })
          .eq("id", variant.id);

        totalUpdated++;
      }

      page++;
    }
  } catch (err) {
    errors++;
    errorDetails.push(`Unexpected: ${String(err)}`);
  }

  const durationMs = Date.now() - startTime;

  // Log summary
  console.log(
    `sync-nyehandel-stock: ${totalUpdated} updated, ${totalSkipped} skipped, ${errors} errors, ${durationMs}ms`,
  );

  // If there were errors, create an ops alert
  if (errors > 0) {
    await adminClient.from("ops_alerts").insert({
      type: "stock_sync_error",
      severity: "warning",
      title: `Stock sync: ${errors} error(s)`,
      details: JSON.stringify(errorDetails),
    }).catch(() => {}); // Don't fail the response if alert insert fails
  }

  return jsonResponse({
    ok: true,
    requestId,
    updated: totalUpdated,
    skipped: totalSkipped,
    errors,
    errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    durationMs,
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/sync-nyehandel-stock/index.ts
git commit -m "feat: lightweight stock sync edge function (10-min cron)

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Add Function Config + Cron Schedule

**Files:**
- Modify: `supabase/config.toml`
- Create: `supabase/migrations/20260331180100_stock_sync_cron.sql`

- [ ] **Step 1: Add function config to supabase/config.toml**

Add at the end of the `[functions.*]` section:

```toml
[functions.sync-nyehandel-stock]
verify_jwt = false
```

- [ ] **Step 2: Create cron migration**

Create `supabase/migrations/20260331180100_stock_sync_cron.sql`:

```sql
-- Schedule lightweight stock sync every 10 minutes
-- Uses same SYNC_CRON_SECRET as the full sync-nyehandel function
DO $$
DECLARE
  project_url text;
  cron_secret text;
BEGIN
  SELECT value INTO project_url FROM sync_config WHERE key = 'supabase_project_url';
  SELECT value INTO cron_secret FROM sync_config WHERE key = 'sync_cron_secret';

  IF project_url IS NULL OR cron_secret IS NULL THEN
    RAISE NOTICE 'sync_config missing supabase_project_url or sync_cron_secret — skipping stock sync cron setup';
    RETURN;
  END IF;

  -- Remove existing job if any
  PERFORM cron.unschedule('sync-nye-stock-10min')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sync-nye-stock-10min');

  PERFORM cron.schedule(
    'sync-nye-stock-10min',
    '*/10 * * * *',
    format(
      'SELECT net.http_post(url := %L, headers := %L::jsonb)',
      project_url || '/functions/v1/sync-nyehandel-stock',
      json_build_object('Content-Type', 'application/json', 'x-cron-secret', cron_secret)::text
    )
  );
END $$;
```

- [ ] **Step 3: Commit**

```bash
git add supabase/config.toml supabase/migrations/20260331180100_stock_sync_cron.sql
git commit -m "feat: stock sync cron — every 10 minutes via pg_cron

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Deploy + Verify

- [ ] **Step 1: Apply migrations via Supabase MCP**

Use `execute_sql` to run both migrations on the live database.

- [ ] **Step 2: Deploy the edge function**

Use Supabase MCP `deploy_edge_function` with name `sync-nyehandel-stock`.

- [ ] **Step 3: Test manually**

Trigger the function manually via curl or MCP:
```bash
curl -X POST https://bozdnoctcszbhemdjsek.supabase.co/functions/v1/sync-nyehandel-stock \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: YOUR_SYNC_CRON_SECRET"
```

Expected: JSON response with `ok: true`, `updated: N` (where N > 0), `errors: 0`.

- [ ] **Step 4: Verify in database**

Check that `product_variants.stock_synced_at` is populated:
```sql
SELECT COUNT(*) FROM product_variants WHERE stock_synced_at IS NOT NULL;
SELECT COUNT(*) FROM inventory WHERE updated_at > now() - interval '5 minutes';
```

- [ ] **Step 5: Update CLAUDE.md**

Add `sync-nyehandel-stock` to the edge function list in CLAUDE.md and update the cron count.

- [ ] **Step 6: Update SESSION_LOG.md**

Add stock sync to the session log.

- [ ] **Step 7: Final commit**

```bash
git add CLAUDE.md SESSION_LOG.md
git commit -m "docs: add stock sync to architecture docs

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
