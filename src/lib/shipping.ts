export type ShippingRegion = 'SE' | 'EU' | 'INTL';

export interface ShippingMethodOption {
  id: string;
  name: string;
  label: string;
  price: number;
  regions: readonly ShippingRegion[];
}

const EU_COUNTRIES = new Set([
  'DE',
  'AT',
  'DK',
  'FI',
  'NL',
  'BE',
  'FR',
  'IT',
  'ES',
  'PL',
  'CZ',
  'IE',
  'PT',
]);

export const SHIPPING_METHOD_OPTIONS: readonly ShippingMethodOption[] = [
  {
    id: 'ups-standard',
    name: 'UPS Standard (J229F1)',
    label: 'UPS Standard (2-3 days)',
    price: 4.90,
    regions: ['SE'],
  },
  {
    id: 'ups-express',
    name: 'UPS Express Saver',
    label: 'UPS Express (1-2 days)',
    price: 9.90,
    regions: ['SE'],
  },
  {
    id: 'dhl-economy-eu',
    name: 'DHL Economy EU',
    label: 'DHL Economy EU (5-7 days)',
    price: 6.90,
    regions: ['EU'],
  },
  {
    id: 'dhl-express-eu',
    name: 'DHL Express EU',
    label: 'DHL Express EU (2-3 days)',
    price: 12.90,
    regions: ['EU'],
  },
  {
    id: 'dhl-economy-intl',
    name: 'DHL Economy (Non EU)',
    label: 'DHL Economy International (7-14 days)',
    price: 9.90,
    regions: ['INTL'],
  },
  {
    id: 'dhl-express-intl',
    name: 'DHL Express (Non EU)',
    label: 'DHL Express International (3-5 days)',
    price: 19.90,
    regions: ['INTL'],
  },
] as const;

export function getShippingRegion(country: string): ShippingRegion {
  if (country === 'SE') {
    return 'SE';
  }

  if (EU_COUNTRIES.has(country)) {
    return 'EU';
  }

  return 'INTL';
}

export function getShippingMethodsForCountry(
  country: string,
  availableMethodNames?: readonly string[] | null,
): ShippingMethodOption[] {
  const region = getShippingRegion(country);
  const regionOptions = SHIPPING_METHOD_OPTIONS.filter((option) => option.regions.includes(region));

  if (!availableMethodNames?.length) {
    return [...regionOptions];
  }

  const availableNames = new Set(
    availableMethodNames.map((name) => name.trim()).filter(Boolean),
  );
  const filtered = regionOptions.filter((option) => availableNames.has(option.name));

  return filtered.length > 0 ? filtered : [...regionOptions];
}
