import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Sparkles, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { computeArchetype, type FlavorProfileInput, type StrengthPref } from '@/hooks/useFlavorProfile';

/* ------------------------------------------------------------------ */
/*  Quiz data                                                          */
/* ------------------------------------------------------------------ */

interface QuizOption {
  label: string;
  emoji: string;
  scores: Partial<Record<'mint' | 'fruit' | 'sweet' | 'bold', number>>;
  strengthBias?: StrengthPref;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'morning',
    question: 'Pick your morning vibe',
    subtitle: 'You just woke up. What hits different?',
    options: [
      { label: 'Crisp mint breeze', emoji: '\u2744\uFE0F', scores: { mint: 30 } },
      { label: 'Fruity burst', emoji: '\uD83C\uDF4A', scores: { fruit: 30 } },
      { label: 'Bold espresso', emoji: '\u2615', scores: { bold: 30 } },
      { label: 'Sweet pastry', emoji: '\uD83C\uDF69', scores: { sweet: 30 } },
    ],
  },
  {
    id: 'adventure',
    question: 'Your ideal weekend escape?',
    subtitle: 'Adventure awaits. Where are you headed?',
    options: [
      { label: 'Nordic ice hotel', emoji: '\uD83C\uDFD4\uFE0F', scores: { mint: 25, bold: 10 } },
      { label: 'Tropical island', emoji: '\uD83C\uDFDD\uFE0F', scores: { fruit: 25, sweet: 10 } },
      { label: 'City rooftop bar', emoji: '\uD83C\uDF03', scores: { bold: 25, sweet: 10 } },
      { label: 'Berry farm trail', emoji: '\uD83C\uDF53', scores: { fruit: 20, sweet: 15 } },
    ],
  },
  {
    id: 'music',
    question: 'What\'s on your playlist?',
    subtitle: 'Your soundtrack says a lot about your taste.',
    options: [
      { label: 'Chill lo-fi beats', emoji: '\uD83C\uDFB5', scores: { mint: 20, sweet: 10 } },
      { label: 'Upbeat pop anthems', emoji: '\uD83C\uDFA4', scores: { fruit: 20, sweet: 10 } },
      { label: 'Heavy bass drops', emoji: '\uD83D\uDD0A', scores: { bold: 25, mint: 5 } },
      { label: 'Smooth jazz', emoji: '\uD83C\uDFB7', scores: { sweet: 20, bold: 10 } },
    ],
  },
  {
    id: 'snack',
    question: 'Midnight snack craving?',
    subtitle: 'Fridge door open. What are you reaching for?',
    options: [
      { label: 'Mint choc chip ice cream', emoji: '\uD83C\uDF68', scores: { mint: 20, sweet: 10 } },
      { label: 'Mango smoothie bowl', emoji: '\uD83E\uDD64', scores: { fruit: 25, sweet: 5 } },
      { label: 'Dark chocolate', emoji: '\uD83C\uDF6B', scores: { bold: 20, sweet: 10 } },
      { label: 'Cinnamon rolls', emoji: '\uD83C\uDF00', scores: { sweet: 25, bold: 5 } },
    ],
  },
  {
    id: 'strength',
    question: 'How do you like your kick?',
    subtitle: 'Nicotine strength is personal. No wrong answers.',
    options: [
      { label: 'Mellow & light', emoji: '\uD83C\uDF3F', scores: {}, strengthBias: 'light' },
      { label: 'Balanced & smooth', emoji: '\u2696\uFE0F', scores: {}, strengthBias: 'regular' },
      { label: 'Punchy & strong', emoji: '\uD83D\uDCAA', scores: {}, strengthBias: 'strong' },
      { label: 'Maximum intensity', emoji: '\uD83D\uDD25', scores: {}, strengthBias: 'extra_strong' },
    ],
  },
  {
    id: 'wild',
    question: 'The wild card round!',
    subtitle: 'One last pick to seal your Flavor DNA.',
    options: [
      { label: 'Eucalyptus sauna', emoji: '\uD83C\uDF2C\uFE0F', scores: { mint: 20, bold: 5 } },
      { label: 'Watermelon poolside', emoji: '\uD83C\uDF49', scores: { fruit: 15, sweet: 10 } },
      { label: 'Campfire s\'mores', emoji: '\uD83C\uDD82', scores: { sweet: 15, bold: 10 } },
      { label: 'Black liquorice', emoji: '\u26AB', scores: { bold: 20, mint: 5 } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Radar chart (pure SVG)                                             */
/* ------------------------------------------------------------------ */

interface RadarProps {
  mint: number;
  fruit: number;
  sweet: number;
  bold: number;
}

function FlavorRadar({ mint, fruit, sweet, bold }: RadarProps) {
  const cx = 120, cy = 120, r = 90;
  const labels = [
    { name: 'Mint', angle: -90, value: mint },
    { name: 'Fruit', angle: 0, value: fruit },
    { name: 'Sweet', angle: 90, value: sweet },
    { name: 'Bold', angle: 180, value: bold },
  ];

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1].map((scale) => {
    const pts = labels.map((l) => {
      const rad = toRad(l.angle);
      return `${cx + r * scale * Math.cos(rad)},${cy + r * scale * Math.sin(rad)}`;
    });
    return pts.join(' ');
  });

  // Data polygon
  const dataPts = labels.map((l) => {
    const rad = toRad(l.angle);
    const s = (l.value / 100) * r;
    return `${cx + s * Math.cos(rad)},${cy + s * Math.sin(rad)}`;
  });

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* Grid */}
      {rings.map((pts, i) => (
        <polygon
          key={i}
          points={pts}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
      ))}
      {/* Axes */}
      {labels.map((l) => {
        const rad = toRad(l.angle);
        return (
          <line
            key={l.name}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(rad)} y2={cy + r * Math.sin(rad)}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        );
      })}
      {/* Data shape */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        points={dataPts.join(' ')}
        fill="hsl(var(--primary))"
        fillOpacity={0.25}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      {/* Dots + labels */}
      {labels.map((l) => {
        const rad = toRad(l.angle);
        const s = (l.value / 100) * r;
        const lx = cx + (r + 18) * Math.cos(rad);
        const ly = cy + (r + 18) * Math.sin(rad);
        return (
          <g key={l.name}>
            <circle
              cx={cx + s * Math.cos(rad)}
              cy={cy + s * Math.sin(rad)}
              r={4}
              fill="hsl(var(--primary))"
            />
            <text
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground text-[11px] font-medium"
            >
              {l.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Results screen                                                     */
/* ------------------------------------------------------------------ */

interface ResultsProps {
  profile: FlavorProfileInput;
  onRetake: () => void;
}

function QuizResults({ profile, onRetake }: ResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Your Flavor DNA</p>
        <h2 className="text-3xl font-bold text-foreground">{profile.profile_name}</h2>
      </div>

      <FlavorRadar
        mint={profile.mint_score}
        fruit={profile.fruit_score}
        sweet={profile.sweet_score}
        bold={profile.bold_score}
      />

      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {[
          { label: 'Mint', value: profile.mint_score, color: 'text-emerald-400' },
          { label: 'Fruit', value: profile.fruit_score, color: 'text-amber-400' },
          { label: 'Sweet', value: profile.sweet_score, color: 'text-pink-400' },
          { label: 'Bold', value: profile.bold_score, color: 'text-orange-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn('text-lg font-bold', s.color)}>{s.value}%</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 max-w-xs mx-auto">
        <p className="text-xs text-muted-foreground">Strength preference</p>
        <p className="text-sm font-semibold text-foreground capitalize">
          {profile.strength_pref.replace('_', ' ')}
        </p>
      </div>

      <Button
        variant="outline"
        onClick={onRetake}
        className="gap-2 rounded-xl"
      >
        <RotateCcw className="h-4 w-4" />
        Retake Quiz
      </Button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main quiz component                                                */
/* ------------------------------------------------------------------ */

interface FlavorQuizProps {
  existingProfile?: FlavorProfileInput | null;
  onComplete: (profile: FlavorProfileInput) => void;
  isSaving?: boolean;
}

function FlavorQuizInner({ existingProfile, onComplete, isSaving }: FlavorQuizProps) {
  const [step, setStep] = useState(existingProfile ? -1 : 0); // -1 = show results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [strengthPref, setStrengthPref] = useState<StrengthPref>('regular');
  const [direction, setDirection] = useState(1);

  const totalSteps = QUESTIONS.length;

  const handleSelect = useCallback((questionId: string, option: QuizOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: QUESTIONS.findIndex((q) => q.id === questionId) >= 0 ? QUESTIONS[0].options.indexOf(option) : 0 }));

    // Accumulate scores
    const newScores = { ...option.scores };

    // Store per-question answer for re-calculation
    setAnswers((prev) => {
      const updated = { ...prev };
      // Store the option index
      updated[questionId] = QUESTIONS.find((q) => q.id === questionId)!.options.indexOf(option);
      return updated;
    });

    if (option.strengthBias) {
      setStrengthPref(option.strengthBias);
    }

    // Auto-advance after selection with short delay
    setTimeout(() => {
      if (step < totalSteps - 1) {
        setDirection(1);
        setStep((s) => s + 1);
      } else {
        // Compute final profile
        finishQuiz();
      }
    }, 350);
  }, [step, totalSteps]);

  const finishQuiz = useCallback(() => {
    // Recalculate all scores from answers
    const totals = { mint: 0, fruit: 0, sweet: 0, bold: 0 };
    for (const [qId, optIdx] of Object.entries(answers)) {
      const question = QUESTIONS.find((q) => q.id === qId);
      if (!question) continue;
      const option = question.options[optIdx];
      if (!option) continue;
      for (const [key, val] of Object.entries(option.scores)) {
        totals[key as keyof typeof totals] += val;
      }
    }

    // Clamp to 0-100
    const clamp = (v: number) => Math.min(100, Math.max(0, v));
    const profile: FlavorProfileInput = {
      mint_score: clamp(totals.mint),
      fruit_score: clamp(totals.fruit),
      sweet_score: clamp(totals.sweet),
      bold_score: clamp(totals.bold),
      strength_pref: strengthPref,
      profile_name: '',
    };
    profile.profile_name = computeArchetype(profile);
    onComplete(profile);
    setStep(-1);
  }, [answers, strengthPref, onComplete]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setStrengthPref('regular');
    setDirection(1);
    setStep(0);
  }, []);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  // Show existing or just-completed results
  if (step === -1) {
    const displayProfile = existingProfile ?? {
      mint_score: 0, fruit_score: 0, sweet_score: 0, bold_score: 0,
      strength_pref: 'regular' as StrengthPref, profile_name: 'Newcomer',
    };
    return <QuizResults profile={displayProfile} onRetake={handleRetake} />;
  }

  const currentQ = QUESTIONS[step];
  const selectedIdx = answers[currentQ.id];

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {step + 1} of {totalSteps}</span>
          <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentQ.id}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="space-y-4"
        >
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground">{currentQ.question}</h3>
            <p className="text-sm text-muted-foreground mt-1">{currentQ.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(currentQ.id, opt)}
                className={cn(
                  'group/opt relative rounded-2xl border p-4 text-left transition-all duration-200',
                  'hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  selectedIdx === idx
                    ? 'border-primary/60 bg-primary/10 shadow-sm'
                    : 'border-white/[0.08] bg-white/[0.03]',
                )}
                aria-label={opt.label}
              >
                <span className="block text-2xl mb-2">{opt.emoji}</span>
                <span className="block text-sm font-medium text-foreground leading-snug">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          disabled={step === 0}
          className="gap-1 text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {selectedIdx !== undefined && step < totalSteps - 1 && (
          <Button
            size="sm"
            onClick={() => { setDirection(1); setStep((s) => s + 1); }}
            className="gap-1 rounded-xl"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {selectedIdx !== undefined && step === totalSteps - 1 && (
          <Button
            size="sm"
            onClick={finishQuiz}
            disabled={isSaving}
            className="gap-1.5 rounded-xl"
          >
            <Sparkles className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Reveal My DNA'}
          </Button>
        )}
      </div>
    </div>
  );
}

export const FlavorQuiz = React.memo(FlavorQuizInner);
