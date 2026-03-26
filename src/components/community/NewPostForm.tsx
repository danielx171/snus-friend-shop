import React, { useState, useCallback, memo } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ProductTagPicker, type TaggedProduct } from './ProductTagPicker';
import { PollCreator, type PollDraft } from './PollCreator';

export interface NewPostSubmitPayload {
  body: string;
  taggedProductIds: string[];
  poll?: PollDraft;
}

interface NewPostFormProps {
  onSubmit: (payload: NewPostSubmitPayload) => Promise<void>;
  isSubmitting: boolean;
  /** The current product page — excluded from tag search */
  excludeProductId?: string;
}

export const NewPostForm = memo(function NewPostForm({
  onSubmit,
  isSubmitting,
  excludeProductId,
}: NewPostFormProps) {
  const [body, setBody] = useState('');
  const [taggedProducts, setTaggedProducts] = useState<TaggedProduct[]>([]);
  const [pollDraft, setPollDraft] = useState<PollDraft | null>(null);
  const [pollKey, setPollKey] = useState(0);

  const handleSubmit = useCallback(async () => {
    const trimmed = body.trim();
    if (!trimmed || isSubmitting) return;
    await onSubmit({
      body: trimmed,
      taggedProductIds: taggedProducts.map((p) => p.id),
      poll: pollDraft ?? undefined,
    });
    setBody('');
    setTaggedProducts([]);
    setPollDraft(null);
    setPollKey((k) => k + 1); // force PollCreator remount to reset internal state
  }, [body, isSubmitting, onSubmit, taggedProducts, pollDraft]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleAddTag = useCallback((product: TaggedProduct) => {
    setTaggedProducts((prev) => {
      if (prev.length >= 3 || prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const handleRemoveTag = useCallback((productId: string) => {
    setTaggedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Textarea
          placeholder="Share your thoughts about this product..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] text-sm resize-none"
          maxLength={2000}
        />
        <Button
          size="sm"
          className="h-auto px-3 flex-shrink-0 self-end"
          onClick={handleSubmit}
          disabled={!body.trim() || isSubmitting}
          aria-label="Create post"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <ProductTagPicker
          selected={taggedProducts}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          excludeProductId={excludeProductId}
        />
        <PollCreator key={pollKey} onPollChange={setPollDraft} />
      </div>
    </div>
  );
});
