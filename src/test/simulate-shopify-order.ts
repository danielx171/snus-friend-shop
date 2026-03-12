/**
 * Step 24 UAT Simulator — Shopify → Supabase → Nyehandel
 *
 * Runs entirely in-process with an in-memory store.
 * No Deno, no live DB connection, no network calls required.
 *
 * Replicates the exact business logic from:
 *   supabase/functions/shopify-webhook/index.ts
 *   supabase/functions/push-order-to-nyehandel/index.ts
 *   supabase/functions/ops-b2b-queues/rules.ts  (imported directly)
 *
 * Scenarios:
 *   A  Happy path      — webhook → paid → Nyehandel 200 → synced
 *   B  Failure + alert — Nyehandel 500 x3 → failed → deliverable_delay alert generated
 *   C  Idempotency     — duplicate webhook returns early, no double push
 *   D  HMAC rejection  — tampered payload → invalid_hmac error
 *
 * Run: bun run simulate
 */

import { createHmac } from "node:crypto";
import {
  deriveDeliverableDelayAlerts,
  deriveUnpaidDeadlineAlerts,
} from "../../supabase/functions/ops-b2b-queues/rules.ts";
import type { OrderCandidate } from "../../supabase/functions/ops-b2b-queues/rules.ts";

// ---------------------------------------------------------------------------
// Types — mirror the real DB schema
// ---------------------------------------------------------------------------

type CheckoutStatus = "pending" | "paid" | "cancelled";
type NyehandelSyncStatus = "pending" | "synced" | "failed" | "skipped";

interface Order {
  id: string;
  shopify_order_id: string | null;
  customer_email: string | null;
  total_price: number;
  currency: string;
  checkout_status: CheckoutStatus;
  nyehandel_sync_status: NyehandelSyncStatus;
  nyehandel_order_id: string | null;
  last_sync_error: string | null;
  paid_at: string | null;
  shipping_address: Record<string, unknown>;
  line_items_snapshot: unknown[];
  created_at: string;
  updated_at: string;
}

interface WebhookRow {
  id: string;
  provider: "shopify" | "nyehandel";
  topic: string;
  status: "received" | "processed" | "failed";
  attempts: number;
  received_at: string;
  processed_at: string | null;
  payload: unknown;
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

class MemDB {
  orders: Map<string, Order> = new Map();
  webhooks: Map<string, WebhookRow> = new Map();

  upsertOrder(patch: Partial<Order> & { shopify_order_id: string }): Order {
    const existing = [...this.orders.values()].find(
      (o) => o.shopify_order_id === patch.shopify_order_id,
    );

    if (existing) {
      const updated: Order = { ...existing, ...patch, updated_at: now() };
      this.orders.set(updated.id, updated);
      return updated;
    }

    const order: Order = {
      id: uuid(),
      shopify_order_id: patch.shopify_order_id,
      customer_email: patch.customer_email ?? null,
      total_price: patch.total_price ?? 0,
      currency: patch.currency ?? "SEK",
      checkout_status: patch.checkout_status ?? "pending",
      nyehandel_sync_status: patch.nyehandel_sync_status ?? "pending",
      nyehandel_order_id: patch.nyehandel_order_id ?? null,
      last_sync_error: patch.last_sync_error ?? null,
      paid_at: patch.paid_at ?? null,
      shipping_address: patch.shipping_address ?? {},
      line_items_snapshot: patch.line_items_snapshot ?? [],
      created_at: now(),
      updated_at: now(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  updateOrder(id: string, patch: Partial<Order>): Order | null {
    const order = this.orders.get(id);
    if (!order) return null;
    const updated: Order = { ...order, ...patch, updated_at: now() };
    this.orders.set(id, updated);
    return updated;
  }

  getOrderByShopifyId(shopifyOrderId: string): Order | null {
    return (
      [...this.orders.values()].find(
        (o) => o.shopify_order_id === shopifyOrderId,
      ) ?? null
    );
  }

  insertWebhook(row: Omit<WebhookRow, "id">): WebhookRow {
    const webhook: WebhookRow = { id: uuid(), ...row };
    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  updateWebhook(id: string, patch: Partial<WebhookRow>): void {
    const row = this.webhooks.get(id);
    if (row) this.webhooks.set(id, { ...row, ...patch });
  }
}

// ---------------------------------------------------------------------------
// HMAC helpers — identical algorithm to shopify-webhook/index.ts
// ---------------------------------------------------------------------------

const WEBHOOK_SECRET = "test-secret-for-simulation";

function computeShopifyHmac(rawBody: string): string {
  return createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("base64");
}

async function verifyShopifyHmac(
  rawBody: string,
  hmacHeader: string,
  secret: string,
): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const expected = Uint8Array.from(atob(hmacHeader), (c) => c.charCodeAt(0));
  const actual = new Uint8Array(sig);
  if (actual.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < actual.length; i++) out |= actual[i] ^ expected[i];
  return out === 0;
}

// ---------------------------------------------------------------------------
// Shopify webhook handler (replicates shopify-webhook/index.ts logic)
// ---------------------------------------------------------------------------

type WebhookResult =
  | { ok: true; orderId: string; webhookId: string; idempotent?: boolean }
  | { ok: false; error: string; status: number };

async function handleShopifyWebhook(
  db: MemDB,
  topic: string,
  shopDomain: string,
  rawBody: string,
  hmacHeader: string,
  nyehandelMock: NyehandelMock,
): Promise<WebhookResult> {
  const EXPECTED_DOMAIN = "test-store.myshopify.com";

  if (shopDomain !== EXPECTED_DOMAIN) {
    return { ok: false, error: "invalid_shop_domain", status: 401 };
  }

  const valid = await verifyShopifyHmac(rawBody, hmacHeader, WEBHOOK_SECRET);
  if (!valid) {
    return { ok: false, error: "invalid_hmac", status: 401 };
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { ok: false, error: "invalid_json", status: 400 };
  }

  const webhook = db.insertWebhook({
    provider: "shopify",
    topic,
    status: "received",
    attempts: 1,
    received_at: now(),
    processed_at: null,
    payload,
  });

  const shopifyOrderId = payload.id ? String(payload.id) : null;
  const isPaid =
    topic === "orders/paid" &&
    (payload.financial_status as string)?.toLowerCase() === "paid";

  if (!isPaid || !shopifyOrderId) {
    db.updateWebhook(webhook.id, { status: "processed", processed_at: now() });
    return { ok: false, error: "not_a_paid_event", status: 422 };
  }

  // Idempotency check
  const existing = db.getOrderByShopifyId(shopifyOrderId);
  if (existing?.checkout_status === "paid") {
    db.updateWebhook(webhook.id, { status: "processed", processed_at: now() });
    return { ok: true, orderId: existing.id, webhookId: webhook.id, idempotent: true };
  }

  const order = db.upsertOrder({
    shopify_order_id: shopifyOrderId,
    customer_email: (payload.email as string) ?? null,
    total_price: Number(payload.total_price ?? 0),
    currency: ((payload.currency as string) ?? "SEK").toUpperCase(),
    checkout_status: "paid",
    nyehandel_sync_status: "pending",
    paid_at: (payload.paid_at as string) ?? now(),
    shipping_address: (payload.shipping_address as Record<string, unknown>) ?? {},
    line_items_snapshot: Array.isArray(payload.line_items) ? payload.line_items : [],
  });

  // Trigger push-order-to-nyehandel (inlined)
  const pushResult = await pushOrderToNyehandel(db, order.id, nyehandelMock);

  if (!pushResult.ok) {
    db.updateOrder(order.id, {
      nyehandel_sync_status: "failed",
      last_sync_error: pushResult.error,
    });
  }

  db.updateWebhook(webhook.id, { status: "processed", processed_at: now() });
  return { ok: true, orderId: order.id, webhookId: webhook.id };
}

// ---------------------------------------------------------------------------
// Nyehandel push handler (replicates push-order-to-nyehandel/index.ts logic)
// ---------------------------------------------------------------------------

interface NyehandelMock {
  mode: "success" | "failure";
  callCount: number;
}

type PushResult =
  | { ok: true; nyehandelOrderId: string }
  | { ok: false; error: string };

async function pushOrderToNyehandel(
  db: MemDB,
  orderId: string,
  mock: NyehandelMock,
): Promise<PushResult> {
  const order = db.orders.get(orderId);
  if (!order) return { ok: false, error: "order_not_found" };

  if (order.nyehandel_sync_status === "synced") {
    return { ok: true, nyehandelOrderId: order.nyehandel_order_id! };
  }

  if (order.checkout_status !== "paid") {
    return { ok: false, error: "order_not_paid" };
  }

  const MAX_ATTEMPTS = 3;
  let lastError = "";
  let nyehandelOrderId: string | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    mock.callCount++;

    if (mock.mode === "success") {
      nyehandelOrderId = `NYE-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      break;
    } else {
      lastError = `attempt_${attempt}_500:simulated_nyehandel_error`;
    }
  }

  if (!nyehandelOrderId) {
    db.updateOrder(orderId, {
      nyehandel_sync_status: "failed",
      last_sync_error: lastError,
    });
    return { ok: false, error: lastError };
  }

  db.updateOrder(orderId, {
    nyehandel_sync_status: "synced",
    nyehandel_order_id: nyehandelOrderId,
    last_sync_error: null,
  });

  return { ok: true, nyehandelOrderId };
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

let passed = 0;
let failed = 0;

function section(label: string) {
  console.log(`\n${BOLD}${CYAN}━━  ${label}  ━━${RESET}`);
}

function step(label: string) {
  console.log(`  ${DIM}▶${RESET} ${label}`);
}

function assert(label: string, condition: boolean, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  ${GREEN}✓${RESET} ${label}`);
  } else {
    failed++;
    console.log(`  ${RED}✗${RESET} ${BOLD}${label}${RESET}${detail ? `  ${RED}(${detail})${RESET}` : ""}`);
  }
}

function buildShopifyPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 98765432100 + Math.floor(Math.random() * 9999),
    order_number: 1001,
    email: "test@snusfriend.se",
    total_price: "249.00",
    currency: "SEK",
    financial_status: "paid",
    paid_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    shipping_address: {
      first_name: "Test",
      last_name: "Svensson",
      address1: "Testgatan 1",
      city: "Stockholm",
      zip: "11120",
      country: "SE",
    },
    line_items: [
      { variant_id: 44001234567890, sku: "GOTE-SLIM-W", quantity: 2, price: "99.00", title: "Göteborgs Rapé Slim White" },
      { variant_id: 44009876543210, sku: "ODEN-COLD-X", quantity: 1, price: "51.00", title: "Oden's Cold Extreme" },
    ],
    ...overrides,
  };
}

function uuid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// SCENARIO A — Happy path
// ---------------------------------------------------------------------------

async function scenarioA() {
  section("SCENARIO A — Happy Path: orders/paid → Nyehandel 200 → synced");

  const db = new MemDB();
  const mock: NyehandelMock = { mode: "success", callCount: 0 };

  // Step 1: Simulate create-shopify-checkout (pending order)
  step("create-shopify-checkout: insert pending order");
  const shopifyId = "shop_" + uuid().slice(0, 8);
  const pendingOrder = db.upsertOrder({
    shopify_order_id: shopifyId,
    customer_email: "test@snusfriend.se",
    checkout_status: "pending",
    nyehandel_sync_status: "pending",
    total_price: 249,
    currency: "SEK",
  });
  assert("Pending order created in DB", pendingOrder.checkout_status === "pending");

  // Step 2: Build webhook payload and compute HMAC
  step("shopify-webhook: compute HMAC signature");
  const payload = buildShopifyPayload({ id: shopifyId });
  const rawBody = JSON.stringify(payload);
  const validHmac = computeShopifyHmac(rawBody);
  assert("HMAC computed (non-empty base64)", validHmac.length > 20);

  // Step 3: Process orders/paid webhook
  step("shopify-webhook: process orders/paid event");
  const result = await handleShopifyWebhook(
    db,
    "orders/paid",
    "test-store.myshopify.com",
    rawBody,
    validHmac,
    mock,
  );
  assert("Webhook accepted (ok: true)", result.ok);
  assert("Not marked idempotent (first time)", result.ok && !result.idempotent);

  // Step 4: Verify order state
  step("Verifying order DB state");
  const order = db.orders.get(result.ok ? result.orderId : "");
  assert("Order exists in DB", !!order);
  assert("checkout_status = paid", order?.checkout_status === "paid");
  assert(
    "nyehandel_sync_status = synced",
    order?.nyehandel_sync_status === "synced",
    order?.nyehandel_sync_status,
  );
  assert("nyehandel_order_id is set", !!order?.nyehandel_order_id);
  assert("last_sync_error is null", order?.last_sync_error === null);

  // Step 5: Verify webhook_inbox was written
  step("Verifying webhook_inbox DB state");
  const webhooks = [...db.webhooks.values()];
  assert("webhook_inbox row created", webhooks.length === 1);
  assert("webhook status = processed", webhooks[0]?.status === "processed");

  // Step 6: Verify Nyehandel was called exactly once
  step("Verifying Nyehandel call count");
  assert("Nyehandel called exactly once", mock.callCount === 1, `callCount=${mock.callCount}`);
}

// ---------------------------------------------------------------------------
// SCENARIO B — Nyehandel failure + ops_alerts generation
// ---------------------------------------------------------------------------

async function scenarioB() {
  section("SCENARIO B — Nyehandel Failure: 500 x3 → failed → deliverable_delay alert");

  const db = new MemDB();
  const mock: NyehandelMock = { mode: "failure", callCount: 0 };

  const shopifyId = "shop_" + uuid().slice(0, 8);
  const payload = buildShopifyPayload({ id: shopifyId });
  const rawBody = JSON.stringify(payload);
  const hmac = computeShopifyHmac(rawBody);

  step("shopify-webhook: process orders/paid (Nyehandel will fail)");
  const result = await handleShopifyWebhook(
    db,
    "orders/paid",
    "test-store.myshopify.com",
    rawBody,
    hmac,
    mock,
  );
  assert("Webhook accepted (webhook handler is ok)", result.ok);

  step("Verifying order DB state after push failure");
  const order = db.orders.get(result.ok ? result.orderId : "");
  assert("checkout_status = paid", order?.checkout_status === "paid");
  assert(
    "nyehandel_sync_status = failed",
    order?.nyehandel_sync_status === "failed",
    order?.nyehandel_sync_status,
  );
  assert("last_sync_error is set", typeof order?.last_sync_error === "string" && order.last_sync_error.length > 0);

  step("Nyehandel was retried 3 times before giving up");
  assert("Nyehandel called 3 times (max attempts)", mock.callCount === 3, `callCount=${mock.callCount}`);

  // Simulate ops-b2b-queues running nightly on a 3-day-old failed order
  step("ops-b2b-queues: run deliverable_delay rule on backdated order");
  const candidate: OrderCandidate = {
    id: order!.id,
    shopify_order_id: order!.shopify_order_id,
    checkout_status: order!.checkout_status,
    nyehandel_sync_status: order!.nyehandel_sync_status,
    paid_at: daysAgo(3),
    updated_at: daysAgo(3),
    created_at: daysAgo(4),
  };

  const alerts = deriveDeliverableDelayAlerts([candidate], new Date());
  assert("ops_alerts: at least 1 alert generated", alerts.length >= 1, `count=${alerts.length}`);
  assert(
    "ops_alerts: ruleKey = deliverable_delay",
    alerts[0]?.ruleKey === "deliverable_delay",
    alerts[0]?.ruleKey,
  );
  assert(
    "ops_alerts: severity = medium (3 days, threshold 7 for high)",
    alerts[0]?.severity === "medium",
    alerts[0]?.severity,
  );
  assert(
    "ops_alerts: sourceOrderId matches order",
    alerts[0]?.sourceOrderId === order!.id,
  );

  // Verify no false-positive for unpaid rule on this paid order
  const unpaidAlerts = deriveUnpaidDeadlineAlerts([candidate], new Date());
  assert("ops_alerts: no unpaid_deadline alert for paid order", unpaidAlerts.length === 0);
}

// ---------------------------------------------------------------------------
// SCENARIO C — Idempotency
// ---------------------------------------------------------------------------

async function scenarioC() {
  section("SCENARIO C — Idempotency: duplicate webhook returns early");

  const db = new MemDB();
  const mock: NyehandelMock = { mode: "success", callCount: 0 };

  const shopifyId = "shop_" + uuid().slice(0, 8);
  const payload = buildShopifyPayload({ id: shopifyId });
  const rawBody = JSON.stringify(payload);
  const hmac = computeShopifyHmac(rawBody);

  step("First webhook call (normal processing)");
  const first = await handleShopifyWebhook(
    db, "orders/paid", "test-store.myshopify.com", rawBody, hmac, mock,
  );
  assert("First call ok", first.ok);
  assert("First call not idempotent", first.ok && !first.idempotent);
  const callsAfterFirst = mock.callCount;

  step("Second webhook call (identical payload)");
  const second = await handleShopifyWebhook(
    db, "orders/paid", "test-store.myshopify.com", rawBody, hmac, mock,
  );
  assert("Second call ok", second.ok);
  assert("Second call flagged as idempotent", second.ok && second.idempotent === true);
  assert(
    "Nyehandel NOT called again on duplicate",
    mock.callCount === callsAfterFirst,
    `callCount went from ${callsAfterFirst} to ${mock.callCount}`,
  );

  step("Verifying single order row (no duplicates)");
  const orderCount = [...db.orders.values()].filter(
    (o) => o.shopify_order_id === shopifyId,
  ).length;
  assert("Exactly 1 order row in DB", orderCount === 1, `found ${orderCount}`);
}

// ---------------------------------------------------------------------------
// SCENARIO D — HMAC rejection
// ---------------------------------------------------------------------------

async function scenarioD() {
  section("SCENARIO D — Security: tampered payload rejected via HMAC");

  const db = new MemDB();
  const mock: NyehandelMock = { mode: "success", callCount: 0 };

  const shopifyId = "shop_" + uuid().slice(0, 8);
  const legitimatePayload = buildShopifyPayload({ id: shopifyId });
  const rawBody = JSON.stringify(legitimatePayload);
  const validHmac = computeShopifyHmac(rawBody);

  step("Send webhook with tampered body (HMAC stays valid for original)");
  const tamperedBody = JSON.stringify({ ...legitimatePayload, total_price: "0.01", email: "attacker@evil.com" });
  const resultTampered = await handleShopifyWebhook(
    db, "orders/paid", "test-store.myshopify.com", tamperedBody, validHmac, mock,
  );
  assert("Tampered body rejected", !resultTampered.ok);
  assert(
    "Error = invalid_hmac",
    !resultTampered.ok && resultTampered.error === "invalid_hmac",
    !resultTampered.ok ? resultTampered.error : "ok",
  );
  assert("No order created from tampered webhook", db.orders.size === 0);
  assert("Nyehandel never called", mock.callCount === 0);

  step("Send webhook with wrong shop domain");
  const resultWrongDomain = await handleShopifyWebhook(
    db, "orders/paid", "attacker.myshopify.com", rawBody, validHmac, mock,
  );
  assert("Wrong domain rejected", !resultWrongDomain.ok);
  assert(
    "Error = invalid_shop_domain",
    !resultWrongDomain.ok && resultWrongDomain.error === "invalid_shop_domain",
    !resultWrongDomain.ok ? resultWrongDomain.error : "ok",
  );
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\n${BOLD}╔══════════════════════════════════════════════╗`);
  console.log(`║  STEP 24 UAT SIMULATOR — Order Flow         ║`);
  console.log(`║  Shopify → Supabase → Nyehandel             ║`);
  console.log(`╚══════════════════════════════════════════════╝${RESET}`);
  console.log(`${DIM}  Environment: Bun ${Bun.version} | In-memory store | No network${RESET}`);

  await scenarioA();
  await scenarioB();
  await scenarioC();
  await scenarioD();

  const total = passed + failed;
  const allPassed = failed === 0;

  console.log(`\n${BOLD}━━  Results  ━━${RESET}`);
  console.log(`  Total: ${total}  ${GREEN}${BOLD}Passed: ${passed}${RESET}  ${failed > 0 ? RED : DIM}Failed: ${failed}${RESET}`);

  if (allPassed) {
    console.log(`\n  ${GREEN}${BOLD}ENGINE STABLE & READY — all UAT scenarios passed.${RESET}\n`);
  } else {
    console.log(`\n  ${RED}${BOLD}UAT FAILED — ${failed} assertion(s) did not pass.${RESET}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\n${RED}${BOLD}SIMULATOR CRASHED:${RESET}`, err);
  process.exit(1);
});
