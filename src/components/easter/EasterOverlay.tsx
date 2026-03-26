import React, { useMemo } from 'react';
import { useEaster } from '@/context/EasterContext';

/** Floating Easter decorations when Easter mode is active */
export function EasterOverlay() {
  const { isEasterMode } = useEaster();

  const decorations = useMemo(() => {
    if (!isEasterMode) return null;
    const items = ['\u{1F338}', '\u{1F423}', '\u{1F337}', '\u{1F95A}', '\u{1F430}', '\u{1F33C}'];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: items[i % items.length],
      left: `${(i * 8.3) % 100}%`,
      delay: `${i * 1.5}s`,
      duration: `${15 + (i % 5) * 3}s`,
      size: 10 + (i % 3) * 4,
    }));
  }, [isEasterMode]);

  if (!decorations) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {decorations.map((d) => (
        <span
          key={d.id}
          className="absolute animate-easter-float opacity-20"
          style={{
            left: d.left,
            top: '-20px',
            fontSize: `${d.size}px`,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
