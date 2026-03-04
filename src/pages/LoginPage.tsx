import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — no actual auth
  };

  return (
    <>
      <SEO title="Sign In | SnusFriend" description="Sign in to your SnusFriend account." />
      <Layout showNicotineWarning={false}>
        <div className="container py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-border/30">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <LogIn className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to manage orders and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full rounded-xl h-11 glow-primary">Sign In</Button>
                </form>

                <Separator className="my-6 bg-border/30" />

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
                </p>

                <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
                  By signing in you confirm you are 18+ and agree to our{' '}
                  <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
