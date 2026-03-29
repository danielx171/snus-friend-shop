import { useStore } from '@nanostores/react';
import { $beginnerMode, enableBeginnerMode, disableBeginnerMode } from '@/stores/beginner-mode';

export default function BeginnerModeToggle() {
  const isActive = useStore($beginnerMode);

  if (isActive) {
    return (
      <button
        onClick={disableBeginnerMode}
        className="inline-flex h-12 items-center justify-center rounded-lg border px-8 text-base font-semibold transition"
        style={{ borderColor: 'hsl(var(--hero-text) / 0.2)', color: 'hsl(var(--hero-text))' }}
      >
        Beginner Mode Active ✓
      </button>
    );
  }

  return (
    <button
      onClick={enableBeginnerMode}
      className="inline-flex h-12 items-center justify-center rounded-lg bg-green-500 px-8 text-base font-semibold text-white transition hover:bg-green-600"
    >
      Enable Beginner Mode
    </button>
  );
}
