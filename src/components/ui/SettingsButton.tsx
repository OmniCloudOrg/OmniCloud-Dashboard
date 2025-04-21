import React from 'react';
import Link from 'next/link';

interface SettingsButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Settings button component with sun/gear icon
 */
const SettingsButton: React.FC<SettingsButtonProps> = ({ 
  onClick, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <Link href="/dash/settings">
      <button
        className={`flex items-center justify-center rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${sizeClasses[size]} ${className}`}
        onClick={onClick}
        aria-label="Settings"
      >
        <svg 
          width={iconSizes[size]} 
          height={iconSizes[size]} 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG paths remain unchanged */}
          <path 
            d="M10 15.8333C13.2217 15.8333 15.8333 13.2217 15.8333 10C15.8333 6.77834 13.2217 4.16667 10 4.16667C6.77834 4.16667 4.16667 6.77834 4.16667 10C4.16667 13.2217 6.77834 15.8333 10 15.8333Z" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M10 1.66667V2.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M10 17.5V18.3333" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M3.5 10H2.5" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M17.5 10H16.6667" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M5.29999 5.29999L4.58332 4.58332" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M15.4167 15.4167L14.7 14.7" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M5.29999 14.7L4.58332 15.4167" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M15.4167 4.58332L14.7 5.29999" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </button>
    </Link>
  );
};

export default SettingsButton;