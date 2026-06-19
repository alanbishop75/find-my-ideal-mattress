import React from 'react';
import { TechnicalDetail } from '../../core/types';

interface TechnicalDetailsAccordionProps {
  details: TechnicalDetail[];
}

const TechnicalDetailsAccordion: React.FC<TechnicalDetailsAccordionProps> = ({ details }) => {
  if (!details.length) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 700, color: '#1a3d2f', marginBottom: 10 }}>
          Why this mattress fits
        </summary>
        <ul style={{ paddingLeft: 18, margin: '8px 0 0', color: '#355445', lineHeight: 1.7 }}>
          {details.map((detail) => (
            <li key={detail.label} style={{ marginBottom: 10 }}>
              <span style={{ fontWeight: 700 }}>{detail.label}:</span> {detail.translation}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};

export default TechnicalDetailsAccordion;