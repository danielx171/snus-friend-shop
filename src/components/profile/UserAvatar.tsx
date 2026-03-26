import React from 'react';
import { cn } from '@/lib/utils';

export type AvatarRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type AvatarSize = 'sm' | 'md' | 'lg';

interface UserAvatarProps {
  avatarId: string;
  name?: string;
  imageUrl?: string;
  size?: AvatarSize;
  rarity?: AvatarRarity;
  className?: string;
}

const sizeMap: Record<AvatarSize, { px: number; text: string; ring: string }> = {
  sm: { px: 32, text: 'text-xs',  ring: 'ring-2' },
  md: { px: 48, text: 'text-sm',  ring: 'ring-2' },
  lg: { px: 72, text: 'text-xl',  ring: 'ring-[3px]' },
};

// Rarity border colors are intentionally hardcoded — they are
// gamification-specific accent values not present in the design token system.
const rarityBorderColor: Record<AvatarRarity, string> = {
  common:    '#6b7280',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b',
};

const rarityBgColor: Record<AvatarRarity, string> = {
  common:    'bg-gray-500',
  rare:      'bg-blue-500',
  epic:      'bg-purple-500',
  legendary: 'bg-amber-500',
};

const UserAvatar = React.memo(function UserAvatar({
  avatarId,
  name,
  imageUrl,
  size = 'md',
  rarity = 'common',
  className,
}: UserAvatarProps) {
  const { px, text, ring } = sizeMap[size];
  const borderColor = rarityBorderColor[rarity];
  const fallbackLetter = name ? name.charAt(0).toUpperCase() : avatarId.charAt(0).toUpperCase();
  const isLegendary = rarity === 'legendary';

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0',
        ring,
        isLegendary && 'animate-pulse',
        className,
      )}
      style={{
        width: px,
        height: px,
        boxShadow: `0 0 0 ${size === 'lg' ? 3 : 2}px ${borderColor}`,
      }}
      aria-label={name ? `Avatar: ${name}` : `Avatar ${avatarId}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name ?? avatarId}
          width={px}
          height={px}
          className="object-cover w-full h-full"
          loading="lazy"
          onError={(e) => {
            // Fall back to letter circle on load failure
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement | null)?.removeAttribute('hidden');
          }}
        />
      ) : null}
      {/* Fallback colored circle — shown when no imageUrl or image fails */}
      <span
        hidden={!!imageUrl}
        className={cn(
          'absolute inset-0 flex items-center justify-center font-semibold text-white select-none',
          rarityBgColor[rarity],
          text,
        )}
        aria-hidden="true"
      >
        {fallbackLetter}
      </span>
    </div>
  );
});

export default UserAvatar;
