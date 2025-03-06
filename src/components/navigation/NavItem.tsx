import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NavItemProps } from '../../types';
import Badge from '../ui/Badge';

/**
 * Navigation item component for sidebar
 */
const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick, 
  hasSubmenu, 
  isSubmenuOpen, 
  badgeCount = 0 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between w-full p-2.5 rounded-lg 
        transition-all duration-200 group
        ${isActive
          ? 'bg-blue-500/10 text-blue-400 font-medium'
          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
        }
      `}
      aria-expanded={isSubmenuOpen}
    >
      <div className="flex items-center gap-3">
        <div className={`
          p-1.5 rounded-md transition-colors
          ${isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}
        `}>
          <Icon size={18} className={isActive ? 'animate-[pulse_1s_ease-in-out]' : ''} />
        </div>
        
        <span className="text-sm">{label}</span>
        
        {badgeCount > 0 && (
          <Badge 
            count={badgeCount}
            variant="danger"
            size="sm"
          />
        )}
      </div>
      
      {hasSubmenu && (
        <ChevronRight
          size={16}
          className={`
            transition-transform duration-200 text-slate-500
            ${isSubmenuOpen ? 'rotate-90' : ''}
          `}
        />
      )}
    </button>
  );
};

export default NavItem;