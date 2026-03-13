import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Mail, ArrowLeft, Check } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { supabase } from '@/integrations/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account`,
    });

    setIsLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      <SEO title="Reset Password | SnusFriend" description="Reset your SnusFriend account password." />
      <Layout showNicotineWarning={false}>
        <div className="container py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-border/30">
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${submitted ? 'bg-primary/10' : 'bg-muted/30'}`}>
                  {submitted ? <Check className="h-7 w-7 text-primary" /> : <KeyRound className="h-7 w-7 text-muted-foreground" />}
                </div>
                <CardTitle className="text-2xl">{submitted ? 'Check your email' : 'Reset your password'}</CardTitle>
                <CardDescription>
                  {submitted
                    ? ("We've sent a reset link to " + email + ". Check your inbox and follow the instructions.")
                    : "Enter your email and we'll send you a link to reset your password."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Didn't receive the email? Check your spam folder or{' '}
                      <button onClick={() => setSubmitted(false)} className="text-primary hover:underline">try again</button>.
                    </p>
                    <Button asChild variant="outline" className="w-full rounded-xl border-border/30">
                      <Link to="/login">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to sign in
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                      </div>
                    </div>
                    {authError && (
                      <p className="text-xs text-destructive">{authError}</p>
                    )}
                    <Button type="submit" className="w-full rounded-xl h-11 glow-primary" disabled={isLoading}>
                      {isLoading ? 'Sending…' : 'Send Reset Link'}
                    </Button>
                    <Button asChild variant="ghost" className="w-full text-sm">
                      <Link to="/login">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to sign in
                      </Link>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    </>
  );
}
