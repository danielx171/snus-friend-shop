import { useState, useMemo, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import type { WebhookEvent } from '@/types/ops';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { opsWebhookInbox } from '@/lib/api';

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

/** Try to extract an order ID from the payload */
function extractOrderId(payload: Record<string, unknown>): string | null {
  return (
    (payload.order_id as string) ||
    (payload.orderId as string) ||
    ((payload.data as any)?.order_id as string) ||
    ((payload.data as any)?.id as string) ||
    null
  );
}

/** Derive event type from topic string (strip order: prefix if present) */
function extractEventType(topic: string, payload: Record<string, unknown>): string {
  // If topic was stored as "order:<id>", try to get actual event from payload
  if (topic.startsWith('order:')) {
    return (payload.topic as string) || (payload.event as string) || 'order-event';
  }
  return topic;
}

export default function WebhookInbox() {
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<WebhookEvent | null>(null);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await opsWebhookInbox(50);
        setEvents(res?.events ?? []);
      } catch (e: unknown) {
        setLoadError(e instanceof Error ? e.message : 'Failed to load webhook inbox');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (providerFilter !== 'all' && e.provider !== providerFilter) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const orderId = extractOrderId(e.payload) || '';
        if (
          !e.eventId.toLowerCase().includes(q) &&
          !e.topic.toLowerCase().includes(q) &&
          !orderId.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [events, providerFilter, statusFilter, search]);

  return (
    <Layout showNicotineWarning={false}>
      <SEO title="Webhook Inbox — SnusFriend Ops" description="Internal webhook event log." metaRobots="noindex,nofollow" />
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/ops" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Webhook Inbox</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="nyehandel">Nyehandel</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search event, topic, or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Loading webhook events...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && loadError && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-destructive py-8">
                      {loadError}
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !loadError && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No events match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {!loading && !loadError && filtered.map((evt) => {
                  const eventType = extractEventType(evt.topic, evt.payload);
                  const orderId = extractOrderId(evt.payload);
                  return (
                    <TableRow
                      key={evt.eventId}
                      className="cursor-pointer transition-colors duration-150 hover:bg-muted/50"
                      onClick={() => setSelected(evt)}
                    >
                      <TableCell className="font-mono text-xs">{evt.eventId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{evt.provider}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{eventType}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {orderId ?? '—'}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[evt.status]}`}>
                          {evt.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">{timeAgo(evt.receivedAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail drawer */}
        <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent side="right" className="sm:max-w-lg overflow-y-auto">
            {selected && (() => {
              const orderId = extractOrderId(selected.payload);
              const eventType = extractEventType(selected.topic, selected.payload);
              return (
                <>
                  <SheetHeader>
                    <SheetTitle className="font-mono text-sm">{selected.eventId.slice(0, 12)}</SheetTitle>
                    <SheetDescription>
                      {selected.provider} · {eventType}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${statusColor[selected.status]}`}>
                          {selected.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Event Type</p>
                        <p className="font-medium text-foreground">{eventType}</p>
                      </div>
                      {orderId && (
                        <div>
                          <p className="text-muted-foreground">Order ID</p>
                          <p className="font-mono text-foreground">{orderId}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground">Attempts</p>
                        <p className="font-medium text-foreground">{selected.attempts}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Received at</p>
                        <p className="font-medium text-foreground">{new Date(selected.receivedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Raw Payload</p>
                      <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto text-foreground max-h-96">
                        {JSON.stringify(selected.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </>
              );
            })()}
          </SheetContent>
        </Sheet>
      </div>
    </Layout>
  );
}
