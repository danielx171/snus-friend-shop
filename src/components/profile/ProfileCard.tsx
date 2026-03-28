import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from './UserAvatar';
import type { AvatarRarity } from './UserAvatar';
import type { Avatar, UserProfile, UpdateProfilePayload } from '@/hooks/useUserProfile';
import { ReputationBadge } from '@/components/gamification/ReputationBadge';
import { useReputation } from '@/hooks/useReputation';

const BIO_MAX = 160;

interface ProfileStats {
  ordersCount: number;
  reviewsCount: number;
  snusPoints: number;
}

interface ProfileCardProps {
  profile: UserProfile | null;
  avatarData: Avatar | null;
  stats?: ProfileStats;
  onSave: (updates: UpdateProfilePayload) => Promise<void>;
}

const ProfileCard = React.memo(function ProfileCard({
  profile,
  avatarData,
  stats,
  onSave,
}: ProfileCardProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  // Sync state when profile loads / changes
  useEffect(() => {
    setDisplayName(profile?.display_name ?? '');
    setBio(profile?.bio ?? '');
  }, [profile?.display_name, profile?.bio]);

  const handleBioChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value.slice(0, BIO_MAX));
  }, []);

  const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
  }, []);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    setSaveError('');
    try {
      await onSave({
        display_name: displayName.trim() || undefined,
        bio: bio.trim() || null,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    }
  }, [onSave, displayName, bio]);

  const { data: reputation } = useReputation(profile?.user_id ?? null);

  const rarity = (avatarData?.rarity as AvatarRarity | undefined) ?? 'common';
  const isDirty =
    displayName.trim() !== (profile?.display_name ?? '').trim() ||
    bio.trim() !== (profile?.bio ?? '').trim();

  return (
    <Card className="border-border/30">
      <CardContent className="pt-6 space-y-6">
        {/* Avatar + display name row */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <UserAvatar
              avatarId={avatarData?.id ?? 'default'}
              name={avatarData?.name ?? displayName}
              imageUrl={avatarData?.image_url || undefined}
              size="lg"
              rarity={rarity}
            />
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="profile-display-name">Display name</Label>
                <ReputationBadge
                  levelName={reputation?.levelName ?? ''}
                  badgeColor={reputation?.badgeColor ?? 'gray'}
                />
              </div>
              <Input
                id="profile-display-name"
                placeholder="Choose a display name"
                value={displayName}
                onChange={handleDisplayNameChange}
                maxLength={60}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-bio">Bio</Label>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {bio.length}/{BIO_MAX}
                </span>
              </div>
              <Textarea
                id="profile-bio"
                placeholder="Tell the community a bit about yourself…"
                value={bio}
                onChange={handleBioChange}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/20 bg-muted/20 p-3">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-semibold text-foreground tabular-nums">
              {stats?.ordersCount ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Orders</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 border-x border-border/20">
            <span className="text-lg font-semibold text-foreground tabular-nums">
              {stats?.reviewsCount ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">Reviews</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-semibold text-primary tabular-nums">
              {stats?.snusPoints ?? 0}
            </span>
            <span className="text-xs text-muted-foreground">SnusPoints</span>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || !isDirty}
          >
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'saved'
                ? 'Saved!'
                : 'Save Profile'}
          </Button>
          {saveStatus === 'error' && (
            <p className="text-xs text-destructive">{saveError}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default ProfileCard;
