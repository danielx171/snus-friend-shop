import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, Gauge, Gift, Search, Heart, Globe, Sparkles } from 'lucide-react';

interface Update {
  version: string;
  date: string;
  headline: string;
  highlights: {
    icon: React.ReactNode;
    title: string;
    description: string;
    tag?: 'performance' | 'feature' | 'security' | 'ux';
  }[];
}

const tagStyles: Record<string, string> = {
  performance: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  feature: 'bg-primary/15 text-primary border-primary/30',
  security: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  ux: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
};

const tagLabels: Record<string, string> = {
  performance: 'Performance',
  feature: 'New Feature',
  security: 'Security',
  ux: 'UX Upgrade',
};

const updates: Update[] = [
  {
    version: '1.4.0',
    date: '25 March 2026',
    headline: 'Speed, security & smarter shopping',
    highlights: [
      {
        icon: <Gauge className="h-5 w-5" />,
        title: '40% faster page loads',
        description: 'Smart code-splitting now loads only what you need. The main app bundle dropped from 517 KB to 311 KB — pages open noticeably faster, especially on mobile.',
        tag: 'performance',
      },
      {
        icon: <Shield className="h-5 w-5" />,
        title: 'Hardened security',
        description: 'Blog content is now sanitized against XSS attacks. Internal API endpoints are locked behind authentication. Error responses no longer leak server details.',
        tag: 'security',
      },
      {
        icon: <Heart className="h-5 w-5" />,
        title: 'Wishlist that works',
        description: 'Your wishlist now loads full product details — prices, pack sizes, and stock status all show correctly. No more blank cards or missing data.',
        tag: 'feature',
      },
      {
        icon: <Globe className="h-5 w-5" />,
        title: 'Correct currency everywhere',
        description: 'All prices now consistently display in EUR across the entire site. No more stray pound signs or mismatched currencies.',
        tag: 'ux',
      },
      {
        icon: <Search className="h-5 w-5" />,
        title: 'Better product sync',
        description: 'Product names and descriptions from our warehouse now always arrive in English, so search and filters work as expected across all 2,200+ products.',
        tag: 'feature',
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: 'Cleaner headings & links',
        description: 'Improved page structure for screen readers and SEO. Terms & Privacy links on login pages now actually go somewhere. Heading hierarchy fixed across all pages.',
        tag: 'ux',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '24 March 2026',
    headline: 'Live domain, checkout confirmed & code review',
    highlights: [
      {
        icon: <Globe className="h-5 w-5" />,
        title: 'snusfriends.com is live',
        description: 'The site is now running on our permanent domain with SSL, verified DNS, and proper auth redirects.',
        tag: 'feature',
      },
      {
        icon: <Shield className="h-5 w-5" />,
        title: 'Checkout verified end-to-end',
        description: 'A real test order (Nyehandel #479) went through successfully — payment, warehouse notification, and order confirmation all working.',
        tag: 'security',
      },
      {
        icon: <Zap className="h-5 w-5" />,
        title: 'CORS & security audit',
        description: 'Locked down cross-origin requests to snusfriends.com only. Fixed 7 issues from a comprehensive code review.',
        tag: 'security',
      },
    ],
  },
  {
    version: '1.2.0',
    date: '23 March 2026',
    headline: 'Rewards, brands & navigation overhaul',
    highlights: [
      {
        icon: <Gift className="h-5 w-5" />,
        title: 'Daily spin wheel & quests',
        description: 'Spin once a day to win vouchers and SnusPoints. Complete quests like "Brand Explorer" or "Review Champion" to unlock exclusive avatars.',
        tag: 'feature',
      },
      {
        icon: <Search className="h-5 w-5" />,
        title: 'Brand discovery',
        description: 'New homepage brand carousel, "also try" suggestions on brand pages, and 24 featured brands. Explore beyond your usual picks.',
        tag: 'feature',
      },
      {
        icon: <Sparkles className="h-5 w-5" />,
        title: 'Simpler navigation',
        description: 'Header trimmed from 7 links to 4. Quick-filter tabs on the shop page. Dynamic brand dropdown with your top brands.',
        tag: 'ux',
      },
      {
        icon: <Gauge className="h-5 w-5" />,
        title: 'WCAG accessibility fixes',
        description: 'Fixed 4 flavor accent colors (coffee, cola, berry, citrus) to meet AA contrast ratios. Lighthouse accessibility score: 100.',
        tag: 'ux',
      },
    ],
  },
  {
    version: '1.1.0',
    date: '20 March 2026',
    headline: 'Catalog UX & search improvements',
    highlights: [
      {
        icon: <Zap className="h-5 w-5" />,
        title: 'Compact product cards',
        description: 'Denser grid layout shows more products at a glance. 3:2 images, icon-only buttons, and a cleaner look for browsing.',
        tag: 'ux',
      },
      {
        icon: <Search className="h-5 w-5" />,
        title: 'Full-featured search',
        description: 'Filter sidebar with brands, strengths, flavors, and formats. Pagination, sort options, and relevance-scored results.',
        tag: 'feature',
      },
    ],
  },
];

export default function WhatsNewPage() {
  return (
    <Layout>
      <SEO
        title="What's New | SnusFriend"
        description="See the latest improvements, features, and fixes we've shipped for SnusFriend."
      />
      <div className="container py-10 max-w-3xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">What's New</h1>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              v{__APP_VERSION__}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            We ship improvements every week. Here's what's changed recently.
          </p>
        </div>

        <div className="space-y-10">
          {updates.map((update) => (
            <section key={update.version}>
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  {update.headline}
                </h2>
                <span className="text-xs font-mono text-muted-foreground/60 shrink-0">
                  v{update.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground/50 mb-4">{update.date}</p>

              <div className="grid gap-3">
                {update.highlights.map((item, i) => (
                  <Card key={i} className="border-border/20 bg-card/60">
                    <CardContent className="p-4 flex gap-4">
                      <div className="shrink-0 mt-0.5 text-muted-foreground/60">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                          {item.tag && (
                            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${tagStyles[item.tag]}`}>
                              {tagLabels[item.tag]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 text-center">
          <p className="text-xs text-muted-foreground/40 font-mono">
            Build v{__APP_VERSION__} &middot; {__BUILD_DATE__}
          </p>
        </div>
      </div>
    </Layout>
  );
}
