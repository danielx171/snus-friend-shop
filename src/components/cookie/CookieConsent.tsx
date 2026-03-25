import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  {
    key: 'essential' as const,
    label: 'Essential',
    description: 'Required for the site to function. Cannot be disabled.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analytics',
    description: 'Help us understand how you use the site.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing',
    description: 'Show you relevant ads and measure their effectiveness.',
    locked: false,
  },
  {
    key: 'personalization' as const,
    label: 'Personalization',
    description: 'Remember your preferences and show personalized content.',
    locked: false,
  },
] as const;

export function CookieConsent() {
  const { hasConsented, acceptAll, rejectNonEssential, saveCustomPreferences } =
    useCookieConsent();
  const [showCustomize, setShowCustomize] = useState(false);
  const [draft, setDraft] = useState({
    analytics: false,
    marketing: false,
    personalization: false,
  });

  const toggleCustomize = useCallback(() => {
    setShowCustomize((prev) => !prev);
  }, []);

  const handleDraftToggle = useCallback(
    (key: 'analytics' | 'marketing' | 'personalization') => {
      setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const handleSavePreferences = useCallback(() => {
    saveCustomPreferences(draft);
  }, [draft, saveCustomPreferences]);

  if (hasConsented) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 border-t border-border/40 bg-background/80 backdrop-blur-xl shadow-lg"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-sm text-muted-foreground flex-1">
            We use cookies to keep the site working and to understand how you use it.
            Read our{' '}
            <Link to="/cookies" className="underline hover:text-foreground">
              cookie policy
            </Link>
            .
          </p>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleCustomize}
              aria-label={showCustomize ? 'Hide cookie preferences' : 'Customize cookie preferences'}
              aria-expanded={showCustomize}
            >
              Customize
              {showCustomize ? (
                <ChevronUp className="ml-1.5 h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectNonEssential}
              aria-label="Accept necessary cookies only"
            >
              Necessary Only
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              aria-label="Accept all cookies"
            >
              Accept All
            </Button>
          </div>
        </div>

        {/* Customize panel */}
        {showCustomize && (
          <div className="rounded-xl border border-border/40 bg-card/60 backdrop-blur-md p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {CATEGORIES.map(({ key, label, description, locked }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <Switch
                  checked={locked ? true : draft[key]}
                  disabled={locked}
                  onCheckedChange={
                    locked ? undefined : () => handleDraftToggle(key as 'analytics' | 'marketing' | 'personalization')
                  }
                  aria-label={`${locked ? 'Essential cookies always enabled' : `Toggle ${label.toLowerCase()} cookies`}`}
                />
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-border/30">
              <Button size="sm" onClick={handleSavePreferences} aria-label="Save cookie preferences">
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
