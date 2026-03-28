import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';
import type { AvatarRarity } from './UserAvatar';
import type { AvatarWithUnlockInfo } from '@/hooks/useAvatarSelector';

/* ------------------------------------------------------------------ */
/*  Rarity label colors                                                */
/* ------------------------------------------------------------------ */

const rarityLabelColor: Record<string, string> = {
  common: 'text-[hsl(var(--color-rarity-common))]',
  rare: 'text-[hsl(var(--color-rarity-rare))]',
  epic: 'text-[hsl(var(--color-rarity-epic))]',
  legendary: 'text-[hsl(var(--color-rarity-legendary))]',
};

const rarityBorderHighlight: Record<string, string> = {
  common: 'border-[hsl(var(--color-rarity-common))]',
  rare: 'border-[hsl(var(--color-rarity-rare))]',
  epic: 'border-[hsl(var(--color-rarity-epic))]',
  legendary: 'border-[hsl(var(--color-rarity-legendary))]',
};

/* ------------------------------------------------------------------ */
/*  Lock icon SVG                                                      */
/* ------------------------------------------------------------------ */

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-4 h-4', className)}
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-4 h-4', className)}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar tile                                                        */
/* ------------------------------------------------------------------ */

interface AvatarTileProps {
  avatar: AvatarWithUnlockInfo;
  isSelected: boolean;
  isSelecting: boolean;
  onSelect: (avatarId: string) => void;
}

const AvatarTile = React.memo(function AvatarTile({
  avatar,
  isSelected,
  isSelecting,
  onSelect,
}: AvatarTileProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = useCallback(() => {
    if (!avatar.isUnlocked || isSelected || isSelecting) return;
    onSelect(avatar.id);
  }, [avatar.isUnlocked, avatar.id, isSelected, isSelecting, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const rarity = avatar.rarity as AvatarRarity;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        disabled={!avatar.isUnlocked || isSelecting}
        aria-label={
          avatar.isUnlocked
            ? isSelected
              ? `${avatar.name} (currently selected)`
              : `Select ${avatar.name} avatar`
            : `${avatar.name} — locked: ${avatar.unlockHint}`
        }
        className={cn(
          'relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          avatar.isUnlocked
            ? isSelected
              ? cn('border-primary bg-primary/10 shadow-md', rarityBorderHighlight[avatar.rarity])
              : 'border-border/40 bg-card/40 hover:border-border hover:bg-card/80 hover:shadow-sm cursor-pointer'
            : 'border-border/20 bg-muted/30 opacity-60 cursor-not-allowed',
        )}
      >
        {/* Avatar image */}
        <div className="relative">
          <UserAvatar
            avatarId={avatar.id}
            name={avatar.name}
            imageUrl={avatar.isUnlocked ? avatar.image_url : undefined}
            size="md"
            rarity={avatar.isUnlocked ? rarity : 'common'}
          />

          {/* Lock overlay for locked avatars */}
          {!avatar.isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
              <LockIcon className="text-muted-foreground" />
            </div>
          )}

          {/* Selected check badge */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <CheckIcon className="text-primary-foreground w-3 h-3" />
            </div>
          )}
        </div>

        {/* Name */}
        <span className="text-xs font-medium text-foreground truncate max-w-[72px]">
          {avatar.name}
        </span>

        {/* Rarity tag */}
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-wider',
            avatar.isUnlocked
              ? rarityLabelColor[avatar.rarity] ?? 'text-muted-foreground'
              : 'text-muted-foreground',
          )}
        >
          {avatar.rarity}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && !avatar.isUnlocked && (
        <div
          role="tooltip"
          className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs shadow-lg border border-border whitespace-nowrap pointer-events-none"
        >
          {avatar.unlockHint}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-popover border-r border-b border-border" />
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Main selector component                                            */
/* ------------------------------------------------------------------ */

interface AvatarSelectorProps {
  avatars: AvatarWithUnlockInfo[];
  selectedAvatarId: string | null;
  isSelecting: boolean;
  onSelect: (avatarId: string) => void;
  error: string | null;
}

const AvatarSelector = React.memo(function AvatarSelector({
  avatars,
  selectedAvatarId,
  isSelecting,
  onSelect,
  error,
}: AvatarSelectorProps) {
  const unlockedCount = avatars.filter((a) => a.isUnlocked).length;
  const totalCount = avatars.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Choose Your Avatar</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {unlockedCount}/{totalCount} unlocked
        </span>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isSelecting && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Updating avatar...
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {avatars.map((avatar) => (
          <AvatarTile
            key={avatar.id}
            avatar={avatar}
            isSelected={avatar.id === selectedAvatarId}
            isSelecting={isSelecting}
            onSelect={onSelect}
          />
        ))}
      </div>

      {totalCount === 0 && (
        <p className="text-center py-6 text-sm text-muted-foreground">
          No avatars available yet. Check back soon!
        </p>
      )}

      {unlockedCount < totalCount && (
        <p className="text-xs text-muted-foreground">
          Complete quests and earn points to unlock more avatars. Hover over locked avatars to see requirements.
        </p>
      )}
    </div>
  );
});

export default AvatarSelector;
