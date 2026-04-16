import type { APIRoute } from 'astro';
import { renderOgSvg } from '@/lib/og-svg';
import { tenant } from '@/config/tenant';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    renderOgSvg({
      eyebrow: 'Best Of',
      title: 'BEST OF',
      subtitle: `Top picks ranked by ${tenant.name}`,
      accent: '#fbbf24',
      icon: 'A',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    },
  );
