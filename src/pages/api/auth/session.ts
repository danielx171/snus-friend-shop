import type { APIRoute } from 'astro';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const prerender = false;

function serializeCookie(name: string, value: string, options?: CookieOptions): string {
  let cookie = `${name}=${value}`;
  cookie += `; Path=${options?.path ?? '/'}`;
  if (options?.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options?.domain) cookie += `; Domain=${options.domain}`;
  if (options?.httpOnly !== false) cookie += '; HttpOnly';
  cookie += '; Secure';
  cookie += `; SameSite=${options?.sameSite ?? 'Lax'}`;
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

  let body: { accessToken?: string; refreshToken?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const accessToken = typeof body.accessToken === 'string' ? body.accessToken : '';
  const refreshToken = typeof body.refreshToken === 'string' ? body.refreshToken : '';

  if (!accessToken || !refreshToken) {
    return new Response(JSON.stringify({ error: 'Auth tokens are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

  const { error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  for (const cookie of cookieHeaders) {
    responseHeaders.append('Set-Cookie', cookie);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: responseHeaders,
  });
};
