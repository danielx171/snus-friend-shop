import { PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PLPEmptyStateProps {
  onClearFilters: () => void;
}

export function PLPEmptyState({ onClearFilters }: PLPEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/30 border border-border/20 mb-6">
        <PackageSearch className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No pouches match those filters</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Try loosening up — we've got 731+ to explore
      </p>
      <Button variant="outline" size="sm" className="rounded-xl border-border/30" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </div>
  );
}
