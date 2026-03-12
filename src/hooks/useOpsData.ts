import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockSyncRuns, mockWebhookEvents, mockSkuMappings } from '@/data/opsMock';
import type { SyncRun, WebhookEvent, SkuMapping } from '@/types/ops';

export function useSyncRuns() {
  return useQuery({
    queryKey: ['ops-sync-runs'],
    queryFn: async (): Promise<SyncRun[]> => {
      const { data, error } = await supabase
        .from('sync_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        return mockSyncRuns;
      }

      return data.map((r: any) => ({
        id: r.id,
        type: r.type as SyncRun['type'],
        status: r.status as SyncRun['status'],
        startedAt: r.started_at,
        durationMs: r.duration_ms,
        itemsProcessed: r.items_processed,
        errors: r.errors,
      }));
    },
    refetchInterval: 15000,
  });
}

export function useWebhookEvents() {
  return useQuery({
    queryKey: ['ops-webhook-events'],
    queryFn: async (): Promise<WebhookEvent[]> => {
      const { data, error } = await supabase
        .from('webhook_inbox')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        return mockWebhookEvents;
      }

      return data.map((e: any) => ({
        eventId: e.id,
        provider: e.provider as WebhookEvent['provider'],
        topic: e.topic,
        status: e.status as WebhookEvent['status'],
        attempts: e.attempts,
        receivedAt: e.received_at,
        payload: e.payload as Record<string, unknown>,
      }));
    },
    refetchInterval: 10000,
  });
}

export function useSkuMappings() {
  return useQuery({
    queryKey: ['ops-sku-mappings'],
    queryFn: async (): Promise<SkuMapping[]> => {
      const { data, error } = await supabase
        .from('sku_mappings')
        .select('*')
        .order('product_name');

      if (error || !data || data.length === 0) {
        return mockSkuMappings;
      }

      return data.map((m: any) => ({
        id: m.id,
        nyehandelSku: m.nyehandel_sku,
        shopifySku: m.shopify_sku,
        productName: m.product_name,
        status: m.status as SkuMapping['status'],
        lastVerified: m.last_verified,
      }));
    },
    refetchInterval: 30000,
  });
}
