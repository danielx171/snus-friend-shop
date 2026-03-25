import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Heart, MessageSquare, Flag, ArrowUpDown, Check, X, Plus, Camera, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductReviews, type ProductReview } from '@/hooks/useProductReviews';
import { useReviewLikes } from '@/hooks/useReviewLikes';
import { useUsersAttributes, type UserAttribute } from '@/hooks/useUserAttributes';
import UserAvatar from '@/components/profile/UserAvatar';
import AttributePills from '@/components/profile/AttributePills';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';
import { useReviewSummary } from '@/hooks/useReviewSummary';
import ReviewSummaryCard from '@/components/product/ReviewSummaryCard';
import { useReviewPhotoUpload } from '@/hooks/useReviewPhotoUpload';
import { useToast } from '@/hooks/use-toast';

type ReviewSortOption = 'relevant' | 'newest' | 'highest' | 'helpful';

function sortReviews(reviews: ProductReview[], sort: ReviewSortOption): ProductReview[] {
  const sorted = [...reviews];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'highest':
      return sorted.sort((a, b) => b.rating - a.rating || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'helpful':
      return sorted.sort((a, b) => b.helpful_count - a.helpful_count || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'relevant':
    default: {
      // Weighted combo: helpful votes + recency bonus (reviews from last 30 days get a boost)
      const now = Date.now();
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      return sorted.sort((a, b) => {
        const recencyA = Math.max(0, 1 - (now - new Date(a.created_at).getTime()) / thirtyDays);
        const recencyB = Math.max(0, 1 - (now - new Date(b.created_at).getTime()) / thirtyDays);
        const scoreA = a.helpful_count * 2 + recencyA * 3 + a.rating * 0.5;
        const scoreB = b.helpful_count * 2 + recencyB * 3 + b.rating * 0.5;
        return scoreB - scoreA;
      });
    }
  }
}

/* ── Stars helper ── */
function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const dim = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            dim,
            i < Math.round(rating)
              ? 'fill-primary text-primary'
              : 'fill-muted text-muted-foreground/30',
          )}
        />
      ))}
    </div>
  );
}

/* ── Star picker for modal ── */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                'h-7 w-7',
                (hover || value) >= star
                  ? 'fill-primary text-primary'
                  : 'fill-muted text-muted-foreground/30',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ── Single review card ── */
const ReviewCard = React.memo(function ReviewCard({
  review,
  onFlag,
  liked,
  onToggleLike,
  userAttributes,
}: {
  review: ProductReview;
  onFlag: (id: string) => void;
  liked: boolean;
  onToggleLike: (id: string) => void;
  userAttributes: UserAttribute[];
}) {
  const dateStr = new Date(review.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const displayName = review.profile?.display_name ?? 'Anonymous';
  const avatarId = review.profile?.avatar_id ?? review.user_id;
  const imageUrl = review.profile?.avatar_image_url ?? undefined;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <UserAvatar
            avatarId={avatarId}
            name={displayName}
            imageUrl={imageUrl}
            size="sm"
            rarity="common"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{displayName}</p>
                  {/* Verified Buyer badge — shown for all reviews (only logged-in users can review) */}
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    Verified Buyer
                  </span>
                </div>
                <AttributePills attributes={userAttributes} maxVisible={3} />
                <Stars rating={review.rating} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{dateStr}</span>
                <button
                  type="button"
                  onClick={() => onFlag(review.id)}
                  aria-label={`Report review by ${displayName}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground/50 transition-colors hover:text-destructive"
                  title="Report this review"
                >
                  <Flag className="h-3 w-3" />
                </button>
              </div>
            </div>

            <p className="text-sm font-medium text-foreground">{review.title}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{review.body}</p>

            {(review.pros.length > 0 || review.cons.length > 0) && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-6">
                {review.pros.length > 0 && (
                  <div className="space-y-0.5">
                    {review.pros.map((pro, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                        <Check className="h-3 w-3 shrink-0" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                )}
                {review.cons.length > 0 && (
                  <div className="space-y-0.5">
                    {review.cons.map((con, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                        <X className="h-3 w-3 shrink-0" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {review.photo_urls.length > 0 && (
              <div className="flex gap-2 pt-1">
                {review.photo_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-16 w-16 overflow-hidden rounded-md border border-border transition-opacity hover:opacity-80"
                  >
                    <img
                      src={url}
                      alt={`Review photo ${i + 1} by ${displayName}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onToggleLike(review.id)}
              className={cn(
                'inline-flex items-center gap-1.5 text-xs transition-colors',
                liked
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary',
              )}
              aria-label={liked ? `Unlike this review (${review.helpful_count} likes)` : `Like this review (${review.helpful_count} likes)`}
            >
              <Heart className={cn('h-3.5 w-3.5', liked && 'fill-primary')} />
              {review.helpful_count > 0
                ? `${review.helpful_count} ${review.helpful_count === 1 ? 'like' : 'likes'}`
                : 'Like'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

/* ── Main component ── */
interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newPros, setNewPros] = useState<string[]>([]);
  const [newCons, setNewCons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<ReviewSortOption>('relevant');
  const { toast } = useToast();

  const { reviews, avgRating, totalCount, distribution, isLoading, submitReview, flagReview } =
    useProductReviews(productId);
  const { likedIds, toggleLike } = useReviewLikes(productId);
  const { data: reviewSummary, isLoading: summaryLoading } = useReviewSummary(productId, totalCount);
  const reviewerIds = useMemo(() => reviews.map((r) => r.user_id), [reviews]);
  const { data: usersAttributesMap } = useUsersAttributes(reviewerIds);
  const { photos, uploading, addPhotos, removePhoto, clearPhotos, uploadAll, canAddMore } = useReviewPhotoUpload();

  const handleToggleLike = useCallback(async (reviewId: string) => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user?.id) {
      toast({ title: 'Sign in required', description: 'Please sign in to like reviews.', variant: 'destructive' });
      return;
    }
    toggleLike(reviewId);
  }, [toggleLike, toast]);

  const sortedReviews = useMemo(() => sortReviews(reviews, sortBy), [reviews, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newTitle.trim() || !newBody.trim()) return;

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) {
      toast({ title: 'Sign in required', description: 'Please sign in to leave a review.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    let photoUrls: string[] = [];
    try {
      const prosFiltered = newPros.map(s => s.trim()).filter(Boolean);
      const consFiltered = newCons.map(s => s.trim()).filter(Boolean);

      // Upload photos first (if any)
      photoUrls = await uploadAll(userId);

      await submitReview({
        product_id: productId,
        user_id: userId,
        rating: newRating,
        title: newTitle.trim(),
        body: newBody.trim(),
        ...(prosFiltered.length ? { pros: prosFiltered } : {}),
        ...(consFiltered.length ? { cons: consFiltered } : {}),
        ...(photoUrls.length ? { photo_urls: photoUrls } : {}),
      });
      toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
      // Fire-and-forget quest progress + avatar unlock checks
      apiFetch('update-quest-progress', { method: 'POST', body: { action: 'review' } }).catch(() => {});
      apiFetch('check-avatar-unlocks', { method: 'POST' }).catch(() => {});
      setDialogOpen(false);
      setNewRating(0);
      setNewTitle('');
      setNewBody('');
      setNewPros([]);
      setNewCons([]);
      clearPhotos();
    } catch {
      // Clean up orphaned photos if upload succeeded but DB write failed
      if (photoUrls.length > 0) {
        const paths = photoUrls.map((url) => {
          const parts = url.split('/review-photos/');
          return parts[1];
        }).filter(Boolean);
        if (paths.length) {
          supabase.storage.from('review-photos').remove(paths).catch(() => {});
        }
      }
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlag = useCallback(async (reviewId: string) => {
    try {
      await flagReview(reviewId);
      toast({ title: 'Review reported', description: 'Thank you — we will look into it.' });
    } catch {
      toast({ title: 'Could not report review', description: 'Please try again.', variant: 'destructive' });
    }
  }, [flagReview, toast]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          Customer Reviews
        </h2>

        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) clearPhotos(); setDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">Write a Review</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <StarPicker value={newRating} onChange={setNewRating} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-title">Title</Label>
                <Input
                  id="review-title"
                  placeholder="Summarise your experience"
                  maxLength={100}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-body">Review</Label>
                <Textarea
                  id="review-body"
                  placeholder="What did you like or dislike?"
                  rows={4}
                  maxLength={1000}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                />
              </div>
              {/* Pros */}
              <div className="space-y-2">
                <Label>Pros (optional)</Label>
                <div className="space-y-1.5">
                  {newPros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                      <Input
                        value={pro}
                        aria-label={`Pro ${i + 1}`}
                        onChange={(e) => {
                          const updated = [...newPros];
                          updated[i] = e.target.value;
                          setNewPros(updated);
                        }}
                        placeholder="What did you like?"
                        maxLength={100}
                        className="h-8 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setNewPros(newPros.filter((_, j) => j !== i))}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove pro ${i + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {newPros.length < 5 && (
                    <button
                      type="button"
                      onClick={() => setNewPros([...newPros, ''])}
                      disabled={newPros.length > 0 && !newPros[newPros.length - 1]?.trim()}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" /> Add a pro
                    </button>
                  )}
                </div>
              </div>

              {/* Cons */}
              <div className="space-y-2">
                <Label>Cons (optional)</Label>
                <div className="space-y-1.5">
                  {newCons.map((con, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                      <Input
                        value={con}
                        aria-label={`Con ${i + 1}`}
                        onChange={(e) => {
                          const updated = [...newCons];
                          updated[i] = e.target.value;
                          setNewCons(updated);
                        }}
                        placeholder="What could be better?"
                        maxLength={100}
                        className="h-8 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setNewCons(newCons.filter((_, j) => j !== i))}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove con ${i + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {newCons.length < 5 && (
                    <button
                      type="button"
                      onClick={() => setNewCons([...newCons, ''])}
                      disabled={newCons.length > 0 && !newCons[newCons.length - 1]?.trim()}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-3 w-3" /> Add a con
                    </button>
                  )}
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-2">
                <Label>Photos (optional, max 3)</Label>
                <div className="flex flex-wrap gap-2">
                  {photos.map((photo, i) => (
                    <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-md border border-border">
                      <img
                        src={photo.previewUrl}
                        alt={`Upload preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {canAddMore && (
                    <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                      <Camera className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.files?.length) {
                            const errors = addPhotos(e.target.files);
                            if (errors.length) {
                              toast({ title: 'Photo error', description: errors.join(' '), variant: 'destructive' });
                            }
                          }
                          e.target.value = '';
                        }}
                        aria-label="Add review photos"
                      />
                    </label>
                  )}
                </div>
                {photos.length > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    {photos.length}/3 photos · JPEG, PNG, or WebP · Max 5 MB each
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || uploading || newRating === 0 || !newTitle.trim() || !newBody.trim()}
                >
                  {uploading ? 'Uploading photos…' : submitting ? 'Submitting…' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Aggregate summary ── */}
      {(totalCount > 0 || isLoading) && (
        <Card>
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            {/* Big number */}
            <div className="flex flex-col items-center gap-2 sm:min-w-[140px]">
              <span className="text-5xl font-bold tracking-tight text-foreground">
                {isLoading ? '—' : avgRating.toFixed(1)}
              </span>
              <Stars rating={avgRating} size="md" />
              <span className="text-sm text-muted-foreground">
                {isLoading ? '…' : `${totalCount} ${totalCount === 1 ? 'review' : 'reviews'}`}
              </span>
            </div>

            <Separator orientation="vertical" className="hidden h-24 sm:block" />
            <Separator className="sm:hidden" />

            {/* Distribution bars */}
            <div className="flex-1 space-y-2">
              {distribution.map((row) => {
                const pct = totalCount > 0 ? (row.count / totalCount) * 100 : 0;
                return (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-6 text-right text-sm font-medium text-foreground">
                      {row.stars}
                    </span>
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <Progress value={pct} className="h-2 flex-1" />
                    <span className="w-8 text-right text-xs text-muted-foreground">
                      {row.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── AI Summary ── */}
      {(summaryLoading || reviewSummary) && (
        <ReviewSummaryCard
          summaryText={reviewSummary?.summary_text}
          generatedAt={reviewSummary?.generated_at}
          isLoading={summaryLoading}
        />
      )}

      {/* ── Empty state ── */}
      {!isLoading && totalCount === 0 && (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}

      {/* ── Sort dropdown + Review list ── */}
      {!isLoading && reviews.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as ReviewSortOption)}>
              <SelectTrigger className="w-[170px]" aria-label="Sort reviews">
                <ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onFlag={handleFlag}
                liked={likedIds.has(review.id)}
                onToggleLike={handleToggleLike}
                userAttributes={usersAttributesMap?.get(review.user_id) ?? []}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
