import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { brandDirectory } from '@/data/brands';
import { products } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function getProductCount(brandName: string): number {
  return products.filter((p) => p.brand === brandName).length;
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://snus-friend-shop.lovable.app/' },
    { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://snus-friend-shop.lovable.app/brands' },
  ],
};

export default function BrandsIndex() {
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
          {brandDirectory.map((brand) => {
            const count = getProductCount(brand.name);
            return (
              <Link
                key={brand.slug}
                to={`/brand/${brand.slug}`}
                className="group block"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border">
                  <CardContent className="p-5 md:p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {brand.name}
                      </h2>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {count > 0 ? `${count} products` : 'Popular products'}
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
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                      >
                        View {brand.name}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
