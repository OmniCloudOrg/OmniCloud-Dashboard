'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePlatform } from '@/components/context/PlatformContext';
import { 
  fetchPlatformApi, 
  postPlatformApi, 
  putPlatformApi, 
  deletePlatformApi 
} from '@/utils/apiConfig';

/**
 * Type for the fetch state
 */
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for making a GET request that automatically refreshes when platform changes
 */
export function usePlatformFetch<T>(path: string, initialData: T | null = null) {
  // Get the selected platform from context
  const { selectedPlatformId } = usePlatform();
  
  // State for tracking the fetch operation
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    loading: true,
    error: null
  });
  
  // Function to fetch data with current platform
  const fetchData = useCallback(async () => {
    if (!selectedPlatformId) {
      // If no platform is selected, set error state
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'No platform selected' 
      }));
      return;
    }
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await fetchPlatformApi<T>(path, selectedPlatformId);
      setState({ data, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [path, selectedPlatformId]);
  
  // Fetch data when component mounts or when platform changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Return state and refetch function
  return {
    ...state,
    refetch: fetchData
  };
}

/**
 * Hook that provides platform-aware API utility functions
 * All calls will automatically use the currently selected platform
 */
export function usePlatformApi() {
  const { selectedPlatformId } = usePlatform();
  
  // Enhanced GET request with current platform
  const get = useCallback(async <T>(path: string, options?: RequestInit): Promise<T> => {
    if (!selectedPlatformId) {
      throw new Error('No platform selected');
    }
    return fetchPlatformApi<T>(path, selectedPlatformId, options);
  }, [selectedPlatformId]);
  
  // Enhanced POST request with current platform
  const post = useCallback(async <T, U = any>(
    path: string, 
    data: U, 
    options?: RequestInit
  ): Promise<T> => {
    if (!selectedPlatformId) {
      throw new Error('No platform selected');
    }
    return postPlatformApi<T, U>(path, data, selectedPlatformId, options);
  }, [selectedPlatformId]);
  
  // Enhanced PUT request with current platform
  const put = useCallback(async <T, U = any>(
    path: string, 
    data?: U, 
    options?: RequestInit
  ): Promise<T> => {
    if (!selectedPlatformId) {
      throw new Error('No platform selected');
    }
    return putPlatformApi<T, U>(path, data, selectedPlatformId, options);
  }, [selectedPlatformId]);
  
  // Enhanced DELETE request with current platform
  const del = useCallback(async <T>(
    path: string, 
    options?: RequestInit
  ): Promise<T> => {
    if (!selectedPlatformId) {
      throw new Error('No platform selected');
    }
    return deletePlatformApi<T>(path, selectedPlatformId, options);
  }, [selectedPlatformId]);
  
  return {
    get,
    post,
    put,
    delete: del,
    selectedPlatformId
  };
}

/**
 * Hook for automatically refreshing data when platform changes
 * Suitable for existing components that already have their own data fetching logic
 * Makes sure window is defined before adding event listeners
 */
export function usePlatformRefresh(callback: () => void) {
  const { selectedPlatformId } = usePlatform();
  
  // Run callback when platform changes
  useEffect(() => {
    if (callback && typeof callback === 'function') {
      callback();
    }
  }, [selectedPlatformId, callback]);
  
  // Also set up event listener for platform change event - only in browser
  useEffect(() => {
    // Skip this effect in SSR
    if (typeof window === 'undefined') return;
    
    const handlePlatformChange = () => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    };
    
    window.addEventListener('platform-changed', handlePlatformChange);
    
    return () => {
      window.removeEventListener('platform-changed', handlePlatformChange);
    };
  }, [callback]);
  
  return selectedPlatformId;
}