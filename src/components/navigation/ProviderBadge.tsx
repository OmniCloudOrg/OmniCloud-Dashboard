import React from 'react';
import { ProviderBadgeProps } from '../../types';
import { getProviderIcon } from '../../utils/navigation';

/**
 * Cloud provider badge component
 */
const ProviderBadge: React.FC<ProviderBadgeProps> = ({ 
  provider, 
  isActive,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1 px-2 py-0.5 rounded-full text-xs 
        transition-all duration-200 focus:outline-none
        ${isActive
          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
        }
      `}
    >
      <span className="flex items-center gap-1.5">
        {getProviderIcon(provider)} {provider}
      </span>
    </button>
  );
};

export default ProviderBadge;