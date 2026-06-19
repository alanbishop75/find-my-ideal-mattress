import React from 'react';
import { RecommendationData } from '../../core/types';
import { useEventLogger } from '../useEventLogger';
import { generateUTM } from '../../lib/utm-generator';

interface CTASectionProps {
  recommendation: RecommendationData;
  isMain: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ recommendation, isMain }) => {
  const { log } = useEventLogger();
  if (!recommendation.affiliateUrl) return null;

  const hookId = isMain ? 'main_cta' : 'alt_cta';
  const utm = generateUTM({
    creativeId: recommendation.productId,
    hookId,
    campaignId: 'mattress',
    source: 'results',
  });

  function handleClick() {
    log({
      event: 'affiliate_click',
      creativeId: recommendation.productId,
      hookId,
      campaignId: 'mattress',
      source: 'results',
      meta: { affiliateUrl: recommendation.affiliateUrl, label: recommendation.label },
    });
  }

  return (
    <div style={{ margin: '18px 0 10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <a
        href={`${recommendation.affiliateUrl}${recommendation.affiliateUrl.includes('?') ? '&' : '?'}${utm}`}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
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