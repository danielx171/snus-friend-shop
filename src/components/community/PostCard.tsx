import React, { useState, useCallback, memo } from 'react';
import { Heart, MessageCircle, Trash2, Send, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { CommunityPost } from '@/hooks/useCommunityPosts';
import type { CommunityComment } from '@/hooks/useCommunityComments';
import { useCommunityComments } from '@/hooks/useCommunityComments';
import { PollCard } from './PollCard';
import type { PollData } from '@/hooks/useCommunityPolls';
import { ReputationBadge } from '@/components/gamification/ReputationBadge';

const SUPABASE_STORAGE_HOST = 'bozdnoctcszbhemdjsek.supabase.co';

function isSafePhotoUrl(url: string | null): url is string {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === SUPABASE_STORAGE_HOST;
  } catch {
    return false;
  }
}

interface PostCardProps {
  post: CommunityPost;
  poll: PollData | null;
  currentUserId: string | null;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onVote: (pollId: string, optionId: string) => void;
  isVoting: boolean;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const CommentItem = memo(function CommentItem({ comment }: { comment: CommunityComment }) {
  const initials = (comment.profile?.display_name ?? 'U').slice(0, 2).toUpperCase();

  return (
    <div className="flex gap-2 py-2">
      <Avatar className="h-6 w-6 flex-shrink-0">
        <AvatarFallback className="text-[10px] bg-muted">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium truncate">
            {comment.profile?.display_name ?? 'Anonymous'}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 break-words">{comment.body}</p>
      </div>
    </div>
  );
});

export const PostCard = memo(function PostCard({
  post,
  poll,
  currentUserId,
  onLike,
  onDelete,
  onVote,
  isVoting,
}: PostCardProps) {
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { comments, isLoading: commentsLoading, addComment, isSubmitting } = useCommunityComments(
    showComments ? post.id : undefined,
  );

  const initials = (post.profile?.display_name ?? 'U').slice(0, 2).toUpperCase();
  const isOwner = currentUserId === post.user_id;

  const handleLike = useCallback(() => onLike(post.id), [onLike, post.id]);
  const handleDelete = useCallback(() => onDelete(post.id), [onDelete, post.id]);
  const toggleComments = useCallback(() => setShowComments((v) => !v), []);

  const handleSubmitComment = useCallback(async () => {
    const trimmed = commentText.trim();
    if (!trimmed || isSubmitting) return;
    try {
      await addComment(post.id, trimmed);
      setCommentText('');
    } catch {
      toast({ title: 'Failed to post comment', description: 'Please try again.', variant: 'destructive' });
    }
  }, [commentText, isSubmitting, addComment, post.id, toast]);

  const handleCommentKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmitComment();
      }
    },
    [handleSubmitComment],
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {post.profile?.display_name ?? 'Anonymous'}
              </span>
              <ReputationBadge levelName="" badgeColor="gray" size="sm" />
              {post.pinned && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Pinned
                </Badge>
              )}
              <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                {formatRelativeTime(post.created_at)}
              </span>
            </div>
            <p className="text-sm mt-1 break-words whitespace-pre-wrap">{post.body}</p>

            {isSafePhotoUrl(post.photo_url) && (
              <img
                src={post.photo_url}
                alt="Post attachment"
                className="mt-2 rounded-md max-h-64 object-cover"
                loading="lazy"
              />
            )}

            {/* Tagged products */}
            {post.tagged_products.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {post.tagged_products.map((tp) => (
                  <Link
                    key={tp.id}
                    to={`/product/${tp.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    <span className="max-w-[120px] truncate">{tp.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Poll */}
            {poll && (
              <PollCard
                poll={poll}
                currentUserId={currentUserId}
                onVote={onVote}
                isVoting={isVoting}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3 ml-11">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 gap-1.5 text-xs ${post.liked_by_me ? 'text-red-500' : 'text-muted-foreground'}`}
            onClick={handleLike}
            aria-label={post.liked_by_me ? 'Unlike post' : 'Like post'}
          >
            <Heart className={`h-3.5 w-3.5 ${post.liked_by_me ? 'fill-current' : ''}`} />
            {post.likes_count > 0 && post.likes_count}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 gap-1.5 text-xs text-muted-foreground"
            onClick={toggleComments}
            aria-label="Toggle comments"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {post.comments_count > 0 && post.comments_count}
          </Button>

          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive ml-auto"
              onClick={handleDelete}
              aria-label="Delete post"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-3 ml-11 border-t pt-3">
            {commentsLoading ? (
              <p className="text-xs text-muted-foreground">Loading comments...</p>
            ) : (
              <>
                {comments.map((c) => (
                  <CommentItem key={c.id} comment={c} />
                ))}
                {comments.length === 0 && (
                  <p className="text-xs text-muted-foreground py-1">No comments yet</p>
                )}
              </>
            )}

            {/* Comment input */}
            {currentUserId && (
              <div className="flex gap-2 mt-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  className="min-h-[36px] h-9 py-2 text-sm resize-none"
                  maxLength={500}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 px-2 flex-shrink-0"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || isSubmitting}
                  aria-label="Send comment"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
