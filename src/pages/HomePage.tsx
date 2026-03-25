import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { PromoMarquee } from '@/components/home/PromoMarquee';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TrustBar } from '@/components/home/TrustBar';
import { MembersClub } from '@/components/home/MembersClub';
import { WhySnusFriends } from '@/components/home/WhySnusFriends';
import { EditorialHighlights } from '@/components/home/EditorialHighlights';
import { BrandCarousel } from '@/components/home/BrandCarousel';
import { SEO } from '@/components/seo/SEO';
import { WebSiteSchema } from '@/components/seo/WebSiteSchema';
import { SITE_URL } from '@/config/brand';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';

export default function HomePage() {
  return (
    <>
      <SEO
        title="SnusFriend | Premium Nicotine Pouches | Free EU Delivery"
        description="Shop 700+ nicotine pouches from 91 leading brands — ZYN, VELO, Loop and more. Free EU delivery. Fast shipping."
        canonical={SITE_URL + '/'}
      />
      <WebSiteSchema />
      <Layout showNicotineWarning={true}>
        {/* Hero — keeps own bg */}
        <HeroBanner />

        {/* Marquee — keeps own bg */}
        <PromoMarquee />

        {/* Category filter */}
        <div className="homepage-section-alt border-t border-border/10">
          <CategoryShortcuts />
        </div>

        {/* Trust badges */}
        <TrustBar />

        {/* Bestsellers */}
        <div className="homepage-section-base border-t border-border/10">
          <FeaturedProducts
            title="Bestsellers"
            filterFn={(p) => p.badgeKeys.includes('popular')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=popular"
          />
        </div>

        {/* Discover Brands carousel */}
        <div className="homepage-section-alt border-t border-border/10">
          <BrandCarousel />
        </div>

        {/* Explore & Discover — with radial glow */}
        <div className="relative homepage-section-alt border-t border-border/10">
          <div className="absolute inset-0 pointer-events-none homepage-section-glow" />
          <EditorialHighlights />
        </div>

        {/* Special Offers */}
        <div className="homepage-section-base border-t border-border/10">
          <FeaturedProducts
            title="Special Offers"
            filterFn={(p) => p.badgeKeys.includes('newPrice')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=newPrice"
          />
        </div>

        {/* Snus Family Club — with fade overlay */}
        <div className="relative homepage-section-alt border-t border-border/10">
          <div className="absolute inset-0 pointer-events-none homepage-section-fade" />
          <MembersClub />
        </div>

        {/* Why SnusFriend */}
        <div className="homepage-section-base border-t border-border/10">
          <WhySnusFriends />
        </div>

        {/* New Arrivals */}
        <div className="homepage-section-alt border-t border-border/10">
          <FeaturedProducts
            title="New Arrivals"
            filterFn={(p) => p.badgeKeys.includes('new')}
            limit={4}
            viewAllHref="/nicotine-pouches?badge=new"
          />
        </div>

        <RecentlyViewed />
      </Layout>
    </>
  );
}
