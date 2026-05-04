import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — FindYourIdealMattress',
  description: 'Frequently asked questions about quiz logic, recommendations, affiliate links, and pricing caveats on FindYourIdealMattress.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/faq',
  },
};

const faqSections = [
  {
    title: 'About The Quiz',
    items: [
      {
        q: 'How does the recommendation quiz work?',
        a: 'The quiz uses your answers on sleep position, body weight, temperature, material preference, pain points, and budget to rank mattress options by fit. It is a guidance tool, not a guaranteed fitting outcome.',
      },
      {
        q: 'How long does the quiz take?',
        a: 'Most people complete it in about 2 minutes. There is no account setup and no payment required.',
      },
      {
        q: 'Do I need to know exact mattress specifications?',
        a: 'No. The fitter asks about your sleep preferences in plain language — no technical jargon required.',
      },
    ],
  },
  {
    title: 'Recommendations',
    items: [
      {
        q: 'Are recommendations guaranteed to improve my sleep?',
        a: 'No. Mattress choice can help with comfort, support, and temperature regulation, but sleep quality also depends on your sleep habits, health, and pillow.',
      },
      {
        q: 'Why might my recommended mattress change over time?',
        a: 'As your sleep position, health needs, or preferences change, your ideal mattress can change too. Re-running the quiz periodically is normal.',
      },
      {
        q: 'Should I still try the mattress myself before committing?',
        a: 'Yes. Use the recommendations as a shortlist, then check each retailer\'s returns policy before purchasing.',
      },
    ],
  },
  {
    title: 'Retailers, Pricing, And Affiliate Links',
    items: [
      {
        q: 'Do prices on your site stay up to date?',
        a: 'Prices and availability can change at retailer level without notice. Always verify final details on the retailer product page before purchase.',
      },
      {
        q: 'Do you use affiliate links?',
        a: 'Some outgoing retailer links are affiliate links. If you buy through those links, we may earn a commission at no extra cost to you.',
      },
      {
        q: 'Does using an affiliate link change what I pay?',
        a: 'No. The retailer sets pricing and checkout terms. Affiliate tracking does not increase your purchase price.',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        q: 'Who should I contact for support or corrections?',
        a: 'Email hello@findyouridealmattress.com and include the page URL and a short description of your question or issue.',
      },
      {
        q: 'Can I suggest a mattress to add to the catalogue?',
        a: 'Yes. Send the product name and a direct retailer URL, and we will review it for inclusion in future updates.',
      },
    ],
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqSections
    .flatMap((section) => section.items)
    .map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px', lineHeight: 1.75 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Frequently Asked Questions</h1>
        <p style={{ color: '#666', marginBottom: 28, fontSize: 14 }}>Last updated: April 2026</p>

        <p>
          This page answers common questions about how FindYourIdealMattress works, how recommendations are generated,
          and what to expect when visiting retailer links.
        </p>

        {faqSections.map((section) => (
          <section key={section.title} style={{ marginTop: 30 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{section.title}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {section.items.map((item) => (
                <div key={item.q} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '14px 16px' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 600 }}>{item.q}</h3>
                  <p style={{ margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}