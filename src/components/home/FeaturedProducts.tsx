import { products as mockProducts } from '@/data/products';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface FeaturedProductsProps {
  title: string;
  filterFn?: (product: typeof mockProducts[0]) => boolean;
  limit?: number;
  viewAllHref?: string;
}

export function FeaturedProducts({
  title,
  filterFn = () => true,
  limit = 4,
  viewAllHref = '/nicotine-pouches',
}: FeaturedProductsProps) {
  const { t } = useTranslation();
  const { data: products = [], isLoading } = useCatalogProducts();
  const filteredProducts = products.filter(filterFn).slice(0, limit);

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
          <Button asChild variant="ghost" className="gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/8">
            <Link to={viewAllHref}>
              {t('products.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: limit }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          }
        </div>
      </div>
    </section>
  );
}
