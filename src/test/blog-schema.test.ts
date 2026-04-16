import { describe, expect, it } from 'vitest';
import { tenant } from '@/config/tenant';
import { buildAbsoluteUrl } from '@/config/site';
import {
  buildAuthorPersonSchema,
  buildBlogPostingSchema,
  buildCollectionPageSchema,
  buildPublisherSchema,
  getDefaultAuthorPath,
} from '@/lib/blog-schema';

describe('blog schema helpers', () => {
  it('builds the default author path from the tenant runtime', () => {
    expect(getDefaultAuthorPath()).toBe(`/authors/${tenant.defaultAuthor.slug ?? 'erik-lindqvist'}`);
  });

  it('uses tenant-backed author identity in the person schema', () => {
    const schema = buildAuthorPersonSchema();

    expect(schema.name).toBe(tenant.defaultAuthor.name);
    expect(schema.jobTitle).toBe(tenant.defaultAuthor.jobTitle);
    expect(schema.description).toBe(tenant.defaultAuthor.bio);
    expect(schema.url).toBe(buildAbsoluteUrl(getDefaultAuthorPath()));
    expect(schema.sameAs).toEqual([...tenant.defaultAuthor.sameAs]);
  });

  it('builds publisher and blog posting schemas with tenant identity and absolute urls', () => {
    const publisher = buildPublisherSchema();
    const schema = buildBlogPostingSchema({
      headline: 'Tenant-safe nicotine pouch guide',
      description: 'A helper-level regression test for tenant-aware blog schema output.',
      slug: 'tenant-safe-nicotine-pouch-guide',
      datePublished: '2026-04-16',
      imagePath: '/images/og/test-blog.svg',
    });

    expect(publisher.name).toBe(tenant.name);
    expect(publisher.logo.url).toBe(buildAbsoluteUrl(tenant.assets.logo));
    expect(schema.url).toBe(buildAbsoluteUrl('/blog/tenant-safe-nicotine-pouch-guide'));
    expect(schema.author.name).toBe(tenant.defaultAuthor.name);
    expect(schema.publisher.name).toBe(tenant.name);
    expect(schema.mainEntityOfPage['@id']).toBe(buildAbsoluteUrl('/blog/tenant-safe-nicotine-pouch-guide'));
    expect(schema.image).toBe(buildAbsoluteUrl('/images/og/test-blog.svg'));
  });

  it('builds tenant-aware collection schemas with absolute item urls', () => {
    const schema = buildCollectionPageSchema({
      name: `${tenant.name} Blog`,
      description: 'Shared collection page helper regression test.',
      path: '/blog',
      items: [
        { position: 1, path: '/blog/tenant-safe-nicotine-pouch-guide', name: 'Tenant-safe nicotine pouch guide' },
      ],
    });

    expect(schema.url).toBe(buildAbsoluteUrl('/blog'));
    expect(schema.mainEntity.itemListElement[0].url).toBe(buildAbsoluteUrl('/blog/tenant-safe-nicotine-pouch-guide'));
  });
});
