import { useEffect } from 'react';
import { posthog } from '@/lib/posthog';

export function PostHogPageView() {
  useEffect(() => {
    const handlePageView = () => {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      });
    };

    // Capture initial pageview
    handlePageView();

    // Listen for Vike client-side navigations
    window.addEventListener('vike:pageview', handlePageView);
    return () => window.removeEventListener('vike:pageview', handlePageView);
  }, []);

  return null;
}
