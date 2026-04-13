import { useStore } from '@nanostores/react';
import { $compareIds } from '@/stores/compare';

/**
 * Header pill that links to /compare with the currently-selected product slugs.
 * Renders nothing when the compare list is empty.
 */
export default function HeaderCompareBadge() {
  const ids = useStore($compareIds);
  if (ids.length === 0) return null;
  const href = `/compare?products=${ids.join(',')}`;
  return (
    <a
      href={href}
      aria-label={`Compare ${ids.length} ${ids.length === 1 ? 'product' : 'products'}`}
      className="relative inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-card transition"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4v16m6-16v16M3 8h18M3 16h18" />
      </svg>
      <span className="tabular-nums">{ids.length}</span>
    </a>
  );
}
