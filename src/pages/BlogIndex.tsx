import { Link } from 'react-router-dom';
import { blogArticles, BLOG_CATEGORIES } from '@/data/blogArticles';
import type { Language } from '@/data/blogTypes';
import { useSeoMeta } from '@/hooks/useSeoMeta';
import { Badge } from '@/components/ui/badge';

interface BlogIndexProps {
  lang?: Language;
}

export default function BlogIndex({ lang = 'en' }: BlogIndexProps) {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const visible = blogArticles.filter((a) => a.availableIn.includes(lang));

  useSeoMeta(
    'Nicotine Pouch Guides & Comparisons — SnusFriend Blog',
    'Strength guides, brand comparisons and flavour maps for nicotine pouches — every claim grounded in real product research.',
    `${prefix}/blog`,
  );

  return (
    <div className="container py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Blog</span>
      </nav>

      <h1 className="text-3xl font-bold mb-2">The SnusFriend Blog</h1>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Guides, strength ladders and honest brand comparisons — written from our own competitor
        research, not marketing copy.
      </p>

      {visible.length === 0 && (
        <p className="text-muted-foreground">No articles available in this language yet.</p>
      )}

      {BLOG_CATEGORIES.map((category) => {
        const articles = visible.filter((a) => a.category === category);
        if (articles.length === 0) return null;
        return (
          <section key={category} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  to={`${prefix}/blog/${a.slug}`}
                  className="block rounded-xl border border-border/40 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <Badge variant="secondary" className="mb-3">{a.category}</Badge>
                  <h3 className="font-medium leading-snug mb-2">{a.title[lang] ?? a.title.en}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
