import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function AgeGate() {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary py-2">
      <div className="container">
        <div className="flex items-center justify-center gap-2 text-sm text-secondary-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>🔞 {t('footer.ageNotice')}</span>
        </div>
      </div>
    </div>
  );
}
