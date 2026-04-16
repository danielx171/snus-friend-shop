import type { APIRoute } from 'astro';
import { renderOgSvg } from '@/lib/og-svg';
import { tenant } from '@/config/tenant';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    renderOgSvg({
      eyebrow: 'Guide',
      title: 'BUYER GUIDE',
      subtitle: tenant.tagline,
      accent: '#34d399',
      icon: 'G',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    },
  );
