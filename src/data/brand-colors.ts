/**
 * Brand primary colors for visual differentiation in product cards and brand pages.
 * Used for: image background tints, brand page header gradients.
 * Fallback for unmapped brands: #e8f0e8 (muted green)
 */
export const brandColors: Record<string, string> = {
  zyn: '#4CAF50',
  velo: '#1565C0',
  loop: '#FF6F00',
  siberia: '#D32F2F',
  skruf: '#1B5E20',
  'white-fox': '#0D47A1',
  pablo: '#B71C1C',
  'nordic-spirit': '#37474F',
  klar: '#004D40',
  fumi: '#6A1B9A',
  cuba: '#E65100',
  iceberg: '#00838F',
  ace: '#2E7D32',
  helwit: '#558B2F',
  '77-pouches': '#F9A825',
  'apr-s': '#795548',
  chainpop: '#AD1457',
  avant: '#BF360C',
  fix: '#1A237E',
  fold: '#33691E',
  klint: '#00695C',
  xqs: '#4A148C',
  on: '#E53935',
  killa: '#B71C1C',
  denssi: '#283593',
  clew: '#0277BD',
  vid: '#4E342E',
  garant: '#1B5E20',
};

/** Strength level color coding for product cards */
export const strengthColors: Record<string, string> = {
  light: '#22c55e',
  normal: '#3b82f6',
  strong: '#f97316',
  'extra-strong': '#ef4444',
  'super-strong': '#a855f7',
};

export const strengthLabels: Record<string, string> = {
  light: 'Light',
  normal: 'Normal',
  strong: 'Strong',
  'extra-strong': 'Extra Strong',
  'super-strong': 'Super Strong',
};

export const defaultBrandColor = '#e8f0e8';
