// RegionsApiClient.ts
// API client for regions that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface Region {
  id: number;
  name: string;
  display_name: string;
  provider: string;
  provider_region?: string;
  location?: string;
  coordinates?: string;
  status?: string;
  is_public?: boolean;
  class?: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderRegion {
  id: number;
  region: Region;
  provider_name: string;
  binding_status: string;  // 'active', 'warning', 'inactive', 'error'
  created_at: string;
  updated_at: string;
}

export interface CreateRegionRequest {
  name: string;
  display_name: string;
  provider: string;
  provider_region?: string;
  location?: string;
  coordinates?: string;
  status?: string;
  is_public?: boolean;
  class?: string;
}

export interface UpdateRegionRequest {
  name: string;
  description: string;
  url: string;
  org_id: number;
}

export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

// API client class
export class RegionsApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // List all regions with pagination
  async listRegions(params?: PaginationParams): Promise<Region[]> {
    try {
      const queryString = params 
        ? `?page=${params.page}&per_page=${params.per_page}` 
        : '';
      
      return await fetchPlatformApi<Region[]>(
        `/regions${queryString}`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // List all provider regions
  async listProviderRegions(): Promise<ProviderRegion[]> {
    try {
      return await fetchPlatformApi<ProviderRegion[]>(
        '/provider_regions', 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get a specific region by ID
  async getRegion(regionId: string): Promise<Region> {
    try {
      return await fetchPlatformApi<Region>(
        `/regions/${regionId}`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Create a new region
  async createRegion(regionRequest: CreateRegionRequest): Promise<Region> {
    try {
      return await postPlatformApi<Region, CreateRegionRequest>(
        '/regions', 
        regionRequest, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Update an existing region
  async updateRegion(regionId: string, regionRequest: UpdateRegionRequest): Promise<Region> {
    try {
      const response = await fetch(
        getPlatformApiUrl(`/regions/${regionId}`, this.platformId),
        {
          ...defaultFetchOptions,
          method: 'PUT',
          body: JSON.stringify(regionRequest)
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as Region;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Delete a specific region
  async deleteRegion(regionId: string): Promise<{ status: string }> {
    try {
      const response = await fetch(
        getPlatformApiUrl(`/regions/${regionId}`, this.platformId),
        {
          ...defaultFetchOptions,
          method: 'DELETE'
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as { status: string };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Helper to format errors consistently
  private formatError(error: any): Error {
    if (error instanceof Error) {
      return error;
    } else if (typeof error === 'string') {
      return new Error(error);
    } else {
      return new Error('An unknown error occurred');
    }
  }
}

// Usage Example:
// import { RegionsApiClient } from './RegionsApiClient';
// import { DEFAULT_PLATFORM_ID } from './apiConfig';
//
// // Convert string to number if needed
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const regionsClient = new RegionsApiClient(platformId);
// const regions = await regionsClient.listRegions({ page: 1, per_page: 10 });
// const providerRegions = await regionsClient.listProviderRegions();