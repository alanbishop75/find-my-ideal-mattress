import React from 'react';
import { BadgeData } from '../../core/types';

interface BadgeProps {
  badge: BadgeData;
}

const Badge: React.FC<BadgeProps> = ({ badge }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 999,
        background: '#f1f8f3',
        color: '#1a3d2f',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <span aria-hidden>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  );
};

export default Badge;