import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $cookieConsent, acceptAll, rejectAll, setConsent } from '@/stores/cookie-consent';

const CookieConsentBanner: React.FC = () => {
  const consent = useStore($cookieConsent);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Prevent hydration mismatch: server always sees answered=false (no localStorage).
  // Wait until mounted so the persistent store has synced from localStorage.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSave = useCallback(() => {
    setConsent(analytics, marketing);
  }, [analytics, marketing]);

  const handleManage = useCallback(() => {
    setShowManage(true);
  }, []);

  // On server, always render the banner (answered=false default).
  // After mount, read actual consent from localStorage.
  if (mounted && consent.answered) return null;
  if (!mounted) return null; // SSR: render nothing — banner appears after hydration if needed

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-lg">
      {!showManage ? (
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleManage}
              className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              Manage Preferences
            </button>
            <button
              onClick={acceptAll}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Essential</span>
            <input type="checkbox" checked disabled className="h-4 w-4 accent-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Analytics</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Marketing</span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={rejectAll}
              className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
            >
              Reject All
            </button>
            <button
              onClick={handleSave}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CookieConsentBanner);
