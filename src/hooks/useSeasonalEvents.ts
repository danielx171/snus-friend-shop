import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SeasonalEvent {
  id: string;
  name: string;
  slug: string;
  description: string;
  theme_color: string;
  banner_image_url: string | null;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  bonus_multiplier: number;
  rewards: unknown[];
  created_at: string;
}

export interface EventParticipation {
  id: string;
  event_id: string;
  user_id: string;
  points_earned: number;
  milestones_reached: unknown[];
  joined_at: string;
}

export interface SeasonalEventWithParticipation extends SeasonalEvent {
  participation: EventParticipation | null;
  timeRemaining: { days: number; hours: number; minutes: number } | null;
  isLive: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function calcTimeRemaining(endsAt: string): { days: number; hours: number; minutes: number } | null {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

function isEventLive(event: SeasonalEvent): boolean {
  const now = Date.now();
  return event.is_active && new Date(event.starts_at).getTime() <= now && new Date(event.ends_at).getTime() > now;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useSeasonalEvents(userId: string | null) {
  return useQuery<SeasonalEventWithParticipation[]>({
    queryKey: ['seasonal-events', userId],
    queryFn: async (): Promise<SeasonalEventWithParticipation[]> => {
      // Fetch active events where end date is in the future
      const { data: eventsData, error: eventsError } = await supabase
        .from('seasonal_events')
        .select('*')
        .eq('is_active', true)
        .gte('ends_at', new Date().toISOString())
        .order('starts_at', { ascending: true });

      if (eventsError) {
        console.error('seasonal_events query failed', eventsError);
        return [];
      }

      const events = (eventsData ?? []) as SeasonalEvent[];

      // Fetch user participation if logged in
      let participationMap: Record<string, EventParticipation> = {};

      if (userId && events.length > 0) {
        const eventIds = events.map((e) => e.id);
        const { data: partData, error: partError } = await supabase
          .from('event_participants')
          .select('*')
          .eq('user_id', userId)
          .in('event_id', eventIds);

        if (partError) {
          console.error('event_participants query failed', partError);
        }

        for (const p of (partData ?? []) as EventParticipation[]) {
          participationMap[p.event_id] = p;
        }
      }

      return events.map((event) => ({
        ...event,
        participation: participationMap[event.id] ?? null,
        timeRemaining: calcTimeRemaining(event.ends_at),
        isLive: isEventLive(event),
      }));
    },
    staleTime: 60_000,
  });
}

/* ------------------------------------------------------------------ */
/*  Join mutation                                                      */
/* ------------------------------------------------------------------ */

export function useJoinEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('event_participants')
        .insert({ event_id: eventId, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-events'] });
    },
  });
}
