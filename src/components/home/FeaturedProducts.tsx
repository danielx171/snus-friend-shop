import { products as mockProducts } from '@/data/products';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';
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
  const { data: products = [] } = useCatalogProducts();
  const filteredProducts = products.filter(filterFn).slice(0, limit);

  return (
    <section className="py-8 md:py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <Button asChild variant="ghost" className="gap-1 text-primary">
            <Link to={viewAllHref}>
              {t('products.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
