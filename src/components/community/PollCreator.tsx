import React, { useState, useCallback, memo } from 'react';
import { BarChart3, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface PollDraft {
  question: string;
  options: string[];
}

interface PollCreatorProps {
  onPollChange: (poll: PollDraft | null) => void;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

export const PollCreator = memo(function PollCreator({ onPollChange }: PollCreatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const syncPoll = useCallback(
    (q: string, opts: string[]) => {
      const trimmedQ = q.trim();
      const validOpts = opts.map((o) => o.trim()).filter(Boolean);
      if (trimmedQ && validOpts.length >= MIN_OPTIONS) {
        onPollChange({ question: trimmedQ, options: validOpts });
      } else {
        onPollChange(null);
      }
    },
    [onPollChange],
  );

  const handleQuestionChange = useCallback(
    (value: string) => {
      setQuestion(value);
      syncPoll(value, options);
    },
    [options, syncPoll],
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      const next = [...options];
      next[index] = value;
      setOptions(next);
      syncPoll(question, next);
    },
    [options, question, syncPoll],
  );

  const addOption = useCallback(() => {
    setOptions((prev) => {
      if (prev.length >= MAX_OPTIONS) return prev;
      return [...prev, ''];
    });
  }, []);

  const removeOption = useCallback(
    (index: number) => {
      setOptions((prev) => {
        if (prev.length <= MIN_OPTIONS) return prev;
        const next = prev.filter((_, i) => i !== index);
        syncPoll(question, next);
        return next;
      });
    },
    [question, syncPoll],
  );

  const handleToggle = useCallback(() => {
    if (isOpen) {
      // Close and clear
      setIsOpen(false);
      setQuestion('');
      setOptions(['', '']);
      onPollChange(null);
    } else {
      setIsOpen(true);
    }
  }, [isOpen, onPollChange]);

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 px-2 gap-1 text-xs text-muted-foreground"
        onClick={handleToggle}
        aria-label="Add a poll"
      >
        <BarChart3 className="h-3.5 w-3.5" />
        Poll
      </Button>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          Create Poll
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0"
          onClick={handleToggle}
          aria-label="Remove poll"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Input
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => handleQuestionChange(e.target.value)}
        className="h-8 text-xs"
        maxLength={200}
      />

      <div className="space-y-1.5">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-1">
            <Input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              className="h-7 text-xs flex-1"
              maxLength={100}
            />
            {options.length > MIN_OPTIONS && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex-shrink-0"
                onClick={() => removeOption(i)}
                aria-label={`Remove option ${i + 1}`}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {options.length < MAX_OPTIONS && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 gap-1 text-xs text-muted-foreground"
          onClick={addOption}
          aria-label="Add another option"
        >
          <Plus className="h-3 w-3" />
          Add option
        </Button>
      )}
    </div>
  );
});
