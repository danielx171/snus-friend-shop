import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PackageOpen, ShoppingBag, Search, Users, FileX } from 'lucide-react';
import { Link } from 'react-router-dom';

type EmptyVariant = 'plp' | 'pdp' | 'cart' | 'orders' | 'search' | 'ops' | 'generic';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const variantDefaults: Record<EmptyVariant, { icon: React.ElementType; title: string; description: string }> = {
  plp: { icon: PackageOpen, title: 'No products found', description: 'Try adjusting your filters or search terms.' },
  pdp: { icon: FileX, title: 'Product not found', description: 'This product may have been removed or is no longer available.' },
  cart: { icon: ShoppingBag, title: 'Your cart is empty', description: 'Browse our range and add your favourites.' },
  orders: { icon: PackageOpen, title: 'No orders yet', description: 'Your order history will appear here once you place your first order.' },
  search: { icon: Search, title: 'No results found', description: 'Try a different search term or browse our categories.' },
  ops: { icon: Users, title: 'No data available', description: 'There is no data to display at this time.' },
  generic: { icon: PackageOpen, title: 'Nothing here yet', description: 'Check back later for updates.' },
};

export function EmptyState({
  variant = 'generic',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const defaults = variantDefaults[variant];
  const Icon = defaults.icon;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/30 border border-border/20 mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title ?? defaults.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description ?? defaults.description}</p>
      {(actionLabel && actionHref) && (
        <Button asChild className="rounded-xl glow-primary">
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      {(actionLabel && onAction && !actionHref) && (
        <Button onClick={onAction} className="rounded-xl glow-primary">{actionLabel}</Button>
      )}
    </div>
  );
}
