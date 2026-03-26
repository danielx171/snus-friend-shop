interface ItemListProduct {
  id: string;
  name: string;
  url: string;
  image?: string;
  position: number;
}

interface ItemListSchemaProps {
  items: ItemListProduct[];
  name?: string;
}

export function ItemListSchema({ items, name = 'Nicotine Pouches' }: ItemListSchemaProps) {
  if (items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 50).map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      item: {
        '@type': 'Product',
        name: item.name,
        url: item.url,
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
