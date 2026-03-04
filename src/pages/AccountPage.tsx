import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/states/EmptyState';
import { User, Package, CreditCard, Settings, LogOut } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';

export default function AccountPage() {
  // Placeholder: simulate logged-in state
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">My Account</h1>
              <p className="text-sm text-muted-foreground mt-1">Welcome back, John</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-11 rounded-xl bg-muted/20 border border-border/20 p-1">
              <TabsTrigger value="orders" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-xs">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-xs">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Subscriptions</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-xs">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 rounded-lg text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:shadow-xs">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>Track and manage your past orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    variant="orders"
                    title="No orders yet"
                    description="Your order history will appear here once you place your first order. Browse our range to get started!"
                    actionLabel="Browse Products"
                    actionHref="/nicotine-pouches"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>Manage your recurring deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    variant="generic"
                    title="No active subscriptions"
                    description="Subscribe to your favourite products and save 10% on every delivery. You can pause or cancel anytime."
                    actionLabel="Explore Subscribe & Save"
                    actionHref="/nicotine-pouches"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
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
                      <Input type="email" placeholder="john@example.com" defaultValue="john@example.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Phone (optional)</Label>
                      <Input type="tel" placeholder="+44 7000 000000" />
                    </div>
                  </div>
                  <Button className="rounded-xl glow-primary">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">Change Password</h3>
                    <p className="text-xs text-muted-foreground">Update your password to keep your account secure.</p>
                    <Button variant="outline" size="sm" className="rounded-xl border-border/30">Change Password</Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">Email Preferences</h3>
                    <p className="text-xs text-muted-foreground">Manage marketing emails and order notifications.</p>
                    <Button variant="outline" size="sm" className="rounded-xl border-border/30">Manage Preferences</Button>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-border/20">
                    <h3 className="text-sm font-medium text-destructive">Delete Account</h3>
                    <p className="text-xs text-muted-foreground">Permanently remove your account and all associated data.</p>
                    <Button variant="outline" size="sm" className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </>
  );
}
