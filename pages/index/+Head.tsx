export { Head }

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SnusFriend',
  url: 'https://snusfriends.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://snusfriends.com/nicotine-pouches?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

function Head() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  )
}
