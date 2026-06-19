import React from 'react';
import { RecommendationData } from '../../core/types';

interface DiagnosticExplanationProps {
  recommendation: RecommendationData;
}

const DiagnosticExplanation: React.FC<DiagnosticExplanationProps> = ({ recommendation }) => {
  return (
    <p style={{ fontSize: 15, color: '#355445', margin: '12px 0 8px 0', lineHeight: 1.6 }}>
      {recommendation.diagnosticExplanation}
    </p>
  );
};

export default DiagnosticExplanation;