export interface MobileNavigationProps {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  activeSection: string;
  openSubmenus: Record<string, boolean>;
  onNavigate: (id: string) => void;
  onToggleSubmenu: (id: string) => void;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  notificationCount: number;
}

export interface AnimationState {
  isVisible: boolean;
  drawerVisible: boolean;
  menuIconRotation: number;
}