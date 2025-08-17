import React from 'react';
import { SystemStatus } from '../../../types';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface NavigationState {
  mobileNavOpen: boolean;
  activeSection: string;
  openSubmenus: Record<string, boolean>;
}

export interface UIState {
  commandPaletteOpen: boolean;
  activeCloudFilter: string;
}

export interface PanelState {
  notificationsOpen: boolean;
  helpPanelOpen: boolean;
  userProfileOpen: boolean;
}

export interface LayoutState {
  navigationState: NavigationState;
  uiState: UIState;
  panelState: PanelState;
  systemStatus: SystemStatus;
  notificationCount: number;
}