const STOREFRONT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const STOREFRONT_URL = `https://${STOREFRONT_DOMAIN}/api/2024-10/graphql.json`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      images(first: 1) {
        edges {
          node {
            url
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  imageUrl: string;
  price: number;
  currencyCode: string;
}

interface ShopifyGraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!STOREFRONT_DOMAIN || !STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront API credentials are not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  }

  const res = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status} ${res.statusText}`);
  }

  const json: ShopifyGraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map(e => e.message).join(', ')}`);
  }

  return json.data;
}

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { edges: { node: { url: string } }[] };
  variants: { edges: { node: { price: { amount: string; currencyCode: string } } }[] };
}

function mapNode(node: ProductNode): ShopifyProduct {
  const variant = node.variants.edges[0]?.node;
  return {
    id: node.id,
    title: node.title,
    description: node.description,
    handle: node.handle,
    imageUrl: node.images.edges[0]?.node.url ?? '',
    price: variant ? parseFloat(variant.price.amount) : 0,
    currencyCode: variant?.price.currencyCode ?? 'GBP',
  };
}

export async function fetchShopifyProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontFetch<{
    products: { edges: { node: ProductNode }[] };
  }>(PRODUCTS_QUERY, { first });

  return data.products.edges.map(edge => mapNode(edge.node));
}

export async function fetchShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontFetch<{
    productByHandle: ProductNode | null;
  }>(PRODUCT_BY_HANDLE_QUERY, { handle });

  return data.productByHandle ? mapNode(data.productByHandle) : null;
}
