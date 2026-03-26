import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export const $easterMode = persistentAtom<boolean>(
  tenant.storage.easterKey,
  false,
  { encode: String, decode: (s) => s === 'true' },
);

export function toggleEaster() { $easterMode.set(!$easterMode.get()); }
