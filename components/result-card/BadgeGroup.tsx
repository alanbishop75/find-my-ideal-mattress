import React from 'react';
import Badge from './Badge';
import { BadgeData } from '../../core/types';

interface BadgeGroupProps {
  badges: BadgeData[];
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({ badges }) => {
  if (!badges.length) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0 0' }}>
      {badges.map((badge) => (
        <Badge key={badge.label} badge={badge} />
      ))}
    </div>
  );
};

export default BadgeGroup;