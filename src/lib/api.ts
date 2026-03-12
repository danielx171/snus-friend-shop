import { supabase } from '@/integrations/supabase/client';
import type { WebhookEvent } from '@/types/ops';

const FUNCTIONS_BASE = new URL('functions/v1', import.meta.env.VITE_SUPABASE_URL).href;

interface ApiOptions {
  params?: Record<string, string>;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Call a backend function with auth header attached.
 * Returns parsed JSON or throws.
 */
export async function apiFetch<T = unknown>(
  fnName: string,
  opts?: ApiOptions,
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  const url = new URL(`${FUNCTIONS_BASE}/${fnName}`);
  if (opts?.params) {
    Object.entries(opts.params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers: Record<string, string> = {
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(opts?.headers ?? {}),
  };

  const res = await fetch(url.toString(), {
    method: opts?.method ?? 'GET',
    headers,
    body: opts?.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`apiFetch ${fnName}: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Convenience: call nyehandel-proxy with a resource name.
 * Returns null if the proxy is not configured (503) so caller can fall back.
 */
export async function fetchNyehandel<T = unknown>(resource: string): Promise<T | null> {
  try {
    const result = await apiFetch<{ data: T; error?: string }>('nyehandel-proxy', {
      params: { resource },
    });
    if (result.error) return null;
    return result.data;
  } catch {
    return null;
  }
}

export async function opsWebhookInbox(limit = 50): Promise<{ events: WebhookEvent[] }> {
  const res = await apiFetch<{ events: OpsWebhookInboxRow[] }>('ops-webhook-inbox', {
    params: { limit: String(limit) },
  });

  const events: WebhookEvent[] = (res.events ?? []).map((r) => ({
    eventId: r.id,
    provider: r.provider,
    topic: r.topic,
    status: r.status,
    attempts: r.attempts ?? 0,
    receivedAt: r.received_at ?? new Date().toISOString(),
    payload: (r.payload as Record<string, unknown>) ?? {},
  }));

  return { events };
}

type OpsWebhookInboxRow = {
  id: string;
  provider: 'shopify' | 'nyehandel';
  topic: string;
  status: 'received' | 'processed' | 'failed';
  attempts: number | null;
  received_at: string | null;
  payload: unknown;
};
