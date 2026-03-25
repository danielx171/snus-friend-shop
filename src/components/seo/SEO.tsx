import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/config/brand';

/** Default OG image — uses the PWA icon as a reliable fallback */
const DEFAULT_OG_IMAGE = '/pwa-512x512.png';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: object | object[];
  metaRobots?: string;
}

/** Tracking params to strip from canonical URLs */
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];

function cleanCanonical(url: string): string {
  try {
    const parsed = new URL(url);
    TRACKING_PARAMS.forEach((p) => parsed.searchParams.delete(p));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
  metaRobots,
}: SEOProps) {
  const resolvedCanonical = canonical
    ? cleanCanonical(canonical)
    : cleanCanonical(SITE_URL + window.location.pathname + window.location.search);

  // Social crawlers require absolute URLs for og:image / twitter:image
  const resolvedOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {metaRobots && <meta name="robots" content={metaRobots} />}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:url" content={resolvedCanonical} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedOgImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
