import React from 'react';
import NavSection from '../../../navigation/NavSection';
import { navSections } from '../../../../utils/navigation';

interface NavigationContentProps {
  activeSection: string;
  openSubmenus: Record<string, boolean>;
  onNavigate: (id: string) => void;
  onToggleSubmenu: (id: string) => void;
  onCloseDrawer: () => void;
}

const NavigationContent: React.FC<NavigationContentProps> = ({
  activeSection,
  openSubmenus,
  onNavigate,
  onToggleSubmenu,
  onCloseDrawer
}) => {
  return (
    <div className="p-4 space-y-4">
      {navSections.map((section, idx) => (
        <div 
          key={idx}
          style={{ 
            animation: `fadeInUp 0.3s ease forwards ${0.1 + idx * 0.05}s`,
            opacity: 0
          }}
        >
          <NavSection
            title={section.title}
            items={section.items}
            activeSection={activeSection}
            openSubmenus={openSubmenus}
            onNavigate={(id) => {
              onNavigate(id);
              onCloseDrawer();
            }}
            onToggleSubmenu={onToggleSubmenu}
          />
        </div>
      ))}
    </div>
  );
};

export default NavigationContent;