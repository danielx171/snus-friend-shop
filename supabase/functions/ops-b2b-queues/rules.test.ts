import { describe, expect, it } from "vitest";
import {
  deriveUnpaidDeadlineAlerts,
  deriveDeliverableDelayAlerts,
  PAYMENT_WINDOW_DAYS,
  SHIPPING_DELAY_DAYS,
  type OrderCandidate,
} from "./rules";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function daysAgo(n: number, from: Date = new Date("2026-03-18T12:00:00Z")): string {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

const NOW = new Date("2026-03-18T12:00:00Z");

function makeOrder(overrides: Partial<OrderCandidate> = {}): OrderCandidate {
  return {
    id: "order-1",
    checkout_status: "pending",
    nyehandel_sync_status: "synced",
    paid_at: null,
    updated_at: daysAgo(0),
    created_at: daysAgo(0),
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/*  deriveUnpaidDeadlineAlerts                                         */
/* ------------------------------------------------------------------ */

describe("deriveUnpaidDeadlineAlerts", () => {
  it("returns no alerts for a fresh pending order", () => {
    const order = makeOrder({ updated_at: daysAgo(0) });
    const alerts = deriveUnpaidDeadlineAlerts([order], NOW);
    expect(alerts).toHaveLength(0);
  });

  it("returns an alert when payment window is within threshold", () => {
    // 5 days elapsed → 2 days remaining (within 3-day threshold)
    const order = makeOrder({ updated_at: daysAgo(5) });
    const alerts = deriveUnpaidDeadlineAlerts([order], NOW);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].ruleKey).toBe("unpaid_deadline");
    expect(alerts[0].severity).toBe("medium");
    expect(alerts[0].sourceOrderId).toBe("order-1");
  });

  it("returns high severity with 1 day remaining", () => {
    // 6 days elapsed → 1 day remaining
    const order = makeOrder({ updated_at: daysAgo(6) });
    const alerts = deriveUnpaidDeadlineAlerts([order], NOW);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe("high");
  });

  it("returns no alert when deadline has passed (0 days remaining)", () => {
    const order = makeOrder({ updated_at: daysAgo(PAYMENT_WINDOW_DAYS) });
    const alerts = deriveUnpaidDeadlineAlerts([order], NOW);
    expect(alerts).toHaveLength(0);
  });

  it("ignores non-pending orders", () => {
    const order = makeOrder({
      checkout_status: "confirmed",
      updated_at: daysAgo(5),
    });
    const alerts = deriveUnpaidDeadlineAlerts([order], NOW);
    expect(alerts).toHaveLength(0);
  });

  it("does not include sourceShopifyOrderId in alert shape", () => {
    const order = makeOrder({ updated_at: daysAgo(5) });
    const alerts = deriveUnpaidDeadlineAlerts([order], NOW);
    expect(alerts).toHaveLength(1);
    expect("sourceShopifyOrderId" in alerts[0]).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/*  deriveDeliverableDelayAlerts                                       */
/* ------------------------------------------------------------------ */

describe("deriveDeliverableDelayAlerts", () => {
  it("returns no alerts for a confirmed+synced order", () => {
    const order = makeOrder({
      checkout_status: "confirmed",
      nyehandel_sync_status: "synced",
      paid_at: daysAgo(5),
    });
    const alerts = deriveDeliverableDelayAlerts([order], NOW);
    expect(alerts).toHaveLength(0);
  });

  it("returns an alert for a confirmed+failed order past delay threshold", () => {
    const order = makeOrder({
      checkout_status: "confirmed",
      nyehandel_sync_status: "failed",
      paid_at: daysAgo(SHIPPING_DELAY_DAYS + 1),
    });
    const alerts = deriveDeliverableDelayAlerts([order], NOW);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].ruleKey).toBe("deliverable_delay");
    expect(alerts[0].severity).toBe("medium");
  });

  it("returns high severity after 7+ days waiting", () => {
    const order = makeOrder({
      checkout_status: "confirmed",
      nyehandel_sync_status: "pending",
      paid_at: daysAgo(8),
    });
    const alerts = deriveDeliverableDelayAlerts([order], NOW);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe("high");
  });

  it("ignores pending orders (not yet confirmed)", () => {
    const order = makeOrder({
      checkout_status: "pending",
      nyehandel_sync_status: "failed",
      paid_at: daysAgo(5),
    });
    const alerts = deriveDeliverableDelayAlerts([order], NOW);
    expect(alerts).toHaveLength(0);
  });

  it("ignores the old 'paid' status — no longer valid", () => {
    const order = makeOrder({
      checkout_status: "paid" as string,
      nyehandel_sync_status: "failed",
      paid_at: daysAgo(5),
    });
    const alerts = deriveDeliverableDelayAlerts([order], NOW);
    expect(alerts).toHaveLength(0);
  });

  it("does not include sourceShopifyOrderId in alert shape", () => {
    const order = makeOrder({
      checkout_status: "confirmed",
      nyehandel_sync_status: "failed",
      paid_at: daysAgo(5),
    });
    const alerts = deriveDeliverableDelayAlerts([order], NOW);
    expect(alerts).toHaveLength(1);
    expect("sourceShopifyOrderId" in alerts[0]).toBe(false);
  });
});
