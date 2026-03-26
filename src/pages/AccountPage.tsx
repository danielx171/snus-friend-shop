import { useState, useEffect, useCallback } from 'react';
import { navigate } from 'vike/client/router';
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
import { Package, Settings, LogOut, Crown, UserCircle, ExternalLink } from 'lucide-react';
import ReorderButton from '@/components/shop/ReorderButton';
import { MembershipAccountTab } from '@/components/account/MembershipAccountTab';
import { SEO } from '@/components/seo/SEO';
import { formatPrice } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAchievements } from '@/hooks/useAchievements';
import ProfileCard from '@/components/profile/ProfileCard';
import AvatarGallery from '@/components/profile/AvatarGallery';
import { AttributeEditor } from '@/components/profile/AttributeEditor';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';
import { PouchBuilder } from '@/components/gamification/PouchBuilder';

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
  if (checkoutStatus === 'cancelled') return 'cancelled';
  if (checkoutStatus === 'shipped') return 'fulfilled';
  if (checkoutStatus === 'pending') return 'pending';
  // confirmed
  if (nyehandelSyncStatus === 'synced') return 'processing';
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
  tracking_id: string | null;
  tracking_url: string | null;
  shipping_method: string | null;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  // Gamification profile
  const { profile, avatars, unlockedAvatarIds, updateProfile } = useUserProfile(user?.id ?? null);

  // Achievements
  const { data: achievementData } = useAchievements(user?.id ?? null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      if (u) {
        setFirstName((u.user_metadata?.first_name as string | undefined) ?? '');
        setLastName((u.user_metadata?.last_name as string | undefined) ?? '');
        setPhone((u.user_metadata?.phone as string | undefined) ?? '');
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return;
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    setSaveError('');
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName, phone },
    });
    if (error) {
      setSaveStatus('error');
      setSaveError(error.message);
    } else {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['account-orders', user?.email],
    queryFn: async (): Promise<OrderRow[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, checkout_status, nyehandel_sync_status, total_price, currency, line_items_snapshot, tracking_id, tracking_url, shipping_method')
        .eq('customer_email', user!.email!)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as OrderRow[];
    },
    enabled: !!user?.email,
  });

  // SnusPoints balance for profile stats
  const { data: pointsBalance = 0 } = useQuery({
    queryKey: ['points-balance', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('points_balances')
        .select('balance')
        .eq('user_id', user!.id)
        .maybeSingle();
      return data?.balance ?? 0;
    },
    enabled: !!user?.id,
  });

  // Derive current avatar data for ProfileCard
  const currentAvatarId = profile?.avatar_id ?? null;
  const currentAvatarData = avatars.find((a) => a.id === currentAvatarId) ?? null;

  const handleAvatarSelect = useCallback(
    async (avatarId: string) => {
      await updateProfile({ avatar_id: avatarId });
    },
    [updateProfile],
  );

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
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-11 rounded-xl bg-muted/20 border border-border/20 p-1">
              <TabsTrigger value="orders" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Order History</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="membership" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Membership</span>
                <span className="sm:hidden">Club</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Account Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
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
                              <TableHead className="text-muted-foreground">Tracking</TableHead>
                              <TableHead className="text-muted-foreground" />
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
                                  <TableCell>
                                    {order.tracking_url ? (
                                      <a
                                        href={order.tracking_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                      >
                                        Track
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    ) : order.tracking_id ? (
                                      <span className="font-mono text-xs text-muted-foreground">{order.tracking_id}</span>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">--</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <ReorderButton lineItemsSnapshot={order.line_items_snapshot} />
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
                              {order.tracking_url && (
                                <a
                                  href={order.tracking_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                  Track shipment
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              <div className="pt-1">
                                <ReorderButton lineItemsSnapshot={order.line_items_snapshot} />
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

            {/* ── Membership ── */}
            <TabsContent value="membership">
              <MembershipAccountTab />
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
                        <Input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Last name</Label>
                        <Input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Email</Label>
                        <Input type="email" value={user.email ?? ''} disabled />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Phone (optional)</Label>
                        <Input type="tel" placeholder="+44 7000 000000" value={phone} onChange={e => setPhone(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={saveStatus === 'saving'}>
                      {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
                    </Button>
                    {saveStatus === 'error' && <p className="text-xs text-destructive mt-1">{saveError}</p>}
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
                      <Button variant="outline" size="sm" onClick={() => navigate('/update-password')}>Change Password</Button>
                    </div>
                    <Separator className="bg-border/20" />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Delete Account</h3>
                      <p className="text-xs text-muted-foreground">
                        To delete your account and all associated data, please email{' '}
                        <a href="mailto:support@snusfriend.com" className="text-primary underline underline-offset-2 hover:text-primary/80">
                          support@snusfriend.com
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Profile ── */}
            <TabsContent value="profile">
              <div className="space-y-6">
                <ProfileCard
                  profile={profile}
                  avatarData={currentAvatarData}
                  stats={{
                    ordersCount: orders.length,
                    reviewsCount: 0,
                    snusPoints: pointsBalance,
                  }}
                  onSave={updateProfile}
                />

                <Card className="border-border/30">
                  <CardHeader>
                    <CardTitle className="font-serif">Avatar Gallery</CardTitle>
                    <CardDescription>
                      Unlock and equip avatars by placing orders, leaving reviews, and earning SnusPoints.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvatarGallery
                      avatars={avatars}
                      unlockedAvatarIds={unlockedAvatarIds}
                      currentAvatarId={currentAvatarId}
                      onSelect={handleAvatarSelect}
                    />
                  </CardContent>
                </Card>

                {user?.id && (
                  <Card className="border-border/30">
                    <CardHeader>
                      <CardTitle className="font-serif">Pouch Character</CardTitle>
                      <CardDescription>
                        Build your custom pouch avatar. Pick a shape, color, expression, accessory, and background.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PouchBuilder userId={user.id} />
                    </CardContent>
                  </Card>
                )}

                {user?.id && (
                  <Card className="border-border/30">
                    <CardHeader>
                      <CardTitle className="font-serif">Your Preferences</CardTitle>
                      <CardDescription>
                        Tell us about your snus preferences. These appear as badges on your reviews.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AttributeEditor userId={user.id} />
                    </CardContent>
                  </Card>
                )}

                {achievementData && (
                  <section className="mt-8">
                    <AchievementGrid
                      grouped={achievementData.grouped}
                      unlockedCount={achievementData.unlockedCount}
                      totalCount={achievementData.totalCount}
                    />
                  </section>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
