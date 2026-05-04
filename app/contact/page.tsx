import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact — FindYourIdealMattress',
  description: 'Get in touch with FindYourIdealMattress. Questions, suggestions, or spotted an error — we\'d love to hear from you.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
