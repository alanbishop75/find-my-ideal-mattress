export interface BadgeData {
  label: string;
  icon: React.ReactNode;
}

export interface TechnicalDetail {
  label: string;
  value: string;
  translation: string;
}

export interface RecommendationData {
  productId: string;
  productName: string;
  brand: string;
  imageUrl: string;
  label: string;
  diagnosticExplanation: string;
  badges: BadgeData[];
  affiliateUrl: string;
  technicalDetails: TechnicalDetail[];
  fitScore?: number;
  priceHint?: string;
}

export interface UserProfile {
  answers: Record<string, string>;
}