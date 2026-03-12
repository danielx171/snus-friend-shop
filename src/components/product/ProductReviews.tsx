import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Mock data ── */
const mockReviews = [
  {
    id: '1',
    author: 'Marcus L.',
    initials: 'ML',
    rating: 5,
    date: 'Feb 28, 2026',
    title: 'Best mint pouch I have tried',
    text: 'Smooth flavour that lasts a long time. The slim format fits perfectly and the nicotine release is just right. Will definitely reorder.',
    helpful: 14,
  },
  {
    id: '2',
    author: 'Sophie T.',
    initials: 'ST',
    rating: 4,
    date: 'Feb 15, 2026',
    title: 'Great quality, slight dryness',
    text: 'Really enjoy the taste and strength. Only minor complaint is it can feel a bit dry after 20 minutes, but overall a solid choice.',
    helpful: 8,
  },
  {
    id: '3',
    author: 'Daniel K.',
    initials: 'DK',
    rating: 5,
    date: 'Jan 30, 2026',
    title: 'My daily go-to',
    text: 'Switched from another brand and have not looked back. The flavour is clean and the pouches are comfortable. 10-pack pricing is excellent value.',
    helpful: 21,
  },
  {
    id: '4',
    author: 'Emma R.',
    initials: 'ER',
    rating: 3,
    date: 'Jan 12, 2026',
    title: 'Decent but expected more',
    text: 'Flavour is nice but fades quicker than I would like. Format is comfortable though and shipping was fast.',
    helpful: 3,
  },
];

const ratingDistribution = [
  { stars: 5, count: 210 },
  { stars: 4, count: 87 },
  { stars: 3, count: 28 },
  { stars: 2, count: 12 },
  { stars: 1, count: 5 },
];

const totalReviews = ratingDistribution.reduce((s, r) => s + r.count, 0);
const avgRating =
  ratingDistribution.reduce((s, r) => s + r.stars * r.count, 0) / totalReviews;

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

/* ── Main component ── */
export function ProductReviews() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);

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
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setDialogOpen(false);
              }}
            >
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <StarPicker value={newRating} onChange={setNewRating} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-title">Title</Label>
                <Input id="review-title" placeholder="Summarise your experience" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-body">Review</Label>
                <Textarea
                  id="review-body"
                  placeholder="What did you like or dislike?"
                  rows={4}
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
                <Button type="submit">Submit Review</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Aggregate summary ── */}
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          {/* Big number */}
          <div className="flex flex-col items-center gap-2 sm:min-w-[140px]">
            <span className="text-5xl font-bold tracking-tight text-foreground">
              {avgRating.toFixed(1)}
            </span>
            <Stars rating={avgRating} size="md" />
            <span className="text-sm text-muted-foreground">
              {totalReviews} reviews
            </span>
          </div>

          <Separator orientation="vertical" className="hidden h-24 sm:block" />
          <Separator className="sm:hidden" />

          {/* Distribution bars */}
          <div className="flex-1 space-y-2">
            {ratingDistribution.map((row) => {
              const pct = totalReviews > 0 ? (row.count / totalReviews) * 100 : 0;
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

      {/* ── Review list ── */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 shrink-0 border border-border">
                  <AvatarFallback className="bg-secondary text-sm font-medium text-secondary-foreground">
                    {review.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {review.author}
                      </p>
                      <Stars rating={review.rating} />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.date}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-foreground">
                    {review.title}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {review.text}
                  </p>

                  <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
