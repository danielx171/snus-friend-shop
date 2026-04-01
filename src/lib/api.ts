import { supabase } from '@/integrations/supabase/client';

const FUNCTIONS_BASE = import.meta.env.VITE_SUPABASE_URL
  ? new URL('functions/v1', import.meta.env.VITE_SUPABASE_URL).href
  : '';

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
/**
 * Extract Supabase access token from cookies (fallback when localStorage has no session).
 * Server-side login sets cookies but not localStorage, so we need both channels.
 */
function getTokenFromCookies(): string | null {
  if (typeof document === 'undefined') return null;
  // Supabase stores session as sb-{ref}-auth-token in cookies
  const cookies = document.cookie.split(';');
  for (const c of cookies) {
    const trimmed = c.trim();
    if (trimmed.match(/^sb-.*-auth-token=/)) {
      const value = trimmed.split('=').slice(1).join('=');
      // The cookie might be a JSON object with access_token, or just the token
      try {
        const parsed = JSON.parse(decodeURIComponent(value));
        if (parsed?.access_token) return parsed.access_token;
        // Supabase chunked cookies: sb-{ref}-auth-token.0, .1, etc.
      } catch {
        // Not JSON — might be a raw token or chunked
      }
      return value || null;
    }
  }
  return null;
}

export async function apiFetch<T = unknown>(
  fnName: string,
  opts?: ApiOptions,
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  let accessToken = data.session?.access_token;

  // Fallback: try to get token from cookies if localStorage session is empty
  if (!accessToken) {
    accessToken = getTokenFromCookies() ?? undefined;
  }

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

