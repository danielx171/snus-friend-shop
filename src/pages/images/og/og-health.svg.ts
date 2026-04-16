import type { APIRoute } from 'astro';
import { renderOgSvg } from '@/lib/og-svg';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    renderOgSvg({
      eyebrow: 'Health',
      title: 'HEALTH',
      subtitle: 'Evidence-led ingredient, safety, and usage explainers',
      accent: '#38bdf8',
      icon: '+',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    },
  );
