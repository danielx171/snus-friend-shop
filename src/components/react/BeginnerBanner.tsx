import { useStore } from '@nanostores/react';
import { $beginnerMode, disableBeginnerMode } from '@/stores/beginner-mode';

export default function BeginnerBanner() {
  const isActive = useStore($beginnerMode);

  if (!isActive) return null;

  return (
    <div className="bg-[#22c55e]/10 border-b border-[#22c55e]/20 text-sm">
      <div className="container flex items-center justify-between gap-2 py-2">
        <p className="text-foreground">
          <span className="font-semibold">Beginner Mode</span>
          <span className="hidden sm:inline"> — showing gentle products only (≤6mg)</span>
        </p>
        <button
          onClick={disableBeginnerMode}
          className="shrink-0 text-xs font-medium text-muted-foreground hover:text-foreground underline"
        >
          Switch to Full Catalog
        </button>
      </div>
    </div>
  );
}
