import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { AgeGate } from '@/components/compliance/AgeGate';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout showNicotineWarning={true}>
      <AgeGate />
      <HeroBanner />
      <CategoryShortcuts />
      
      {/* Featured Products Sections */}
      <FeaturedProducts
        title={t('products.featured')}
        filterFn={(p) => p.badgeKeys.includes('popular')}
        limit={4}
        viewAllHref="/produkter?badge=Populär"
      />
      
      <div className="bg-muted/30">
        <FeaturedProducts
          title={t('badge.newPrice')}
          filterFn={(p) => p.badgeKeys.includes('newPrice')}
          limit={4}
          viewAllHref="/produkter?badge=Nytt+pris"
        />
      </div>
      
      <FeaturedProducts
        title={t('badge.new')}
        filterFn={(p) => p.badgeKeys.includes('new')}
        limit={4}
        viewAllHref="/produkter?badge=Nyhet"
      />
    </Layout>
  );
}
