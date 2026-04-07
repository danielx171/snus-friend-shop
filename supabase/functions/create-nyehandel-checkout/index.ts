declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// @ts-ignore: Deno URL import
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @ts-ignore: Deno file import
import { getCorsHeaders } from "../_shared/cors.ts";
// @ts-ignore: Deno file import
import { distributeDiscount, percentageToAmount } from "../_shared/discount-distribution.ts";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

/** Fallback shipping methods — used only when live NYE fetch fails */
const FALLBACK_SHIPPING_METHODS = [
  "UPS Standard (J229F1)",
  "UPS Express Saver",
  "DHL Economy (Non EU)",
  "DHL Express (Non EU)",
  "DHL Express EU",
  "DHL Economy EU",
];

/** In-memory cache for live shipping methods from Nyehandel */
let cachedShippingMethods: string[] = [];
let shippingCachedAt = 0;
const SHIPPING_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CheckoutItem {
  sku: string;
  slug: string;
  quantity: number;
  /** Display fields — persisted in line_items_snapshot for order confirmation UI */
  product_name?: string;
  brand?: string;
  image_url?: string;
  pack_label?: string;
  unit_price?: number;
}

interface CheckoutCustomer {
  email: string;
  firstname: string;
  lastname: string;
}

interface CheckoutAddress {
  address: string;
  postcode: string;
  city: string;
  country: string;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  billing_address: CheckoutAddress;
  shipping_method: string;
  idempotency_key?: string;
  /** Client-computed display total — persisted for order confirmation UI */
  display_total?: number;
  /** Currency code for the display total */
  display_currency?: string;
  /** Optional discount/coupon code */
  discount_code?: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let _corsHeaders: Record<string, string> = getCorsHeaders();

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ..._corsHeaders, "Content-Type": "application/json" },
  });
}

function validatePayload(
  body: unknown,
  requestId: string,
): { ok: true; data: CheckoutRequest } | { ok: false; response: Response } {
  const b = body as Record<string, unknown>;

  // items
  if (!Array.isArray(b?.items) || b.items.length === 0) {
    return {
      ok: false,
      response: jsonResponse(
        { error: "items_required", requestId },
        400,
      ),
    };
  }
  for (const item of b.items as Record<string, unknown>[]) {
    if (typeof item.sku !== "string" || !item.sku.trim()) {
      return {
        ok: false,
        response: jsonResponse(
          { error: "item_sku_required", requestId },
          400,
        ),
      };
    }
    if (typeof item.quantity !== "number" || item.quantity < 1) {
      return {
        ok: false,
        response: jsonResponse(
          { error: "item_quantity_invalid", requestId },
          400,
        ),
      };
    }
  }

  // customer
  const cust = b.customer as Record<string, unknown> | undefined;
  if (
    !cust ||
    typeof cust.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(cust.email).trim()) ||
    typeof cust.firstname !== "string" ||
    !cust.firstname.trim() ||
    typeof cust.lastname !== "string" ||
    !cust.lastname.trim()
  ) {
    return {
      ok: false,
      response: jsonResponse(
        { error: "customer_fields_required", message: "email, firstname, lastname are required", requestId },
        400,
      ),
    };
  }

  // billing_address
  const addr = b.billing_address as Record<string, unknown> | undefined;
  if (
    !addr ||
    typeof addr.address !== "string" ||
    !addr.address.trim() ||
    typeof addr.postcode !== "string" ||
    !addr.postcode.trim() ||
    typeof addr.city !== "string" ||
    !addr.city.trim() ||
    typeof addr.country !== "string" ||
    !addr.country.trim()
  ) {
    return {
      ok: false,
      response: jsonResponse(
        {
          error: "billing_address_fields_required",
          message: "address, postcode, city, country are required",
          requestId,
        },
        400,
      ),
    };
  }

  // shipping_method — basic type check; live validation against NYE happens in main handler
  if (typeof b.shipping_method !== "string" || !b.shipping_method.trim()) {
    return {
      ok: false,
      response: jsonResponse(
        { error: "shipping_method_required", requestId },
        400,
      ),
    };
  }

  // idempotency_key — optional, client-generated UUID to prevent duplicate orders
  const idempotencyKey =
    typeof b.idempotency_key === "string" && b.idempotency_key.trim()
      ? b.idempotency_key.trim()
      : undefined;

  const displayTotal = typeof b.display_total === "number" ? b.display_total : undefined;
  const displayCurrency = typeof b.display_currency === "string" ? b.display_currency : undefined;

  return {
    ok: true,
    data: {
      items: b.items as CheckoutItem[],
      customer: cust as unknown as CheckoutCustomer,
      billing_address: addr as unknown as CheckoutAddress,
      shipping_method: b.shipping_method as string,
      idempotency_key: idempotencyKey,
      display_total: displayTotal,
      display_currency: displayCurrency,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  NYE Validation Helpers                                             */
/* ------------------------------------------------------------------ */

/** Fetch valid shipping methods from Nyehandel, with in-memory cache */
async function getValidShippingMethods(
  baseUrl: string,
  token: string,
  xIdentifier: string,
): Promise<string[]> {
  const now = Date.now();
  if (cachedShippingMethods.length > 0 && now - shippingCachedAt < SHIPPING_CACHE_TTL_MS) {
    return cachedShippingMethods;
  }
  try {
    const res = await fetch(`${baseUrl}/shipping-methods`, {
      headers: {
        Accept: "application/json",
        "X-identifier": xIdentifier,
        Authorization: `Bearer ${token}`,
        "X-Language": "en",
      },
    });
    if (res.ok) {
      const json = await res.json();
      // NYE returns { data: [{ name: "UPS Standard (J229F1)", ... }, ...] }
      const methods = (json?.data ?? [])
        .map((m: Record<string, unknown>) => String(m.name ?? ""))
        .filter(Boolean);
      if (methods.length > 0) {
        cachedShippingMethods = methods;
        shippingCachedAt = now;
        return methods;
      }
    }
  } catch {
    // Fall through to fallback
  }
  // Return fallback if live fetch fails — never block checkout on a cache miss
  return FALLBACK_SHIPPING_METHODS;
}

/**
 * Validate SKUs against the Nyehandel catalog.
 * Returns an array of SKUs that NYE doesn't recognise.
 * Uses batched individual lookups (NYE has no bulk SKU endpoint).
 */
async function validateSkusAgainstNye(
  skus: string[],
  baseUrl: string,
  token: string,
  xIdentifier: string,
  requestId: string,
): Promise<string[]> {
  const invalidSkus: string[] = [];

  // Deduplicate SKUs before checking
  const uniqueSkus = [...new Set(skus)];

  // Check each SKU against NYE — run in parallel with concurrency limit
  const BATCH_SIZE = 5;
  for (let i = 0; i < uniqueSkus.length; i += BATCH_SIZE) {
    const batch = uniqueSkus.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(async (sku) => {
        try {
          const res = await fetch(
            `${baseUrl}/products/find?sku=${encodeURIComponent(sku)}`,
            {
              headers: {
                Accept: "application/json",
                "X-identifier": xIdentifier,
                Authorization: `Bearer ${token}`,
                "X-Language": "en",
              },
            },
          );
          if (!res.ok) {
            console.log(JSON.stringify({ requestId, event: "nye_sku_check_failed", sku, status: res.status }));
            return { sku, valid: false };
          }
          const json = await res.json();
          // NYE returns { data: { ... } } for found products, or empty/404 for missing
          const found = json?.data?.id != null;
          return { sku, valid: found };
        } catch {
          // Network error on SKU check — treat as valid to avoid blocking checkout
          console.log(JSON.stringify({ requestId, event: "nye_sku_check_error", sku }));
          return { sku, valid: true };
        }
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled" && !result.value.valid) {
        invalidSkus.push(result.value.sku);
      }
    }
  }

  return invalidSkus;
}

/**
 * Acquire a processing lock using Supabase pg_advisory_xact_lock.
 * Prevents concurrent requests with the same idempotency key from
 * both creating orders. Returns true if lock acquired.
 */
async function acquireProcessingLock(
  adminClient: ReturnType<typeof createClient>,
  idempotencyKey: string,
  requestId: string,
): Promise<boolean> {
  try {
    // Hash the idempotency key to a bigint for pg_advisory_xact_lock
    // Use a simple hash: sum of char codes modulo 2^31
    let hash = 0;
    for (let i = 0; i < idempotencyKey.length; i++) {
      hash = ((hash << 5) - hash + idempotencyKey.charCodeAt(i)) | 0;
    }
    // pg_try_advisory_lock returns true if acquired, false if already held
    const { data, error } = await adminClient.rpc("pg_try_advisory_lock", { key: hash });
    if (error) {
      console.log(JSON.stringify({ requestId, event: "advisory_lock_error", error: error.message }));
      // If advisory lock fails, allow checkout to proceed (fail-open)
      return true;
    }
    return data === true;
  } catch {
    // Fail open — don't block checkout if lock mechanism fails
    return true;
  }
}

/* ------------------------------------------------------------------ */
/*  Main handler                                                       */
/* ------------------------------------------------------------------ */

Deno.serve(async (req) => {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  try {
    _corsHeaders = getCorsHeaders(req.headers.get("origin"));
  } catch (e) {
    return new Response(JSON.stringify({ error: "cors_init_failed", detail: String(e) }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: _corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed", requestId }, 405);
  }

  try {

  /* ---------- env vars ---------- */

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const nyehandelToken = Deno.env.get("NYEHANDEL_API_TOKEN");
  const nyehandelXIdentifier = Deno.env.get("NYEHANDEL_X_IDENTIFIER") ?? "";
  const nyehandelBaseUrl =
    Deno.env.get("NYEHANDEL_API_URL") || "https://api.nyehandel.se/api/v2";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "missing_supabase_env", requestId }, 500);
  }
  if (!nyehandelToken) {
    return jsonResponse({ error: "missing_nyehandel_token", requestId }, 500);
  }

  /* ---------- parse + validate body ---------- */

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_json", requestId }, 400);
  }

  const validation = validatePayload(rawBody, requestId);
  if (!validation.ok) return validation.response;
  const { items, customer, billing_address, shipping_method, idempotency_key, display_total, display_currency } = validation.data;

  /* ---------- resolve optional user_id (for SnusPoints) ---------- */

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  let userId: string | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const { data: { user } } = await adminClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (user?.id) userId = user.id;
  }

  /* ---------- idempotency check + processing lock ---------- */

  if (idempotency_key) {
    // Layer 1: Check if order already exists for this idempotency key
    const { data: existing } = await adminClient
      .from("orders")
      .select("id, nyehandel_order_id, nyehandel_prefix")
      .eq("idempotency_key", idempotency_key)
      .maybeSingle();

    if (existing) {
      return jsonResponse({
        ok: true,
        idempotent: true,
        orderId: existing.id,
        nyehandelOrderId: existing.nyehandel_order_id,
        prefix: existing.nyehandel_prefix,
        requestId,
      });
    }

    // Layer 2: Acquire advisory lock to prevent concurrent duplicate submissions
    const lockAcquired = await acquireProcessingLock(adminClient, idempotency_key, requestId);
    if (!lockAcquired) {
      console.log(JSON.stringify({ requestId, event: "duplicate_submission_blocked", idempotency_key }));
      return jsonResponse(
        { error: "order_already_processing", message: "This order is currently being processed. Please wait.", requestId },
        409,
      );
    }

    // Layer 3: Re-check after lock acquired (another request may have completed)
    const { data: existingAfterLock } = await adminClient
      .from("orders")
      .select("id, nyehandel_order_id, nyehandel_prefix")
      .eq("idempotency_key", idempotency_key)
      .maybeSingle();

    if (existingAfterLock) {
      return jsonResponse({
        ok: true,
        idempotent: true,
        orderId: existingAfterLock.id,
        nyehandelOrderId: existingAfterLock.nyehandel_order_id,
        prefix: existingAfterLock.nyehandel_prefix,
        requestId,
      });
    }
  }

  /* ---------- validate shipping method against live NYE data ---------- */

  const validMethods = await getValidShippingMethods(nyehandelBaseUrl, nyehandelToken, nyehandelXIdentifier);
  if (!validMethods.includes(shipping_method)) {
    console.log(JSON.stringify({ requestId, event: "invalid_shipping_method", method: shipping_method, validMethods }));
    return jsonResponse(
      {
        error: "invalid_shipping_method",
        message: `Shipping method "${shipping_method}" is not available. Valid methods: ${validMethods.join(", ")}`,
        requestId,
      },
      400,
    );
  }

  /* ---------- server-side price lookup (never trust client prices) ---------- */

  const skus = items.map((i) => i.sku);

  // 1. Look up real prices from product_variants
  const { data: variantRows, error: variantErr } = await adminClient
    .from("product_variants")
    .select("sku, price")
    .in("sku", skus);

  if (variantErr) {
    console.error(JSON.stringify({ requestId, event: "variant_price_lookup_failed", error: variantErr.message }));
    return jsonResponse({ error: "price_lookup_failed", requestId }, 500);
  }

  const variantPriceMap: Record<string, number> = {};
  for (const row of variantRows ?? []) {
    if (row.sku) variantPriceMap[row.sku] = Number(row.price);
  }

  // 2. Look up upsell prices from checkout_upsells
  const { data: upsellRows, error: upsellErr } = await adminClient
    .from("checkout_upsells")
    .select("sku, price_override")
    .in("sku", skus)
    .eq("active", true);

  if (upsellErr) {
    console.error(JSON.stringify({ requestId, event: "upsell_price_lookup_failed", error: upsellErr.message }));
    return jsonResponse({ error: "price_lookup_failed", requestId }, 500);
  }

  const upsellPriceMap: Record<string, number> = {};
  for (const row of upsellRows ?? []) {
    if (row.sku) upsellPriceMap[row.sku] = Number(row.price_override);
  }

  // 3. Resolve server-side price for each item; reject if any SKU has no price
  const pricedItems: { sku: string; quantity: number; serverPrice: number }[] = [];
  for (const item of items) {
    // Upsell items take priority (they override the regular variant price)
    const upsellPrice = upsellPriceMap[item.sku];
    const variantPrice = variantPriceMap[item.sku];

    if (upsellPrice != null) {
      pricedItems.push({ sku: item.sku, quantity: item.quantity, serverPrice: upsellPrice });
    } else if (variantPrice != null) {
      pricedItems.push({ sku: item.sku, quantity: item.quantity, serverPrice: variantPrice });
    } else {
      console.error(JSON.stringify({ requestId, event: "sku_price_not_found", sku: item.sku }));
      return jsonResponse({ error: "sku_not_found", sku: item.sku, requestId }, 400);
    }
  }

  /* ---------- validate SKUs against live NYE catalog ---------- */

  const invalidSkus = await validateSkusAgainstNye(
    skus,
    nyehandelBaseUrl,
    nyehandelToken,
    nyehandelXIdentifier,
    requestId,
  );

  if (invalidSkus.length > 0) {
    console.error(JSON.stringify({
      requestId,
      event: "nye_sku_validation_failed",
      invalidSkus,
    }));

    // Surface an ops alert so the catalog sync issue gets attention
    try {
      await adminClient.from("ops_alerts").insert({
        alert_type: "sku_mismatch",
        severity: "high",
        title: `SKU(s) missing from Nyehandel catalog: ${invalidSkus.join(", ")}`,
        details: {
          invalidSkus,
          customerEmail: customer.email,
          requestId,
          timestamp: new Date().toISOString(),
        },
        status: "open",
      });
    } catch {
      // Best-effort alert — the console.error above logs the critical info
    }

    return jsonResponse(
      {
        error: "sku_not_in_catalog",
        message: `The following SKU(s) are not available in the fulfillment catalog: ${invalidSkus.join(", ")}. Please remove them and try again.`,
        invalidSkus,
        requestId,
      },
      400,
    );
  }

  /* ---------- apply discount code (if provided) ---------- */

  let discountApplied = 0;
  let discountCode: string | null = null;

  if (rawBody.discount_code) {
    const code = String(rawBody.discount_code).trim().toUpperCase();
    const { data: discount, error: discountErr } = await adminClient
      .from("discounts")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();

    if (discountErr || !discount) {
      return jsonResponse({ error: "invalid_discount_code", code, requestId }, 400);
    }

    // Check validity window
    const now = new Date();
    if (discount.valid_from && new Date(discount.valid_from) > now) {
      return jsonResponse({ error: "discount_not_yet_active", code, requestId }, 400);
    }
    if (discount.valid_until && new Date(discount.valid_until) < now) {
      return jsonResponse({ error: "discount_expired", code, requestId }, 400);
    }

    // Check max uses
    if (discount.max_uses != null && discount.used_count >= discount.max_uses) {
      return jsonResponse({ error: "discount_exhausted", code, requestId }, 400);
    }

    // Check min order value
    const cartTotalCents = pricedItems.reduce((s, i) => s + Math.round(i.serverPrice * 100) * i.quantity, 0);
    const minOrderCents = Math.round((discount.min_order_value ?? 0) * 100);
    if (cartTotalCents < minOrderCents) {
      return jsonResponse({
        error: "discount_min_order_not_met",
        min_order: discount.min_order_value,
        cart_total: cartTotalCents / 100,
        code,
        requestId,
      }, 400);
    }

    // Calculate discount amount in cents
    const discountCents = discount.type === "percentage"
      ? percentageToAmount(cartTotalCents, Number(discount.value))
      : Math.round(Number(discount.value) * 100);

    // Distribute across line items (VAT-safe)
    const discountableItems = pricedItems.map((i) => ({
      sku: i.sku,
      quantity: i.quantity,
      priceIncVat: Math.round(i.serverPrice * 100),
      vatRate: 0, // NYE handles VAT — we pass price_inc_vat = price_ex_vat (0% local VAT)
    }));

    const distributed = distributeDiscount(discountableItems, discountCents);
    if (!distributed) {
      return jsonResponse({ error: "discount_exceeds_cart_total", code, requestId }, 400);
    }

    // Apply discounted prices back to pricedItems
    for (let idx = 0; idx < pricedItems.length; idx++) {
      pricedItems[idx].serverPrice = distributed[idx].discountedPriceIncVat / 100;
    }

    discountApplied = discountCents;
    discountCode = code;

    // Increment used_count
    await adminClient
      .from("discounts")
      .update({ used_count: (discount.used_count ?? 0) + 1 })
      .eq("id", discount.id);

    console.log(JSON.stringify({
      requestId,
      event: "discount_applied",
      code,
      type: discount.type,
      value: discount.value,
      discountCents,
    }));
  }

  /* ---------- build Nyehandel POST /orders payload ---------- */

  const deliveryCallbackUrl = `${supabaseUrl}/functions/v1/nyehandel-delivery-callback`;
  const orderRef = `NB${Date.now()}`;

  const nyehandelPayload = {
    prefix: "NB",
    currency_iso: "EUR",
    locale: "en-gb",
    reference: orderRef,
    marking: orderRef,
    delivery_callback_url: deliveryCallbackUrl,
    customer: {
      type: "person",
      email: customer.email,
    },
    billing_address: {
      firstname: customer.firstname,
      lastname: customer.lastname,
      address: billing_address.address,
      postcode: billing_address.postcode,
      city: billing_address.city,
      country: billing_address.country,
    },
    shipping_address: {
      firstname: customer.firstname,
      lastname: customer.lastname,
      address: billing_address.address,
      postcode: billing_address.postcode,
      city: billing_address.city,
      country: billing_address.country,
    },
    shipping: {
      name: shipping_method,
      price_ex_vat: 0,
      price_inc_vat: 0,
    },
    payment: {
      name: "NFC Group Payment",
      price_ex_vat: 0,
      price_inc_vat: 0,
    },
    items: pricedItems.map((i) => {
      const unitPriceOre = Math.round(i.serverPrice * 100);
      const totalOre = unitPriceOre * i.quantity;
      return {
        type: "product" as const,
        sku: i.sku,
        quantity: i.quantity,
        price_ex_vat: totalOre,
        price_inc_vat: totalOre,
      };
    }),
  };

  /* ---------- call Nyehandel ---------- */

  console.log(
    JSON.stringify({
      requestId,
      event: "nyehandel_checkout_start",
      itemCount: items.length,
      shippingMethod: shipping_method,
      hasToken: !!nyehandelToken,
      hasXIdentifier: !!nyehandelXIdentifier && nyehandelXIdentifier.length > 0,
      xIdentifierLen: nyehandelXIdentifier.length,
      baseUrl: nyehandelBaseUrl,
      payload: nyehandelPayload,
    }),
  );

  let nyehandelResponse: Response;
  try {
    nyehandelResponse = await fetch(`${nyehandelBaseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-identifier": nyehandelXIdentifier,
        Authorization: `Bearer ${nyehandelToken}`,
        "X-Language": "en",
      },
      body: JSON.stringify(nyehandelPayload),
    });
  } catch (networkError) {
    console.error(
      JSON.stringify({ requestId, event: "nyehandel_network_error", error: String(networkError) }),
    );
    return jsonResponse(
      { error: "nyehandel_network_error", requestId },
      502,
    );
  }

  if (!nyehandelResponse.ok) {
    const errText = await nyehandelResponse.text().catch(() => "");
    // Log full upstream error server-side for debugging — never expose to client
    console.error(
      JSON.stringify({
        requestId,
        event: "nyehandel_checkout_rejected",
        status: nyehandelResponse.status,
        upstreamBody: errText,
      }),
    );
    return jsonResponse(
      {
        error: "nyehandel_order_creation_failed",
        status: nyehandelResponse.status,
        requestId,
      },
      502,
    );
  }

  /* ---------- parse Nyehandel response ---------- */

  let nyehandelData: { data?: { id?: number | string; prefix?: string } };
  try {
    nyehandelData = await nyehandelResponse.json();
  } catch {
    return jsonResponse(
      { error: "nyehandel_invalid_response", requestId },
      502,
    );
  }

  const nyehandelOrderId = nyehandelData?.data?.id != null
    ? String(nyehandelData.data.id)
    : null;
  const nyehandelPrefix = nyehandelData?.data?.prefix ?? null;

  if (!nyehandelOrderId) {
    console.error(
      JSON.stringify({ requestId, event: "nyehandel_missing_order_id" }),
    );
    return jsonResponse(
      { error: "nyehandel_missing_order_id", requestId },
      502,
    );
  }

  console.log(
    JSON.stringify({
      requestId,
      event: "nyehandel_checkout_success",
      nyehandelOrderId,
      nyehandelPrefix,
    }),
  );

  /* ---------- persist order in Supabase ---------- */

  const orderInsert: Record<string, unknown> = {
    nyehandel_order_id: nyehandelOrderId,
    nyehandel_prefix: nyehandelPrefix,
    checkout_status: "pending",
    customer_email: customer.email,
    currency: display_currency ?? "EUR",
    total_price: null, // calculated server-side after Nyehandel confirms — never trust client-supplied price
    line_items_snapshot: items, // includes display fields (product_name, pack_label, unit_price)
    customer_metadata: {
      firstname: customer.firstname,
      lastname: customer.lastname,
      shipping_method,
    },
    shipping_address: {
      ...billing_address,
      firstname: customer.firstname,
      lastname: customer.lastname,
    },
    nyehandel_sync_status: "synced",
  };

  if (userId) {
    orderInsert.user_id = userId;
  }

  if (idempotency_key) {
    orderInsert.idempotency_key = idempotency_key;
  }

  const { data: insertedOrder, error: insertError } = await adminClient
    .from("orders")
    .insert(orderInsert)
    .select("id")
    .single();

  if (insertError || !insertedOrder) {
    console.error(
      JSON.stringify({
        requestId,
        event: "order_insert_failed",
        error: insertError?.message,
        nyehandelOrderId,
      }),
    );

    // Audit trail: Nyehandel order exists but local insert failed — ops can reconcile
    try {
      await adminClient.from("webhook_inbox").insert({
        provider: "nyehandel",
        topic: "orphan_order",
        status: "received",
        payload: {
          nyehandelOrderId,
          nyehandelPrefix,
          customerEmail: customer.email,
          insertError: insertError?.message ?? "unknown",
          requestId,
        },
        received_at: new Date().toISOString(),
      });
    } catch {
      // Best-effort — the console.error above already logs the critical info
    }

    return jsonResponse(
      {
        error: "order_persistence_failed",
        nyehandelOrderId,
        requestId,
      },
      500,
    );
  }

  /* ---------- fire-and-forget: send order confirmation email ---------- */

  const internalSecret = Deno.env.get("INTERNAL_FUNCTIONS_SECRET");
  const supabaseFunctionsUrl = supabaseUrl?.replace(".supabase.co", ".supabase.co/functions/v1");

  if (customer.email && internalSecret && supabaseFunctionsUrl) {
    const emailItems = items.map((i) => ({
      name: i.product_name ?? i.sku,
      qty: i.quantity,
      price: i.unit_price != null
        ? `${display_currency ?? "EUR"} ${Number(i.unit_price).toFixed(2)}`
        : "",
    }));

    const totalDisplay = display_total != null
      ? `${display_currency ?? "EUR"} ${Number(display_total).toFixed(2)}`
      : "";

    fetch(`${supabaseFunctionsUrl}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-function-secret": internalSecret,
      },
      body: JSON.stringify({
        to: customer.email,
        subject: `Order confirmed — #${nyehandelOrderId}`,
        template: "order_confirmed",
        data: {
          orderId: String(nyehandelOrderId),
          customerName: `${customer.firstname} ${customer.lastname}`.trim(),
          total: totalDisplay,
          currency: display_currency ?? "EUR",
          items: emailItems,
          shippingMethod: shipping_method,
        },
      }),
    }).catch((err) => {
      console.error(JSON.stringify({
        requestId,
        event: "checkout_confirmation_email_fire_failed",
        error: String(err),
      }));
    });
  } else {
    console.log(JSON.stringify({
      requestId,
      event: "checkout_confirmation_email_skipped",
      reason: !customer.email ? "no_email" : !internalSecret ? "no_internal_secret" : "no_functions_url",
    }));
  }

  /* ---------- success ---------- */

  return jsonResponse({
    ok: true,
    orderId: insertedOrder.id,
    nyehandelOrderId,
    prefix: nyehandelPrefix,
    requestId,
  });

  } catch (fatalError) {
    console.error("FATAL_UNHANDLED", String(fatalError), (fatalError as Error)?.stack);
    return new Response(
      JSON.stringify({ error: "fatal_unhandled", requestId }),
      { status: 500, headers: { ..._corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
