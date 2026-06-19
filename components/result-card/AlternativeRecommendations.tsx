import React from 'react';
import ResultCard from './ResultCard';
import { RecommendationData, UserProfile } from '../../core/types';

interface AlternativeRecommendationsProps {
  alternatives: RecommendationData[];
  userProfile: UserProfile;
}

const AlternativeRecommendations: React.FC<AlternativeRecommendationsProps> = ({ alternatives, userProfile }) => {
  if (!alternatives.length) return null;

  return (
    <div style={{ marginTop: 20 }}>
      {alternatives.slice(0, 2).map((recommendation) => (
        <ResultCard key={recommendation.productId} recommendation={recommendation} userProfile={userProfile} />
      ))}
    </div>
  );
};

export default AlternativeRecommendations;