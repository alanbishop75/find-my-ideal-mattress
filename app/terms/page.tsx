import type { Metadata } from 'next';
import TermsPageClient from './TermsPageClient';

export const metadata: Metadata = {
  title: 'Terms of Use — FindMyIdealMattress',
  description: 'Terms of use for FindMyIdealMattress, including retailer-link and regional legal details.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}
