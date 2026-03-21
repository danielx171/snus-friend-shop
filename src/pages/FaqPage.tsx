import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/seo/SEO';
import { motion } from 'framer-motion';
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

function FaqCategory({ title, items, startIndex }: { title: string; items: FaqItem[]; startIndex: number }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wider text-accent/70 font-medium mb-4 mt-8 first:mt-0">
        {title}
      </h3>
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
  return (
    <>
      <SEO
        title="FAQ | SnusFriend"
        description="Frequently asked questions about nicotine pouches, delivery, and SnusPoints at SnusFriend."
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

          {/* FAQ card */}
          <motion.div
            className="max-w-3xl mx-auto bg-card/50 border border-white/[0.06] rounded-2xl p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          >
            <FaqCategory title="About Nicotine Pouches" items={aboutPouches} startIndex={0} />
            <FaqCategory title="Orders & Delivery" items={ordersDelivery} startIndex={aboutPouches.length} />
            <FaqCategory title="SnusFriend Rewards" items={rewards} startIndex={aboutPouches.length + ordersDelivery.length} />
          </motion.div>
        </div>
      </Layout>
    </>
  );
}
