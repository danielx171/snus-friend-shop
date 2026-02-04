import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryShortcuts } from '@/components/home/CategoryShortcuts';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { AgeGate } from '@/components/compliance/AgeGate';

export default function HomePage() {
  return (
    <Layout showNicotineWarning={true}>
      <AgeGate />
      <HeroBanner />
      <CategoryShortcuts />
      
      {/* Featured Products Sections */}
      <FeaturedProducts
        title="Utvalda produkter"
        filterFn={(p) => p.badges.includes('Populär')}
        limit={4}
        viewAllHref="/produkter?badge=Populär"
      />
      
      <div className="bg-muted/30">
        <FeaturedProducts
          title="Nya priser"
          filterFn={(p) => p.badges.includes('Nytt pris')}
          limit={4}
          viewAllHref="/produkter?badge=Nytt+pris"
        />
      </div>
      
      <FeaturedProducts
        title="Nyheter"
        filterFn={(p) => p.badges.includes('Nyhet')}
        limit={4}
        viewAllHref="/produkter?badge=Nyhet"
      />
    </Layout>
  );
}
