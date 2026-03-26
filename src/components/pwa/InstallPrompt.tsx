import { useState, useEffect, useCallback } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DAYS = 7;

/** Returns true if the user dismissed the prompt less than DISMISS_DAYS ago. */
function isDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  if (Number.isNaN(dismissedAt)) return false;
  const elapsed = Date.now() - dismissedAt;
  // Re-show after DISMISS_DAYS
  if (elapsed > DISMISS_DAYS * 24 * 60 * 60 * 1000) {
    localStorage.removeItem(DISMISS_KEY);
    return false;
  }
  return true;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Already running as installed PWA — never show
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (isDismissed()) return;

    // Check if the event was captured before React mounted (main.tsx).
    // This is the primary path — the browser fires beforeinstallprompt early,
    // often before React's first useEffect runs.
    if (window.__pwaInstallPromptEvent) {
      setDeferredPrompt(window.__pwaInstallPromptEvent as BeforeInstallPromptEvent);
      setShow(true);
      window.__pwaInstallPromptEvent = null; // consumed
      return;
    }

    // Fallback: listen for the event in case it hasn't fired yet
    // (e.g. slow network, or browser defers the event).
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShow(false);
    // Store timestamp so the prompt resurfaces after DISMISS_DAYS
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-border/40 bg-card/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Install SnusFriend</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add to your home screen for quick access and offline browsing.
          </p>
          <Button size="sm" className="mt-2 rounded-lg" onClick={handleInstall}>
            Install
          </Button>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
