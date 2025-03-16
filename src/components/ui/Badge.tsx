import React from 'react';

interface BadgeProps {
  count: number;
  maxCount?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Badge component for displaying counts
 */
const Badge: React.FC<BadgeProps> = ({
  count,
  maxCount = 99,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Size classes
  const sizeClasses = {
    sm: 'min-w-4 h-4 text-xs',
    md: 'min-w-5 h-5 text-xs'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-slate-600 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <span 
      className={`
        inline-flex items-center justify-center px-1 
        rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
    >
      {displayCount}
    </span>
  );
};

export default Badge;