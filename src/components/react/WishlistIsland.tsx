import { useStore } from '@nanostores/react';
import { $wishlistIds, toggleWishlist } from '@/stores/wishlist';
import { useCallback } from 'react';
import React from 'react';

function WishlistIsland() {
  const ids = useStore($wishlistIds);

  if (ids.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Save products you love and come back to them later.
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        {ids.length} {ids.length === 1 ? 'item' : 'items'} saved
      </p>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
        {ids.map((id) => (
          <WishlistRow key={id} productId={id} />
        ))}
      </ul>
    </div>
  );
}

const WishlistRow = React.memo<{ productId: string }>(function WishlistRow({ productId }) {
  const handleRemove = useCallback(() => {
    toggleWishlist(productId);
  }, [productId]);

  // Derive a slug-based display name from the product ID
  const displayName = productId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <li className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
      </div>
      <div className="flex items-center gap-3">
        <a
          href={`/products/${productId}`}
          className="text-xs font-medium text-primary hover:underline"
        >
          View
        </a>
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${displayName} from wishlist`}
          className="text-xs text-muted-foreground underline hover:text-destructive transition-colors"
        >
          Remove
        </button>
      </div>
    </li>
  );
});

export default WishlistIsland;
