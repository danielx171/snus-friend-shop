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
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CheckoutItem = {
  shopifyVariantId: string;
  quantity: number;
};

type CreateCheckoutBody = {
  items: CheckoutItem[];
  totalPrice?: number;
  currency?: string;
  customer?: Record<string, unknown>;
};

type ShopifyCartCreateResponse = {
  data?: {
    cartCreate?: {
      cart?: {
        id?: string;
        checkoutUrl?: string;
      };
      userErrors?: Array<{
        field?: string[];
        message: string;
      }>;
    };
  };
  errors?: Array<{ message: string }>;
};

function toShopifyMerchandiseId(shopifyVariantId: string): string {
  if (shopifyVariantId.startsWith("gid://shopify/ProductVariant/")) {
    return shopifyVariantId;
  }
  return `gid://shopify/ProductVariant/${shopifyVariantId}`;
}

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed", requestId }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as CreateCheckoutBody;
    const items = body?.items;

    if (!Array.isArray(items)) {
      return new Response(JSON.stringify({ error: "'items' must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isValidItems = items.every((item: CheckoutItem) => {
      return (
        item &&
        typeof item.shopifyVariantId === "string" &&
        item.shopifyVariantId.trim().length > 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    });

    if (!isValidItems) {
      return new Response(
        JSON.stringify({ error: "Each item must include shopifyVariantId (string) and quantity (positive integer)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "missing_supabase_env" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const idempotencyKey = crypto.randomUUID();
    const totalPrice = typeof body.totalPrice === "number" && body.totalPrice >= 0
      ? body.totalPrice
      : 0;
    const currency = typeof body.currency === "string" && body.currency.trim().length > 0
      ? body.currency.trim().toUpperCase()
      : "GBP";
    const customerMetadata = body.customer && typeof body.customer === "object"
      ? body.customer
      : {};

    const { data: insertedOrder, error: insertError } = await adminClient
      .from("orders")
      .insert({
        total_price: totalPrice,
        currency,
        checkout_status: "pending",
        nyehandel_sync_status: "pending",
        line_items_snapshot: items,
        customer_metadata: customerMetadata,
        idempotency_key: idempotencyKey,
      })
      .select("id")
      .single();

    if (insertError || !insertedOrder) {
      return new Response(
        JSON.stringify({ error: "failed_to_persist_order", details: insertError?.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const shopifyStoreDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN");
    const storefrontAccessToken = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
    const shopifyApiVersion = Deno.env.get("SHOPIFY_API_VERSION") ?? "2025-01";

    if (!shopifyStoreDomain || !storefrontAccessToken) {
      await adminClient
        .from("orders")
        .update({
          checkout_status: "failed",
          last_sync_error: "missing_shopify_env",
        })
        .eq("id", insertedOrder.id);

      return new Response(
        JSON.stringify({
          error: "missing_shopify_env",
          orderId: insertedOrder.id,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const graphqlEndpoint = `https://${shopifyStoreDomain}/api/${shopifyApiVersion}/graphql.json`;
    const query = `mutation cartCreate($input: CartInput) { cartCreate(input: $input) { cart { id checkoutUrl } userErrors { field message } } }`;
    const lines = items.map((item) => ({
      merchandiseId: toShopifyMerchandiseId(item.shopifyVariantId),
      quantity: item.quantity,
    }));

    const shopifyRes = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          input: { lines },
        },
      }),
    });

    const shopifyBody = (await shopifyRes.json()) as ShopifyCartCreateResponse;
    console.log(JSON.stringify({
      requestId,
      event: "shopify_cart_create_response",
      status: shopifyRes.status,
      orderId: insertedOrder.id,
    }));

    const apiErrors = shopifyBody.errors?.map((e) => e.message) ?? [];
    const userErrors = shopifyBody.data?.cartCreate?.userErrors?.map((e) => e.message) ?? [];
    const allErrors = [...apiErrors, ...userErrors];
    const checkoutUrl = shopifyBody.data?.cartCreate?.cart?.checkoutUrl;
    const shopifyCheckoutId = shopifyBody.data?.cartCreate?.cart?.id;

    if (!shopifyRes.ok || !checkoutUrl || !shopifyCheckoutId || allErrors.length > 0) {
      await adminClient
        .from("orders")
        .update({
          checkout_status: "failed",
          last_sync_error: allErrors.join(" | ") || `shopify_checkout_failed_${shopifyRes.status}`,
        })
        .eq("id", insertedOrder.id);

      return new Response(
        JSON.stringify({
          error: "shopify_checkout_failed",
          orderId: insertedOrder.id,
          requestId,
          details: allErrors,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    await adminClient
      .from("orders")
      .update({
        shopify_checkout_id: shopifyCheckoutId,
      })
      .eq("id", insertedOrder.id);

    return new Response(
      JSON.stringify({
        checkoutUrl,
        orderId: insertedOrder.id,
        idempotencyKey,
        requestId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error(JSON.stringify({ requestId, event: "create_shopify_checkout_error", error: String(error) }));
    return new Response(JSON.stringify({ error: "Invalid JSON body", requestId }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
