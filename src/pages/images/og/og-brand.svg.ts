import type { APIRoute } from 'astro';
import { renderOgSvg } from '@/lib/og-svg';
import { tenant } from '@/config/tenant';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    renderOgSvg({
      eyebrow: 'Brands',
      title: 'BRAND GUIDE',
      subtitle: `Catalog overviews and brand breakdowns from ${tenant.name}`,
      accent: '#60a5fa',
      icon: 'B',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    },
  );
