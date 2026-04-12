import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CACHE_PREFIX = 'snuspoints-balance:';
const CACHE_TTL_MS = 60_000;

type Cached = { balance: number; ts: number };

function cacheKey(userId: string) {
  return `${CACHE_PREFIX}${userId}`;
}

function readCache(userId: string): Cached | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(userId: string, balance: number) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(cacheKey(userId), JSON.stringify({ balance, ts: Date.now() }));
  } catch {
    // storage may be disabled; non-fatal
  }
}

export function useSnusPointsLite(userId: string | null): { balance: number } {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!userId) {
      setBalance(0);
      return;
    }

    const cached = readCache(userId);
    if (cached) {
      setBalance(cached.balance);
      return;
    }

    let cancelled = false;
    supabase
      .from('points_balances')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        const next = data?.balance ?? 0;
        setBalance(next);
        writeCache(userId, next);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return { balance };
}
