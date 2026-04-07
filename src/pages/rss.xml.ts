import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { blogArticles } from '../data/blog-registry';

export async function GET(context: APIContext) {
  return rss({
    title: 'SnusFriend Blog',
    description: 'Guides, reviews, and tips about nicotine pouches from SnusFriend.',
    site: context.site!.toString(),
    items: blogArticles
      .filter((a) => a.date) // only include articles with dates
      .map((a) => ({
        title: a.title,
        description: a.excerpt,
        pubDate: new Date(a.date!),
        link: `/blog/${a.slug}`,
      })),
  });
}

export const prerender = true;
