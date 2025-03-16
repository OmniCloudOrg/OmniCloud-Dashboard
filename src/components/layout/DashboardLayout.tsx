import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNavigation from './MobileNavigation';
import CommandPalette from '../command/CommandPalette';
import NotificationsPanel from '../dropdowns/NotificationsPanel';
import HelpPanel from '../dropdowns/HelpPanel';
import UserProfilePanel from '../dropdowns/UserProfilePanel';
import { SystemStatus } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Main dashboard layout component
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  
  // Navigation state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  
  // UI state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activeCloudFilter, setActiveCloudFilter] = useState('all');
  
  // Panels state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  // System status
  const systemStatus: SystemStatus = 'healthy'; // Could be 'healthy', 'warning', 'critical', or 'unknown'

  // Mock notification count
  const notificationCount = 12;

  // Toggle submenu open state
  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle navigation
  const handleNavigation = (id: string) => {
    setActiveSection(id);
    router.push(`/${id}`);
  };

  // Close all panels
  const closeAllPanels = () => {
    setNotificationsOpen(false);
    setHelpPanelOpen(false);
    setUserProfileOpen(false);
  };

  // Toggle panels
  const toggleNotifications = () => {
    closeAllPanels();
    setNotificationsOpen(prev => !prev);
  };

  const toggleHelpPanel = () => {
    closeAllPanels();
    setHelpPanelOpen(prev => !prev);
  };

  const toggleUserProfile = () => {
    closeAllPanels();
    setUserProfileOpen(prev => !prev);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command + K shortcut for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      } 
      // Escape key to close panels
      else if (e.key === 'Escape') {
        closeAllPanels();
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Notification Panel */}
      <NotificationsPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />

      {/* Help Panel */}
      <HelpPanel 
        isOpen={helpPanelOpen} 
        onClose={() => setHelpPanelOpen(false)} 
      />

      {/* User Profile Panel */}
      <UserProfilePanel 
        isOpen={userProfileOpen} 
        onClose={() => setUserProfileOpen(false)} 
      />

      {/* Mobile Navigation */}
      <MobileNavigation
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        activeSection={activeSection}
        openSubmenus={openSubmenus}
        onNavigate={handleNavigation}
        onToggleSubmenu={toggleSubmenu}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onToggleNotifications={toggleNotifications}
        notificationCount={notificationCount}
      />

      {/* Desktop Layout */}
      <div className="flex h-screen overflow-hidden pt-16 lg:pt-0">
        {/* Sidebar Navigation */}
        <Sidebar
          activeSection={activeSection}
          openSubmenus={openSubmenus}
          onNavigate={handleNavigation}
          onToggleSubmenu={toggleSubmenu}
          systemStatus={systemStatus}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <TopBar
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onToggleNotifications={toggleNotifications}
            onToggleHelpPanel={toggleHelpPanel}
            onToggleUserProfile={toggleUserProfile}
            notificationCount={notificationCount}
            activeCloudFilter={activeCloudFilter}
            setActiveCloudFilter={setActiveCloudFilter}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;