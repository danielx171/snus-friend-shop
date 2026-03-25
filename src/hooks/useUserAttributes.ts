import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback } from 'react';

export interface AttributeCategory {
  key: string;
  label: string;
  options: string[];
  sort_order: number;
}

export interface UserAttribute {
  attribute_key: string;
  attribute_value: string;
}

/** Fetches all attribute categories (globally cached) */
export function useAttributeCategories() {
  return useQuery({
    queryKey: ['attribute_categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attribute_categories')
        .select('key, label, options, sort_order')
        .order('sort_order');
      if (error) throw error;
      return (data ?? []) as AttributeCategory[];
    },
    staleTime: 300_000, // 5 minutes — categories rarely change
  });
}

/** Fetches a user's selected attributes */
export function useUserAttributes(userId: string | undefined) {
  const queryClient = useQueryClient();
  const queryKey = ['user_attributes', userId];

  const { data: attributes = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_attributes')
        .select('attribute_key, attribute_value')
        .eq('user_id', userId);
      if (error) throw error;
      return (data ?? []) as UserAttribute[];
    },
    enabled: !!userId,
    staleTime: 60_000,
  });

  /** Replace all attributes for a given category */
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ categoryKey, values }: { categoryKey: string; values: string[] }) => {
      if (!userId) throw new Error('Not authenticated');

      // Atomic replace via RPC (single transaction)
      const { error } = await supabase.rpc('replace_user_attributes', {
        p_user_id: userId,
        p_attribute_key: categoryKey,
        p_values: values,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateCategory = useCallback(
    (categoryKey: string, values: string[]) =>
      updateCategoryMutation.mutateAsync({ categoryKey, values }),
    [updateCategoryMutation],
  );

  return { attributes, isLoading, updateCategory };
}

/** Fetches attributes for a list of user IDs (batch, for review display) */
export function useUsersAttributes(userIds: string[]) {
  return useQuery({
    queryKey: ['users_attributes', [...userIds].sort().join(',')],
    queryFn: async () => {
      if (userIds.length === 0) return new Map<string, UserAttribute[]>();
      const { data, error } = await supabase
        .from('user_attributes')
        .select('user_id, attribute_key, attribute_value')
        .in('user_id', userIds);
      if (error) throw error;

      const map = new Map<string, UserAttribute[]>();
      for (const row of data ?? []) {
        const existing = map.get(row.user_id) ?? [];
        existing.push({ attribute_key: row.attribute_key, attribute_value: row.attribute_value });
        map.set(row.user_id, existing);
      }
      return map;
    },
    enabled: userIds.length > 0,
    staleTime: 60_000,
  });
}
