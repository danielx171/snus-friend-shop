import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Link2, AlertTriangle, XCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockSkuMappings } from '@/data/opsMock';
import type { SkuMappingStatus } from '@/types/ops';

const statusConfig: Record<SkuMappingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Link2 }> = {
  mapped: { label: 'Mapped', variant: 'default', icon: Link2 },
  missing: { label: 'Missing', variant: 'destructive', icon: XCircle },
  conflict: { label: 'Conflict', variant: 'secondary', icon: AlertTriangle },
};

export default function SkuMappings() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockSkuMappings.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          m.nyehandelSku.toLowerCase().includes(q) ||
          (m.shopifySku?.toLowerCase().includes(q) ?? false) ||
          m.productName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, search]);

  const counts = useMemo(() => ({
    mapped: mockSkuMappings.filter((m) => m.status === 'mapped').length,
    missing: mockSkuMappings.filter((m) => m.status === 'missing').length,
    conflict: mockSkuMappings.filter((m) => m.status === 'conflict').length,
  }), []);

  return (
    <Layout showNicotineWarning={false}>
      <SEO
        title="SKU Mappings | Ops · SnusFriend"
        description="SKU mapping status between Nyehandel and Shopify"
        metaRobots="noindex,nofollow"
      />

      <div className="container py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to="/ops"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SKU Mappings</h1>
            <p className="text-sm text-muted-foreground">Nyehandel → Shopify SKU mapping status</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {(Object.entries(counts) as [SkuMappingStatus, number][]).map(([status, count]) => {
            const cfg = statusConfig[status];
            const Icon = cfg.icon;
            return (
              <Card key={status} className="cursor-pointer transition-all hover:shadow-sm" onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{cfg.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SKU or product name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="mapped">Mapped</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
              <SelectItem value="conflict">Conflict</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {filtered.length} mapping{filtered.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Nyehandel SKU</TableHead>
                    <TableHead>Shopify SKU</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Verified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((m) => {
                    const cfg = statusConfig[m.status];
                    return (
                      <TableRow key={m.id} className="transition-colors">
                        <TableCell className="font-medium">{m.productName}</TableCell>
                        <TableCell className="font-mono text-xs">{m.nyehandelSku}</TableCell>
                        <TableCell className="font-mono text-xs">{m.shopifySku ?? <span className="text-muted-foreground italic">—</span>}</TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant} className="text-xs gap-1">
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {new Date(m.lastVerified).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No mappings match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
