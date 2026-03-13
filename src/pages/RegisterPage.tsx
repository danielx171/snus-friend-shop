import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { supabase } from '@/integrations/supabase/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });
    setIsLoading(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (data.session) {
      navigate('/account');
    } else {
      setConfirmationSent(true);
    }
  };

  return (
    <>
      <SEO title="Create Account | SnusFriend" description="Create your SnusFriend account." />
      <Layout showNicotineWarning={false}>
        <div className="container py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-border/30">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>Join SnusFriend for exclusive offers and easy reordering</CardDescription>
              </CardHeader>
              <CardContent>
                {confirmationSent ? (
                  <div className="py-6 text-center space-y-2">
                    <p className="font-semibold text-foreground">Check your email</p>
                    <p className="text-sm text-muted-foreground">
                      We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to activate your account.
                    </p>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="firstName" placeholder="John" className="pl-10" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" required value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-10" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Must be at least 8 characters</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="age"
                      checked={ageConfirmed}
                      onCheckedChange={(v) => setAgeConfirmed(!!v)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="age" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I confirm I am at least 18 years old
                    </Label>
                  </div>

                  {authError && (
                    <p className="text-sm text-destructive">{authError}</p>
                  )}
                  <Button type="submit" className="w-full rounded-xl h-11 glow-primary" disabled={!ageConfirmed || isLoading}>
                    {isLoading ? 'Creating account…' : 'Create Account'}
                  </Button>
                </form>
                )}

                <Separator className="my-6 bg-border/30" />

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
                </p>

                <p className="text-center text-[11px] text-muted-foreground mt-4 leading-relaxed">
                  By creating an account you agree to our{' '}
                  <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="underline cursor-pointer">Privacy Policy</span>.
                  We'll never share your details with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
