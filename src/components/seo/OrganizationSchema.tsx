import { useEffect } from 'react';
import { SITE_URL } from '@/config/brand';

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'SnusFriend',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description:
    'Premium nicotine pouch shop with 700+ products from 91 brands. Fast EU delivery, secure checkout, and a loyalty rewards programme.',
  email: 'support@snusfriend.com',
  foundingDate: '2026',
  areaServed: { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 51.5, longitude: -0.12 }, geoRadius: '3000 km' },
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Credit Card, Debit Card',
  priceRange: '€€',
  sameAs: [],
};

/**
 * Injects Organization / OnlineStore JSON-LD into <head>.
 * Mount once in App.tsx or Layout — not per-page.
 */
export function OrganizationSchema() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-org-jsonld', 'true');
    script.textContent = JSON.stringify(ORGANIZATION_SCHEMA);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return null;
}
