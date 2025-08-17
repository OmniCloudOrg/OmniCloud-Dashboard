import { useRouter } from 'next/navigation';
import { NavigationState, UIState, PanelState } from '../types';

export const useDashboardActions = (
  setNavigationState: React.Dispatch<React.SetStateAction<NavigationState>>,
  setUIState: React.Dispatch<React.SetStateAction<UIState>>,
  setPanelState: React.Dispatch<React.SetStateAction<PanelState>>
) => {
  const router = useRouter();

  const toggleSubmenu = (id: string) => {
    setNavigationState(prev => ({
      ...prev,
      openSubmenus: {
        ...prev.openSubmenus,
        [id]: !prev.openSubmenus[id]
      }
    }));
  };

  const handleNavigation = (id: string) => {
    setNavigationState(prev => ({ ...prev, activeSection: id }));
    router.push(`/${id}`);
  };

  const closeAllPanels = () => {
    setPanelState({
      notificationsOpen: false,
      helpPanelOpen: false,
      userProfileOpen: false
    });
  };

  const toggleNotifications = () => {
    closeAllPanels();
    setPanelState(prev => ({ ...prev, notificationsOpen: !prev.notificationsOpen }));
  };

  const toggleHelpPanel = () => {
    closeAllPanels();
    setPanelState(prev => ({ ...prev, helpPanelOpen: !prev.helpPanelOpen }));
  };

  const toggleUserProfile = () => {
    closeAllPanels();
    setPanelState(prev => ({ ...prev, userProfileOpen: !prev.userProfileOpen }));
  };

  const setCommandPaletteOpen = (open: boolean | ((prev: boolean) => boolean)) => {
    setUIState(prev => ({
      ...prev,
      commandPaletteOpen: typeof open === 'function' ? open(prev.commandPaletteOpen) : open
    }));
  };

  const setActiveCloudFilter = (filter: string) => {
    setUIState(prev => ({ ...prev, activeCloudFilter: filter }));
  };

  const setMobileNavOpen = (open: boolean) => {
    setNavigationState(prev => ({ ...prev, mobileNavOpen: open }));
  };

  return {
    toggleSubmenu,
    handleNavigation,
    closeAllPanels,
    toggleNotifications,
    toggleHelpPanel,
    toggleUserProfile,
    setCommandPaletteOpen,
    setActiveCloudFilter,
    setMobileNavOpen
  };
};