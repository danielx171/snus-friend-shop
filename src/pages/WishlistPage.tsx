import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { useCatalogProducts } from '@/hooks/useCatalog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { data: products = [], isLoading } = useCatalogProducts();

  const wishlisted = ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <Layout>
      <SEO
        title="Wishlist | SnusFriend"
        description="Your saved nicotine pouches."
        metaRobots="noindex,follow"
      />
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Wishlist</h1>
        {wishlisted.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No saved products yet</h2>
            <p className="text-muted-foreground mb-6">Browse our collection and tap the heart icon to save products here.</p>
            <Button asChild><Link to="/nicotine-pouches">Browse Products</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlisted.map((product) => (
              <ProductCard key={product!.id} product={product!} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
