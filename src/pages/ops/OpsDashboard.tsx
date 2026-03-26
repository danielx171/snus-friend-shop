import { navigate } from 'vike/client/router';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Webhook, AlertTriangle, RefreshCw, Package, LogOut, Bell, Clock, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWebhookEvents, useSyncRuns } from '@/hooks/useOpsData';
import { useOpsAlerts, useResolveAlert } from '@/hooks/useOpsAlerts';
import type { OpsAlert, AlertRuleKey, AlertSeverity } from '@/types/ops';

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

const severityVariant: Record<AlertSeverity, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-destructive/10 text-destructive',
};

const ruleLabel: Record<AlertRuleKey, string> = {
  unpaid_deadline: 'Obetalda',
  deliverable_delay: 'Försenad',
};

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityVariant[severity]}`}>
      {severity}
    </span>
  );
}

function RuleBadge({ ruleKey }: { ruleKey: AlertRuleKey }) {
  return (
    <Badge variant="outline" className="text-xs">
      {ruleLabel[ruleKey]}
    </Badge>
  );
}

function truncateId(id: string) {
  return id.slice(0, 8) + '…';
}

// --- Skeleton rows for loading state ---
function AlertSkeletonRows() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20 font-mono" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20 rounded-md" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function AlertCardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Alert Action Queue ---
function AlertActionQueue({ alerts, isLoading }: { alerts: OpsAlert[]; isLoading: boolean }) {
  const { mutate: resolve, isPending } = useResolveAlert();

  if (!isLoading && alerts.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          Inga öppna larm. Allt ser bra ut.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Regel</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Meddelande</TableHead>
                <TableHead className="text-right">Åtgärd</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <AlertSkeletonRows />
              ) : (
                alerts.map((alert) => (
                  <TableRow key={alert.id} className="transition-colors duration-150">
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {alert.alertDate}
                    </TableCell>
                    <TableCell>
                      <RuleBadge ruleKey={alert.ruleKey} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={alert.severity} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {truncateId(alert.sourceOrderId)}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate" title={alert.message}>
                      {alert.message}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => resolve(alert.id)}
                      >
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          <AlertCardSkeleton />
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <RuleBadge ruleKey={alert.ruleKey} />
                  <SeverityBadge severity={alert.severity} />
                </div>
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {alert.alertDate} · Order {truncateId(alert.sourceOrderId)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => resolve(alert.id)}
                >
                  Resolve
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

// --- Main page ---
export default function OpsDashboard() {
  const { data: events = [] } = useWebhookEvents();
  const { data: syncRuns = [] } = useSyncRuns();
  const { data: alerts = [], isLoading: alertsLoading } = useOpsAlerts();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/ops/login');
  };

  const todayEvents = events.filter(
    (e) => new Date(e.receivedAt).toDateString() === new Date().toDateString()
  );
  const failedEvents = events.filter((e) => e.status === 'failed');
  const lastCatalog = syncRuns.find((r) => r.type === 'catalog');
  const lastInventory = syncRuns.find((r) => r.type === 'inventory');

  const unpaidAlerts = alerts.filter((a) => a.ruleKey === 'unpaid_deadline');
  const delayedAlerts = alerts.filter((a) => a.ruleKey === 'deliverable_delay');

  const webhookKpis = [
    { label: 'Webhooks today', value: todayEvents.length, icon: Webhook },
    { label: 'Failed events', value: failedEvents.length, icon: AlertTriangle },
    { label: 'Last catalog sync', value: lastCatalog ? timeAgo(lastCatalog.startedAt) : '—', icon: Package },
    { label: 'Last inventory sync', value: lastInventory ? timeAgo(lastInventory.startedAt) : '—', icon: RefreshCw },
  ];

  const alertKpis = [
    {
      label: 'Totala larm',
      value: alertsLoading ? null : alerts.length,
      icon: Bell,
    },
    {
      label: 'Försenade leveranser',
      value: alertsLoading ? null : delayedAlerts.length,
      icon: Clock,
    },
    {
      label: 'Obetalda deadlines',
      value: alertsLoading ? null : unpaidAlerts.length,
      icon: CreditCard,
    },
  ];

  return (
    <Layout showNicotineWarning={false}>
      <SEO title="Ops Dashboard — SnusFriend" description="Internal operations dashboard." metaRobots="noindex,nofollow" />
      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Ops Dashboard</h1>
          <div className="flex items-center gap-3 text-sm">
            <a href="/ops/webhooks" className="text-primary hover:underline">Webhooks</a>
            <span className="text-muted-foreground">·</span>
            <a href="/ops/sync" className="text-primary hover:underline">Sync Status</a>
            <span className="text-muted-foreground">·</span>
            <a href="/ops/mappings" className="text-primary hover:underline">Mappings</a>
            <span className="text-muted-foreground">·</span>
            <a href="/ops/users" className="text-primary hover:underline">Users</a>
            <Button variant="ghost" size="sm" className="gap-1.5 ml-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* B2B Alert KPIs */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">B2B Larmkö</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {alertKpis.map((kpi) => (
              <Card key={kpi.label} className="transition-shadow duration-200 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {kpi.value === null ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <AlertActionQueue alerts={alerts} isLoading={alertsLoading} />
        </section>

        {/* Webhook KPI cards */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Webhook & Sync</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {webhookKpis.map((kpi) => (
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
        </section>

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
                {events.slice(0, 10).map((evt) => (
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
