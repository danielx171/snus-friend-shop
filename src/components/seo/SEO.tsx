import { useEffect } from 'react';
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

/** Set or create a <meta> tag in the document head */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Set or create a <link rel="canonical"> in the document head */
function setCanonicalLink(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
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

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setCanonicalLink(resolvedCanonical);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', resolvedOgImage);
    setMeta('property', 'og:url', resolvedCanonical);

    // Twitter Card
    setMeta('name', 'twitter:card', twitterCard);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', resolvedOgImage);

    // Robots
    if (metaRobots) {
      setMeta('name', 'robots', metaRobots);
    }
  }, [title, description, resolvedCanonical, resolvedOgImage, ogType, twitterCard, metaRobots]);

  // JSON-LD can live in the body — Google supports it anywhere
  if (!jsonLd) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
