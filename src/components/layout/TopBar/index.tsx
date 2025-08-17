"use client";

import React, { useEffect, useCallback } from 'react';
import { usePlatform } from '@/components/context/PlatformContext';
import { navSections } from '../../../utils/navigation';
import UserProfileDropdown from '../UserProfile';

import { TopBarProps } from './types';
import { useTopBarState } from './hooks/useTopBarState';
import { useProviderAPI } from './hooks/useProviderAPI';
import { useUserData } from './hooks/useUserData';

import SearchButton from './components/SearchButton';
import PlatformDropdown from './components/PlatformDropdown';
import ProviderDropdown from './components/ProviderDropdown';
import ActionButtons from './components/ActionButtons';
import UserProfileButton from './components/UserProfileButton';

const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onToggleNotifications,
  onToggleHelpPanel,
  onToggleMobileMenu,
  notificationCount,
  activeCloudFilter,
  setActiveCloudFilter,
}) => {
  const pages = navSections.flatMap(section =>
    section.items.map(item => ({ label: item.label, id: item.id }))
  );

  const { selectedPlatformId, selectedPlatform, platforms } = usePlatform() as any;

  const {
    mounted,
    setMounted,
    isMobile,
    setIsMobile,
    platformDropdown,
    setPlatformDropdown,
    providerDropdown,
    setProviderDropdown,
    userProfile,
    setUserProfile,
    providersLoadedRef,
    isFetchingProvidersRef,
    abortControllerRef,
    topBarRef,
    leftSectionRef,
    rightSectionRef,
    providerDropdownRef,
    platformDropdownRef,
    searchInputRef,
    platformSearchInputRef,
    userButtonRef
  } = useTopBarState();

  const { loadAllProviders } = useProviderAPI(
    selectedPlatformId,
    providersLoadedRef,
    isFetchingProvidersRef,
    abortControllerRef,
    setProviderDropdown
  );

  const { getUserInitials } = useUserData(setUserProfile);

  const checkForWrapping = useCallback(() => {
    if (!topBarRef.current || !leftSectionRef.current || !rightSectionRef.current) return;
    
    const topBarWidth = topBarRef.current.offsetWidth;
    const leftSectionWidth = leftSectionRef.current.scrollWidth;
    const rightSectionWidth = rightSectionRef.current.scrollWidth;
    
    const totalContentWidth = leftSectionWidth + rightSectionWidth + 24;
    setIsMobile(totalContentWidth >= topBarWidth);
  }, [setIsMobile]);

  const handleProviderSearch = useCallback((term: string) => {
    setPlatformDropdown(prev => ({ ...prev, searchTerm: term }));
    
    if (!term.trim()) {
      setPlatformDropdown(prev => ({ ...prev, filteredPlatforms: platforms }));
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    setPlatformDropdown(prev => ({
      ...prev,
      filteredPlatforms: platforms.filter((platform: any) => 
        platform.name.toLowerCase().includes(lowerTerm) ||
        (platform.description && platform.description.toLowerCase().includes(lowerTerm))
      )
    }));
  }, [platforms, setPlatformDropdown]);

  const handlePlatformSearch = useCallback((term: string) => {
    setProviderDropdown(prev => ({ ...prev, searchTerm: term }));
    
    if (!term.trim()) {
      setProviderDropdown(prev => ({ ...prev, filteredProviders: prev.providers }));
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    setProviderDropdown(prev => ({
      ...prev,
      filteredProviders: prev.providers.filter((provider: any) => 
        provider.display_name.toLowerCase().includes(lowerTerm) ||
        provider.name.toLowerCase().includes(lowerTerm)
      )
    }));
  }, [setProviderDropdown]);

  const handleOpenProviderDropdown = useCallback(() => {
    if (!selectedPlatformId) return;
    if (!providerDropdown.isOpen) {
      if (platformDropdown.isOpen) {
        setPlatformDropdown(prev => ({ ...prev, isOpen: false }));
      }
      
      if (userProfile.isOpen) {
        setUserProfile(prev => ({ ...prev, isOpen: false }));
      }
      
      if (!providersLoadedRef.current && providerDropdown.providers.length === 0) {
        loadAllProviders();
      }
      
      setProviderDropdown(prev => ({
        ...prev,
        isOpen: true,
        searchTerm: '',
        filteredProviders: prev.providers
      }));
      
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    } else {
      setProviderDropdown(prev => ({ ...prev, isOpen: false }));
    }
  }, [providerDropdown.isOpen, platformDropdown.isOpen, userProfile.isOpen, providerDropdown.providers, selectedPlatformId, providersLoadedRef, loadAllProviders, setPlatformDropdown, setUserProfile, setProviderDropdown]);
  
  const handleOpenPlatformDropdown = useCallback(() => {
    if (!platformDropdown.isOpen) {
      if (providerDropdown.isOpen) {
        setProviderDropdown(prev => ({ ...prev, isOpen: false }));
      }
      
      if (userProfile.isOpen) {
        setUserProfile(prev => ({ ...prev, isOpen: false }));
      }
      
      setPlatformDropdown(prev => ({
        ...prev,
        isOpen: true,
        searchTerm: '',
        filteredPlatforms: platforms
      }));
      
      setTimeout(() => {
        if (platformSearchInputRef.current) {
          platformSearchInputRef.current.focus();
        }
      }, 10);
    } else {
      setPlatformDropdown(prev => ({ ...prev, isOpen: false }));
    }
  }, [platformDropdown.isOpen, providerDropdown.isOpen, userProfile.isOpen, platforms, setProviderDropdown, setUserProfile, setPlatformDropdown]);

  const toggleUserProfile = useCallback(() => {
    if (providerDropdown.isOpen) {
      setProviderDropdown(prev => ({ ...prev, isOpen: false }));
    }
    
    if (platformDropdown.isOpen) {
      setPlatformDropdown(prev => ({ ...prev, isOpen: false }));
    }
    
    setUserProfile(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, [providerDropdown.isOpen, platformDropdown.isOpen, setProviderDropdown, setPlatformDropdown, setUserProfile]);

  const handleSelectProvider = useCallback((providerName: string) => {
    setActiveCloudFilter(providerName);
    setProviderDropdown(prev => ({ ...prev, isOpen: false }));
  }, [setActiveCloudFilter, setProviderDropdown]);

  useEffect(() => {
    setMounted(true);
    checkForWrapping();
    
    const resizeObserver = new ResizeObserver(() => {
      checkForWrapping();
    });
    
    if (topBarRef.current) {
      resizeObserver.observe(topBarRef.current);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (
        providerDropdownRef.current && 
        !providerDropdownRef.current.contains(target) &&
        !target.closest('[data-provider-button]')
      ) {
        setProviderDropdown(prev => ({ ...prev, isOpen: false }));
      }
      
      if (
        platformDropdownRef.current && 
        !platformDropdownRef.current.contains(target) &&
        !target.closest('[data-platform-button]')
      ) {
        setPlatformDropdown(prev => ({ ...prev, isOpen: false }));
      }
      
      if (
        userProfile.isOpen && 
        userButtonRef.current && 
        !userButtonRef.current.contains(target) && 
        !target.closest('[data-user-dropdown]')
      ) {
        setUserProfile(prev => ({ ...prev, isOpen: false }));
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('mousedown', handleClickOutside);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [checkForWrapping, userProfile.isOpen, setMounted, setProviderDropdown, setPlatformDropdown, setUserProfile]);

  useEffect(() => {
    if (platformDropdown.searchTerm.trim() === '') {
      setPlatformDropdown(prev => ({ ...prev, filteredPlatforms: platforms }));
    } else {
      const lowerTerm = platformDropdown.searchTerm.toLowerCase();
      setPlatformDropdown(prev => ({
        ...prev,
        filteredPlatforms: platforms.filter((platform: any) => 
          platform.name.toLowerCase().includes(lowerTerm) ||
          (platform.description && platform.description.toLowerCase().includes(lowerTerm))
        )
      }));
    }
  }, [platforms, platformDropdown.searchTerm, setPlatformDropdown]);

  return (
    <div 
      ref={topBarRef}
      className="h-16 border-b border-slate-800 flex items-center justify-between px-3 sm:px-6 relative"
    >
      <div ref={leftSectionRef} className="flex items-center gap-2 sm:gap-4">
        <SearchButton onOpenCommandPalette={onOpenCommandPalette} pages={pages} />

        <PlatformDropdown
          isOpen={platformDropdown.isOpen}
          searchTerm={platformDropdown.searchTerm}
          filteredPlatforms={platformDropdown.filteredPlatforms}
          onToggle={handleOpenPlatformDropdown}
          onSearch={handleProviderSearch}
          platformSearchInputRef={platformSearchInputRef}
          platformDropdownRef={platformDropdownRef}
        />

        <ProviderDropdown
          isOpen={providerDropdown.isOpen}
          searchTerm={providerDropdown.searchTerm}
          filteredProviders={providerDropdown.filteredProviders}
          providers={providerDropdown.providers}
          isLoading={providerDropdown.isLoading}
          error={providerDropdown.error}
          activeCloudFilter={activeCloudFilter}
          selectedPlatformId={selectedPlatformId}
          onToggle={handleOpenProviderDropdown}
          onSearch={handlePlatformSearch}
          onSelectProvider={handleSelectProvider}
          searchInputRef={searchInputRef}
          providerDropdownRef={providerDropdownRef}
        />
      </div>

      <div ref={rightSectionRef} className="flex items-center gap-2 sm:gap-4">
        <ActionButtons
          isMobile={isMobile}
          selectedPlatformId={selectedPlatformId}
          notificationCount={notificationCount}
          onToggleMobileMenu={onToggleMobileMenu}
          onToggleNotifications={onToggleNotifications}
          onToggleHelpPanel={onToggleHelpPanel}
        />

        <div className="relative">
          <UserProfileButton
            isOpen={userProfile.isOpen}
            userData={userProfile.userData}
            onToggle={toggleUserProfile}
            userButtonRef={userButtonRef}
            getUserInitials={getUserInitials}
          />

          <UserProfileDropdown 
            data-user-dropdown 
            isOpen={userProfile.isOpen} 
            onClose={() => setUserProfile(prev => ({ ...prev, isOpen: false }))} 
            userData={userProfile.userData} 
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;