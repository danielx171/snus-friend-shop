import React, { useCallback } from 'react';
import { Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';
import type { AvatarRarity } from './UserAvatar';
import type { Avatar } from '@/hooks/useUserProfile';

interface AvatarGalleryProps {
  avatars: Avatar[];
  unlockedAvatarIds: string[];
  currentAvatarId: string | null;
  onSelect: (avatarId: string) => void;
}

// Rarity dot colors match UserAvatar's rarityBorderColor values
const rarityDotClass: Record<string, string> = {
  common:    'bg-gray-500',
  rare:      'bg-blue-500',
  epic:      'bg-purple-500',
  legendary: 'bg-amber-500',
};

const rarityLabel: Record<string, string> = {
  common:    'Common',
  rare:      'Rare',
  epic:      'Epic',
  legendary: 'Legendary',
};

function unlockProgressText(avatar: Avatar): string {
  const threshold = avatar.unlock_threshold;
  if (!threshold) return 'Locked';

  switch (avatar.unlock_type) {
    case 'orders':
      return `${threshold} order${threshold !== 1 ? 's' : ''} needed`;
    case 'reviews':
      return `${threshold} review${threshold !== 1 ? 's' : ''} needed`;
    case 'points':
      return `${threshold} SnusPoints needed`;
    case 'spin':
      return 'Win from spin wheel';
    default:
      return `${threshold} ${avatar.unlock_type} needed`;
  }
}

const AvatarGallery = React.memo(function AvatarGallery({
  avatars,
  unlockedAvatarIds,
  currentAvatarId,
  onSelect,
}: AvatarGalleryProps) {
  const handleSelect = useCallback(
    (avatarId: string) => {
      onSelect(avatarId);
    },
    [onSelect],
  );

  if (avatars.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No avatars available yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {avatars.map((avatar) => {
        const isUnlocked = unlockedAvatarIds.includes(avatar.id);
        const isEquipped = avatar.id === currentAvatarId;
        const rarity = (avatar.rarity as AvatarRarity) ?? 'common';
        const dotClass = rarityDotClass[rarity] ?? rarityDotClass.common;

        return (
          <div key={avatar.id} className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              aria-label={
                isEquipped
                  ? `${avatar.name} — equipped`
                  : isUnlocked
                    ? `Equip ${avatar.name}`
                    : `${avatar.name} — locked`
              }
              disabled={!isUnlocked}
              onClick={() => isUnlocked && handleSelect(avatar.id)}
              className={cn(
                'relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform',
                isUnlocked && !isEquipped && 'hover:scale-105 cursor-pointer',
                isEquipped && 'cursor-default',
                !isUnlocked && 'cursor-not-allowed',
              )}
            >
              {/* Greyscale filter for locked avatars */}
              <span className={cn(!isUnlocked && 'grayscale opacity-50')}>
                <UserAvatar
                  avatarId={avatar.id}
                  name={avatar.name}
                  imageUrl={avatar.image_url || undefined}
                  size="md"
                  rarity={isUnlocked ? rarity : 'common'}
                />
              </span>

              {/* Equipped checkmark */}
              {isEquipped && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                  aria-hidden="true"
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}

              {/* Locked overlay */}
              {!isUnlocked && (
                <span
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <Lock className="h-4 w-4 text-muted-foreground drop-shadow" />
                </span>
              )}
            </button>

            {/* Rarity badge */}
            <span className="flex items-center gap-1">
              <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotClass)} aria-hidden="true" />
              <span className="text-[10px] text-muted-foreground leading-none">
                {rarityLabel[rarity] ?? rarity}
              </span>
            </span>

            {/* Avatar name */}
            <span className="text-[11px] font-medium text-foreground text-center leading-tight line-clamp-1 w-full px-0.5">
              {avatar.name}
            </span>

            {/* Progress text for locked avatars */}
            {!isUnlocked && (
              <span className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2 w-full px-0.5">
                {unlockProgressText(avatar)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default AvatarGallery;
