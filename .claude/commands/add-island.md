# Add React Island

Scaffold a new React island component for Astro hydration.

## Usage
- `/add-island <ComponentName>` — e.g. `/add-island LeaderboardIsland`

## Template

Every auth-gated React island MUST include:
1. `QueryProvider` wrapper (if using React Query hooks)
2. Auth check via `supabase.auth.getUser()`
3. `mounted` state to prevent SSR hydration mismatch
4. Sign-in fallback UI for unauthenticated users
5. Inner component that renders the actual feature

## Steps

1. **Create island** — `src/components/react/<Name>Island.tsx`:
   ```tsx
   import QueryProvider from './QueryProvider';
   import { supabase } from '@/integrations/supabase/client';
   import { useState, useEffect } from 'react';

   function <Name>Inner() {
     const [userId, setUserId] = useState<string | null>(null);
     const [mounted, setMounted] = useState(false);
     useEffect(() => {
       setMounted(true);
       supabase.auth.getUser().then(({ data }) => {
         setUserId(data.user?.id ?? null);
       });
     }, []);
     if (!mounted) return null;
     if (!userId) {
       return (
         <div class="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-8 text-center">
           <p class="text-muted-foreground mb-4">Sign in to access this feature.</p>
           <a href="/login" class="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition">Sign In</a>
         </div>
       );
     }
     return <ActualComponent userId={userId} />;
   }

   export default function <Name>Island() {
     return <QueryProvider><Name>Inner /></QueryProvider>;
   }
   ```
2. **Add to Astro page** — Use appropriate directive
3. **Build** — `bun run build` to verify hydration works

## Hydration Directives
| Directive | Use when |
|-----------|----------|
| `client:load` | Critical interactive UI (cart, add-to-cart) |
| `client:idle` | Important but not blocking (rewards, quests) |
| `client:visible` | Below the fold (spin wheel, leaderboard) |

## Public Islands (no auth)
Skip userId check. Just wrap with QueryProvider if using React Query.
