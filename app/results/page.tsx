import type { Metadata } from 'next';
import type { Product } from '../../core/types';
import type { ScoringEngine } from '../../lib/scoring';
import ResultsPageClient from './page-client';

interface ResultsPageProps {
  products?: Product[];
  scoringEngine?: ScoringEngine;
  resultsHeading?: string;
  homeHref?: string;
}

export function generateMetadata(): Metadata {
  return {
    robots: { index: false, follow: true },
    alternates: {
      canonical: '/results',
    },
  };
}

export default function ResultsPage(props: ResultsPageProps) {
  return <ResultsPageClient {...props} />;
}

