import type { APIRoute } from 'astro';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Auth service unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { email?: string; password?: string; redirect?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, password, redirect } = body;
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        // Astro API route cookies — try getAll first, fall back to parsing header
        try {
          if (typeof cookies.getAll === 'function') {
            return cookies.getAll().map((c: any) => ({ name: c.name ?? '', value: c.value }));
          }
        } catch { /* fall through */ }
        const header = request.headers.get('cookie') ?? '';
        return header.split(';').filter(Boolean).map((pair) => {
          const [name, ...rest] = pair.trim().split('=');
          return { name: name ?? '', value: rest.join('=') };
        });
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookies.set(name, value, options as any);
        }
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const dest = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/account';

  return new Response(JSON.stringify({ success: true, redirect: dest }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
