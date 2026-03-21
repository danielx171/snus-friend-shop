import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { brandDirectory } from '@/data/brands';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://snus-friend-shop.lovable.app/' },
    { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://snus-friend-shop.lovable.app/brands' },
  ],
};

/** Brand accent colours keyed by slug */
const brandAccents: Record<string, string> = {
  zyn: '220 70% 50%',
  velo: '200 80% 45%',
  on: '25 95% 55%',
  skruf: '150 40% 40%',
  loop: '280 60% 55%',
  lyft: '190 70% 50%',
  'nordic-spirit': '210 50% 45%',
  siberia: '0 70% 50%',
  pablo: '45 90% 50%',
  killa: '340 70% 50%',
};

export default function BrandsIndex() {
  const { data: allProducts = [] } = useCatalogProducts();
  const getProductCount = (brandName: string) => allProducts.filter(p => p.brand === brandName).length;

  return (
    <Layout>
      <SEO
        title="Brands | SnusFriend"
        description="Explore all nicotine pouch brands available at SnusFriend. From ZYN to VELO, find your perfect match."
        canonical="https://snus-friend-shop.lovable.app/brands"
        jsonLd={breadcrumbJsonLd}
      />

      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Brands</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Our Brands
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Discover top nicotine pouch brands from leading manufacturers across Scandinavia and Europe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {brandDirectory.map((brand, index) => {
            const count = getProductCount(brand.name);
            const accent = brandAccents[brand.slug] ?? '220 10% 50%';

            return (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
              >
              <Link
                to={`/brand/${brand.slug}`}
                className="group block h-full"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-200 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:border-[hsl(0_0%_100%/0.3)]">
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-all duration-200 group-hover:w-2"
                    style={{ backgroundColor: `hsl(${accent})` }}
                  />

                  <div className="p-5 md:p-6 pl-6 md:pl-7 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      {/* Brand initial circle */}
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm"
                          style={{ backgroundColor: `hsl(${accent})` }}
                        >
                          {brand.name.charAt(0)}
                        </div>
                        <h2 className="text-lg font-semibold text-foreground group-hover:text-[hsl(var(--chart-4))] transition-colors">
                          {brand.name}
                        </h2>
                      </div>
                      <Badge className="shrink-0 text-xs bg-[hsl(var(--chart-4)/0.15)] text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4)/0.3)] hover:bg-[hsl(var(--chart-4)/0.2)]">
                        {count > 0 ? `${count} products` : 'Popular'}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                      {brand.tagline}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      by {brand.manufacturer}
                    </p>

                    <div className="mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 rounded-xl border-[hsl(var(--chart-4)/0.3)] text-[hsl(var(--chart-4))] hover:bg-[hsl(var(--chart-4))] hover:text-white hover:border-[hsl(var(--chart-4))] transition-all duration-200"
                      >
                        View {brand.name}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
