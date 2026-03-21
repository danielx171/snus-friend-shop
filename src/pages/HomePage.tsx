import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { PromoMarquee } from '@/components/home/PromoMarquee';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TrustBar } from '@/components/home/TrustBar';
import { MembersClub } from '@/components/home/MembersClub';
import { WhySnusFriends } from '@/components/home/WhySnusFriends';
import { EditorialHighlights } from '@/components/home/EditorialHighlights';
import { SEO } from '@/components/seo/SEO';
import { SITE_URL } from '@/config/brand';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SnusFriend',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/nicotine-pouches?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SEO
        title="SnusFriend | Premium Nicotine Pouches | Free EU Delivery"
        description="Shop 700+ nicotine pouches from 91 leading brands — ZYN, VELO, Loop and more. Free EU delivery. Fast shipping."
        canonical={SITE_URL + '/'}
        jsonLd={jsonLd}
      />
      <Layout showNicotineWarning={true}>
        {/* Hero — keeps own bg */}
        <HeroBanner />

        {/* Marquee — keeps own bg */}
        <PromoMarquee />

        {/* Category filter — slightly lighter navy */}
        <div style={{ background: 'rgba(15, 35, 75, 0.5)' }} className="border-t border-white/[0.04]">
          <CategoryShortcuts />
        </div>

        {/* Trust badges — keep */}
        <TrustBar />

        {/* Bestsellers — base navy */}
        <div
          className="border-t border-white/[0.04]"
          style={{ background: 'hsl(220 100% 10%)' }}
        >
          <FeaturedProducts
            title="Bestsellers"
            filterFn={(p) => p.badgeKeys.includes('popular')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=popular"
          />
        </div>

        {/* Explore & Discover — slightly lighter navy with radial glow */}
        <div
          className="relative border-t border-white/[0.04]"
          style={{ background: 'hsl(220 80% 12%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(50, 80, 150, 0.08), transparent)',
            }}
          />
          <EditorialHighlights />
        </div>

        {/* Special Offers — base navy */}
        <div
          className="border-t border-white/[0.04]"
          style={{ background: 'hsl(220 100% 10%)' }}
        >
          <FeaturedProducts
            title="Special Offers"
            filterFn={(p) => p.badgeKeys.includes('newPrice')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=newPrice"
          />
        </div>

        {/* Snus Family Club — slightly lighter navy with purple gradient */}
        <div
          className="relative border-t border-white/[0.04]"
          style={{ background: 'hsl(220 80% 12%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(30, 20, 60, 0.3) 60%, rgba(30, 20, 60, 0.3) 100%)',
            }}
          />
          <MembersClub />
        </div>

        {/* Why SnusFriend — base navy */}
        <div
          className="border-t border-white/[0.04]"
          style={{ background: 'hsl(220 100% 10%)' }}
        >
          <WhySnusFriends />
        </div>

        {/* New Arrivals — slightly lighter navy */}
        <div
          className="border-t border-white/[0.04]"
          style={{ background: 'hsl(220 80% 12%)' }}
        >
          <FeaturedProducts
            title="New Arrivals"
            filterFn={(p) => p.badgeKeys.includes('new')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=new"
          />
        </div>
      </Layout>
    </>
  );
}
