import { LucideIcon } from 'lucide-react';

// Navigation types
export interface NavItemProps {
  icon: LucideIcon;
  label: string;
  id: string;
  isActive: boolean;
  onClick: () => void;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  badgeCount?: number;
}

export interface NavSectionProps {
  title: string;
  items: NavItemType[];
  activeSection: string;
  openSubmenus: Record<string, boolean>;
  onNavigate: (id: string) => void;
  onToggleSubmenu: (id: string) => void;
}

export interface NavItemType {
  icon: LucideIcon;
  label: string;
  id: string;
  badgeCount?: number;
  submenu?: SubNavItem[];
}

export interface SubNavItem {
  label: string;
  id: string;
}

// Provider badge types
export interface ProviderBadgeProps {
  provider: string;
  isActive: boolean;
  onClick?: () => void;
}

export interface CloudProvider {
  id: string;
  name: string;
}

// Status indicator types
export type SystemStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export interface StatusIndicatorProps {
  status: SystemStatus;
}

export interface StatusMetrics {
  ping: string;
  uptime: string;
  cpu: string;
  memory: string;
  services: string;
}

// Dropdown panel types
export interface DropdownPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: string;
}

// Command palette types
export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchResult {
  type: 'app' | 'instance' | 'user' | 'route' | 'cloud';
  name: string;
  id: string;
  environment?: string;
  status?: string;
  role?: string;
  target?: string;
}

// Notification types
export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

// Help resource types
export interface HelpResource {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}