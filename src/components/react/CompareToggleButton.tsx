import { useStore } from '@nanostores/react';
import { useCallback } from 'react';
import { $compareIds, toggleCompare, COMPARE_LIMIT } from '@/stores/compare';

interface Props {
  slug: string;
  name: string;
  className?: string;
}

export default function CompareToggleButton({ slug, name, className = '' }: Props) {
  const ids = useStore($compareIds);
  const selected = ids.includes(slug);
  const atLimit = ids.length >= COMPARE_LIMIT && !selected;

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCompare(slug);
    },
    [slug],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={atLimit}
      aria-pressed={selected}
      aria-label={
        selected
          ? `Remove ${name} from compare`
          : `Add ${name} to compare (${ids.length}/${COMPARE_LIMIT})`
      }
      className={`text-[10px] font-medium rounded-full px-2.5 py-0.5 border transition ${
        selected
          ? 'bg-primary/10 border-primary/40 text-primary'
          : atLimit
            ? 'opacity-40 cursor-not-allowed border-border'
            : 'border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground'
      } ${className}`}
    >
      {selected ? '✓ Comparing' : '+ Compare'}
    </button>
  );
}
