// ApplicationApiClient.ts
// API client that leverages the centralized apiConfig

import { 
    fetchPlatformApi, 
    postPlatformApi, 
    getPlatformApiUrl,
    defaultFetchOptions
  } from '@/utils/apiConfig';
  
  // Type definitions based on server models
  export interface Application {
    id: string;
    name: string;
    owner: string;
    instances: number;
    memory: number;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Instance {
    id: string;
    app_id: number;
    node_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface App {
    id: number;
    name: string;
    org_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface AppWithInstances {
    app: App;
    instances: Instance[];
  }
  
  export interface AppWithInstanceCount {
    app: App;
    instance_count: number;
  }
  
  export interface ScaleRequest {
    instances: number;
    memory: number;
  }
  
  export interface AppStats {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    requests_per_second: number;
    response_time_ms: number;
  }
  
  export interface CreateAppRequest {
    name: string;
    memory: number;
    instances: number;
    org_id: number;
  }
  
  export interface UpdateAppRequest {
    name: string;
    memory: number;
    instances: number;
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
  export class ApplicationApiClient {
    private platformId: number;
  
    constructor(platformId: number) {
      this.platformId = platformId;
    }
  
    // Set platform ID
    setPlatformId(platformId: number): void {
      this.platformId = platformId;
    }
  
    // List all applications with pagination
    async listApps(params: PaginationParams): Promise<PaginatedResponse<App>> {
      try {
        const queryString = `?page=${params.page}&per_page=${params.per_page}`;
        const response = await fetchPlatformApi<any>(`/apps${queryString}`, this.platformId);
        
        return {
          data: response.apps,
          pagination: response.pagination
        };
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Get app with instances
    async getAppWithInstances(appId: number): Promise<AppWithInstances> {
      try {
        return await fetchPlatformApi<AppWithInstances>(
          `/app_with_instances/${appId}`, 
          this.platformId
        );
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Count total applications
    async countApps(): Promise<number> {
      try {
        return await fetchPlatformApi<number>(
          '/app-count', 
          this.platformId
        );
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Get a specific application by ID
    async getApp(appId: number): Promise<App> {
      try {
        return await fetchPlatformApi<App>(
          `/apps/${appId}`, 
          this.platformId
        );
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Create a new application
    async createApp(appRequest: CreateAppRequest): Promise<App> {
      try {
        return await postPlatformApi<App, CreateAppRequest>(
          '/apps', 
          appRequest, 
          this.platformId
        );
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Update an existing application
    async updateApp(appId: number, appRequest: UpdateAppRequest): Promise<App> {
      try {
        return await postPlatformApi<App, UpdateAppRequest>(
          `/apps/${appId}`, 
          appRequest, 
          this.platformId
        );
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Get statistics for a specific application
    async getAppStats(appId: number): Promise<AppStats> {
      try {
        return await fetchPlatformApi<AppStats>(
          `/apps/${appId}/stats`, 
          this.platformId
        );
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Start a specific application
    async startApp(appId: number): Promise<Application> {
      try {
        const response = await fetch(
          getPlatformApiUrl(`/apps/${appId}/start`, this.platformId),
          {
            ...defaultFetchOptions,
            method: 'PUT'
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json() as Application;
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Stop a specific application
    async stopApp(appId: number): Promise<Application> {
      try {
        const response = await fetch(
          getPlatformApiUrl(`/apps/${appId}/stop`, this.platformId),
          {
            ...defaultFetchOptions,
            method: 'PUT'
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json() as Application;
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Scale a specific application
    async scaleApp(appId: number, scaleRequest: ScaleRequest): Promise<Application> {
      try {
        const response = await fetch(
          getPlatformApiUrl(`/apps/${appId}/scale`, this.platformId),
          {
            ...defaultFetchOptions,
            method: 'PUT',
            body: JSON.stringify(scaleRequest)
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json() as Application;
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // Delete a specific application
    async deleteApp(appId: number): Promise<{ status: string }> {
      try {
        const response = await fetch(
          getPlatformApiUrl(`/apps/${appId}`, this.platformId),
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
  
    // Release a new version of an application
    async releaseApp(
      appId: number, 
      releaseVersion: string, 
      fileData: File
    ): Promise<void> {
      try {
        const formData = new FormData();
        formData.append('file', fileData);
        
        const response = await fetch(
          getPlatformApiUrl(`/apps/${appId}/releases/${releaseVersion}/upload`, this.platformId),
          {
            method: 'POST',
            body: formData,
            // No content-type header - browser will set it with the boundary for multipart/form-data
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        throw this.formatError(error);
      }
    }
  
    // List all instances for an application with pagination
    async listInstances(
      appId: number, 
      params: PaginationParams
    ): Promise<PaginatedResponse<Instance>> {
      try {
        const queryString = `?page=${params.page}&per_page=${params.per_page}`;
        const response = await fetchPlatformApi<any>(
          `/apps/${appId}/instances${queryString}`, 
          this.platformId
        );
        
        return {
          data: response.instances,
          pagination: response.pagination
        };
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
  // import { ApplicationApiClient } from './ApplicationApiClient';
  // import { DEFAULT_PLATFORM_ID } from './apiConfig';
  //
  // // Convert string to number if needed
  // const platformId = Number(DEFAULT_PLATFORM_ID);
  // const apiClient = new ApplicationApiClient(platformId);
  // const apps = await apiClient.listApps({ page: 1, per_page: 10 });