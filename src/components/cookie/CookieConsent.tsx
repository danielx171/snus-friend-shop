import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function CookieConsent() {
  const { hasConsented, accept } = useCookieConsent();

  if (hasConsented) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-background border-t shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          We use cookies to keep the site working and to understand how you use it.
          Read our <Link to="/cookies" className="underline hover:text-foreground">cookie policy</Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => accept('essential')}>
            Necessary Only
          </Button>
          <Button size="sm" onClick={() => accept('all')}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
