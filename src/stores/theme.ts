import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export type Theme = 'forest' | 'copper';

/** Human-friendly labels for the theme picker UI */
export const themeLabels: Record<Theme, string> = {
  forest: 'Forest Green',
  copper: 'Copper Glass',
};

/** All available themes — order matches picker display */
export const allThemes: Theme[] = ['forest', 'copper'];

export const $theme = persistentAtom<Theme>(tenant.storage.themeKey, tenant.theme.defaultTheme);

const themeClasses: Theme[] = ['forest', 'copper'];

export function setTheme(next: Theme) {
  $theme.set(next);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove(...themeClasses);
    root.classList.add(next);
  }
}

