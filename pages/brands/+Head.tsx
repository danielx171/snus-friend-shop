export { Head }

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://snusfriends.com/' },
    { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://snusfriends.com/brands' },
  ],
}

function Head() {
  return (
    <>
      <link rel="canonical" href="https://snusfriends.com/brands" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  )
}
