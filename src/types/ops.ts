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
