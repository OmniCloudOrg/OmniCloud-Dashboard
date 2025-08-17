import React from 'react';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import MobileNavigation from '../MobileNavigation';

import { DashboardLayoutProps } from './types';
import { useDashboardState } from './hooks/useDashboardState';
import { useDashboardActions } from './hooks/useDashboardActions';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import PanelOverlays from './components/PanelOverlays';
import MainContent from './components/MainContent';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    navigationState,
    uiState,
    panelState,
    systemStatus,
    notificationCount,
    setNavigationState,
    setUIState,
    setPanelState
  } = useDashboardState();

  const {
    toggleSubmenu,
    handleNavigation,
    closeAllPanels,
    toggleNotifications,
    toggleHelpPanel,
    toggleUserProfile,
    setCommandPaletteOpen,
    setActiveCloudFilter,
    setMobileNavOpen
  } = useDashboardActions(setNavigationState, setUIState, setPanelState);

  useKeyboardShortcuts(setCommandPaletteOpen, closeAllPanels);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <PanelOverlays
        panelState={panelState}
        uiState={uiState}
        onCloseCommandPalette={() => setCommandPaletteOpen(false)}
        onCloseNotifications={() => setPanelState(prev => ({ ...prev, notificationsOpen: false }))}
        onCloseHelp={() => setPanelState(prev => ({ ...prev, helpPanelOpen: false }))}
        onCloseUserProfile={() => setPanelState(prev => ({ ...prev, userProfileOpen: false }))}
      />

      <MobileNavigation
        mobileNavOpen={navigationState.mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        activeSection={navigationState.activeSection}
        openSubmenus={navigationState.openSubmenus}
        onNavigate={handleNavigation}
        onToggleSubmenu={toggleSubmenu}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleNotifications={toggleNotifications}
        notificationCount={notificationCount}
      />

      <div className="flex h-screen overflow-hidden pt-16 lg:pt-0">
        <Sidebar
          activeSection={navigationState.activeSection}
          openSubmenus={navigationState.openSubmenus}
          onNavigate={handleNavigation}
          onToggleSubmenu={toggleSubmenu}
          systemStatus={systemStatus}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onToggleNotifications={toggleNotifications}
            onToggleHelpPanel={toggleHelpPanel}
            notificationCount={notificationCount}
            activeCloudFilter={uiState.activeCloudFilter}
            setActiveCloudFilter={setActiveCloudFilter}
            onToggleMobileMenu={() => {
              console.log('Mobile menu toggled');
            }}
          />

          <MainContent>
            {children}
          </MainContent>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;