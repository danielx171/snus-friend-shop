import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export const $wishlistIds = persistentAtom<string[]>(
  tenant.storage.wishlistKey,
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

export function toggleWishlist(productId: string) {
  const ids = $wishlistIds.get();
  if (ids.includes(productId)) {
    $wishlistIds.set(ids.filter((id) => id !== productId));
  } else {
    $wishlistIds.set([...ids, productId]);
  }
}
