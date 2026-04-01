import type { APIRoute } from 'astro';
import { createServerClient } from '@supabase/ssr';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const rawCookieHeader = request.headers.get('cookie') ?? '';

  const allCookies = cookies.getAll().map(c => ({
    name: c.name,
    valueLength: c.value.length,
    valueStart: c.value.substring(0, 30),
  }));

  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

  let user = null;
  let authError = null;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookies.getAll().map(c => ({ name: c.name, value: c.value }));
        },
        setAll() {},
      },
    });
    const { data, error } = await supabase.auth.getUser();
    user = data.user ? { id: data.user.id, email: data.user.email } : null;
    authError = error?.message ?? null;
  }

  return new Response(JSON.stringify({
    cookieHeaderLength: rawCookieHeader.length,
    cookieHeaderStart: rawCookieHeader.substring(0, 100),
    parsedCookies: allCookies,
    authUser: user,
    authError,
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
