import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { OpsAlert } from '@/types/ops';

const QUERY_KEY = ['ops-alerts'] as const;

export function useOpsAlerts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<OpsAlert[]> => {
      const { data, error } = await (supabase as any)
        .from('ops_alerts')
        .select('id, alert_date, rule_key, severity, status, source_order_id, title, message, context, created_at, resolved_at')
        .eq('status', 'open')
        .order('alert_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw new Error(error.message);

      return (data ?? []).map((r: any) => ({
        id: r.id,
        alertDate: r.alert_date,
        ruleKey: r.rule_key,
        severity: r.severity,
        status: r.status,
        sourceOrderId: r.source_order_id,
        title: r.title,
        message: r.message,
        context: r.context ?? {},
        createdAt: r.created_at,
        resolvedAt: r.resolved_at,
      }));
    },
    refetchInterval: 60000,
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await (supabase as any)
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
