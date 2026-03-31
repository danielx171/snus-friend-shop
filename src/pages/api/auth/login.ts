import type { APIRoute } from 'astro';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const prerender = false;

function serializeCookie(name: string, value: string, options?: CookieOptions): string {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options?.path) cookie += `; Path=${options.path}`;
  if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options?.domain) cookie += `; Domain=${options.domain}`;
  if (options?.httpOnly) cookie += '; HttpOnly';
  if (options?.secure) cookie += '; Secure';
  if (options?.sameSite) cookie += `; SameSite=${options.sameSite}`;
  return cookie;
}

export const POST: APIRoute = async ({ request }) => {
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

  // Collect Set-Cookie headers manually — Astro API routes don't attach
  // cookies.set() to manually constructed Response objects
  const cookieHeaders: string[] = [];

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        const header = request.headers.get('cookie') ?? '';
        return header.split(';').filter(Boolean).map((pair) => {
          const [name, ...rest] = pair.trim().split('=');
          return { name: name ?? '', value: decodeURIComponent(rest.join('=')) };
        });
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          cookieHeaders.push(serializeCookie(name, value, options));
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

  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  for (const cookie of cookieHeaders) {
    responseHeaders.append('Set-Cookie', cookie);
  }

  return new Response(JSON.stringify({ success: true, redirect: dest }), {
    status: 200,
    headers: responseHeaders,
  });
};
