import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { OpsAlert } from '@/types/ops';

// ops_alerts isn't in auto-generated types yet
const db = supabase as unknown as {
  from: (table: string) => ReturnType<typeof supabase.from>;
};

const QUERY_KEY = ['ops-alerts'] as const;

export function useOpsAlerts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<OpsAlert[]> => {
      const { data, error } = await db
        .from('ops_alerts')
        .select('id, alert_date, rule_key, severity, status, source_order_id, title, message, context, created_at, resolved_at')
        .eq('status', 'open')
        .order('alert_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw new Error(error.message);

      return ((data as Record<string, unknown>[] | null) ?? []).map((r) => ({
        id: r.id as string,
        alertDate: r.alert_date as string,
        ruleKey: r.rule_key as OpsAlert['ruleKey'],
        severity: r.severity as OpsAlert['severity'],
        status: r.status as OpsAlert['status'],
        sourceOrderId: (r.source_order_id as string | null) ?? null,
        title: r.title as string,
        message: r.message as string,
        context: (r.context ?? {}) as Record<string, unknown>,
        createdAt: r.created_at as string,
        resolvedAt: (r.resolved_at as string | null) ?? null,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await db
        .from('ops_alerts')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
