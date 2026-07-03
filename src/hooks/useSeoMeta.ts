import { useEffect } from 'react';

/** Sets document.title + meta description + canonical link for SPA pages.
 *  Restores nothing on unmount by design — every routed page sets its own. */
export function useSeoMeta(title: string, description: string, canonicalPath: string) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = `https://snusfriend.se${canonicalPath}`;
  }, [title, description, canonicalPath]);
}
