// DeploymentApiClient.ts
// API client for deployment-related operations

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface Deployment {
  id: number;
  app_id: number;
  build_id: number;
  version: string;
  deployment_strategy: string;
  status: string;
  previous_deployment_id?: number;
  canary_percentage?: number;
  environment_variables?: any;
  annotations?: any;
  labels?: any;
  error_message?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export interface CreateDeploymentRequest {
  app_id: number;
  build_id: number;
  version: string;
  deployment_strategy: string;
  previous_deployment_id?: number;
  canary_percentage?: number;
  environment_variables?: any;
  annotations?: any;
  labels?: any;
}

export interface UpdateDeploymentStatusRequest {
  status: string;
  error_message?: string;
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
export class DeploymentApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // List all deployments with pagination
  async listDeployments(params: PaginationParams): Promise<PaginatedResponse<Deployment>> {
    try {
      const queryString = `?page=${params.page}&per_page=${params.per_page}`;
      const response = await fetchPlatformApi<any>(
        `/deployments${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.deployments,
        pagination: response.pagination
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Count total deployments
  async countDeployments(): Promise<number> {
    try {
      return await fetchPlatformApi<number>(
        '/count/deployments', 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get a specific deployment by ID
  async getDeployment(deploymentId: number): Promise<Deployment> {
    try {
      return await fetchPlatformApi<Deployment>(
        `/deployments/${deploymentId}`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // List all deployments for a specific application with pagination
  async listAppDeployments(
    appId: number, 
    params: PaginationParams
  ): Promise<PaginatedResponse<Deployment>> {
    try {
      const queryString = `?page=${params.page}&per_page=${params.per_page}`;
      const response = await fetchPlatformApi<any>(
        `/apps/${appId}/deployments${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.deployments,
        pagination: response.pagination
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Create a new deployment
  async createDeployment(deploymentRequest: CreateDeploymentRequest): Promise<Deployment> {
    try {
      return await postPlatformApi<Deployment, CreateDeploymentRequest>(
        '/deployments', 
        deploymentRequest, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Update a deployment's status
  async updateDeploymentStatus(
    deploymentId: number, 
    statusRequest: UpdateDeploymentStatusRequest
  ): Promise<Deployment> {
    try {
      const response = await fetch(
        getPlatformApiUrl(`/deployments/${deploymentId}/status`, this.platformId),
        {
          ...defaultFetchOptions,
          method: 'PUT',
          body: JSON.stringify(statusRequest)
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json() as Deployment;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Delete a specific deployment
  async deleteDeployment(deploymentId: number): Promise<{ status: string }> {
    try {
      const response = await fetch(
        getPlatformApiUrl(`/deployments/${deploymentId}`, this.platformId),
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
// import { DeploymentApiClient } from './DeploymentApiClient';
// import { DEFAULT_PLATFORM_ID } from './apiConfig';
//
// // Convert string to number if needed
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const deploymentClient = new DeploymentApiClient(platformId);
// const deployments = await deploymentClient.listDeployments({ page: 1, per_page: 10 });