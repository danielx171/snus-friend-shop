import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrderItem {
  slug: string;
  name: string;
  brand?: string;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  totalPrice: number;
  items: OrderItem[];
}

/** Fetch user's order history and extract purchased product slugs. */
export function useOrders(userId: string | null) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async (): Promise<Order[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, total_price, line_items_snapshot')
        .eq('user_id', userId)
        .eq('checkout_status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error || !data) return [];

      return data.map((row: any) => {
        const items: OrderItem[] = [];
        try {
          const snapshot = typeof row.line_items_snapshot === 'string'
            ? JSON.parse(row.line_items_snapshot)
            : row.line_items_snapshot;

          if (Array.isArray(snapshot)) {
            for (const item of snapshot) {
              items.push({
                slug: item.slug ?? item.product_slug ?? item.sku ?? '',
                name: item.name ?? item.product_name ?? '',
                brand: item.brand ?? '',
                quantity: item.quantity ?? 1,
              });
            }
          }
        } catch { /* ignore parse errors */ }

        return {
          id: row.id,
          createdAt: row.created_at,
          totalPrice: row.total_price ?? 0,
          items,
        };
      });
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/** Extract unique purchased product slugs from order history. */
export function getPurchasedSlugs(orders: Order[]): string[] {
  const slugs = new Set<string>();
  for (const order of orders) {
    for (const item of order.items) {
      if (item.slug) slugs.add(item.slug);
    }
  }
  return Array.from(slugs);
}

/** Extract purchasing preferences (top brands/flavors) from order history. */
export function getPurchasePreferences(orders: Order[]) {
  const brands: Record<string, number> = {};
  for (const order of orders) {
    for (const item of order.items) {
      if (item.brand) {
        brands[item.brand] = (brands[item.brand] ?? 0) + item.quantity;
      }
    }
  }
  return {
    topBrand: Object.entries(brands).sort((a, b) => b[1] - a[1])[0]?.[0],
  };
}
