import { useState, useEffect } from 'react';
import { AnimationState } from '../types';

export const useAnimations = (mobileNavOpen: boolean, setMobileNavOpen: (open: boolean) => void) => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isVisible: false,
    drawerVisible: false,
    menuIconRotation: 0
  });

  useEffect(() => {
    if (mobileNavOpen) {
      setAnimationState(prev => ({ ...prev, isVisible: true, menuIconRotation: 90 }));
      setTimeout(() => setAnimationState(prev => ({ ...prev, drawerVisible: true })), 50);
    } else {
      setAnimationState(prev => ({ ...prev, drawerVisible: false, menuIconRotation: 0 }));
      setTimeout(() => setAnimationState(prev => ({ ...prev, isVisible: false })), 300);
    }
  }, [mobileNavOpen]);

  const handleCloseDrawer = () => {
    setAnimationState(prev => ({ ...prev, drawerVisible: false }));
    setTimeout(() => setMobileNavOpen(false), 300);
  };

  return {
    animationState,
    handleCloseDrawer
  };
};