export type WebhookProvider = 'shopify' | 'nyehandel';
export type WebhookStatus = 'received' | 'processed' | 'failed';

export interface WebhookEvent {
  eventId: string;
  provider: WebhookProvider;
  topic: string;
  status: WebhookStatus;
  attempts: number;
  receivedAt: string; // ISO date
  payload: Record<string, unknown>;
}

export type SyncType = 'catalog' | 'inventory';
export type SyncRunStatus = 'success' | 'partial' | 'failed' | 'running';

export interface SyncRun {
  id: string;
  type: SyncType;
  status: SyncRunStatus;
  startedAt: string;
  durationMs: number;
  itemsProcessed: number;
  errors: number;
}

export type AlertRuleKey = 'unpaid_deadline' | 'deliverable_delay';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'open' | 'resolved';

export interface OpsAlert {
  id: string;
  alertDate: string;
  ruleKey: AlertRuleKey;
  severity: AlertSeverity;
  status: AlertStatus;
  sourceOrderId: string;
  sourceShopifyOrderId: string | null;
  title: string;
  message: string;
  context: Record<string, unknown>;
  createdAt: string;
  resolvedAt: string | null;
}

export type SkuMappingStatus = 'mapped' | 'missing' | 'conflict';

export interface SkuMapping {
  id: string;
  nyehandelSku: string;
  shopifySku: string | null;
  productName: string;
  status: SkuMappingStatus;
  lastVerified: string;
}
