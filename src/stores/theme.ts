import { persistentAtom } from '@nanostores/persistent';
import { tenant } from '@/config/tenant';

export type Theme = 'velo' | 'light' | 'editorial' | 'forest' | 'copper';

/** Human-friendly labels for the theme picker UI */
export const themeLabels: Record<Theme, string> = {
  velo: 'Midnight Blue',
  light: 'Scandinavian Light',
  editorial: 'Editorial Warm',
  forest: 'Forest Green',
  copper: 'Copper Glass',
};

/** All available themes — order matches picker display */
export const allThemes: Theme[] = ['light', 'forest', 'editorial', 'copper', 'velo'];

export const $theme = persistentAtom<Theme>(tenant.storage.themeKey, tenant.theme.defaultTheme);

const themeClasses: Theme[] = ['velo', 'light', 'editorial', 'forest', 'copper'];

export function setTheme(next: Theme) {
  $theme.set(next);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.classList.remove(...themeClasses);
    root.classList.add(next);
  }
}

export function cycleTheme() {
  const current = $theme.get();
  const idx = allThemes.indexOf(current);
  const next = allThemes[(idx + 1) % allThemes.length];
  setTheme(next);
}

/** Legacy toggle — kept for backward compat */
export function toggleTheme() {
  setTheme($theme.get() === 'forest' ? 'light' : 'forest');
}
