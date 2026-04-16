declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-expect-error — Deno types: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-expect-error — Deno types: Deno file import
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
            stockUpdates.push({ sku: variant.sku, stock: variant.stock ?? 0 });
          }
        }
      }

      // Batch update inventory for each variant
      for (const update of stockUpdates) {
        const { data: variant } = await adminClient
          .from("product_variants")
          .select("id")
          .eq("sku", update.sku)
          .maybeSingle();

        if (!variant) {
          totalSkipped++;
          continue;
        }

        // Upsert inventory row
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
            .insert({ variant_id: variant.id, quantity: update.stock, warehouse: "nordicpouch" });
        }

        // Mark variant as synced
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
  console.log(
    `sync-nyehandel-stock: ${totalUpdated} updated, ${totalSkipped} skipped, ${errors} errors, ${durationMs}ms`,
  );

  // Create ops alert if errors occurred
  if (errors > 0) {
    await adminClient
      .from("ops_alerts")
      .insert({
        type: "stock_sync_error",
        severity: "warning",
        title: `Stock sync: ${errors} error(s)`,
        details: JSON.stringify(errorDetails),
      })
      .catch(() => {}); // Don't fail response if alert insert fails
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
