import React, { useCallback, memo } from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PollData } from '@/hooks/useCommunityPolls';

interface PollCardProps {
  poll: PollData;
  currentUserId: string | null;
  onVote: (pollId: string, optionId: string) => void;
  isVoting: boolean;
}

function formatTimeLeft(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return 'Ended';
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return `${Math.ceil(diff / 60_000)}m left`;
  if (hours < 24) return `${hours}h left`;
  return `${Math.floor(hours / 24)}d left`;
}

export const PollCard = memo(function PollCard({
  poll,
  currentUserId,
  onVote,
  isVoting,
}: PollCardProps) {
  const hasVoted = poll.options.some((o) => o.voted_by_me);
  const showResults = hasVoted || poll.has_ended;

  const handleVote = useCallback(
    (optionId: string) => {
      onVote(poll.id, optionId);
    },
    [onVote, poll.id],
  );

  return (
    <div className="mt-2 rounded-lg border bg-muted/30 p-3">
      {/* Question */}
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart3 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        <span className="text-sm font-medium">{poll.question}</span>
      </div>

      {/* Options */}
      <div className="space-y-1.5">
        {poll.options.map((option) => {
          const percentage =
            poll.total_votes > 0
              ? Math.round((option.votes_count / poll.total_votes) * 100)
              : 0;

          if (showResults) {
            return (
              <div key={option.id} className="relative">
                <div
                  className="absolute inset-0 rounded-md bg-primary/10 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
                <button
                  type="button"
                  className={`relative flex items-center justify-between w-full rounded-md px-3 py-1.5 text-xs transition-colors ${
                    option.voted_by_me
                      ? 'font-semibold text-primary'
                      : 'text-foreground'
                  } ${!poll.has_ended && currentUserId ? 'hover:bg-accent/30 cursor-pointer' : ''}`}
                  onClick={() => !poll.has_ended && currentUserId && handleVote(option.id)}
                  disabled={poll.has_ended || !currentUserId || isVoting}
                  aria-label={`${option.label} — ${percentage}% (${option.votes_count} votes)${option.voted_by_me ? ', your vote' : ''}`}
                >
                  <span className="truncate">{option.label}</span>
                  <span className="ml-2 flex-shrink-0 tabular-nums">
                    {percentage}%
                  </span>
                </button>
              </div>
            );
          }

          return (
            <Button
              key={option.id}
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8"
              onClick={() => handleVote(option.id)}
              disabled={!currentUserId || isVoting || poll.has_ended}
              aria-label={`Vote for ${option.label}`}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
        <span>
          {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}
        </span>
        {poll.ends_at && (
          <>
            <span>&middot;</span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-2.5 w-2.5" />
              {formatTimeLeft(poll.ends_at)}
            </span>
          </>
        )}
      </div>
    </div>
  );
});
