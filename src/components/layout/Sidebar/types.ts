import { SystemStatus } from '../../../types';

export interface SidebarProps {
  activeSection: string;
  openSubmenus: Record<string, boolean>;
  onNavigate: (id: string) => void;
  onToggleSubmenu: (id: string) => void;
  systemStatus: SystemStatus;
}