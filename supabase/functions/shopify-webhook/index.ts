declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-shopify-topic, x-shopify-hmac-sha256, x-shopify-shop-domain, x-shopify-webhook-id",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ShopifyAddress = {
  first_name?: string;
  last_name?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
};

type ShopifyLineItem = {
  id?: number;
  variant_id?: number | null;
  sku?: string;
  quantity?: number;
  price?: string;
  title?: string;
};

type ShopifyOrderPayload = {
  id?: number;
  order_number?: number;
  email?: string;
  total_price?: string;
  currency?: string;
  financial_status?: string;
  paid_at?: string;
  created_at?: string;
  shipping_address?: ShopifyAddress;
  line_items?: ShopifyLineItem[];
};

const textEncoder = new TextEncoder();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a[i] ^ b[i];
  }
  return out === 0;
}

async function verifyShopifyHmac(rawBody: string, hmacHeader: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(rawBody));
  const expected = Uint8Array.from(atob(hmacHeader), (c) => c.charCodeAt(0));
  const actual = new Uint8Array(signature);
  return timingSafeEqual(actual, expected);
}

function isPaidEvent(topic: string, payload: ShopifyOrderPayload): boolean {
  if (topic === "orders/paid") return true;
  return (payload.financial_status ?? "").toLowerCase() === "paid";
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET");
  if (!secret) {
    return jsonResponse({ error: "missing_webhook_secret", requestId }, 500);
  }

  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const topic = req.headers.get("x-shopify-topic") ?? "unknown";
  const webhookId = req.headers.get("x-shopify-webhook-id") ?? crypto.randomUUID();

  const rawBody = await req.text();
  if (!hmacHeader) {
    return jsonResponse({ error: "missing_hmac", requestId }, 401);
  }

  const isValid = await verifyShopifyHmac(rawBody, hmacHeader, secret).catch(() => false);
  if (!isValid) {
    return jsonResponse({ error: "invalid_hmac", requestId }, 401);
  }

  let payload: ShopifyOrderPayload;
  try {
    payload = JSON.parse(rawBody) as ShopifyOrderPayload;
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: webhookRow, error: webhookInsertError } = await adminClient
    .from("webhook_inbox")
    .insert({
      provider: "shopify",
      topic,
      status: "received",
      attempts: 1,
      received_at: new Date().toISOString(),
      payload,
    })
    .select("id")
    .single();

  if (webhookInsertError || !webhookRow) {
    return jsonResponse({ error: "failed_to_persist_webhook", details: webhookInsertError?.message, requestId }, 500);
  }

  try {
    const shopifyOrderId = payload.id ? String(payload.id) : null;
    const paidEvent = isPaidEvent(topic, payload);

    if (paidEvent && shopifyOrderId) {
      const { data: existing } = await adminClient
        .from("orders")
        .select("id, checkout_status, shopify_order_id")
        .eq("shopify_order_id", shopifyOrderId)
        .maybeSingle();

      if (existing?.checkout_status === "paid") {
        await adminClient
          .from("webhook_inbox")
          .update({ status: "processed", processed_at: new Date().toISOString() })
          .eq("id", webhookRow.id);

        return jsonResponse({
          received: true,
          requestId,
          webhookId,
          webhookInboxId: webhookRow.id,
          idempotent: true,
          orderId: existing.id,
        });
      }

      const totalPrice = Number(payload.total_price ?? "0");
      const currency = (payload.currency ?? "GBP").toUpperCase();
      const paidAt = payload.paid_at ?? payload.created_at ?? new Date().toISOString();
      const lineItems = Array.isArray(payload.line_items) ? payload.line_items : [];
      const shippingAddress = payload.shipping_address ?? {};

      const { data: upsertedOrder, error: upsertError } = await adminClient
        .from("orders")
        .upsert({
          shopify_order_id: shopifyOrderId,
          customer_email: payload.email ?? null,
          total_price: Number.isFinite(totalPrice) ? totalPrice : 0,
          currency,
          checkout_status: "paid",
          paid_at: paidAt,
          shipping_address: shippingAddress,
          line_items_snapshot: lineItems,
          nyehandel_sync_status: existing?.checkout_status === "paid" ? "synced" : "pending",
        }, { onConflict: "shopify_order_id" })
        .select("id")
        .single();

      if (upsertError || !upsertedOrder) {
        await adminClient
          .from("webhook_inbox")
          .update({ status: "failed", processed_at: new Date().toISOString() })
          .eq("id", webhookRow.id);
        return jsonResponse({ error: "failed_to_upsert_order", details: upsertError?.message, requestId }, 500);
      }

      const functionBase = `${supabaseUrl}/functions/v1/push-order-to-nyehandel`;
      const pushResponse = await fetch(functionBase, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ orderId: upsertedOrder.id }),
      });

      if (!pushResponse.ok) {
        const details = await pushResponse.text();
        console.error(JSON.stringify({
          requestId,
          webhookId,
          event: "push_order_to_nyehandel_failed",
          orderId: upsertedOrder.id,
          status: pushResponse.status,
        }));
        await adminClient
          .from("orders")
          .update({
            nyehandel_sync_status: "failed",
            last_sync_error: `push_order_trigger_failed_${pushResponse.status}:${details}`,
          })
          .eq("id", upsertedOrder.id);
      } else {
        console.log(JSON.stringify({
          requestId,
          webhookId,
          event: "push_order_to_nyehandel_ok",
          orderId: upsertedOrder.id,
          status: pushResponse.status,
        }));
      }

      await adminClient
        .from("webhook_inbox")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("id", webhookRow.id);

      return jsonResponse({
        received: true,
        requestId,
        webhookId,
        webhookInboxId: webhookRow.id,
        orderId: upsertedOrder.id,
        paidEvent: true,
      });
    }

    await adminClient
      .from("webhook_inbox")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("id", webhookRow.id);

    return jsonResponse({
      received: true,
      requestId,
      webhookId,
      webhookInboxId: webhookRow.id,
      paidEvent: false,
    });
  } catch (error) {
    await adminClient
      .from("webhook_inbox")
      .update({ status: "failed", processed_at: new Date().toISOString() })
      .eq("id", webhookRow.id);

    return jsonResponse({ error: "processing_failed", details: String(error), requestId }, 500);
  }
});
