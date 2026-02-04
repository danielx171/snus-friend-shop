import { AlertTriangle } from 'lucide-react';

interface NicotineWarningProps {
  variant?: 'banner' | 'inline';
}

export function NicotineWarning({ variant = 'banner' }: NicotineWarningProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <p className="text-destructive">
          Denna produkt innehåller nikotin som är ett mycket beroendeframkallande ämne.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/50 border-b border-border">
      <div className="container py-2">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>
            Denna produkt innehåller nikotin som är ett mycket beroendeframkallande ämne.
          </span>
        </div>
      </div>
    </div>
  );
}
