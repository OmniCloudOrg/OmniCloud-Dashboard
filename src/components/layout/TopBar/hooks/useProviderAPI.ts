import { useCallback } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

export const useProviderAPI = (
  selectedPlatformId: string,
  providersLoadedRef: React.RefObject<boolean>,
  isFetchingProvidersRef: React.RefObject<boolean>,
  abortControllerRef: React.RefObject<AbortController | null>,
  setProviderDropdown: (updater: (prev: any) => any) => void
) => {
  const loadAllProviders = useCallback(async () => {
    if (providersLoadedRef.current || isFetchingProvidersRef.current) return;
    
    isFetchingProvidersRef.current = true;
    setProviderDropdown(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    try {
      const countResponse = await fetch(`${apiBaseUrl}/platform/${selectedPlatformId}/providers?page=0&per_page=1`, { signal });

      if (!countResponse.ok) {
        throw new Error(`Failed to fetch provider count: ${countResponse.status}`);
      }
      
      const countData = await countResponse.json();
      const totalProviders = countData.pagination.total_count;
      
      const response = await fetch(`${apiBaseUrl}/platform/${selectedPlatformId}/providers?page=0&per_page=${totalProviders}`, { signal });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch providers: ${response.status}`);
      }
      
      const data = await response.json();
      
      setProviderDropdown(prev => ({
        ...prev,
        providers: data.providers,
        filteredProviders: data.providers,
        totalCount: totalProviders,
        isLoading: false
      }));
      
      providersLoadedRef.current = true;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Provider request was cancelled');
        return;
      }
      
      setProviderDropdown(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        isLoading: false
      }));
    } finally {
      isFetchingProvidersRef.current = false;
    }
  }, [selectedPlatformId, providersLoadedRef, isFetchingProvidersRef, abortControllerRef, setProviderDropdown]);

  return { loadAllProviders };
};