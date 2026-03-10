import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSyncRuns } from '@/hooks/useOpsData';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { SyncRun } from '@/types/ops';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDuration(ms: number) {
  return `${(ms / 1000).toFixed(1)}s`;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  success: 'default',
  partial: 'secondary',
  failed: 'destructive',
  running: 'outline',
};

export default function SyncStatus() {
  const { data: runs = [], isLoading, refetch } = useSyncRuns();
  const [syncing, setSyncing] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSync = async (type: 'catalog' | 'inventory') => {
    setSyncing(type);
    try {
      await apiFetch('sync-nyehandel', { params: { type } });
      toast({ title: 'Sync started', description: `${type} sync has been triggered.` });
      setTimeout(() => refetch(), 2000);
    } catch (e: any) {
      toast({ title: 'Sync failed', description: e.message, variant: 'destructive' });
    } finally {
      setSyncing(null);
    }
  };

  const catalogRuns = runs.filter((r) => r.type === 'catalog');
  const inventoryRuns = runs.filter((r) => r.type === 'inventory');
  const lastCatalog = catalogRuns[0];
  const lastInventory = inventoryRuns[0];

  return (
    <Layout showNicotineWarning={false}>
      <SEO title="Sync Status — SnusFriend Ops" description="Internal sync monitoring." metaRobots="noindex,nofollow" />
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/ops" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Sync Status</h1>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={!!syncing} onClick={() => handleSync('catalog')}>
              {syncing === 'catalog' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Package className="h-4 w-4 mr-1" />}
              Sync Catalog
            </Button>
            <Button size="sm" variant="outline" disabled={!!syncing} onClick={() => handleSync('inventory')}>
              {syncing === 'inventory' ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              Sync Inventory
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Catalog Sync', icon: Package, run: lastCatalog, type: 'catalog' as const },
            { label: 'Inventory Sync', icon: RefreshCw, run: lastInventory, type: 'inventory' as const },
          ].map(({ label, icon: Icon, run }) => (
            <Card key={label} className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                {run ? (
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last run</p>
                      <p className="font-medium text-foreground">{timeAgo(run.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{formatDuration(run.durationMs)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Items processed</p>
                      <p className="font-medium text-foreground">{run.itemsProcessed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errors</p>
                      <p className={`font-medium ${run.errors > 0 ? 'text-destructive' : 'text-foreground'}`}>{run.errors}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">{isLoading ? 'Loading…' : 'No runs recorded.'}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Run history */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Run History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow key={run.id} className="transition-colors duration-150">
                    <TableCell className="capitalize text-foreground">{run.type}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[run.status]} className="capitalize">
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{run.itemsProcessed}</TableCell>
                    <TableCell className={run.errors > 0 ? 'text-destructive font-medium' : ''}>{run.errors}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDuration(run.durationMs)}</TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">{timeAgo(run.startedAt)}</TableCell>
                  </TableRow>
                ))}
                {runs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {isLoading ? 'Loading…' : 'No sync runs yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
