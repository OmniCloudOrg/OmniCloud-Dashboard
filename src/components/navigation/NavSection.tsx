import React from 'react';
import { NavSectionProps, SubNavItem } from '../../types';
import NavItem from './NavItem';

/**
 * Navigation section component for sidebar
 */
const NavSection: React.FC<NavSectionProps> = ({
  title,
  items,
  activeSection,
  openSubmenus,
  onNavigate,
  onToggleSubmenu
}) => {
  return (
    <div className="mb-6">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-4 mb-2">
        {title}
      </div>
      
      <div className="space-y-1">
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <NavItem
              icon={item.icon}
              label={item.label}
              id={item.id}
              isActive={activeSection === item.id}
              onClick={() => {
                if (item.submenu) {
                  onToggleSubmenu(item.id);
                } else {
                  onNavigate(item.id);
                }
              }}
              hasSubmenu={!!item.submenu}
              isSubmenuOpen={!!openSubmenus[item.id]}
              badgeCount={item.badgeCount || 0}
            />

            {/* Submenu items */}
            {item.submenu && openSubmenus[item.id] && (
              <div 
                className="ml-10 space-y-1 mt-1 mb-2 overflow-hidden animate-[fadeIn_0.2s_ease-in-out]"
                style={{ 
                  maxHeight: item.submenu.length * 40, // Approximate height per item
                  transition: 'max-height 0.2s ease-in-out'
                }}
              >
                {item.submenu.map((subitem: SubNavItem) => (
                  <button
                    key={subitem.id}
                    onClick={() => onNavigate(subitem.id)}
                    className={`
                      block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${activeSection === subitem.id
                        ? 'bg-blue-500/10 text-blue-400 font-medium'
                        : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }
                    `}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NavSection;