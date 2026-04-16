import type { APIRoute } from 'astro';
import { renderOgSvg } from '@/lib/og-svg';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    renderOgSvg({
      eyebrow: 'Legal',
      title: 'LEGAL GUIDE',
      subtitle: 'Country rules, taxes, and ordering guidance across Europe',
      accent: '#a78bfa',
      icon: 'L',
    }),
    {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    },
  );
