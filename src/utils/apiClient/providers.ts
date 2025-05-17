// ProvidersApiClient.ts
// API client for cloud providers that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface Provider {
  id: number;
  name: string;
  display_name: string;
  status: string;
  provider_type: string;
  auth_config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProviderWithResources extends Provider {
  resources: Record<string, any>;
  accountId: string;
  resourceMetric: string;
  monthlyCost: number;
  lastUpdated: string;
  regions: string[];
}

export interface CreateProviderRequest {
  name: string;
  display_name: string;
  provider_type: string;
  auth_config?: Record<string, any>;
}

export interface UpdateProviderRequest {
  display_name?: string;
  status?: string;
  auth_config?: Record<string, any>;
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
export class ProvidersApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // List all providers with pagination
  async listProviders(params: PaginationParams): Promise<PaginatedResponse<Provider>> {
    try {
      const queryString = `?page=${params.page}&per_page=${params.per_page}`;
      
      const response = await fetchPlatformApi<any>(
        `/providers${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.providers || [],
        pagination: response.pagination || {
          page: 0,
          per_page: params.per_page,
          total_count: 0,
          total_pages: 1
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get a specific provider by ID
  async getProvider(providerId: number): Promise<Provider> {
    try {
      return await fetchPlatformApi<Provider>(
        `/providers/${providerId}`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Create a new provider
  async createProvider(providerRequest: CreateProviderRequest): Promise<Provider> {
    try {
      return await postPlatformApi<Provider, CreateProviderRequest>(
        '/providers', 
        providerRequest, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Update an existing provider
  async updateProvider(providerId: number, providerRequest: UpdateProviderRequest): Promise<Provider> {
    try {
      const response = await fetch(
        getPlatformApiUrl(`/providers/${providerId}`, this.platformId),
        {
          ...defaultFetchOptions,
          method: 'PUT',
          body: JSON.stringify(providerRequest)
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as Provider;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Delete a provider
  async deleteProvider(providerId: number): Promise<void> {
    try {
      const response = await fetch(
        getPlatformApiUrl(`/providers/${providerId}`, this.platformId),
        {
          ...defaultFetchOptions,
          method: 'DELETE'
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Test provider connection
  async testProviderConnection(providerId: number): Promise<{ status: string; message: string }> {
    try {
      return await fetchPlatformApi<{ status: string; message: string }>(
        `/providers/${providerId}/test-connection`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get provider resources
  async getProviderResources(providerId: number): Promise<Record<string, any>> {
    try {
      return await fetchPlatformApi<Record<string, any>>(
        `/providers/${providerId}/resources`, 
        this.platformId
      );
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
// import { ProvidersApiClient } from './ProvidersApiClient';
// import { DEFAULT_PLATFORM_ID } from './apiConfig';
//
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const providersClient = new ProvidersApiClient(platformId);
// const providersResponse = await providersClient.listProviders({ page: 0, per_page: 18 });