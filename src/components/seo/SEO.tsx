import { useEffect } from 'react';

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

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
  metaRobots,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    // Standard meta
    setMeta('name', 'description', description);

    // Robots
    if (metaRobots) {
      setMeta('name', 'robots', metaRobots);
    } else {
      const existing = document.querySelector('meta[name="robots"]');
      if (existing) existing.remove();
    }

    // Canonical
    const resolvedCanonical = canonical
      ? cleanCanonical(canonical)
      : cleanCanonical(window.location.href);
    setLink('canonical', resolvedCanonical);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:url', resolvedCanonical);

    // Twitter Card
    setMeta('name', 'twitter:card', twitterCard);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    // JSON-LD
    if (jsonLd) {
      let script = document.querySelector('script[data-seo-jsonld]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo-jsonld', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      const s = document.querySelector('script[data-seo-jsonld]');
      if (s) s.remove();
    };
  }, [title, description, canonical, ogImage, ogType, twitterCard, jsonLd, metaRobots]);

  return null;
}
