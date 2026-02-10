import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockWebhookEvents, mockSyncRuns } from '@/data/opsMock';
import { Webhook, AlertTriangle, RefreshCw, Package } from 'lucide-react';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusColor: Record<string, string> = {
  received: 'bg-muted text-muted-foreground',
  processed: 'bg-primary/10 text-primary',
  failed: 'bg-destructive/10 text-destructive',
};

export default function OpsDashboard() {
  const todayEvents = mockWebhookEvents.filter(
    (e) => new Date(e.receivedAt).toDateString() === new Date().toDateString()
  );
  const failedEvents = mockWebhookEvents.filter((e) => e.status === 'failed');
  const lastCatalog = mockSyncRuns.find((r) => r.type === 'catalog');
  const lastInventory = mockSyncRuns.find((r) => r.type === 'inventory');

  const kpis = [
    { label: 'Webhooks today', value: todayEvents.length, icon: Webhook },
    { label: 'Failed events', value: failedEvents.length, icon: AlertTriangle },
    { label: 'Last catalog sync', value: lastCatalog ? timeAgo(lastCatalog.startedAt) : '—', icon: Package },
    { label: 'Last inventory sync', value: lastInventory ? timeAgo(lastInventory.startedAt) : '—', icon: RefreshCw },
  ];

  return (
    <Layout showNicotineWarning={false}>
      <SEO title="Ops Dashboard — SnusFriend" description="Internal operations dashboard." metaRobots="noindex,nofollow" />
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Ops Dashboard</h1>
          <div className="flex gap-2 text-sm">
            <Link to="/ops/webhooks" className="text-primary hover:underline">Webhooks</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/ops/sync" className="text-primary hover:underline">Sync Status</Link>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Events</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWebhookEvents.slice(0, 10).map((evt) => (
                  <TableRow key={evt.eventId} className="transition-colors duration-150 cursor-default">
                    <TableCell className="font-mono text-xs">{evt.eventId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{evt.provider}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{evt.topic}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[evt.status]}`}>
                        {evt.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">{timeAgo(evt.receivedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
