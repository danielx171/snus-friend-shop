import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { SITE_URL } from '@/config/brand';
import { Card } from '@/components/ui/card';
import { FlavorQuiz } from '@/components/quiz/FlavorQuiz';
import { useFlavorProfile, type FlavorProfileInput } from '@/hooks/useFlavorProfile';
import { ProductCard } from '@/components/product/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FlavorQuizPage() {
  const { toast } = useToast();

  /* ---- Auth state ---- */
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ---- Profile hook ---- */
  const { profile, isLoading, saveProfile, isSaving, recommendations } = useFlavorProfile(userId);

  /* ---- Completed result held locally for non-auth users or fresh completions ---- */
  const [localResult, setLocalResult] = useState<FlavorProfileInput | null>(null);

  const handleComplete = useCallback(async (result: FlavorProfileInput) => {
    setLocalResult(result);

    if (!userId) {
      toast({
        title: 'Sign in to save your results',
        description: 'Create a free account to save your Flavor DNA and earn 25 SnusPoints.',
      });
      return;
    }

    try {
      await saveProfile(result);

      // Award 25 SnusPoints for quiz completion (idempotent — check if already awarded)
      const { data: existing } = await supabase
        .from('points_transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('reason', 'flavor_quiz_complete')
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from('points_transactions').insert({
          user_id: userId,
          points: 25,
          reason: 'flavor_quiz_complete',
        });
        // Also bump the balance
        const { data: bal } = await supabase
          .from('points_balances')
          .select('balance, lifetime_earned')
          .eq('user_id', userId)
          .maybeSingle();

        if (bal) {
          await supabase
            .from('points_balances')
            .update({
              balance: bal.balance + 25,
              lifetime_earned: bal.lifetime_earned + 25,
            })
            .eq('user_id', userId);
        }

        toast({
          title: '+25 SnusPoints!',
          description: 'Flavor DNA quiz completed. Points added to your account.',
        });
      } else {
        toast({
          title: 'Profile updated!',
          description: `You're a ${result.profile_name}. Browse your personalised picks below.`,
        });
      }
    } catch (err) {
      console.error('Failed to save flavor profile', err);
      toast({
        title: 'Saved locally',
        description: 'We couldn\'t save to your account right now, but your results are shown below.',
        variant: 'destructive',
      });
    }
  }, [userId, saveProfile, toast]);

  /* ---- Derive display profile ---- */
  const displayProfile: FlavorProfileInput | null = localResult ?? (profile ? {
    mint_score: profile.mint_score,
    fruit_score: profile.fruit_score,
    sweet_score: profile.sweet_score,
    bold_score: profile.bold_score,
    strength_pref: profile.strength_pref as FlavorProfileInput['strength_pref'],
    profile_name: profile.profile_name,
  } : null);

  return (
    <Layout>
      <SEO
        title="Flavor DNA Quiz | SnusFriend"
        description="Discover your nicotine pouch taste profile with the Flavor DNA quiz. Get personalised product recommendations based on your unique flavour preferences."
        canonical={`${SITE_URL}/flavor-quiz`}
      />

      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Earn 25 SnusPoints</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Flavor DNA Quiz
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Answer 6 quick questions and we'll map your unique taste profile to find your
              perfect pouch match.
            </p>
          </div>

          {/* Quiz card */}
          <Card className="rounded-2xl border-white/[0.06] bg-card/90 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.04)] p-6 sm:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <FlavorQuiz
                existingProfile={displayProfile}
                onComplete={handleComplete}
                isSaving={isSaving}
              />
            )}
          </Card>

          {/* Recommendations */}
          {displayProfile && recommendations.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-1">Your Top Picks</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Based on your {displayProfile.profile_name} profile, we think you'll love these.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
