import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { ProductCard } from '@/components/product/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/[0.06] bg-card/90 overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-3.5 space-y-2.5">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const { products, isLoading, count } = useWishlist();

  return (
    <Layout>
      <SEO
        title="Wishlist | SnusFriend"
        description="Your saved nicotine pouches."
        metaRobots="noindex,nofollow"
      />
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-foreground">Wishlist</h1>
          {count > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </div>

        {isLoading ? (
          <WishlistSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/20">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Browse products and tap the heart icon to save your favorites here.
            </p>
            <Button asChild>
              <Link to="/nicotine-pouches">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
