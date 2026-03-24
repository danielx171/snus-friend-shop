import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useReorder } from '@/hooks/useReorder';
import { cn } from '@/lib/utils';

interface ReorderButtonProps {
  lineItemsSnapshot: unknown;
  className?: string;
}

const ReorderButton = React.memo(function ReorderButton({
  lineItemsSnapshot,
  className,
}: ReorderButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reorder, isReordering } = useReorder();

  const handleReorder = useCallback(async () => {
    const result = await reorder(lineItemsSnapshot);
    const total = result.added + result.unavailable;

    if (result.added === 0) {
      toast({
        title: 'Could not reorder',
        description: 'None of the items from this order are currently available.',
        variant: 'destructive',
      });
      return;
    }

    const message =
      result.unavailable === 0
        ? 'All items added to cart.'
        : `${result.added} of ${total} item${total !== 1 ? 's' : ''} added to cart.`;

    toast({ title: 'Reorder added', description: message });
    navigate('/cart');
  }, [reorder, lineItemsSnapshot, toast, navigate]);

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('gap-1.5', className)}
      onClick={handleReorder}
      disabled={isReordering}
      aria-label="Reorder items from this order"
    >
      {isReordering ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <RotateCcw className="h-3.5 w-3.5" />
      )}
      Reorder
    </Button>
  );
});

export default ReorderButton;
