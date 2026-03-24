import React, { useState } from 'react';
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
import { Star, ThumbsUp, MessageSquare, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProductReviews, type ProductReview } from '@/hooks/useProductReviews';
import UserAvatar from '@/components/profile/UserAvatar';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
}: {
  review: ProductReview;
  onFlag: (id: string) => void;
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

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`${review.helpful_count} people found this review helpful`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful ({review.helpful_count})
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
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const { reviews, avgRating, totalCount, distribution, isLoading, submitReview, flagReview } =
    useProductReviews(productId);

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
    try {
      await submitReview({ product_id: productId, user_id: userId, rating: newRating, title: newTitle.trim(), body: newBody.trim() });
      toast({ title: 'Review submitted', description: 'Thank you for your feedback!' });
      // Fire-and-forget quest progress + avatar unlock checks
      apiFetch('update-quest-progress', { method: 'POST', body: { action: 'review' } }).catch(() => {});
      apiFetch('check-avatar-unlocks', { method: 'POST' }).catch(() => {});
      setDialogOpen(false);
      setNewRating(0);
      setNewTitle('');
      setNewBody('');
    } catch {
      toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlag = async (reviewId: string) => {
    try {
      await flagReview(reviewId);
      toast({ title: 'Review reported', description: 'Thank you — we will look into it.' });
    } catch {
      toast({ title: 'Could not report review', description: 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          Customer Reviews
        </h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  disabled={submitting || newRating === 0 || !newTitle.trim() || !newBody.trim()}
                >
                  {submitting ? 'Submitting…' : 'Submit Review'}
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

      {/* ── Empty state ── */}
      {!isLoading && totalCount === 0 && (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Be the first to share your thoughts!
        </p>
      )}

      {/* ── Review list ── */}
      {!isLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} onFlag={handleFlag} />
          ))}
        </div>
      )}
    </section>
  );
}
