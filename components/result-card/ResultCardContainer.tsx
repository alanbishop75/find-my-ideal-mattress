import React from 'react';
import ResultCard from './ResultCard';
import AlternativeRecommendations from './AlternativeRecommendations';
import { RecommendationData, UserProfile } from '../../core/types';

interface ResultCardContainerProps {
  mainRecommendation: RecommendationData;
  alternatives?: RecommendationData[];
  userProfile: UserProfile;
}

const ResultCardContainer: React.FC<ResultCardContainerProps> = ({ mainRecommendation, alternatives = [], userProfile }) => {
  return (
    <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
      <ResultCard recommendation={mainRecommendation} userProfile={userProfile} isMain />
      {alternatives.length > 0 ? (
        <AlternativeRecommendations alternatives={alternatives} userProfile={userProfile} />
      ) : null}
    </div>
  );
};

export default ResultCardContainer;