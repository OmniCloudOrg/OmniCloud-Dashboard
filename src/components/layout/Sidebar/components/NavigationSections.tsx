import React from 'react';
import NavSection from '../../../navigation/NavSection';
import { navSections } from '../../../../utils/navigation';

interface NavigationSectionsProps {
  activeSection: string;
  openSubmenus: Record<string, boolean>;
  onNavigate: (id: string) => void;
  onToggleSubmenu: (id: string) => void;
}

const NavigationSections: React.FC<NavigationSectionsProps> = ({
  activeSection,
  openSubmenus,
  onNavigate,
  onToggleSubmenu
}) => {
  return (
    <div className="p-4 h-[calc(100vh-88px)] space-y-4">
      {navSections.map((section, idx) => (
        <NavSection
          key={idx}
          title={section.title}
          items={section.items}
          activeSection={activeSection}
          openSubmenus={openSubmenus}
          onNavigate={onNavigate}
          onToggleSubmenu={onToggleSubmenu}
        />
      ))}
    </div>
  );
};

export default NavigationSections;