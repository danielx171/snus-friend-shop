import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react';

type ErrorVariant = 'network' | 'server' | 'notFound' | 'generic';

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const variantDefaults: Record<ErrorVariant, { icon: React.ElementType; title: string; description: string }> = {
  network: { icon: WifiOff, title: 'Connection issue', description: 'Please check your internet connection and try again.' },
  server: { icon: ServerCrash, title: 'Something went wrong', description: 'Our servers are having a moment. Please try again shortly.' },
  notFound: { icon: AlertTriangle, title: 'Not found', description: 'The page or resource you're looking for doesn't exist.' },
  generic: { icon: AlertTriangle, title: 'Something went wrong', description: 'An unexpected error occurred. Please try again.' },
};

export function ErrorState({
  variant = 'generic',
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  const defaults = variantDefaults[variant];
  const Icon = defaults.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
        <Icon className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title ?? defaults.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description ?? defaults.description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="rounded-xl gap-2 border-border/30">
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
