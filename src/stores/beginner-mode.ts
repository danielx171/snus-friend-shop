import { persistentAtom } from '@nanostores/persistent';
import { getStorageKey } from '@/lib/tenant-storage';

export const $beginnerMode = persistentAtom<boolean>(
  getStorageKey('beginnerKey'),
  false,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function enableBeginnerMode() {
  $beginnerMode.set(true);
}

export function disableBeginnerMode() {
  $beginnerMode.set(false);
}

export function toggleBeginnerMode() {
  $beginnerMode.set(!$beginnerMode.get());
}

/** Max nicotine mg shown in beginner mode */
export const BEGINNER_MAX_MG = 6;
