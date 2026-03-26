import { defineMiddleware } from 'astro:middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    context.locals.user = null;
    context.locals.supabase = null;
    return next();
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return context.cookies.getAll().map(c => ({ name: c.name ?? '', value: c.value }));
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        for (const { name, value, options } of cookiesToSet) {
          context.cookies.set(name, value, options as any);
        }
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  context.locals.user = user;
  context.locals.supabase = supabase as any;

  const pathname = context.url.pathname;
  const protectedPaths = ['/account', '/checkout', '/order-confirmation', '/rewards', '/wishlist'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isOps = pathname.startsWith('/ops') && pathname !== '/ops/login';

  if (isProtected && !user) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
  }

  if (isOps && !user) {
    return context.redirect('/ops/login');
  }

  if (isOps && user) {
    const isAdmin = user.app_metadata?.role === 'admin' || user.app_metadata?.role === 'ops';
    if (!isAdmin) return context.redirect('/');
  }

  return next();
});
