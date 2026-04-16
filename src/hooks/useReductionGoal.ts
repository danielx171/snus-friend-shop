import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReductionGoal {
  id: string;
  user_id: string;
  current_mg: number;
  target_mg: number;
  step_interval_days: number;
  started_at: string;
  next_step_at: string | null;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  created_at: string;
}

export interface CreateGoalPayload {
  user_id: string;
  current_mg: number;
  target_mg: number;
  step_interval_days: number;
}

export interface UpdateGoalPayload {
  id: string;
  current_mg?: number;
  target_mg?: number;
  step_interval_days?: number;
  next_step_at?: string | null;
  status?: ReductionGoal['status'];
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

/** Fetch the user's active reduction goal. */
export function useReductionGoal(userId: string | null) {
  return useQuery<ReductionGoal | null>({
    queryKey: ['reduction_goal', userId],
    queryFn: async (): Promise<ReductionGoal | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('reduction_goals')
        .select('id, user_id, current_mg, target_mg, step_interval_days, started_at, next_step_at, status, created_at')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('reduction_goals query failed', error);
        return null;
      }

      return data as ReductionGoal | null;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

/** Create a new reduction goal. */
export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateGoalPayload) => {
      const now = new Date();
      const nextStep = new Date(now);
      nextStep.setDate(nextStep.getDate() + payload.step_interval_days);

      const { data, error } = await supabase
        .from('reduction_goals')
        .insert({
          user_id: payload.user_id,
          current_mg: payload.current_mg,
          target_mg: payload.target_mg,
          step_interval_days: payload.step_interval_days,
          started_at: now.toISOString(),
          next_step_at: nextStep.toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;
      return data as ReductionGoal;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reduction_goal', variables.user_id] });
    },
  });
}

/** Update an existing reduction goal (pause, advance step, complete, etc.). */
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateGoalPayload) => {
      const { id, ...updates } = payload;

      const { data, error } = await supabase
        .from('reduction_goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as ReductionGoal;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reduction_goal', data.user_id] });
    },
  });
}
