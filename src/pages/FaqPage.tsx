import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { SITE_URL } from '@/config/brand';
import { motion } from 'framer-motion';
import { Search, MessageCircleQuestion } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const aboutPouches: FaqItem[] = [
  {
    question: 'What are nicotine pouches?',
    answer: 'Nicotine pouches are small, white pouches placed under your upper lip. They deliver nicotine without tobacco, smoke, or vapour — making them a discreet, smoke-free alternative.',
  },
  {
    question: 'Are nicotine pouches legal in the UK?',
    answer: 'Yes. Nicotine pouches are legal in the UK and regulated as consumer nicotine products. They do not contain tobacco, so they fall outside tobacco product legislation.',
  },
  {
    question: 'What strength should I choose?',
    answer: (
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Normal (4–8mg)</strong> — good starting point if you're new to pouches</li>
        <li><strong>Strong (8–12mg)</strong> — suitable for regular users</li>
        <li><strong>Extra Strong (12–18mg)</strong> — for experienced users wanting a stronger hit</li>
        <li><strong>Ultra Strong (18mg+)</strong> — very high strength, not recommended for beginners</li>
      </ul>
    ),
  },
  {
    question: 'What is the minimum age to buy?',
    answer: 'You must be 18 or over to purchase nicotine products from SnusFriend. Age verification is required at checkout.',
  },
];

const ordersDelivery: FaqItem[] = [
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3–5 business days. Orders placed before 2pm on business days are dispatched the same day.',
  },
  {
    question: 'Do you ship to my country?',
    answer: "We ship to the UK and most EU countries. At checkout you'll see the countries we currently deliver to.",
  },
  {
    question: 'How do I get free delivery?',
    answer: 'Free delivery is available on all orders over €29. Orders below this threshold attract a standard shipping fee shown at checkout.',
  },
];

const rewards: FaqItem[] = [
  {
    question: 'What is SnusPoints?',
    answer: 'SnusPoints is our loyalty programme. You earn 10 SnusPoints for every €1 spent. Points can be redeemed for discounts on future orders. Sign up for a free account to start earning.',
  },
];

/** Recursively extract text from ReactNode for search matching. */
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join(' ');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props.children);
  }
  return '';
}

function filterFaqItems(items: FaqItem[], query: string): FaqItem[] {
  if (!query) return items;
  const lower = query.toLowerCase();
  return items.filter(
    (item) =>
      item.question.toLowerCase().includes(lower) ||
      extractText(item.answer).toLowerCase().includes(lower),
  );
}

function FaqCategory({ title, items, startIndex }: { title: string; items: FaqItem[]; startIndex: number }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-xs uppercase tracking-wider text-accent/70 font-medium mb-4 mt-8 first:mt-0">
        {title}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem
            key={startIndex + i}
            value={`item-${startIndex + i}`}
            className="border-b border-white/[0.04]"
          >
            <AccordionTrigger className="py-5 text-base font-medium text-foreground hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAbout = useMemo(() => filterFaqItems(aboutPouches, searchQuery), [searchQuery]);
  const filteredOrders = useMemo(() => filterFaqItems(ordersDelivery, searchQuery), [searchQuery]);
  const filteredRewards = useMemo(() => filterFaqItems(rewards, searchQuery), [searchQuery]);
  const totalResults = filteredAbout.length + filteredOrders.length + filteredRewards.length;
  const hasQuery = searchQuery.trim().length > 0;

  return (
    <>
      <SEO
        title="FAQ | SnusFriend"
        description="Frequently asked questions about ordering nicotine pouches, delivery, returns, and SnusPoints."
        canonical={`${SITE_URL}/faq`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            ...aboutPouches.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: typeof q.answer === 'string' ? q.answer : q.question === 'What strength should I choose?' ? 'Normal (4-8mg) for beginners, Strong (8-12mg) for regular users, Extra Strong (12-18mg) for experienced users, Ultra Strong (18mg+) for advanced users.' : '' } })),
            ...ordersDelivery.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: typeof q.answer === 'string' ? q.answer : '' } })),
            ...rewards.map(q => ({ '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: typeof q.answer === 'string' ? q.answer : '' } })),
          ],
        }}
      />
      <Layout showNicotineWarning={false}>
        <div className="container py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.div
              className="mx-auto w-12 h-[3px] rounded-full bg-accent mt-4 mb-4"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            />
            <motion.p
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Can't find what you're looking for?{' '}
              <Link to="/contact" className="text-accent hover:underline font-medium">
                Contact us
              </Link>
              .
            </motion.p>
          </div>

          {/* Search */}
          <motion.div
            className="max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-white/[0.06] focus-visible:border-accent/40 h-11"
                aria-label="Search FAQ"
              />
            </div>
          </motion.div>

          {/* FAQ card */}
          <motion.div
            className="max-w-3xl mx-auto bg-card/50 border border-white/[0.06] rounded-2xl p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            {hasQuery && totalResults === 0 ? (
              <div className="flex flex-col items-center text-center py-12 gap-4">
                <div className="rounded-full bg-muted/30 p-4">
                  <MessageCircleQuestion className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">
                    No results for "{searchQuery}"
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    We couldn't find a matching question. Try different keywords or{' '}
                    <Link to="/contact" className="text-accent hover:underline font-medium">
                      contact our support team
                    </Link>{' '}
                    — we're happy to help.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <FaqCategory title="About Nicotine Pouches" items={filteredAbout} startIndex={0} />
                <FaqCategory title="Orders & Delivery" items={filteredOrders} startIndex={aboutPouches.length} />
                <FaqCategory title="SnusFriend Rewards" items={filteredRewards} startIndex={aboutPouches.length + ordersDelivery.length} />
              </>
            )}
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
