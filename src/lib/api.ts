import { supabase } from '@/integrations/supabase/client';

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface ApiOptions {
  params?: Record<string, string>;
  method?: string;
  body?: unknown;
}

/**
 * Call a backend function with auth header attached.
 * Returns parsed JSON or throws.
 */
export async function apiFetch<T = unknown>(
  fnName: string,
  opts?: ApiOptions,
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const url = new URL(`${FUNCTIONS_BASE}/${fnName}`);
  if (opts?.params) {
    Object.entries(opts.params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOpts: RequestInit = { headers, method: opts?.method ?? 'GET' };
  if (opts?.body) {
    fetchOpts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url.toString(), fetchOpts);

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
