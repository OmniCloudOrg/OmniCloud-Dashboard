import React from 'react';
import { SidebarProps } from './types';
import SidebarHeader from './components/SidebarHeader';
import NavigationSections from './components/NavigationSections';

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  openSubmenus,
  onNavigate,
  onToggleSubmenu,
  systemStatus
}) => {
  return (
    <div className="hidden lg:block w-72 border-r border-slate-800 overflow-y-auto overflow-x-hidden">
      <SidebarHeader systemStatus={systemStatus} />
      <NavigationSections
        activeSection={activeSection}
        openSubmenus={openSubmenus}
        onNavigate={onNavigate}
        onToggleSubmenu={onToggleSubmenu}
      />
    </div>
  );
};

export default Sidebar;