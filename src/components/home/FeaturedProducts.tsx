import { useCatalogProducts } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { motion } from 'framer-motion';
import type { Product } from '@/data/products';

interface FeaturedProductsProps {
  title: string;
  filterFn?: (product: Product) => boolean;
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
  const filtered = products.filter(filterFn);
  const filteredProducts = (filtered.length > 0 ? filtered : products).slice(0, limit);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="featured-section py-12 md:py-16 bg-muted/5">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="text-2xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {title}
          </motion.h2>
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
            : filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
          }
        </div>
      </div>
    </section>
  );
}