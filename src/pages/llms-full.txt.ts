import type { APIRoute } from 'astro';
import { getLlmsFullTxt } from '@/lib/llms';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(getLlmsFullTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
