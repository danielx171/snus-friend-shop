import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  slug: string;
  image_url: string;
  description: string;
  rank: number;
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['product-search', query],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase.rpc('search_products', {
        query,
        result_limit: 20,
      });

      if (error) throw error;
      return data ?? [];
    },
    enabled: query.length >= 2,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}
