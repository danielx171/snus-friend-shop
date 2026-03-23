import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  manufacturer: string | null;
  productCount: number;
}

async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, slug, manufacturer, products(count)')
    .order('name');

  if (error) throw error;

  return (data ?? [])
    .map((b: { id: string; name: string; slug: string; manufacturer: string | null; products: Array<{ count: number }> }) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      manufacturer: b.manufacturer,
      productCount: b.products?.[0]?.count ?? 0,
    }))
    .filter((b) => b.productCount > 0 && b.name !== 'Unknown');
}

function groupByLetter(brands: Brand[]): Record<string, Brand[]> {
  const groups: Record<string, Brand[]> = {};
  for (const b of brands) {
    const letter = b.name[0]?.toUpperCase() ?? '#';
    const key = /[A-Z]/.test(letter) ? letter : '#';
    if (!groups[key]) groups[key] = [];
    groups[key].push(b);
  }
  return groups;
}

export function useBrands() {
  const query = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    staleTime: 5 * 60 * 1000,
  });

  const brands = query.data ?? [];
  const topBrands = [...brands]
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 24);
  const brandsByLetter = groupByLetter(brands);

  return {
    brands,
    topBrands,
    brandsByLetter,
    isLoading: query.isLoading,
  };
}

/** Generate a deterministic accent color from a brand name */
export function brandAccentColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
