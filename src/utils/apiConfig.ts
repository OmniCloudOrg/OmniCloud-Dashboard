// apiConfig.ts
// Central configuration for API endpoints with correct URL structure

/**
 * The base URL for all API requests.
 * Uses the environment variable if available, falls back to localhost for development.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

/**
 * Platform ID to use for requests
 */
export const DEFAULT_PLATFORM_ID = process.env.NEXT_PUBLIC_DEFAULT_PLATFORM_ID || '1';

/**
 * Common fetch options with JSON headers
 */
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
};

/**
 * Constructs the platform-specific API URL with the correct structure
 * @param path - The API path to append (without the platform prefix)
 * @param platformId - Platform ID to use in the URL
 * @returns The complete platform-specific API URL
 */
export const getPlatformApiUrl = (path: string, platformId: string | number): string => {
  // Ensure path starts with a slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Correctly format the URL according to the API structure:
  // /api/v1/platform/<platform_id>/...
  return `${API_BASE_URL}/platform/${platformId}${formattedPath}`;
};

/**
 * Helper function for making GET requests to platform endpoints
 * @param path - API path to fetch from (without platform prefix)
 * @param platformId - Platform ID to use in the URL
 * @param options - Optional fetch options to override defaults
 * @returns Promise with the API response
 */
export const fetchPlatformApi = async <T>(
  path: string, 
  platformId: string | number, 
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(getPlatformApiUrl(path, platformId), {
    ...defaultFetchOptions,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

/**
 * Helper function for making POST requests to platform endpoints
 * @param path - API path to post to (without platform prefix)
 * @param data - Data to send in the request body
 * @param platformId - Platform ID to use in the URL
 * @param options - Optional fetch options to override defaults
 * @returns Promise with the API response
 */
export const postPlatformApi = async <T, U = any>(
  path: string, 
  data: U, 
  platformId: string | number,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(getPlatformApiUrl(path, platformId), {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

/**
 * Helper function for making PUT requests to platform endpoints
 * @param path - API path (without platform prefix)
 * @param data - Optional data to send in the request body
 * @param platformId - Platform ID to use in the URL
 * @param options - Optional fetch options to override defaults
 * @returns Promise with the API response
 */
export const putPlatformApi = async <T, U = any>(
  path: string, 
  data?: U, 
  platformId?: string | number,
  options?: RequestInit
): Promise<T> => {
  const pId = platformId || DEFAULT_PLATFORM_ID;
  
  const requestOptions: RequestInit = {
    ...defaultFetchOptions,
    method: 'PUT',
    ...options,
  };
  
  // Only add body if data is provided
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }
  
  const response = await fetch(getPlatformApiUrl(path, pId), requestOptions);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

/**
 * Helper function for making DELETE requests to platform endpoints
 * @param path - API path (without platform prefix)
 * @param platformId - Platform ID to use in the URL
 * @param options - Optional fetch options to override defaults
 * @returns Promise with the API response
 */
export const deletePlatformApi = async <T>(
  path: string, 
  platformId: string | number,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(getPlatformApiUrl(path, platformId), {
    ...defaultFetchOptions,
    method: 'DELETE',
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};