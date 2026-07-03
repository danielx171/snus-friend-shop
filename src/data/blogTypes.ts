// Shared blog type system — Phase 0 of the interlinking spec (2026-07-03).
// All blog modules import from here. Languages live now: 'en'. Swedish next, German after.
// Do not add languages that have no content yet.
export type Language = 'en' | 'sv' | 'de';

export interface BlogProductLink {
  blogSlug: string;       // slug of the article containing this link
  productSlug: string;    // verified Supabase slug (never corrupted); '' when not stocked → render as /search link
  productName: string;    // display name from Supabase (authoritative); frontmatter name when not stocked
  anchor: string;         // the product name as it appears in the article body (used to build <a> text)
  verified: boolean;      // true = slug exists in Supabase and is not corrupted
  lastVerified: string;   // ISO date string of last Supabase check
}

export interface BlogArticle {
  slug: string;
  title: Record<Language, string> | { en: string; sv?: string; de?: string };
  metaDescription: Record<Language, string> | { en: string; sv?: string; de?: string };
  category: string;
  availableIn: Language[];        // ['en'] for all 21 initially
  translatedFrom?: Language;      // only on translated copies
  productsLinked: BlogProductLink[];
  // Rendering payload (kept from v1 module — components depend on these):
  html: string;                   // precompiled article body (inline links already resolved)
  excerpt: string;                // first ~120 chars, list cards
  related: string[];              // up to 3 related article slugs
}
