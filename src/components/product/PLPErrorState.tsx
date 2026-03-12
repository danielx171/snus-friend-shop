import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PLPErrorStateProps {
  onRetry?: () => void;
}

export function PLPErrorState({ onRetry }: PLPErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        We had trouble loading products. Please check your connection and try again.
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="rounded-xl gap-2 border-border/30" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
