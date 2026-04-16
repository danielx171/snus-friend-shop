/**
 * Brand primary colors for visual differentiation in product cards and brand pages.
 * Used for: image background tints, brand page header gradients.
 * Fallback for unmapped brands: #4a7a5a (dark accessible green, contrast ≥ 4.5:1 on white)
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
  // Previously unmapped — caused near-invisible brand text on light cards
  rabbit: '#7B3F00',
  nois: '#1A3A4A',
  thunder: '#5C3A1E',
  pearl: '#4A4560',
  volt: '#4B6B00',
  dope: '#1C2B4A',
  thor: '#5A3070',
  gallantry: '#2D4A3E',
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

export const defaultBrandColor = '#4a7a5a'; // dark accessible green — contrast ≥ 4.5:1 on white

/** Flavor family colors for product card left borders */
export const flavorColors: Record<string, string> = {
  mint: '#06B6D4',
  menthol: '#06B6D4',
  berry: '#A855F7',
  citrus: '#84CC16',
  coffee: '#92400E',
  tobacco: '#78716C',
  fruit: '#FB923C',
  tropical: '#FB923C',
  cola: '#92400E',
  vanilla: '#F59E0B',
  licorice: '#374151',
};

export const defaultFlavorColor = '#6B7280';
