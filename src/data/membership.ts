import type { LucideIcon } from 'lucide-react';
import { Gift, Crown } from 'lucide-react';

export type MembershipTier = 'member' | 'vip';

export interface TierDefinition {
  id: MembershipTier;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  mysteryBoxLabel: string;
  mysteryBoxDesc: string;
  discount: string;
  perks: string[];
  icon: LucideIcon;
  /** Tailwind classes for tier accent color */
  accentText: string;
  accentBg: string;
  accentBorder: string;
  /** Gradient for card header area */
  gradientClass: string;
  /** Glow class for highlighted elements */
  glowClass: string;
}

export const TIERS: TierDefinition[] = [
  {
    id: 'member',
    name: 'Member',
    tagline: 'Your monthly pouch surprise',
    price: '€9.99',
    priceNote: '/month',
    mysteryBoxLabel: 'Curated Box',
    mysteryBoxDesc: 'A hand-picked selection of 5 premium pouches delivered to your door every month.',
    discount: '5% off all orders',
    perks: [
      'Monthly mystery box (5 cans)',
      '5% discount on all orders',
      'Early access to new drops',
      'Member-only flash sales',
      'Free shipping on all orders',
    ],
    icon: Gift,
    accentText: 'text-primary',
    accentBg: 'bg-primary',
    accentBorder: 'border-primary/30',
    gradientClass: 'from-primary/20 to-primary/5',
    glowClass: 'glow-primary',
  },
  {
    id: 'vip',
    name: 'VIP',
    tagline: 'The ultimate pouch experience',
    price: '€19.99',
    priceNote: '/month',
    mysteryBoxLabel: 'Premium Box',
    mysteryBoxDesc: 'An exclusive box of 10 premium & limited-edition pouches, plus vendor merchandise.',
    discount: '10% off all orders',
    perks: [
      'Premium mystery box (10 cans)',
      '10% discount on all orders',
      'Exclusive vendor merchandise access',
      'Early access to new drops',
      'VIP-only limited editions',
      'Free shipping on all orders',
      'Priority customer support',
    ],
    icon: Crown,
    accentText: 'text-[hsl(var(--chart-4))]',
    accentBg: 'bg-[hsl(var(--chart-4))]',
    accentBorder: 'border-[hsl(var(--chart-4)/0.3)]',
    gradientClass: 'from-[hsl(var(--chart-4)/0.2)] to-[hsl(var(--chart-4)/0.05)]',
    glowClass: 'shadow-[0_0_24px_hsl(var(--chart-4)/0.3)]',
  },
];

export const SNUSPOINTS = {
  pointsPerEuro: 10,
  freeTrialCost: 500,
  displayName: 'SnusPoints',
};

export const MEMBERSHIP_FAQ: { question: string; answer: string }[] = [
  {
    question: 'What is the Snus Family Club?',
    answer: 'The Snus Family Club is our membership program. Members receive a monthly mystery box of curated nicotine pouches, exclusive discounts on all orders, and early access to new products.',
  },
  {
    question: 'What\'s in the mystery box?',
    answer: 'Each mystery box is hand-curated by our team. The Member box includes 5 cans of premium pouches, while the VIP box includes 10 cans plus limited-edition flavors and vendor merchandise.',
  },
  {
    question: 'Can I cancel my membership?',
    answer: 'Yes, you can cancel anytime from your account page. Your membership benefits continue until the end of your current billing period.',
  },
  {
    question: 'What is the difference between Member and VIP?',
    answer: 'VIP members get a larger mystery box (10 vs 5 cans), access to exclusive vendor merchandise, a bigger discount (10% vs 5%), and VIP-only limited edition products.',
  },
  {
    question: 'What are SnusPoints?',
    answer: 'SnusPoints are our loyalty rewards. You earn 10 points for every €1 you spend on orders. Once you reach 500 points, you can redeem them for a free month of the mystery box — a great way to try membership risk-free!',
  },
  {
    question: 'How do I earn SnusPoints?',
    answer: 'Simply shop on SnusFriend! Every €1 you spend earns you 10 SnusPoints automatically. Points are credited after your order is confirmed.',
  },
  {
    question: 'Do SnusPoints expire?',
    answer: 'SnusPoints are valid for 12 months from the date they are earned. As long as you make a purchase within 12 months, your points stay active.',
  },
  {
    question: 'Is the merchandise only for VIP members?',
    answer: 'Yes, branded merchandise from our vendor partners is an exclusive VIP perk. Member-tier subscribers can upgrade to VIP anytime to unlock merch access.',
  },
];
