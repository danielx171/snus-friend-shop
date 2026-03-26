export { Head }

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://snusfriends.com/',
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
    <>
      <meta property="og:title" content="Nicotine Pouches — Shop 700+ Products | SnusFriend" />
      <meta property="og:description" content="Browse our full range of nicotine pouches. Filter by strength, flavor, format, and brand. Free EU delivery." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://snusfriends.com/nicotine-pouches" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
