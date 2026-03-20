import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'age-verified';

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    setVerified(localStorage.getItem(STORAGE_KEY) === 'true');
  }, []);

  function handleConfirm() {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVerified(true);
  }

  function handleDeny() {
    window.location.href = 'https://google.com';
  }

  // Still checking localStorage — render nothing to avoid flash
  if (verified === null) return null;

  if (verified) return <>{children}</>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="max-w-md w-full mx-4 text-center space-y-6 p-8">
        <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
        <h1 id="age-gate-title" className="font-serif text-2xl font-bold text-foreground">
          Age Verification Required
        </h1>
        <p className="text-muted-foreground">
          This website sells nicotine products. You must be 18 years or older to enter.
        </p>
        <p className="text-sm font-medium text-foreground">
          Are you 18 or older?
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={handleConfirm} size="lg" className="rounded-xl px-8">
            Yes, I am 18+
          </Button>
          <Button onClick={handleDeny} variant="outline" size="lg" className="rounded-xl px-8">
            No, I am not
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          By entering, you confirm you are of legal age to purchase nicotine products in your country.
        </p>
      </div>
    </div>
  );
}
