import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Eye, EyeOff, Check, ArrowLeft } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { supabase } from '@/integrations/supabase/client';

// 'no-recovery': page visited without a recovery hash (direct nav or normal session)
// 'expired':     recovery hash was present but token exchange failed (link used or expired)
// 'init-error':  auth listener could not be established
type PageState = 'loading' | 'ready' | 'no-recovery' | 'expired' | 'init-error' | 'submitting' | 'success';

export default function UpdatePasswordPage() {
  const navigate = useNavigate();

  // Captured synchronously at first render, before Supabase's async initialize()
  // strips the hash. This is the only reliable way to detect recovery context
  // because PASSWORD_RECOVERY fires during Supabase init — before this component
  // mounts — and is not replayed when onAuthStateChange is registered.
  const [isRecoveryCallback] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery',
  );

  const [pageState, setPageState] = useState<PageState>('loading');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // No recovery token in the URL — direct navigation or normal signed-in user.
    // Resolve immediately without registering a listener.
    if (!isRecoveryCallback) {
      setPageState('no-recovery');
      return;
    }

    // Recovery hash was present. Register listener to catch Supabase's outcome:
    // - PASSWORD_RECOVERY fires if Supabase is still processing the hash async.
    // - INITIAL_SESSION fires (with the already-exchanged session) if processing
    //   completed before this component mounted.
    // Both paths use a `settled` flag so the first event wins.
    let settled = false;

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (settled) return;
        if (event === 'PASSWORD_RECOVERY' && session) {
          settled = true;
          setPageState('ready');
        } else if (event === 'INITIAL_SESSION') {
          settled = true;
          // Session present means the exchange succeeded (sync path).
          // Session absent means the token was invalid or already consumed.
          setPageState(session ? 'ready' : 'expired');
        }
      });

      return () => subscription.unsubscribe();
    } catch {
      setPageState('init-error');
    }
  }, [isRecoveryCallback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setAuthError(null);

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setValidationError('Passwords do not match.');
      return;
    }

    setPageState('submitting');
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setAuthError(error.message);
      setPageState('ready');
      return;
    }

    setPageState('success');
    setTimeout(() => navigate('/account'), 2000);
  };

  return (
    <>
      <SEO title="Update Password | SnusFriend" description="Set a new password for your SnusFriend account." />
      <Layout showNicotineWarning={false}>
        <div className="container py-16">
          <div className="max-w-md mx-auto">
            <Card className="border-border/30">
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${pageState === 'success' ? 'bg-primary/10' : 'bg-muted/30'}`}>
                  {pageState === 'success'
                    ? <Check className="h-7 w-7 text-primary" />
                    : <KeyRound className="h-7 w-7 text-muted-foreground" />}
                </div>
                <CardTitle className="text-2xl">
                  {pageState === 'success' ? 'Password updated' : 'Set new password'}
                </CardTitle>
                <CardDescription>
                  {pageState === 'success'
                    ? 'Your password has been changed. Redirecting you to your account…'
                    : 'Choose a new password for your account.'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {pageState === 'loading' && (
                  <p className="text-sm text-muted-foreground text-center py-4">Verifying reset link…</p>
                )}

                {pageState === 'no-recovery' && (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      This link is invalid. Use the forgot password page to request a new one.
                    </p>
                    <Button asChild variant="outline" className="w-full rounded-xl border-border/30">
                      <Link to="/forgot">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Request a reset link
                      </Link>
                    </Button>
                  </div>
                )}

                {pageState === 'expired' && (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      This reset link has expired or has already been used.
                    </p>
                    <Button asChild variant="outline" className="w-full rounded-xl border-border/30">
                      <Link to="/forgot">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Request a new link
                      </Link>
                    </Button>
                  </div>
                )}

                {pageState === 'init-error' && (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Something went wrong while verifying your reset link. Please try again.
                    </p>
                    <Button asChild variant="outline" className="w-full rounded-xl border-border/30">
                      <Link to="/forgot">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Request a new link
                      </Link>
                    </Button>
                  </div>
                )}

                {pageState === 'success' && (
                  <div className="text-center py-2">
                    <Button asChild variant="outline" className="rounded-xl border-border/30">
                      <Link to="/account">Go to account</Link>
                    </Button>
                  </div>
                )}

                {(pageState === 'ready' || pageState === 'submitting') && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">New password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min. 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                          required
                          minLength={6}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm new password</Label>
                      <Input
                        id="confirm"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Repeat your new password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    {(validationError || authError) && (
                      <p className="text-sm text-destructive">{validationError ?? authError}</p>
                    )}

                    <Button
                      type="submit"
                      className="w-full rounded-xl h-11 glow-primary"
                      disabled={pageState === 'submitting'}
                    >
                      {pageState === 'submitting' ? 'Updating…' : 'Update Password'}
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
