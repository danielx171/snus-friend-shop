import { Product, PackSize, packSizeMultipliers } from '@/data/products';
import { SEO } from './SEO';

interface ProductSchemaProps {
  product: Product;
  selectedPackSize: PackSize;
}

export function ProductSchema({ product, selectedPackSize }: ProductSchemaProps) {
  const baseUrl = window.location.origin;
  const productUrl = `${baseUrl}/product/${product.id}`;
  const price = product.prices[selectedPackSize];
  const packCount = packSizeMultipliers[selectedPackSize];
  const unitPrice = price / packCount;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: `${product.name} by ${product.brand}. ${product.nicotineContent}mg nicotine per pouch, ${product.portionsPerCan} pouches per can.`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.manufacturer,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'EUR',
      price: price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: product.ratings.toString(),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nicotine Pouches',
        item: `${baseUrl}/nicotine-pouches`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  const combinedJsonLd = [jsonLd, breadcrumbJsonLd];

  return (
    <SEO
      title={`${product.name} | ${product.brand} | SnusFriend`}
      description={`Buy ${product.name} by ${product.brand}. From €${unitPrice.toFixed(2)}/can. ${product.nicotineContent}mg nicotine, ${product.portionsPerCan} pouches. Fast EU delivery.`}
      canonical={productUrl}
      ogType="product"
      jsonLd={combinedJsonLd}
    />
  );
}
