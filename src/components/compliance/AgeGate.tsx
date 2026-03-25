import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';

const STORAGE_KEY = 'age_verified';

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [denied, setDenied] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const denyMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVerified(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  // Focus the confirm button when the gate first renders
  useEffect(() => {
    if (verified === false && !denied) {
      confirmRef.current?.focus();
    }
  }, [verified, denied]);

  // Focus the denied message when shown
  useEffect(() => {
    if (denied) {
      denyMessageRef.current?.focus();
    }
  }, [denied]);

  const handleConfirm = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVerified(true);
  }, []);

  const handleDeny = useCallback(() => {
    setDenied(true);
  }, []);

  // Handle keyboard — Enter/Space on buttons is native, but trap focus within the dialog
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Trap Tab within the dialog
    if (e.key === 'Tab') {
      const focusableElements = e.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, []);

  // Still checking localStorage — render nothing to avoid flash of content
  if (verified === null) return null;

  if (verified) return <>{children}</>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby={denied ? 'age-gate-denied' : 'age-gate-description'}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(220_16%_8%)] overflow-hidden"
    >
      {/* Subtle radial glow behind the panel */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, hsl(174 90% 50% / 0.06), transparent)',
        }}
      />

      {/* Glass panel */}
      <div className="relative z-10 max-w-md w-full mx-4 text-center space-y-6 p-8 rounded-2xl border border-[hsl(220_12%_22%)] bg-[hsl(220_14%_13%/0.85)] backdrop-blur-xl shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size={56} />
        </div>

        {denied ? (
          /* ── Access denied state ── */
          <div ref={denyMessageRef} tabIndex={-1} id="age-gate-denied" className="space-y-4 outline-none">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 id="age-gate-title" className="font-serif text-2xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You must be 18 years or older to access this website.
              This site sells nicotine products which are restricted to adults only.
            </p>
            <p className="text-sm text-muted-foreground">
              Please close this tab or navigate away.
            </p>
          </div>
        ) : (
          /* ── Verification prompt ── */
          <>
            <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
            <h1 id="age-gate-title" className="font-serif text-2xl font-bold text-foreground">
              Age Verification Required
            </h1>
            <p id="age-gate-description" className="text-muted-foreground">
              This website sells nicotine products. You must be 18 years or older to enter.
            </p>
            <p className="text-sm font-medium text-foreground">
              Are you 18 or older?
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                ref={confirmRef}
                onClick={handleConfirm}
                size="lg"
                className="rounded-xl px-8"
              >
                I am 18 or older
              </Button>
              <Button
                onClick={handleDeny}
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
              >
                I am under 18
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              By entering, you confirm you are of legal age to purchase nicotine products in your country.
            </p>
          </>
        )}

        {/* Nicotine warning — always visible */}
        <div className="mt-4 pt-4 border-t border-[hsl(220_12%_22%)]">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">WARNING:</span>{' '}
            This product contains nicotine. Nicotine is an addictive chemical.
          </p>
        </div>
      </div>
    </div>
  );
}
