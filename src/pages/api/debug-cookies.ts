import type { APIRoute } from 'astro';
import { createServerClient } from '@supabase/ssr';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const rawCookieHeader = request.headers.get('cookie') ?? '';

  // Parse raw cookie header manually
  const parsedCookies = rawCookieHeader.split(';').filter(Boolean).map(pair => {
    const eqIdx = pair.indexOf('=');
    const name = pair.slice(0, eqIdx).trim();
    const value = pair.slice(eqIdx + 1).trim();
    return { name, valueLength: value.length, valueStart: value.substring(0, 40) };
  });

  // Try Supabase auth
  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

  let user = null;
  let authError = null;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return rawCookieHeader.split(';').filter(Boolean).map(pair => {
            const eqIdx = pair.indexOf('=');
            return { name: pair.slice(0, eqIdx).trim(), value: pair.slice(eqIdx + 1).trim() };
          });
        },
        setAll() {},
      },
    });
    const { data, error } = await supabase.auth.getUser();
    user = data.user ? { id: data.user.id, email: data.user.email } : null;
    authError = error?.message ?? null;
  } catch (e: any) {
    authError = e.message;
  }

  return new Response(JSON.stringify({
    cookieHeaderLength: rawCookieHeader.length,
    parsedCookies,
    authUser: user,
    authError,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
