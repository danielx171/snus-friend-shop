import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface WishlistContextValue {
  ids: string[];
  count: number;
  has: (productId: string) => boolean;
  toggle: (productId: string) => void;
  clear: () => void;
  products: Product[];
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const STORAGE_KEY = 'snusfriend_wishlist';

function loadFromStorage(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  // localIds is used for anonymous users only
  const [localIds, setLocalIds] = useState<string[]>(() => loadFromStorage());

  // Track auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // Merge localStorage items into Supabase when user logs in
  useEffect(() => {
    if (!user) return;

    const pending = loadFromStorage();
    if (pending.length === 0) return;

    // Merge: upsert all pending local IDs, then clear localStorage
    const rows = pending.map((product_id) => ({
      user_id: user.id,
      product_id,
    }));

    supabase
      .from('user_wishlists')
      .upsert(rows, { onConflict: 'user_id,product_id', ignoreDuplicates: true })
      .then(() => {
        clearStorage();
        setLocalIds([]);
        queryClient.invalidateQueries({ queryKey: ['wishlist', user.id] });
      });
  }, [user, queryClient]);

  // Supabase query for logged-in users
  const { data: remoteIds = [], isLoading: remoteLoading } = useQuery<string[]>({
    queryKey: ['wishlist', user?.id],
    queryFn: async (): Promise<string[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_wishlists')
        .select('product_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.product_id);
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  // Full product data for wishlisted IDs (used on wishlist page)
  const activeIds = user ? remoteIds : localIds;

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['wishlist-products', activeIds],
    queryFn: async (): Promise<Product[]> => {
      if (activeIds.length === 0) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', activeIds);
      if (error) throw error;
      return data ?? [];
    },
    enabled: activeIds.length > 0,
    staleTime: 60_000,
  });

  // Insert mutation (Supabase)
  const insertMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) return;
      const { error } = await supabase
        .from('user_wishlists')
        .insert({ user_id: user.id, product_id: productId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-products'] });
    },
  });

  // Delete mutation (Supabase)
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) return;
      const { error } = await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-products'] });
    },
  });

  const has = useCallback(
    (productId: string) => activeIds.includes(productId),
    [activeIds],
  );

  const toggle = useCallback(
    (productId: string) => {
      if (user) {
        // Logged in: use Supabase
        if (remoteIds.includes(productId)) {
          deleteMutation.mutate(productId);
        } else {
          insertMutation.mutate(productId);
        }
      } else {
        // Anonymous: use localStorage
        setLocalIds((prev) => {
          const next = prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId];
          saveToStorage(next);
          return next;
        });
      }
    },
    [user, remoteIds, insertMutation, deleteMutation],
  );

  const clear = useCallback(async () => {
    if (user) {
      await supabase
        .from('user_wishlists')
        .delete()
        .eq('user_id', user.id);
      queryClient.invalidateQueries({ queryKey: ['wishlist', user.id] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-products'] });
    } else {
      setLocalIds([]);
      clearStorage();
    }
  }, [user, queryClient]);

  const ids = activeIds;
  const count = ids.length;
  const isLoading = !!user && (remoteLoading || productsLoading);

  return (
    <WishlistContext.Provider
      value={{ ids, count, has, toggle, clear, products, isLoading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
