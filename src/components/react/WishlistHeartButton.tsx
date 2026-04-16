import { useStore } from '@nanostores/react';
import { useCallback } from 'react';
import { $wishlistIds, toggleWishlist } from '@/stores/wishlist';

interface Props {
  slug: string;
  name: string;
  className?: string;
}

export default function WishlistHeartButton({ slug, name, className = '' }: Props) {
  const ids = useStore($wishlistIds);
  const saved = ids.includes(slug);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(slug);
    },
    [slug],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm border border-border/60 transition hover:bg-card hover:border-primary/60 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        className={`h-4 w-4 transition-colors ${saved ? 'text-primary' : 'text-muted-foreground'}`}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
