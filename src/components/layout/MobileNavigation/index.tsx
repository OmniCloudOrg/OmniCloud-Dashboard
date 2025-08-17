import React from 'react';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { MobileNavigationProps } from './types';
import { useAnimations } from './hooks/useAnimations';

import MobileTopBar from './components/MobileTopBar';
import DrawerHeader from './components/DrawerHeader';
import NavigationContent from './components/NavigationContent';
import AnimationStyles from './components/AnimationStyles';

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  mobileNavOpen,
  setMobileNavOpen,
  activeSection,
  openSubmenus,
  onNavigate,
  onToggleSubmenu,
  onOpenCommandPalette,
  onToggleNotifications,
  notificationCount
}) => {
  const { animationState, handleCloseDrawer } = useAnimations(mobileNavOpen, setMobileNavOpen);
  
  const mobileNavRef = useOutsideClick(() => {
    if (mobileNavOpen) handleCloseDrawer();
  });

  return (
    <>
      <MobileTopBar
        menuIconRotation={animationState.menuIconRotation}
        notificationCount={notificationCount}
        onOpenMenu={() => setMobileNavOpen(true)}
        onOpenCommandPalette={onOpenCommandPalette}
        onToggleNotifications={onToggleNotifications}
      />

      {animationState.isVisible && (
        <div 
          className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ease-in-out backdrop-blur-sm ${
            animationState.drawerVisible ? 'opacity-100 bg-slate-900/80' : 'opacity-0 bg-slate-900/0'
          }`}
        >
          <div 
            ref={mobileNavRef} 
            className={`h-full w-80 max-w-[80%] bg-slate-900 border-r border-slate-800 overflow-y-auto transition-transform duration-300 ease-in-out ${
              animationState.drawerVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <DrawerHeader onClose={handleCloseDrawer} />
            
            <NavigationContent
              activeSection={activeSection}
              openSubmenus={openSubmenus}
              onNavigate={onNavigate}
              onToggleSubmenu={onToggleSubmenu}
              onCloseDrawer={handleCloseDrawer}
            />
          </div>
        </div>
      )}

      <AnimationStyles />
    </>
  );
};

export default MobileNavigation;