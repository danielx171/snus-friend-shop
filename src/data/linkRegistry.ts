// Derived link index — Phase 2 of the interlinking spec (2026-07-03).
// Built at module load from blogArticles; no duplicated state. Corrupted slugs
// never enter (Phase 1 import skips them); unstocked links carry verified:false
// with an empty productSlug and render as /search links.
import { blogArticles } from './blogArticles';
import type { BlogProductLink } from './blogTypes';

// product slug → articles that mention it
export const productToBlogs: Record<string, string[]> = {};

// article slug → verified product links
export const blogToProducts: Record<string, BlogProductLink[]> = {};

for (const article of blogArticles) {
  blogToProducts[article.slug] = article.productsLinked;
  for (const link of article.productsLinked) {
    if (!link.verified || !link.productSlug) continue;
    if (!productToBlogs[link.productSlug]) productToBlogs[link.productSlug] = [];
    productToBlogs[link.productSlug].push(article.slug);
  }
}

/** URL for a product link: verified → product page, unstocked → search. */
export function productLinkHref(link: BlogProductLink): string {
  return link.verified && link.productSlug
    ? `/product/${link.productSlug}`
    : `/search?q=${encodeURIComponent(link.productName)}`;
}
