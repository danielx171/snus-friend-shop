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
  admin_graphql_api_id?: string;
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
  if (topic !== "orders/paid") return false;
  return (payload.financial_status ?? "paid").toLowerCase() === "paid";
}

function buildShopifyOrderGid(payload: ShopifyOrderPayload): string | null {
  if (payload.admin_graphql_api_id && payload.admin_graphql_api_id.startsWith("gid://shopify/Order/")) {
    return payload.admin_graphql_api_id;
  }

  if (payload.id) {
    return `gid://shopify/Order/${payload.id}`;
  }

  return null;
}

async function callShopifyAdminGraphql(
  shopDomain: string,
  adminToken: string,
  apiVersion: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<{ ok: boolean; details?: string; data?: Record<string, unknown> }> {
  const response = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const details = await response.text();
    return { ok: false, details: `http_${response.status}:${details}` };
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  const graphqlErrors = Array.isArray(data?.errors) ? data.errors : [];
  if (graphqlErrors.length > 0) {
    return { ok: false, details: `graphql_errors:${JSON.stringify(graphqlErrors)}` };
  }

  return { ok: true, data };
}

async function markShopifyOrderSyncFailed(
  shopDomain: string,
  adminToken: string,
  apiVersion: string,
  orderGid: string,
): Promise<{ ok: boolean; details?: string }> {
  const mutation = `
    mutation AddOrderTag($id: ID!, $tags: [String!]!) {
      tagsAdd(id: $id, tags: $tags) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await callShopifyAdminGraphql(shopDomain, adminToken, apiVersion, mutation, {
    id: orderGid,
    tags: ["NYE_SYNC_FAILED"],
  });

  const userErrors = (result.data?.tagsAdd as { userErrors?: unknown[] } | undefined)?.userErrors ?? [];
  if (Array.isArray(userErrors) && userErrors.length > 0) {
    return { ok: false, details: `tags_add_user_errors:${JSON.stringify(userErrors)}` };
  }

  return result;
}

async function writeNyehandelOrderIdMetafield(
  shopDomain: string,
  adminToken: string,
  apiVersion: string,
  orderGid: string,
  nyehandelOrderId: string,
): Promise<{ ok: boolean; details?: string }> {
  const mutation = `
    mutation SetOrderMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await callShopifyAdminGraphql(shopDomain, adminToken, apiVersion, mutation, {
    metafields: [
      {
        ownerId: orderGid,
        namespace: "nyehandel",
        key: "order_id",
        type: "single_line_text_field",
        value: nyehandelOrderId,
      },
    ],
  });

  const userErrors = (result.data?.metafieldsSet as { userErrors?: unknown[] } | undefined)?.userErrors ?? [];
  if (Array.isArray(userErrors) && userErrors.length > 0) {
    return { ok: false, details: `metafields_set_user_errors:${JSON.stringify(userErrors)}` };
  }

  return result;
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
  const expectedShopDomain = (Deno.env.get("SHOPIFY_STORE_DOMAIN") ?? "").trim().toLowerCase();
  const shopifyAdminToken = Deno.env.get("SHOPIFY_ADMIN_API_ACCESS_TOKEN");
  const shopifyApiVersion = (Deno.env.get("SHOPIFY_API_VERSION") ?? "2024-10").trim();
  if (!secret) {
    return jsonResponse({ error: "missing_webhook_secret", requestId }, 500);
  }

  if (!expectedShopDomain) {
    return jsonResponse({ error: "missing_shopify_store_domain", requestId }, 500);
  }

  if (!shopifyAdminToken) {
    return jsonResponse({ error: "missing_shopify_admin_api_access_token", requestId }, 500);
  }

  const hmacHeader = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const shopDomainHeader = (req.headers.get("x-shopify-shop-domain") ?? "").trim().toLowerCase();
  const topic = req.headers.get("x-shopify-topic") ?? "unknown";
  const webhookId = req.headers.get("x-shopify-webhook-id") ?? crypto.randomUUID();

  if (!shopDomainHeader || shopDomainHeader !== expectedShopDomain) {
    return jsonResponse({ error: "invalid_shop_domain", requestId, webhookId }, 401);
  }

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
  const internalFunctionsSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }

  if (!internalFunctionsSecret) {
    return jsonResponse({ error: "missing_internal_functions_secret", requestId }, 500);
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
      const orderGid = buildShopifyOrderGid(payload);

      if (!orderGid) {
        await adminClient
          .from("webhook_inbox")
          .update({ status: "failed", processed_at: new Date().toISOString() })
          .eq("id", webhookRow.id);
        return jsonResponse({ error: "missing_shopify_order_gid", requestId, webhookId }, 500);
      }

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
          "x-internal-function-secret": internalFunctionsSecret,
          "x-request-id": requestId,
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

        const syncFailedTagResult = await markShopifyOrderSyncFailed(
          expectedShopDomain,
          shopifyAdminToken,
          shopifyApiVersion,
          orderGid,
        );

        if (!syncFailedTagResult.ok) {
          await adminClient
            .from("orders")
            .update({
              last_sync_error: `shopify_tag_failed:${syncFailedTagResult.details ?? "unknown"}`,
            })
            .eq("id", upsertedOrder.id);
        }
      } else {
        const pushResult = await pushResponse.json().catch(() => ({}));
        const nyehandelOrderId = String(pushResult?.nyehandelOrderId ?? "").trim();

        if (nyehandelOrderId) {
          const metafieldResult = await writeNyehandelOrderIdMetafield(
            expectedShopDomain,
            shopifyAdminToken,
            shopifyApiVersion,
            orderGid,
            nyehandelOrderId,
          );

          if (!metafieldResult.ok) {
            await adminClient
              .from("orders")
              .update({
                last_sync_error: `shopify_metafield_failed:${metafieldResult.details ?? "unknown"}`,
              })
              .eq("id", upsertedOrder.id);
          }
        }

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
