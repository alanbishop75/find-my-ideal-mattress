import React from 'react';
import { RecommendationData } from '../../core/types';

interface CTASectionProps {
  recommendation: RecommendationData;
  isMain: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ recommendation, isMain }) => {
  if (!recommendation.affiliateUrl) return null;

  return (
    <div style={{ margin: '18px 0 10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <a
        href={recommendation.affiliateUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        style={{
          display: 'inline-block',
          background: '#3bb273',
          color: '#123125',
          borderRadius: 10,
          fontWeight: 800,
          fontSize: 15,
          padding: '12px 0',
          textAlign: 'center',
          textDecoration: 'none',
          width: '100%',
        }}
      >
        {isMain ? 'Shop this pick' : 'View retailer'}
      </a>
    </div>
  );
};

export default CTASection;