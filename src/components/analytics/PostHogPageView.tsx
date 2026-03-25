import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { posthog } from '@/lib/posthog';

export function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    // PostHog autocapture handles this, but explicit tracking ensures accuracy
    posthog.capture('$pageview', {
      $current_url: window.location.href,
    });
  }, [location.pathname, location.search]);

  return null;
}
