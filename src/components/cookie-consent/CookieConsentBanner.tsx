import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCookieConsent } from './CookieConsentProvider';

// ---------------------------------------------------------------------------
// Category definitions
// ---------------------------------------------------------------------------

const CATEGORIES = [
  {
    key: 'essential' as const,
    label: 'Essential cookies',
    description: 'Required for the site to function. Cannot be disabled.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'Analytics cookies',
    description: 'Helps us understand how you use the site.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing cookies',
    description: 'Lets us show you relevant ads on social media.',
    locked: false,
  },
] as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 28, stiffness: 300 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CookieConsentBanner = React.memo(function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectNonEssential, updateConsent } = useCookieConsent();
  const [step, setStep] = useState<1 | 2>(1);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });

  // Block body scroll while banner is visible
  useEffect(() => {
    if (showBanner) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showBanner]);

  // Reset step when banner re-appears (e.g., after resetConsent)
  useEffect(() => {
    if (showBanner) {
      setStep(1);
      setDraft({ analytics: false, marketing: false });
    }
  }, [showBanner]);

  const handleCustomize = useCallback(() => {
    setStep(2);
  }, []);

  const handleDraftToggle = useCallback((key: 'analytics' | 'marketing') => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSavePreferences = useCallback(() => {
    updateConsent(draft);
  }, [draft, updateConsent]);

  const handleBackdropClick = useCallback(() => {
    // Backdrop dismiss = reject all (essential only)
    rejectNonEssential();
  }, [rejectNonEssential]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="cookie-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie consent"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative z-10 w-full max-w-md rounded-2xl glass-panel-strong p-6 shadow-2xl',
              'border border-border/30',
            )}
          >
            {/* Icon */}
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                We use cookies to improve your experience
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    We use cookies to keep things running smoothly and to understand how you interact
                    with our site. You can accept all, or customise your preferences.{' '}
                    <Link
                      to="/cookies"
                      className="underline hover:text-foreground transition-colors"
                    >
                      Cookie policy
                    </Link>
                  </p>

                  <Button
                    className="w-full mb-3"
                    size="lg"
                    onClick={acceptAll}
                    aria-label="Accept all cookies"
                  >
                    Accept All
                  </Button>

                  <button
                    type="button"
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={handleCustomize}
                  >
                    Customize
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <div className="space-y-3 mb-6">
                    {CATEGORIES.map(({ key, label, description, locked }) => (
                      <div
                        key={key}
                        className={cn(
                          'flex items-center justify-between gap-4 rounded-xl border border-border/20 bg-card/40 px-4 py-3',
                          locked && 'opacity-60',
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground">{description}</p>
                        </div>
                        <Switch
                          checked={locked ? true : draft[key]}
                          disabled={locked}
                          onCheckedChange={
                            locked
                              ? undefined
                              : () => handleDraftToggle(key as 'analytics' | 'marketing')
                          }
                          aria-label={
                            locked
                              ? 'Essential cookies always enabled'
                              : `Toggle ${label.toLowerCase()}`
                          }
                          className={locked ? 'pointer-events-none' : undefined}
                        />
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mb-3"
                    size="lg"
                    onClick={handleSavePreferences}
                    aria-label="Save cookie preferences"
                  >
                    Save Preferences
                  </Button>

                  <button
                    type="button"
                    className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    onClick={rejectNonEssential}
                  >
                    Reject All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export { CookieConsentBanner };
