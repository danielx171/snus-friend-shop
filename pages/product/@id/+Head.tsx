export { Head }

// Generic breadcrumb schema for product pages.
// Dynamic product-specific JSON-LD (name, price, image, reviews) will be
// added in the next pass when +data.ts is introduced for SSR data fetching.
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://snusfriends.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Nicotine Pouches',
      item: 'https://snusfriends.com/nicotine-pouches',
    },
  ],
}

function Head() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}
