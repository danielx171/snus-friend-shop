import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TrustBar } from '@/components/home/TrustBar';
import { MembersClub } from '@/components/home/MembersClub';
import { WhySnusFriends } from '@/components/home/WhySnusFriends';
import { EditorialHighlights } from '@/components/home/EditorialHighlights';
import { AgeGate } from '@/components/compliance/AgeGate';
import { SEO } from '@/components/seo/SEO';

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SnusFriend',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/nicotine-pouches?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SEO
        title="SnusFriend | Premium Nicotine Pouches | Free EU Delivery"
        description="Shop 700+ nicotine pouches from 91 leading brands — ZYN, VELO, Loop and more. Free EU delivery. Fast shipping."
        canonical={window.location.origin + '/'}
        jsonLd={jsonLd}
      />
      <Layout showNicotineWarning={true}>
        <AgeGate />
        <HeroBanner />
        <CategoryShortcuts />
        <TrustBar />
        
        <FeaturedProducts
          title="Bestsellers"
          filterFn={(p) => p.badgeKeys.includes('popular')}
          limit={4}
          viewAllHref="/nicotine-pouches?badge=popular"
        />

        <EditorialHighlights />

        <div className="border-y border-border/10 bg-card/20">
          <FeaturedProducts
            title="Special Offers"
            filterFn={(p) => p.badgeKeys.includes('newPrice')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=newPrice"
          />
        </div>

        <MembersClub />

        <WhySnusFriends />

        <FeaturedProducts
          title="New Arrivals"
          filterFn={(p) => p.badgeKeys.includes('new')}
          limit={4}
          viewAllHref="/nicotine-pouches?badge=new"
        />
      </Layout>
    </>
  );
}
