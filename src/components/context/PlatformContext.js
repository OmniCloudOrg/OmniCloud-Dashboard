import React, { createContext, useState, useContext, useEffect } from 'react';

// API base URL configuration
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

// Create Context
const PlatformContext = createContext();

/**
 * Provider component for platform context
 * Makes selected platform ID and related functions available to all children components
 */
export const PlatformProvider = ({ children }) => {
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch platforms on mount
  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('omnicloud_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch(`${apiBaseUrl}/platforms`, {
          method: 'GET',
          headers,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch platforms: ${response.status}`);
        }
        
        const data = await response.json();
        setPlatforms(data);
        
        // Select the platform with the lowest ID by default
        if (data.length > 0) {
          const lowestIdPlatform = data.reduce((prev, current) => 
            prev.id < current.id ? prev : current
          );
          
          setSelectedPlatformId(lowestIdPlatform.id);
          
          // Store in localStorage for persistence
          localStorage.setItem('selectedPlatformId', lowestIdPlatform.id.toString());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to load platforms:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Try to get stored platform ID first
    const storedPlatformId = localStorage.getItem('selectedPlatformId');
    if (storedPlatformId) {
      setSelectedPlatformId(parseInt(storedPlatformId, 10));
    }
    
    fetchPlatforms();
  }, []);
  
  // Update selected platform
  const selectPlatform = (platformId) => {
    setSelectedPlatformId(platformId);
    localStorage.setItem('selectedPlatformId', platformId.toString());
  };
  
  // Get the selected platform object
  const selectedPlatform = platforms.find(platform => platform.id === selectedPlatformId) || null;
  
  // Values to provide to consumers
  const value = {
    platforms,
    selectedPlatformId,
    selectedPlatform,
    selectPlatform,
    loading,
    error,
  };
  
  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

/**
 * Hook to use platform context in any component
 * @returns {Object} Platform context with platforms, selectedPlatformId, selectedPlatform, and selectPlatform function
 */
export const usePlatform = () => {
  const context = useContext(PlatformContext);
  
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  
  return context;
};

export default PlatformContext;