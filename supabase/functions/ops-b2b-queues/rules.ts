export const PAYMENT_WINDOW_DAYS = 7;
export const PAYMENT_ALERT_THRESHOLD_DAYS = 3;
export const SHIPPING_DELAY_DAYS = 2;

export type OrderCandidate = {
  id: string;
  checkout_status: string;
  nyehandel_sync_status: string;
  paid_at: string | null;
  updated_at: string;
  created_at: string;
};

export type AlertRuleKey = "unpaid_deadline" | "deliverable_delay";
export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type GeneratedAlert = {
  ruleKey: AlertRuleKey;
  severity: AlertSeverity;
  sourceOrderId: string;
  title: string;
  message: string;
  context: Record<string, unknown>;
};

function toUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function daysBetweenUtc(from: Date, to: Date): number {
  const msInDay = 24 * 60 * 60 * 1000;
  return Math.floor((toUtcDay(to) - toUtcDay(from)) / msInDay);
}

function parseIso(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function deriveUnpaidDeadlineAlerts(
  orders: OrderCandidate[],
  now: Date,
): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];

  for (const order of orders) {
    if (order.checkout_status !== "pending") continue;

    const baseDate = parseIso(order.updated_at) ?? parseIso(order.created_at);
    if (!baseDate) continue;

    const daysElapsed = daysBetweenUtc(baseDate, now);
    const daysRemaining = PAYMENT_WINDOW_DAYS - daysElapsed;

    if (daysRemaining <= 0 || daysRemaining > PAYMENT_ALERT_THRESHOLD_DAYS) continue;

    let severity: AlertSeverity = "low";
    if (daysRemaining === 1) severity = "high";
    else if (daysRemaining === 2) severity = "medium";

    alerts.push({
      ruleKey: "unpaid_deadline",
      severity,
      sourceOrderId: order.id,
      title: "Unpaid deadline approaching",
      message: `Order has ${daysRemaining} day(s) left in the ${PAYMENT_WINDOW_DAYS}-day payment window.`,
      context: {
        daysElapsed,
        daysRemaining,
        paymentWindowDays: PAYMENT_WINDOW_DAYS,
        sourceTimestamp: baseDate.toISOString(),
      },
    });
  }

  return alerts;
}

export function deriveDeliverableDelayAlerts(
  orders: OrderCandidate[],
  now: Date,
): GeneratedAlert[] {
  const alerts: GeneratedAlert[] = [];

  for (const order of orders) {
    const eligible =
      order.checkout_status === "confirmed" &&
      (order.nyehandel_sync_status === "pending" || order.nyehandel_sync_status === "failed");

    if (!eligible) continue;

    const baseDate = parseIso(order.paid_at) ?? parseIso(order.updated_at) ?? parseIso(order.created_at);
    if (!baseDate) continue;

    const daysWaiting = daysBetweenUtc(baseDate, now);
    if (daysWaiting < SHIPPING_DELAY_DAYS) continue;

    const severity: AlertSeverity = daysWaiting >= 7 ? "high" : "medium";

    alerts.push({
      ruleKey: "deliverable_delay",
      severity,
      sourceOrderId: order.id,
      title: "Deliverable delay detected",
      message: `Paid order has waited ${daysWaiting} day(s) without successful Nyehandel sync.`,
      context: {
        daysWaiting,
        delayThresholdDays: SHIPPING_DELAY_DAYS,
        sourceTimestamp: baseDate.toISOString(),
        nyehandelSyncStatus: order.nyehandel_sync_status,
      },
    });
  }

  return alerts;
}
