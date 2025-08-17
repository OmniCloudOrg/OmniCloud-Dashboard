import { useState } from 'react';
import { NavigationState, UIState, PanelState, LayoutState } from '../types';
import { SystemStatus } from '../../../../types';

export const useDashboardState = (): LayoutState & {
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>;
  setUIState: React.Dispatch<React.SetStateAction<UIState>>;
  setPanelState: React.Dispatch<React.SetStateAction<PanelState>>;
} => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    mobileNavOpen: false,
    activeSection: 'dashboard',
    openSubmenus: {}
  });

  const [uiState, setUIState] = useState<UIState>({
    commandPaletteOpen: false,
    activeCloudFilter: 'all'
  });

  const [panelState, setPanelState] = useState<PanelState>({
    notificationsOpen: false,
    helpPanelOpen: false,
    userProfileOpen: false
  });

  const systemStatus: SystemStatus = 'healthy';
  const notificationCount = 12;

  return {
    navigationState,
    uiState,
    panelState,
    systemStatus,
    notificationCount,
    setNavigationState,
    setUIState,
    setPanelState
  };
};