export { Head }

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are nicotine pouches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nicotine pouches are small, white pouches placed under your upper lip. They deliver nicotine without tobacco, smoke, or vapour — making them a discreet, smoke-free alternative.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are nicotine pouches legal in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Nicotine pouches are legal in the UK and regulated as consumer nicotine products. They do not contain tobacco, so they fall outside tobacco product legislation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What strength should I choose?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Normal (4-8mg) for beginners, Strong (8-12mg) for regular users, Extra Strong (12-18mg) for experienced users, Ultra Strong (18mg+) for advanced users.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum age to buy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You must be 18 or over to purchase nicotine products from SnusFriend. Age verification is required at checkout.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard delivery takes 3–5 business days. Orders placed before 2pm on business days are dispatched the same day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you ship to my country?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "We ship to the UK and most EU countries. At checkout you'll see the countries we currently deliver to.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get free delivery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Free delivery is available on all orders over €29. Orders below this threshold attract a standard shipping fee shown at checkout.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is SnusPoints?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SnusPoints is our loyalty programme. You earn 10 SnusPoints for every €1 spent. Points can be redeemed for discounts on future orders. Sign up for a free account to start earning.',
      },
    },
  ],
}

function Head() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}
