import React, { useCallback } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PouchPart } from '@/hooks/usePouchBuilder';

/* ------------------------------------------------------------------ */
/*  Rarity border map                                                  */
/* ------------------------------------------------------------------ */

const RARITY_BORDER: Record<string, string> = {
  common: 'border-white/10',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-amber-400',
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface PouchPartPickerProps {
  parts: PouchPart[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  category: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const PouchPartPicker = React.memo(function PouchPartPicker({
  parts,
  selectedId,
  onSelect,
  category,
}: PouchPartPickerProps) {
  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect]
  );

  if (parts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">No parts available.</p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {parts.map((part) => {
        const isLocked = part.unlock_condition !== 'default';
        const isSelected = part.id === selectedId;
        const rarityBorder = RARITY_BORDER[part.rarity] ?? RARITY_BORDER.common;

        return (
          <button
            key={part.id}
            type="button"
            disabled={isLocked}
            aria-label={`${part.name}${isLocked ? ' (locked)' : ''}`}
            aria-pressed={isSelected}
            onClick={() => !isLocked && handleSelect(part.id)}
            className={cn(
              'relative flex items-center justify-center rounded-lg border p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              rarityBorder,
              isSelected && 'ring-2 ring-primary',
              isLocked && 'opacity-40 cursor-not-allowed'
            )}
          >
            {category === 'color' ? (
              /* Color swatch */
              <span
                className="block w-8 h-8 rounded-full border border-white/20"
                style={{ backgroundColor: part.svg_data }}
                aria-hidden="true"
              />
            ) : (
              /* SVG preview */
              <svg
                width="48"
                height="38"
                viewBox="0 0 100 80"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: part.svg_data }}
              />
            )}

            {/* Locked overlay */}
            {isLocked && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});
