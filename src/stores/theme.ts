import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export type Theme = 'velo' | 'light';

export const $theme = persistentAtom<Theme>(tenant.storage.themeKey, tenant.theme.defaultTheme);

export function setTheme(next: Theme) {
  $theme.set(next);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove('velo', 'light');
    root.classList.add(next);
  }
}

export function toggleTheme() {
  setTheme($theme.get() === 'velo' ? 'light' : 'velo');
}
