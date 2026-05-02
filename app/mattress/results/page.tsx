"use client";
import { categoryRegistry } from "../../../config/registry";
import ResultsPageClient from "../../results/page-client";

export default function MattressResultsPage() {
  const config = categoryRegistry["mattress"];
  return (
    <ResultsPageClient
      products={config.products}
      scoringEngine={config.scoringEngine}
      resultsHeading={config.meta.resultsHeading}
      homeHref="/"
      questionnaireHref="/mattress/questionnaire"
    />
  );
}
