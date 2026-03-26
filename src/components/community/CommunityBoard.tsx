import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Users, MessageSquare, BarChart3, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useCommunityPolls } from '@/hooks/useCommunityPolls';
import { PostCard } from './PostCard';
import { NewPostForm, type NewPostSubmitPayload } from './NewPostForm';

interface CommunityBoardProps {
  productId: string;
}

export const CommunityBoard = memo(function CommunityBoard({ productId }: CommunityBoardProps) {
  const { toast } = useToast();
  const { posts, isLoading, createPost, toggleLike, deletePost, isCreating } =
    useCommunityPosts(productId);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const postIds = useMemo(() => posts.map((p) => p.id), [posts]);
  const { pollMap, castVote, isVoting } = useCommunityPolls(postIds);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleCreatePost = useCallback(
    async (payload: NewPostSubmitPayload) => {
      if (!currentUserId) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to post.',
          variant: 'destructive',
        });
        return;
      }
      try {
        await createPost({
          product_id: productId,
          body: payload.body,
          ...(payload.taggedProductIds.length > 0 ? { tagged_product_ids: payload.taggedProductIds } : {}),
          ...(payload.poll ? { poll: payload.poll } : {}),
        });
      } catch {
        toast({
          title: 'Failed to create post',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    },
    [currentUserId, createPost, productId, toast],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      if (!currentUserId) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to like posts.',
          variant: 'destructive',
        });
        return;
      }
      try {
        await toggleLike(postId);
      } catch {
        toast({
          title: 'Failed to update like',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    },
    [currentUserId, toggleLike, toast],
  );

  const handleVote = useCallback(
    async (pollId: string, optionId: string) => {
      if (!currentUserId) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to vote.',
          variant: 'destructive',
        });
        return;
      }
      try {
        await castVote(pollId, optionId);
      } catch {
        toast({
          title: 'Failed to cast vote',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    },
    [currentUserId, castVote, toast],
  );

  const handleDelete = useCallback(
    async (postId: string) => {
      try {
        await deletePost(postId);
        toast({ title: 'Post deleted' });
      } catch {
        toast({
          title: 'Failed to delete post',
          description: 'Please try again.',
          variant: 'destructive',
        });
      }
    },
    [deletePost, toast],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* New post form — shown to authenticated users */}
      {currentUserId ? (
        <NewPostForm onSubmit={handleCreatePost} isSubmitting={isCreating} excludeProductId={productId} />
      ) : (
        <div className="rounded-lg border bg-muted/20 p-5 text-center space-y-3">
          <Users className="h-8 w-8 text-primary/60 mx-auto" />
          <div>
            <p className="text-sm font-medium">Join the conversation</p>
            <p className="text-xs text-muted-foreground mt-1">
              Share thoughts, create polls, and tag products
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />Discuss</span>
            <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" />Polls</span>
            <span className="flex items-center gap-1"><Tag className="h-3 w-3" />Tag products</span>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link to="/login">Sign in to post</Link>
          </Button>
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm font-semibold text-foreground mb-1">The board is fresh</p>
          <p className="text-xs text-muted-foreground">Start a conversation with the Snus Family</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            poll={pollMap[post.id] ?? null}
            currentUserId={currentUserId}
            onLike={handleLike}
            onDelete={handleDelete}
            onVote={handleVote}
            isVoting={isVoting}
          />
        ))
      )}
    </div>
  );
});
