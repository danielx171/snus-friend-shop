import { useState } from 'react';
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
import { Package, MapPin, Settings, LogOut, Plus, Pencil, Trash2 } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';

/* ── Mock data ── */
type OrderStatus = 'delivered' | 'shipped' | 'processing' | 'pending' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  delivered: { label: 'Delivered', className: 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30' },
  shipped: { label: 'Shipped', className: 'bg-[hsl(var(--info))]/15 text-[hsl(var(--info))] border-[hsl(var(--info))]/30' },
  processing: { label: 'Processing', className: 'bg-primary/15 text-primary border-primary/30' },
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

const mockOrders = [
  { id: 'SF-20260305-1192', date: 'Mar 5, 2026', status: 'processing' as OrderStatus, items: 3, total: 62.97 },
  { id: 'SF-20260221-0874', date: 'Feb 21, 2026', status: 'shipped' as OrderStatus, items: 1, total: 21.99 },
  { id: 'SF-20260210-0531', date: 'Feb 10, 2026', status: 'delivered' as OrderStatus, items: 5, total: 109.99 },
  { id: 'SF-20260128-0412', date: 'Jan 28, 2026', status: 'delivered' as OrderStatus, items: 2, total: 39.98 },
  { id: 'SF-20260115-0203', date: 'Jan 15, 2026', status: 'cancelled' as OrderStatus, items: 1, total: 4.99 },
  { id: 'SF-20260103-0091', date: 'Jan 3, 2026', status: 'delivered' as OrderStatus, items: 10, total: 134.99 },
];

const mockAddresses = [
  { id: '1', label: 'Home', name: 'John Doe', line1: '42 Camden High Street', line2: 'London NW1 0JH', country: 'United Kingdom', isDefault: true },
  { id: '2', label: 'Work', name: 'John Doe', line1: '10 Finsbury Square', line2: 'London EC2A 1AF', country: 'United Kingdom', isDefault: false },
];

export default function AccountPage() {
  const [isLoggedIn] = useState(true);

  if (!isLoggedIn) {
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

  return (
    <>
      <SEO title="My Account | SnusFriend" description="Manage your SnusFriend account, orders, and subscriptions." />
      <Layout showNicotineWarning={false}>
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">My Account</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, John</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
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
                        {mockOrders.map((order) => {
                          const cfg = statusConfig[order.status];
                          return (
                            <TableRow key={order.id} className="border-border/20">
                              <TableCell className="font-mono text-sm text-foreground">{order.id}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{order.items}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn('text-xs font-medium', cfg.className)}>
                                  {cfg.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right text-sm font-medium text-foreground">
                                {formatPrice(order.total)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile cards */}
                  <div className="space-y-3 sm:hidden">
                    {mockOrders.map((order) => {
                      const cfg = statusConfig[order.status];
                      return (
                        <div key={order.id} className="rounded-lg border border-border/20 bg-secondary/20 p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-foreground">{order.id}</span>
                            <Badge variant="outline" className={cn('text-xs font-medium', cfg.className)}>
                              {cfg.label}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{order.date} &middot; {order.items} items</span>
                            <span className="font-medium text-foreground">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Saved Addresses ── */}
            <TabsContent value="addresses">
              <Card className="border-border/30">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="font-serif">Saved Addresses</CardTitle>
                    <CardDescription className="mt-1">Manage your delivery addresses</CardDescription>
                  </div>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Address</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mockAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={cn(
                          'relative rounded-lg border p-4 space-y-1',
                          addr.isDefault ? 'border-primary/40 bg-primary/5' : 'border-border/20 bg-secondary/20',
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-foreground">{addr.label}</span>
                          {addr.isDefault && (
                            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground">{addr.name}</p>
                        <p className="text-sm text-muted-foreground">{addr.line1}</p>
                        <p className="text-sm text-muted-foreground">{addr.line2}</p>
                        <p className="text-sm text-muted-foreground">{addr.country}</p>
                        <div className="flex gap-2 pt-3">
                          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground">
                            <Pencil className="h-3 w-3" /> Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3 w-3" /> Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Account Settings ── */}
            <TabsContent value="settings">
              <div className="space-y-6">
                {/* Personal info */}
                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="font-serif">Personal Information</CardTitle>
                    <CardDescription>Update your name, email, and phone number</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First name</Label>
                        <Input placeholder="John" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last name</Label>
                        <Input placeholder="Doe" defaultValue="Doe" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Email</Label>
                        <Input type="email" defaultValue="john@example.com" />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Phone (optional)</Label>
                        <Input type="tel" placeholder="+44 7000 000000" />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                {/* Security */}
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
