declare const Deno: {
  test: (name: string, fn: () => void | Promise<void>) => void;
};

import {
  deriveDeliverableDelayAlerts,
  deriveUnpaidDeadlineAlerts,
  type OrderCandidate,
} from "./rules.ts";

function assertEquals<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Assertion failed: expected ${String(expected)}, got ${String(actual)}`);
  }
}

Deno.test("flags deliverable-delay alert for paid order waiting >= 2 days", () => {
  const now = new Date("2026-03-12T12:00:00Z");
  const orders: OrderCandidate[] = [
    {
      id: "order-1",
      shopify_order_id: "1001",
      checkout_status: "paid",
      nyehandel_sync_status: "pending",
      paid_at: "2026-03-09T10:00:00Z",
      updated_at: "2026-03-10T10:00:00Z",
      created_at: "2026-03-09T09:00:00Z",
    },
  ];

  const alerts = deriveDeliverableDelayAlerts(orders, now);

  assertEquals(alerts.length, 1);
  assertEquals(alerts[0].ruleKey, "deliverable_delay");
  assertEquals(alerts[0].severity, "medium");
  assertEquals(alerts[0].sourceOrderId, "order-1");
});

Deno.test("flags unpaid-deadline alert when order is within 3 days of payment window", () => {
  const now = new Date("2026-03-12T12:00:00Z");
  const orders: OrderCandidate[] = [
    {
      id: "order-2",
      shopify_order_id: "1002",
      checkout_status: "pending",
      nyehandel_sync_status: "pending",
      paid_at: null,
      updated_at: "2026-03-08T09:00:00Z",
      created_at: "2026-03-08T08:00:00Z",
    },
  ];

  const alerts = deriveUnpaidDeadlineAlerts(orders, now);

  assertEquals(alerts.length, 1);
  assertEquals(alerts[0].ruleKey, "unpaid_deadline");
  assertEquals(alerts[0].severity, "low");
  assertEquals(alerts[0].sourceOrderId, "order-2");
});
