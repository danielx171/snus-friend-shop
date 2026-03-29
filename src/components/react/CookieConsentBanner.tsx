import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $cookieConsent, acceptAll, rejectAll, setConsent } from '@/stores/cookie-consent';
import { tenant } from '@/config/tenant';

const CookieConsentBanner: React.FC = () => {
  const consent = useStore($cookieConsent);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Prevent hydration mismatch: server always sees answered=false (no localStorage).
  // Wait until mounted so the persistent store has synced from localStorage.
  const [mounted, setMounted] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if age gate has already been dismissed
    const verified = localStorage.getItem(tenant.storage.ageVerifiedKey) === 'true';
    setAgeVerified(verified || !tenant.features.ageGate);

    // Listen for age gate dismissal if not yet verified
    if (!verified && tenant.features.ageGate) {
      const handler = () => setAgeVerified(true);
      window.addEventListener('age-verified', handler);
      return () => window.removeEventListener('age-verified', handler);
    }
  }, []);

  const handleSave = useCallback(() => {
    setConsent(analytics, marketing);
  }, [analytics, marketing]);

  const handleManage = useCallback(() => {
    setShowManage(true);
  }, []);

  // Don't render during SSR
  if (!mounted) return null;
  // Don't render if consent already given
  if (consent.answered) return null;
  // Don't render while age gate is still visible — avoid overlapping popups
  if (!ageVerified) return null;

  return (
    <>
    {/* Spacer to prevent content from being hidden behind fixed banner */}
    <div className="h-16 sm:h-14" />
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card p-4 shadow-lg">
      {!showManage ? (
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience.
          </p>
          <div className="flex w-full gap-3 sm:w-auto">
            <button
              onClick={handleManage}
              className="min-h-[44px] flex-1 rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 sm:flex-initial"
            >
              Manage Preferences
            </button>
            <button
              onClick={acceptAll}
              className="min-h-[44px] flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-initial"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-3">
          <label className="flex min-h-[44px] items-center justify-between">
            <span className="text-sm font-medium">Essential</span>
            <input type="checkbox" checked disabled className="h-5 w-5 accent-primary" />
          </label>
          <label className="flex min-h-[44px] items-center justify-between">
            <span className="text-sm font-medium">Analytics</span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
          <label className="flex min-h-[44px] items-center justify-between">
            <span className="text-sm font-medium">Marketing</span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={rejectAll}
              className="min-h-[44px] px-2 text-sm text-muted-foreground underline transition-colors hover:text-foreground"
            >
              Reject All
            </button>
            <button
              onClick={handleSave}
              className="min-h-[44px] rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default React.memo(CookieConsentBanner);
