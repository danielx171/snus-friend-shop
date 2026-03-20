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
        title="SnusFriend | Premium Nicotine Pouches | Free UK Delivery"
        description="Shop the UK's best selection of nicotine pouches from top brands like ZYN, VELO, and more. Free delivery over £25. Subscribe and save 10%."
        canonical={window.location.origin + '/'}
        jsonLd={jsonLd}
      />
      <Layout showNicotineWarning={true}>
        <AgeGate />
        <HeroBanner />
        <CategoryShortcuts />
        <TrustBar />
        
        {/* TODO: replace brand filter with badge=popular once badges are seeded */}
        <FeaturedProducts
          title="Bestsellers"
          filterFn={(p) => p.brand === 'VELO'}
          limit={4}
          viewAllHref="/nicotine-pouches?brand=VELO"
        />

        <EditorialHighlights />

        <div className="border-y border-border/10 bg-card/20">
          {/* TODO: replace brand filter with badge=newPrice once offers are seeded */}
          <FeaturedProducts
            title="Special Offers"
            filterFn={(p) => p.brand === 'CUBA'}
            limit={4}
            viewAllHref="/nicotine-pouches?brand=CUBA"
          />
        </div>

        <MembersClub />

        <WhySnusFriends />

        {/* TODO: replace brand filter with badge=new once new-arrivals logic is live */}
        <FeaturedProducts
          title="New Arrivals"
          filterFn={(p) => p.brand === 'Skruf'}
          limit={4}
          viewAllHref="/nicotine-pouches?brand=Skruf"
        />
      </Layout>
    </>
  );
}
