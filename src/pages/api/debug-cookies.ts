import type { APIRoute } from 'astro';
import { createServerClient } from '@supabase/ssr';

export const prerender = false;

export const GET: APIRoute = async ({ request, cookies }) => {
  const rawCookieHeader = request.headers.get('cookie') ?? '';

  // Test Astro's native cookies.getAll()
  let astroCookies: any[] = [];
  let astroGetAllError = null;
  try {
    // @ts-ignore - testing if it exists
    astroCookies = (cookies as any).getAll().map((c: any) => ({
      name: c.name,
      valueLength: (c.value ?? '').length,
      valueStart: (c.value ?? '').substring(0, 30),
    }));
  } catch (e: any) {
    astroGetAllError = e.message;
  }

  // Compare: raw header parse
  const rawParsed = rawCookieHeader.split(';').filter(Boolean).map(pair => {
    const eqIdx = pair.indexOf('=');
    const name = pair.slice(0, eqIdx).trim();
    const value = pair.slice(eqIdx + 1).trim();
    return { name, valueLength: value.length, valueStart: value.substring(0, 30) };
  });

  // Test Supabase auth using Astro cookies
  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';

  let userFromAstro = null;
  let errorFromAstro = null;
  let userFromRaw = null;
  let errorFromRaw = null;

  try {
    const sb1 = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          try {
            return (cookies as any).getAll().map((c: any) => ({ name: c.name, value: c.value ?? '' }));
          } catch { return []; }
        },
        setAll() {},
      },
    });
    const { data, error } = await sb1.auth.getUser();
    userFromAstro = data.user?.email ?? null;
    errorFromAstro = error?.message ?? null;
  } catch (e: any) { errorFromAstro = e.message; }

  try {
    const sb2 = createServerClient(supabaseUrl, supabaseKey, {
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
    const { data, error } = await sb2.auth.getUser();
    userFromRaw = data.user?.email ?? null;
    errorFromRaw = error?.message ?? null;
  } catch (e: any) { errorFromRaw = e.message; }

  return new Response(JSON.stringify({
    astroGetAllError,
    astroCookieCount: astroCookies.length,
    astroCookies,
    rawCookieCount: rawParsed.length,
    rawParsed,
    auth: {
      fromAstroCookies: { user: userFromAstro, error: errorFromAstro },
      fromRawHeader: { user: userFromRaw, error: errorFromRaw },
    },
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
