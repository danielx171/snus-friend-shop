import rss from '@astrojs/rss';
import { blogArticles } from '../data/blog-registry';
import { tenant } from '@/config/tenant';
import { siteUrl } from '@/config/site';

export async function GET() {
  return rss({
    title: `${tenant.name} Blog`,
    description: `Guides, reviews, and tips about nicotine pouches from ${tenant.name}.`,
    site: siteUrl,
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
