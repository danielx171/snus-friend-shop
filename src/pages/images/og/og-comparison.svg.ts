import type { APIRoute } from 'astro';
import { renderOgSvg } from '@/lib/og-svg';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    renderOgSvg({
      eyebrow: 'Comparison',
      title: 'COMPARE',
      subtitle: 'Head-to-head nicotine pouch brand and product comparisons',
      accent: '#f97316',
      icon: '≠',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    },
  );
