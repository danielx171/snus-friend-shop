import { Link, useParams } from 'react-router-dom';
import { blogArticles } from '@/data/blogArticles';
import { blogToProducts, productLinkHref } from '@/data/linkRegistry';
import type { Language } from '@/data/blogTypes';
import { useSeoMeta } from '@/hooks/useSeoMeta';
import { Badge } from '@/components/ui/badge';
import NotFound from '@/pages/NotFound';

interface BlogPostProps {
  lang?: Language;
}

export default function BlogPost({ lang = 'en' }: BlogPostProps) {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);
  const prefix = lang === 'en' ? '' : `/${lang}`;

  const title = article ? (article.title[lang] ?? article.title.en) : 'Article not found';
  const meta = article ? (article.metaDescription[lang] ?? article.metaDescription.en) : '';

  useSeoMeta(
    `${title} — SnusFriend`,
    meta,
    article ? `${prefix}/blog/${article.slug}` : `${prefix}/blog`,
  );

  if (!article) return <NotFound />;

  const productLinks = (blogToProducts[article.slug] ?? []).slice(0, 6);
  const related = article.related
    .map((r) => blogArticles.find((a) => a.slug === r))
    .filter((a): a is (typeof blogArticles)[number] => Boolean(a))
    .slice(0, 3);

  return (
    <div className="container py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6 flex flex-wrap gap-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to={`${prefix}/blog`} className="hover:text-primary">Blog</Link>
        <span>/</span>
        <span>{article.category}</span>
        <span>/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <article className="max-w-3xl">
        <Badge variant="secondary" className="mb-4">{article.category}</Badge>
        <h1 className="text-3xl font-bold leading-tight mb-6">{title}</h1>
        <div
          className="blog-content space-y-4 leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
            [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline
            [&_table]:w-full [&_table]:text-sm [&_table]:my-4
            [&_th]:text-left [&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2
            [&_td]:border-b [&_td]:border-border/40 [&_td]:px-3 [&_td]:py-2"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </article>

      {productLinks.length > 0 && (
        <section className="max-w-3xl mt-12 border-t border-border/40 pt-8">
          <h2 className="text-xl font-semibold mb-4">Products in this article</h2>
          <div className="flex flex-wrap gap-2">
            {productLinks.map((l) => (
              <Link
                key={`${l.productSlug}-${l.productName}`}
                to={productLinkHref(l)}
                className="rounded-full border border-border/40 bg-card/40 px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                {l.productName}
                {!l.verified && <span className="ml-1 text-muted-foreground">(search)</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="max-w-3xl mt-12 border-t border-border/40 pt-8">
          <h2 className="text-xl font-semibold mb-4">Related articles</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                to={`${prefix}/blog/${a.slug}`}
                className="block rounded-xl border border-border/40 bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="text-sm font-medium leading-snug">{a.title[lang] ?? a.title.en}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
