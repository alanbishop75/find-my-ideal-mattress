import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'About FindMyIdealMattress — Free, Personalised Mattress Recommendations',
  description: 'FindMyIdealMattress helps you find the right mattress for how you sleep through a quick, personalised quiz. No ads, no sign-up, no nonsense.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
