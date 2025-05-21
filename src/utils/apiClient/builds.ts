// BuildsApiClient.ts
// API client for builds that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface Build {
  id: number;
  app_id: number;
  source_version: string;
  status: string; // 'running', 'succeeded', 'failed', 'canceled'
  created_at: string;
  completed_at?: string;
  logs?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface BuildWithApp {
  build: Build;
  app_name: string;
  provider: string;
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

export interface CreateBuildRequest {
  app_id: number;
  source_version: string;
  metadata?: Record<string, any>;
}

// API client class
export class BuildsApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // List all builds with pagination
  async listBuilds(params: PaginationParams): Promise<PaginatedResponse<Build>> {
    try {
      if (!this.platformId) {
        throw new Error("No platform selected");
      }
      
      const queryString = `?page=${params.page}&per_page=${params.per_page}`;
      
      const response = await fetchPlatformApi<any>(
        `/builds${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.builds || [],
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

  // Get builds for a specific app
  async listAppBuilds(appId: number, params: PaginationParams): Promise<PaginatedResponse<Build>> {
    try {
      if (!this.platformId) {
        throw new Error("No platform selected");
      }
      
      const queryString = `?page=${params.page}&per_page=${params.per_page}`;
      
      const response = await fetchPlatformApi<any>(
        `/apps/${appId}/builds${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.builds || [],
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

  // Get a specific build by ID
  async getBuild(buildId: number): Promise<Build> {
    try {
      if (!this.platformId) {
        throw new Error("No platform selected");
      }
      
      return await fetchPlatformApi<Build>(
        `/builds/${buildId}`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get build logs
  async getBuildLogs(buildId: number): Promise<string> {
    try {
      if (!this.platformId) {
        throw new Error("No platform selected");
      }
      
      const response = await fetchPlatformApi<{logs: string}>(
        `/builds/${buildId}/logs`, 
        this.platformId
      );
      
      return response.logs || '';
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Create a new build
  async createBuild(buildRequest: CreateBuildRequest): Promise<Build> {
    try {
      if (!this.platformId) {
        throw new Error("No platform selected");
      }
      
      return await postPlatformApi<Build, CreateBuildRequest>(
        '/builds', 
        buildRequest, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Cancel a running build
  async cancelBuild(buildId: number): Promise<Build> {
    try {
      if (!this.platformId) {
        throw new Error("No platform selected");
      }
      
      const response = await fetch(
        getPlatformApiUrl(`/builds/${buildId}/cancel`, this.platformId),
        {
          ...defaultFetchOptions,
          method: 'PUT'
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as Build;
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
// import { BuildsApiClient } from './BuildsApiClient';
// const platformId = 1;
// const buildsClient = new BuildsApiClient(platformId);
// const buildsResponse = await buildsClient.listBuilds({ page: 0, per_page: 10 });