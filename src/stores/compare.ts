import { persistentAtom } from '@nanostores/persistent';
import { getStorageKey } from '@/lib/tenant-storage';

const MAX_COMPARE = 4;

/**
 * Persistent compare list — stored in tenant-scoped localStorage.
 * Caps at 4 products to keep the /compare table readable on mobile.
 */
export const $compareIds = persistentAtom<string[]>(
  getStorageKey('compareKey'),
  [],
  { encode: JSON.stringify, decode: JSON.parse },
);

/**
 * Toggle a product slug in the compare list.
 * Returns `true` if the product is now in the list, `false` if removed
 * or rejected (already at MAX_COMPARE).
 */
export function toggleCompare(productSlug: string): boolean {
  const ids = $compareIds.get();
  if (ids.includes(productSlug)) {
    $compareIds.set(ids.filter((id) => id !== productSlug));
    return false;
  }
  if (ids.length >= MAX_COMPARE) return false;
  $compareIds.set([...ids, productSlug]);
  return true;
}

export function clearCompare(): void {
  $compareIds.set([]);
}

export const COMPARE_LIMIT = MAX_COMPARE;
