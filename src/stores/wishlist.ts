import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import { tenant } from '@/config/tenant';

export const $wishlistIds = persistentAtom<string[]>(
  tenant.storage.wishlistKey,
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

export const $wishlistCount = computed($wishlistIds, (ids) => ids.length);

export function toggleWishlist(productId: string) {
  const ids = $wishlistIds.get();
  if (ids.includes(productId)) {
    $wishlistIds.set(ids.filter((id) => id !== productId));
  } else {
    $wishlistIds.set([...ids, productId]);
  }
}

export function hasInWishlist(productId: string): boolean {
  return $wishlistIds.get().includes(productId);
}

export function clearWishlist() { $wishlistIds.set([]); }
