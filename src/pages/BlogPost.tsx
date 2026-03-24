import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/seo/SEO';
import { CalendarDays, ArrowLeft, User } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
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

/** Simple markdown renderer — no external deps needed */
function renderMarkdown(md: string): string {
  return md
    // Tables: detect | ... | rows
    .replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm, (_m, header, rows) => {
      const ths = header.split('|').filter((c: string) => c.trim()).map((c: string) => `<th class="px-3 py-2 text-left">${c.trim()}</th>`).join('');
      const trs = rows.trim().split('\n').map((row: string) => {
        const tds = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="px-3 py-2 border-t border-border/30">${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      return `<div class="overflow-x-auto my-6"><table class="w-full text-sm border border-border/40 rounded-lg overflow-hidden"><thead class="bg-muted/60"><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
    })
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-foreground mt-6 mb-2">$1</h3>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h2>')
    // H1
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-8 mb-3">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Unordered list items — group them
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li[^>]*>.*?<\/li>\n?)+/g, (match) => `<ul class="my-4 space-y-1 pl-2">${match}</ul>`)
    // Paragraphs (lines not starting with <)
    .split('\n\n')
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => {
      if (block.startsWith('<')) return block;
      return `<p class="text-muted-foreground leading-relaxed">${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null | 'loading'>('loading');

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => {
        setPost((data as BlogPost) ?? null);
      });
  }, [slug]);

  if (post === 'loading') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container py-12 max-w-3xl space-y-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded" />
            <div className="h-64 w-full bg-muted animate-pulse rounded" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) return <Navigate to="/blog" replace />;

  const siteUrl = 'https://snusfriends.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const pageTitle = post.seo_title ?? `${post.title} | SnusFriend`;
  const pageDesc = post.seo_description ?? post.excerpt;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Organization', name: post.author_name },
    publisher: { '@type': 'Organization', name: 'SnusFriend', url: siteUrl },
    datePublished: post.published_at,
    url: canonicalUrl,
    ...(post.cover_image_url ? { image: post.cover_image_url } : {}),
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonical={canonicalUrl}
        ogType="article"
        ogImage={post.cover_image_url ?? undefined}
        jsonLd={articleJsonLd}
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container py-8 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs uppercase tracking-wide">
                  {tag.replace(/-/g, ' ')}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border/40">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{post.author_name}</span>
            </div>
            {post.published_at && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            )}
          </div>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="mb-8 rounded-xl overflow-hidden bg-muted">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Body */}
          <article
            className="prose-container"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
          />

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
