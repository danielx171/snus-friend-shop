import { useEffect, useState } from 'react';
import { navigate } from 'vike/client/router';
import { supabase } from '@/integrations/supabase/client';
import { apiFetch } from '@/lib/api';
import type { Session } from '@supabase/supabase-js';

export default function OpsAuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  // Initialize from getSession() for a synchronous first read, then keep in
  // sync via onAuthStateChange for subsequent events (sign-in, sign-out, etc).
  // Both are needed per Supabase v2 recommended pattern.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Re-verify admin only when the user identity changes (login/logout),
  // not on token refreshes which update the session object but keep the same user.
  const userId = session === undefined ? undefined : (session?.user?.id ?? null);

  useEffect(() => {
    if (userId === undefined) return; // still loading

    if (userId === null) {
      setIsAdmin(false);
      return;
    }

    apiFetch<{ isAdmin: boolean }>('verify-admin')
      .then(({ isAdmin }) => setIsAdmin(isAdmin))
      .catch(() => setIsAdmin(false));
  }, [userId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/ops/login', { replace: true });
  };

  if (session === undefined || (session && isAdmin === undefined)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    navigate('/ops/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Access Denied</p>
          <p className="text-muted-foreground">You do not have admin privileges.</p>
          <button type="button" className="text-primary underline text-sm" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
