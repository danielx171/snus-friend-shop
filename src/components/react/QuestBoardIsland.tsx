import { useQuests } from '@/hooks/useQuests';
import QuestBoard from '@/components/quests/QuestBoard';
import QueryProvider from './QueryProvider';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useState, useEffect } from 'react';

function QuestBoardInner() {
  const { userId, authChecked } = useAuthUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { data: quests, isLoading } = useQuests(userId);

  if (!mounted || !authChecked) return null;

  if (!userId) {
    return (
      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center">
        <p className="text-muted-foreground mb-4">Sign in to view and complete quests.</p>
        <a
          href="/login"
          className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
        >
          Sign In
        </a>
      </div>
    );
  }

  return <QuestBoard quests={quests ?? []} isLoading={isLoading} />;
}

export default function QuestBoardIsland() {
  return (
    <QueryProvider>
      <QuestBoardInner />
    </QueryProvider>
  );
}
