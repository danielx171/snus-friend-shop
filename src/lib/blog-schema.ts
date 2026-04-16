import { buildAbsoluteUrl } from '@/config/site';
import { tenant } from '@/config/tenant';

export interface BlogPostingSchemaInput {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  imagePath?: string;
}

export interface CollectionPageSchemaInput {
  name: string;
  description: string;
  path: string;
  items: Array<{
    position: number;
    path: string;
    name: string;
  }>;
}

const toAbsoluteUrl = (value: string): string =>
  /^https?:\/\//i.test(value) ? value : buildAbsoluteUrl(value);

export const getDefaultAuthorPath = (): string =>
  `/authors/${tenant.defaultAuthor.slug ?? 'erik-lindqvist'}`;

export const editorialTeamLabel = `${tenant.name} Editorial`;

export const buildAuthorPersonSchema = (path = getDefaultAuthorPath()) => ({
  '@type': 'Person',
  name: tenant.defaultAuthor.name,
  jobTitle: tenant.defaultAuthor.jobTitle,
  description: tenant.defaultAuthor.bio,
  url: buildAbsoluteUrl(path),
  sameAs: [...tenant.defaultAuthor.sameAs],
});

export const buildPublisherSchema = () => ({
  '@type': 'Organization',
  name: tenant.name,
  logo: {
    '@type': 'ImageObject',
    url: toAbsoluteUrl(tenant.assets.logo),
  },
});

export const buildBlogPostingSchema = ({
  headline,
  description,
  slug,
  datePublished,
  dateModified,
  imagePath,
}: BlogPostingSchemaInput) => {
  const url = buildAbsoluteUrl(`/blog/${slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    ...(imagePath ? { image: toAbsoluteUrl(imagePath) } : {}),
    url,
    author: buildAuthorPersonSchema(),
    publisher: buildPublisherSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
};

export const buildCollectionPageSchema = ({
  name,
  description,
  path,
  items,
}: CollectionPageSchemaInput) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name,
  description,
  url: buildAbsoluteUrl(path),
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map(({ position, path: itemPath, name: itemName }) => ({
      '@type': 'ListItem',
      position,
      url: buildAbsoluteUrl(itemPath),
      name: itemName,
    })),
  },
});
