import { useState, useRef } from 'react';
import { PlatformDropdownState, ProviderDropdownState, UserProfileState } from '../types';

export const useTopBarState = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [platformDropdown, setPlatformDropdown] = useState<PlatformDropdownState>({
    isOpen: false,
    searchTerm: '',
    filteredPlatforms: []
  });
  
  const [providerDropdown, setProviderDropdown] = useState<ProviderDropdownState>({
    isOpen: false,
    searchTerm: '',
    filteredProviders: [],
    providers: [],
    isLoading: false,
    error: null,
    totalCount: 0
  });
  
  const [userProfile, setUserProfile] = useState<UserProfileState>({
    isOpen: false,
    userData: null,
    isLoading: false
  });
  
  const providersLoadedRef = useRef(false);
  const isFetchingProvidersRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const topBarRef = useRef<HTMLDivElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const platformSearchInputRef = useRef<HTMLInputElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  return {
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
  };
};