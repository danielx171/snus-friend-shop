import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PouchPart {
  id: string;
  category: string;
  name: string;
  svg_data: string;
  unlock_condition: string;
  unlock_value: number;
  rarity: string;
  sort_order: number;
}

export interface PouchSelection {
  shape_id: string | null;
  color_id: string | null;
  expression_id: string | null;
  accessory_id: string | null;
  background_id: string | null;
}

export const POUCH_CATEGORIES = [
  'shape',
  'color',
  'expression',
  'accessory',
  'background',
] as const;

/* ------------------------------------------------------------------ */
/*  usePouchParts                                                      */
/* ------------------------------------------------------------------ */

export function usePouchParts() {
  return useQuery<Record<string, PouchPart[]>>({
    queryKey: ['pouch_parts'],
    queryFn: async (): Promise<Record<string, PouchPart[]>> => {
      const { data, error } = await supabase
        .from('pouch_parts')
        .select('id, category, name, svg_data, unlock_condition, unlock_value, rarity, sort_order')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('pouch_parts query failed', error);
        return {};
      }

      const grouped: Record<string, PouchPart[]> = {};
      for (const part of data ?? []) {
        const p = part as PouchPart;
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      }
      return grouped;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ------------------------------------------------------------------ */
/*  usePouchAvatar                                                     */
/* ------------------------------------------------------------------ */

export interface UsePouchAvatarResult {
  selection: PouchSelection | null;
  isLoading: boolean;
  saveAvatar: (selection: PouchSelection) => Promise<void>;
  isSaving: boolean;
}

export function usePouchAvatar(userId: string | null): UsePouchAvatarResult {
  const queryClient = useQueryClient();

  const { data: selection, isLoading } = useQuery<PouchSelection | null>({
    queryKey: ['user_pouch_avatar', userId],
    queryFn: async (): Promise<PouchSelection | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('user_pouch_avatars')
        .select('shape_id, color_id, expression_id, accessory_id, background_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('user_pouch_avatars query failed', error);
        return null;
      }

      if (!data) return null;

      return {
        shape_id: data.shape_id ?? null,
        color_id: data.color_id ?? null,
        expression_id: data.expression_id ?? null,
        accessory_id: data.accessory_id ?? null,
        background_id: data.background_id ?? null,
      };
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: async (sel: PouchSelection) => {
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_pouch_avatars')
        .upsert(
          {
            user_id: userId,
            shape_id: sel.shape_id,
            color_id: sel.color_id,
            expression_id: sel.expression_id,
            accessory_id: sel.accessory_id,
            background_id: sel.background_id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
    },
    onSuccess: (_data, sel) => {
      queryClient.setQueryData(['user_pouch_avatar', userId], sel);
    },
  });

  return {
    selection: selection ?? null,
    isLoading,
    saveAvatar: (sel: PouchSelection) => mutation.mutateAsync(sel),
    isSaving: mutation.isPending,
  };
}
