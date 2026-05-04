import { Questionnaire, Product } from '../core/types';
import { ThemeName } from '../core/theme/tokens';
import { ScoringEngine } from '../lib/scoring';
import { mattressQuestionnaire } from './mattress/questionnaire';
import { products as mattressProducts } from './mattress/products';
import { scoreMattress } from './mattress/scoring';
export { defaultCategoryId } from './domain-map';

export interface CategoryMeta {
  title: string;
  description: string;
  /** Brand name shown in the site header, e.g. "FindMyIdealPillow" */
  brandName: string;
  hero: string;
  subhero: string;
  ctaText: string;
  resultsHeading: string;
}

export interface CategoryConfig {
  id: string;
  meta: CategoryMeta;
  theme: ThemeName;
  questionnaire: Questionnaire;
  products: Product[];
  scoringEngine: ScoringEngine;
}

export const categoryRegistry: Record<string, CategoryConfig> = {
  'mattress': {
    id: 'mattress',
    meta: {
      title: 'FindYourIdealMattress — Find Your Perfect Mattress',
      description: 'Answer a few quick questions and get a free, personalised mattress recommendation tailored to how you sleep.',
      brandName: 'FindYourIdealMattress',
      hero: 'Answer a few questions.\nGet your ideal mattress.',
      subhero: 'Free, instant recommendations tailored to how you sleep.',
      ctaText: 'Start fitting →',
      resultsHeading: 'Your best-fit mattresses',
    },
    theme: 'light-green',
    questionnaire: mattressQuestionnaire,
    products: mattressProducts,
    scoringEngine: scoreMattress,
  },
};

export type CategoryId = keyof typeof categoryRegistry;
