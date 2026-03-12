import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface NicotineWarningProps {
  variant?: 'banner' | 'inline';
}

export function NicotineWarning({ variant = 'banner' }: NicotineWarningProps) {
  const { t } = useTranslation();

  if (variant === 'inline') {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <p className="text-destructive">
          {t('compliance.nicotineWarning')}
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
            {t('compliance.nicotineWarning')}
          </span>
        </div>
      </div>
    </div>
  );
}
