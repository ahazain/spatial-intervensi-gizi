import React from 'react';
import { NutritionStatus } from '../../types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: NutritionStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  className = '' 
}) => {
  const statusConfig = {
    normal: {
      text: 'Normal',
      className: 'bg-green-100 text-green-800',
    },
    underweight: {
      text: 'Gizi Kurang',
      className: 'bg-yellow-100 text-yellow-800',
    },
    severely_underweight: {
      text: 'Gizi Buruk',
      className: 'bg-red-100 text-red-800',
    },
    stunting: {
      text: 'Stunting',
      className: 'bg-orange-100 text-orange-800',
    },
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  const { text, className: statusClassName } = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        statusClassName,
        sizeClasses[size],
        className
      )}
    >
      {text}
    </span>
  );
};

export default StatusBadge;