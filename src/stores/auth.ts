import { atom } from 'nanostores';
import type { User, Session } from '@supabase/supabase-js';

export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $isAuthenticated = atom(false);

export function setAuth(user: User | null, session: Session | null) {
  $user.set(user);
  $session.set(session);
  $isAuthenticated.set(!!user);
}

export function clearAuth() {
  $user.set(null);
  $session.set(null);
  $isAuthenticated.set(false);
}

// Hydrate from server-rendered auth state (set by Shop.astro layout)
if (typeof window !== 'undefined' && (window as any).__AUTH_STATE__) {
  const auth = (window as any).__AUTH_STATE__;
  $user.set(auth as User);
  $isAuthenticated.set(true);
}
