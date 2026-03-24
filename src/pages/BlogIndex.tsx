import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SEO } from '@/components/seo/SEO';
import { CalendarDays, ChevronRight, BookOpen } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author_name: string;
  tags: string[];
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image_url, author_name, tags, published_at, seo_title, seo_description')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO
        title="Blog — Nicotine Pouch Guides & News | SnusFriend"
        description="Expert guides, brand deep-dives, and the latest news on nicotine pouches from the SnusFriend team."
        canonical="https://snusfriends.com/blog"
        ogType="website"
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container py-12 max-w-5xl">
          {/* Hero */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-primary mb-3">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Blog</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Guides & News</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Expert guides on nicotine pouches, brand reviews, and tips for switching from smoking.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">No posts yet — check back soon.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                  <Card className="h-full border-border/50 bg-card hover:border-primary/30 transition-all duration-200 hover:shadow-md overflow-hidden">
                    {post.cover_image_url && (
                      <div className="h-40 overflow-hidden bg-muted">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardContent className="p-5 flex flex-col gap-3">
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wide px-2 py-0.5">
                              {tag.replace(/-/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <h2 className="font-semibold text-foreground text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatDate(post.published_at)}</span>
                        </div>
                        <span className="flex items-center gap-0.5 text-xs font-medium text-primary">
                          Read <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
