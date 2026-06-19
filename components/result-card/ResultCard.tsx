import React from 'react';
import Image from 'next/image';
import DiagnosticExplanation from './DiagnosticExplanation';
import BadgeGroup from './BadgeGroup';
import CTASection from './CTASection';
import TechnicalDetailsAccordion from './TechnicalDetailsAccordion';
import TrustDisclosure from './TrustDisclosure';
import { RecommendationData, UserProfile } from '../../core/types';

interface ResultCardProps {
  recommendation: RecommendationData;
  userProfile: UserProfile;
  isMain?: boolean;
}

const borderColorByLabel: Record<string, string> = {
  'Best Match': '#3bb273',
  'Strong Alternative': '#9bc5a9',
  'Best Value': '#7d9f86',
};

const ResultCard: React.FC<ResultCardProps> = ({ recommendation, isMain }) => {
  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        padding: 20,
        width: '100%',
        margin: '0 auto 18px auto',
        border: `2px solid ${borderColorByLabel[recommendation.label] ?? '#d7e8dc'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '4px 0 12px 0' }}>
        <Image src={recommendation.imageUrl} alt={recommendation.productName} width={88} height={88} style={{ objectFit: 'contain', borderRadius: 8, flexShrink: 0, background: '#f6fbf7' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 2px 0', color: '#1a3d2f', lineHeight: 1.15 }}>{recommendation.brand} {recommendation.productName}</h2>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#3bb273', lineHeight: 1.1 }}>{isMain ? 'Your Best Match' : recommendation.label}</h3>
          {recommendation.priceHint ? (
            <span style={{ fontSize: 13, color: '#617969', marginTop: 3 }}>{recommendation.priceHint}</span>
          ) : null}
        </div>
      </div>

      <DiagnosticExplanation recommendation={recommendation} />
      <BadgeGroup badges={recommendation.badges} />
      <TechnicalDetailsAccordion details={recommendation.technicalDetails} />
      <CTASection recommendation={recommendation} isMain={!!isMain} />
      {isMain ? <TrustDisclosure /> : null}
    </section>
  );
};

export default ResultCard;