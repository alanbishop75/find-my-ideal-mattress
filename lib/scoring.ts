import { Product } from '../core/types';

/**
 * Scoring engine interface.
 * Takes a product and a map of quiz answers, returns a numeric score and human-readable reasons.
 */
export type ScoringEngine = (
  product: Product,
  answers: Record<string, string>
) => { score: number; reasons: string[] };
