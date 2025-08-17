export interface TopBarProps {
  onOpenCommandPalette: (pages?: any[]) => void;
  onToggleNotifications: () => void;
  onToggleHelpPanel: () => void;
  onToggleMobileMenu: () => void;
  notificationCount: number;
  activeCloudFilter: string;
  setActiveCloudFilter: (filter: string) => void;
}

export interface PlatformDropdownState {
  isOpen: boolean;
  searchTerm: string;
  filteredPlatforms: any[];
}

export interface ProviderDropdownState {
  isOpen: boolean;
  searchTerm: string;
  filteredProviders: any[];
  providers: any[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

export interface UserProfileState {
  isOpen: boolean;
  userData: any;
  isLoading: boolean;
}