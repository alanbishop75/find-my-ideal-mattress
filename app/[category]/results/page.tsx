"use client";
import { useParams } from 'next/navigation';
import { categoryRegistry } from '../../../config/registry';
import { Suspense } from 'react';
import ResultsPageClient from '../../results/page-client';

function CategoryResultsInner() {
  const params = useParams();
  const categoryId = params?.category as string;
  const config = categoryRegistry[categoryId];

  if (!config) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <p>Category &quot;{categoryId}&quot; not found.</p>
      </div>
    );
  }

  return (
    <ResultsPageClient
      products={config.products}
      scoringEngine={config.scoringEngine}
      resultsHeading={config.meta.resultsHeading}
      homeHref="/"
      questionnaireHref={`/${categoryId}/questionnaire`}
    />
  );
}

export default function CategoryResultsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#888" }}>Finding your best matches…</div>}>
      <CategoryResultsInner />
    </Suspense>
  );
}
