import { Link, useParams } from 'react-router-dom';
import { productToBlogs } from '@/data/linkRegistry';
import { blogArticles } from '@/data/blogArticles';

/** "From our guides" — reverse product→blog links from the derived registry.
 *  Renders nothing when the current product isn't referenced by any article. */
export function BlogLinks() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  const blogSlugs = (productToBlogs[id] ?? []).slice(0, 3);
  if (blogSlugs.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">From our guides</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogSlugs.map((slug) => {
          const article = blogArticles.find((a) => a.slug === slug);
          if (!article) return null;
          return (
            <Link
              key={slug}
              to={`/blog/${slug}`}
              className="block rounded-xl border border-border/40 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{article.category}</div>
              <div className="font-medium leading-snug mb-2">{article.title.en}</div>
              <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
