import { useStore } from '@nanostores/react';
import { $beginnerMode, enableBeginnerMode, disableBeginnerMode } from '@/stores/beginner-mode';

export default function BeginnerModeToggle() {
  const isActive = useStore($beginnerMode);

  if (isActive) {
    return (
      <button
        onClick={disableBeginnerMode}
        className="inline-flex h-12 items-center justify-center rounded-lg border border-[#faf8f5]/20 px-8 text-base font-semibold text-[#faf8f5] transition hover:bg-[#faf8f5]/10"
      >
        Beginner Mode Active ✓
      </button>
    );
  }

  return (
    <button
      onClick={enableBeginnerMode}
      className="inline-flex h-12 items-center justify-center rounded-lg bg-[#22c55e] px-8 text-base font-semibold text-white transition hover:bg-[#16a34a]"
    >
      Enable Beginner Mode
    </button>
  );
}
