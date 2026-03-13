import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { Package, MapPin, Settings, LogOut } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

type DisplayStatus = 'fulfilled' | 'processing' | 'pending' | 'cancelled';

const statusConfig: Record<DisplayStatus, { label: string; className: string }> = {
  fulfilled:  { label: 'Fulfilled',  className: 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30' },
  processing: { label: 'Processing', className: 'bg-primary/15 text-primary border-primary/30' },
  pending:    { label: 'Pending',    className: 'bg-muted text-muted-foreground border-border' },
  cancelled:  { label: 'Cancelled',  className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

function toDisplayStatus(
  checkoutStatus: string,
  nyehandelSyncStatus: string,
): DisplayStatus {
  if (checkoutStatus === 'cancelled' || checkoutStatus === 'failed') return 'cancelled';
  if (checkoutStatus === 'pending') return 'pending';
  // paid
  if (nyehandelSyncStatus === 'synced') return 'fulfilled';
  return 'processing';
}

type OrderRow = {
  id: string;
  created_at: string;
  checkout_status: string;
  nyehandel_sync_status: string;
  total_price: number;
  currency: string;
  line_items_snapshot: unknown;
};

export default function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return;
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['account-orders', user?.email],
    queryFn: async (): Promise<OrderRow[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, checkout_status, nyehandel_sync_status, total_price, currency, line_items_snapshot')
        .eq('customer_email', user!.email!)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as OrderRow[];
    },
    enabled: !!user?.email,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Still loading session
  if (user === undefined) {
    return (
      <Layout showNicotineWarning={false}>
        <div className="container py-16" />
      </Layout>
    );
  }

  // Not logged in
  if (user === null) {
    return (
      <>
        <SEO title="Account | SnusFriend" description="Sign in to your SnusFriend account." />
        <Layout showNicotineWarning={false}>
          <div className="container py-16">
            <EmptyState
              variant="generic"
              title="Sign in to continue"
              description="Please sign in to access your account dashboard."
              actionLabel="Sign In"
              actionHref="/login"
            />
          </div>
        </Layout>
      </>
    );
  }

  const firstName = (user.user_metadata?.first_name as string | undefined) ?? '';
  const lastName = (user.user_metadata?.last_name as string | undefined) ?? '';
  const displayName = firstName || (user.email?.split('@')[0] ?? 'there');

  return (
    <>
      <SEO title="My Account | SnusFriend" description="Manage your SnusFriend account, orders, and subscriptions." />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">My Account</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, {displayName}</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid h-11 rounded-xl bg-muted/20 border border-border/20 p-1">
              <TabsTrigger value="orders" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Order History</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="addresses" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Saved Addresses</span>
                <span className="sm:hidden">Addresses</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Account Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* ── Order History ── */}
            <TabsContent value="orders">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="font-serif">Order History</CardTitle>
                  <CardDescription>Track and manage your past orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">Loading orders…</p>
                  ) : orders.length === 0 ? (
                    <EmptyState
                      variant="generic"
                      title="No orders yet"
                      description="Your order history will appear here after your first purchase."
                      actionLabel="Browse Products"
                      actionHref="/nicotine-pouches"
                    />
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-border/20 hover:bg-transparent">
                              <TableHead className="text-muted-foreground">Order ID</TableHead>
                              <TableHead className="text-muted-foreground">Date</TableHead>
                              <TableHead className="text-muted-foreground">Items</TableHead>
                              <TableHead className="text-muted-foreground">Status</TableHead>
                              <TableHead className="text-right text-muted-foreground">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.map((order) => {
                              const status = toDisplayStatus(order.checkout_status, order.nyehandel_sync_status);
                              const cfg = statusConfig[status];
                              const itemCount = Array.isArray(order.line_items_snapshot) ? order.line_items_snapshot.length : '—';
                              const date = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                              return (
                                <TableRow key={order.id} className="border-border/20">
                                  <TableCell className="font-mono text-sm text-foreground">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{date}</TableCell>
                                  <TableCell className="text-sm text-muted-foreground">{itemCount}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className={cn('text-xs font-medium', cfg.className)}>
                                      {cfg.label}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right text-sm font-medium text-foreground">
                                    {formatPrice(order.total_price)}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile cards */}
                      <div className="space-y-3 sm:hidden">
                        {orders.map((order) => {
                          const status = toDisplayStatus(order.checkout_status, order.nyehandel_sync_status);
                          const cfg = statusConfig[status];
                          const itemCount = Array.isArray(order.line_items_snapshot) ? order.line_items_snapshot.length : '—';
                          const date = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                          return (
                            <div key={order.id} className="rounded-lg border border-border/20 bg-secondary/20 p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-foreground">{order.id.slice(0, 8).toUpperCase()}</span>
                                <Badge variant="outline" className={cn('text-xs font-medium', cfg.className)}>
                                  {cfg.label}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{date} &middot; {itemCount} items</span>
                                <span className="font-medium text-foreground">{formatPrice(order.total_price)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Saved Addresses ── */}
            <TabsContent value="addresses">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="font-serif">Saved Addresses</CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    variant="generic"
                    title="No saved addresses"
                    description="Address management is coming soon."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Account Settings ── */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="font-serif">Personal Information</CardTitle>
                    <CardDescription>Update your name, email, and phone number</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First name</Label>
                        <Input placeholder="First name" defaultValue={firstName} />
                      </div>
                      <div className="space-y-2">
                        <Label>Last name</Label>
                        <Input placeholder="Last name" defaultValue={lastName} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Email</Label>
                        <Input type="email" defaultValue={user.email ?? ''} disabled />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Phone (optional)</Label>
                        <Input type="tel" placeholder="+44 7000 000000" />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="font-serif">Security</CardTitle>
                    <CardDescription>Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">Change Password</h3>
                      <p className="text-xs text-muted-foreground">Update your password to keep your account secure.</p>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                    <Separator className="bg-border/20" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-foreground">Email Preferences</h3>
                      <p className="text-xs text-muted-foreground">Manage marketing emails and order notifications.</p>
                      <Button variant="outline" size="sm">Manage Preferences</Button>
                    </div>
                    <Separator className="bg-border/20" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
                      <p className="text-xs text-muted-foreground">Permanently remove your account and all associated data.</p>
                      <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
