'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// API base URL configuration
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

// Local storage key
const PLATFORM_STORAGE_KEY = 'omnicloud_selected_platform';

// Create the context
const PlatformContext = createContext(undefined);

/**
 * Platform provider component that manages platform state
 * and provides access to other components
 */
export const PlatformProvider = ({ children }) => {
  // State for platforms and selection
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track if platforms have been loaded to prevent redundant API calls
  const platformsLoadedRef = useRef(false);
  
  // Debounce timers
  const platformChangeTimerRef = useRef(null);

  // Load platforms from API with debouncing to prevent multiple calls
  const loadPlatforms = useCallback(async (force = false) => {
    // Skip if already loaded and not forcing a refresh
    if (platformsLoadedRef.current && !force) return platforms;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiBaseUrl}/platforms`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch platforms: ${response.status}`);
      }
      
      const data = await response.json();
      const platformsData = data.platforms || data; // Handle both formats
      setPlatforms(platformsData);
      
      // Mark as loaded
      platformsLoadedRef.current = true;
      
      return platformsData;
    } catch (err) {
      setError(err.message || 'Failed to load platforms');
      return [];
    } finally {
      setLoading(false);
    }
  }, [platforms]);

  // Initialize - load platforms and restore selected platform from storage
  useEffect(() => {
    // Need to check if we're in a browser environment before using localStorage
    const isBrowser = typeof window !== 'undefined';
    
    const initializePlatforms = async () => {
      // Don't load if already loaded
      if (platformsLoadedRef.current) return;
      
      // First load platforms
      const loadedPlatforms = await loadPlatforms();
      
      // Then try to restore selected platform from storage (only in browser)
      if (isBrowser) {
        const storedPlatformId = localStorage.getItem(PLATFORM_STORAGE_KEY);
        
        if (storedPlatformId && loadedPlatforms.length > 0) {
          // Find the platform in the loaded platforms
          const platform = loadedPlatforms.find(p => p.id === storedPlatformId);
          
          if (platform) {
            setSelectedPlatformId(storedPlatformId);
            setSelectedPlatform(platform);
          }
        }
      }
    };
    
    initializePlatforms();
    
    // Clean up any timers on unmount
    return () => {
      if (platformChangeTimerRef.current) {
        clearTimeout(platformChangeTimerRef.current);
      }
    };
  }, [loadPlatforms]);

  // Function to select a platform with debouncing
  const selectPlatform = useCallback((platformId) => {
    // Don't do anything if the platform ID is the same
    if (platformId === selectedPlatformId) return true;
    
    // Find the platform in the loaded platforms
    const platform = platforms.find(p => p.id === platformId);
    
    if (platform) {
      // Update state
      setSelectedPlatformId(platformId);
      setSelectedPlatform(platform);
      
      // Persist to localStorage (only in browser)
      if (typeof window !== 'undefined') {
        localStorage.setItem(PLATFORM_STORAGE_KEY, platformId);
      }
      
      // Emit a custom event that other components can listen for (only in browser)
      // Use a timer to debounce multiple rapid changes
      if (typeof window !== 'undefined') {
        // Clear any pending timer
        if (platformChangeTimerRef.current) {
          clearTimeout(platformChangeTimerRef.current);
        }
        
        // Set a new timer to dispatch the event
        platformChangeTimerRef.current = setTimeout(() => {
          window.dispatchEvent(new CustomEvent('platform-changed', { 
            detail: { platformId, platform } 
          }));
          platformChangeTimerRef.current = null;
        }, 100); // 100ms debounce
      }
      
      return true;
    }
    
    return false;
  }, [platforms, selectedPlatformId]);

  // Refresh platforms list with debouncing
  const refreshPlatforms = useCallback(async () => {
    return loadPlatforms(true); // Force refresh
  }, [loadPlatforms]);

  // Context value that will be provided to consumers
  const contextValue = {
    platforms,
    selectedPlatformId,
    selectedPlatform,
    selectPlatform,
    refreshPlatforms,
    loading,
    error
  };

  console.log('PlatformContext initialized with:', contextValue);
  // Various console logs for debugging the provider

  console.log('Platforms loaded:', platforms);
  console.log('Selected platform ID:', selectedPlatformId);
  console.log('Selected platform:', selectedPlatform);
  console.log('Loading state:', loading);
  console.log('Error state:', error);
  

  return (
    <PlatformContext.Provider value={contextValue}>
      {children}
    </PlatformContext.Provider>
  );
};

// Custom hook for using the platform context
export const usePlatform = () => {
  const context = useContext(PlatformContext);
  
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  
  return context;
};