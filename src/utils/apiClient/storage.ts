// StorageApiClient.ts
// API client for storage management that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  putPlatformApi,
  deletePlatformApi,
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface StorageClass {
  id: number;
  storage_type: string;
  name: string;
  volume_binding_mode: string;
  allow_volume_expansion: boolean;
  reclaim_policy?: string;
  mount_options?: string[];
  parameters?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StorageVolume {
  id: number;
  name: string;
  size_gb: number;
  detailed: boolean;
  app_id?: number;
  storage_class_id: number;
  storage_class?: string;
  node_id?: number;
  status: string;
  persistence_level: string;
  write_concern: string;
  access_mode?: string;
  object_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StorageVolumeFilter {
  app_id?: number;
  storage_class_id?: number;
  status?: string;
  node_id?: number;
  persistence_level?: string;
  write_concern?: string;
  search?: string;
}

export interface StorageStats {
  totalStorage: number;
  volumeCount: number;
}

export interface RegionVolumes {
  region: {
    id: number;
    name: string;
    location: string;
  };
  volumes: StorageVolume[];
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

export interface CreateVolumeRequest {
  name: string;
  size_gb: number;
  storage_class_id: number;
  app_id?: number;
  persistence_level: string;
  write_concern: string;
  access_mode?: string;
}

export interface StorageQosPolicy {
  id: number;
  name: string;
  max_iops?: number;
  min_iops?: number;
  max_throughput_mbps?: number;
  min_throughput_mbps?: number;
  burst_iops?: number;
  burst_throughput_mbps?: number;
}

// API client class
export class StorageApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // List all storage classes with optional filtering
  async listStorageClasses(
    filter?: { 
      storage_type?: string; 
      volume_binding_mode?: string; 
      allow_volume_expansion?: boolean 
    }
  ): Promise<StorageClass[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filter) {
        if (filter.storage_type) queryParams.append('storage_type', filter.storage_type);
        if (filter.volume_binding_mode) queryParams.append('volume_binding_mode', filter.volume_binding_mode);
        if (filter.allow_volume_expansion !== undefined) queryParams.append('allow_volume_expansion', filter.allow_volume_expansion.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/classes${queryString}`, 
        this.platformId
      );
      
      return response.storage_classes || [];
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get a specific storage class by ID
  async getStorageClass(id: number): Promise<StorageClass> {
    try {
      const response = await fetchPlatformApi<any>(
        `/storage/classes/${id}`, 
        this.platformId
      );
      
      return response.storage_class;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // List storage volumes with comprehensive filtering
  async listStorageVolumes(
    filter?: StorageVolumeFilter,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<StorageVolume>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      // Add filter parameters
      if (filter) {
        if (filter.app_id !== undefined) queryParams.append('app_id', filter.app_id.toString());
        if (filter.storage_class_id !== undefined) queryParams.append('storage_class_id', filter.storage_class_id.toString());
        if (filter.status) queryParams.append('status', filter.status);
        if (filter.node_id !== undefined) queryParams.append('node_id', filter.node_id.toString());
        if (filter.persistence_level) queryParams.append('persistence_level', filter.persistence_level);
        if (filter.write_concern) queryParams.append('write_concern', filter.write_concern);
        if (filter.search) queryParams.append('search', filter.search);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/volumes${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.storage_volumes || [],
        pagination: response.pagination || {
          page: pagination?.page || 0,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get a specific volume by ID
  async getVolumeById(id: number): Promise<StorageVolume | null> {
    try {
      // Since there may not be a specific endpoint for a single volume,
      // we'll use the volumes endpoint with a filter
      const response = await this.listStorageVolumes({ storage_class_id: id });
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      return null;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get volumes by storage class
  async getVolumesByStorageClass(
    classId: number,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<StorageVolume>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/classes/${classId}/volumes${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.volumes || [],
        pagination: response.pagination || {
          page: pagination?.page || 0,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get volumes by write concern
  async getVolumesByWriteConcern(
    writeConcern: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<StorageVolume>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/write-concerns/${writeConcern}/volumes${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.volumes || [],
        pagination: response.pagination || {
          page: pagination?.page || 0,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get volumes by persistence level
  async getVolumesByPersistenceLevel(
    persistenceLevel: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<StorageVolume>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/persistence-levels/${persistenceLevel}/volumes${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.volumes || [],
        pagination: response.pagination || {
          page: pagination?.page || 0,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get volumes for a specific region
  async getVolumesForRegion(
    regionId: number,
    pagination?: PaginationParams
  ): Promise<{ data: RegionVolumes; pagination: any }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/regions/${regionId}/volumes${queryString}`, 
        this.platformId
      );
      
      return {
        data: {
          region: response.region || { id: regionId, name: 'Unknown', location: 'Unknown' },
          volumes: response.volumes || []
        },
        pagination: response.pagination || {
          page: pagination?.page || 0,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get volumes for a specific provider
  async getVolumesForProvider(
    providerId: number,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<StorageVolume>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/storage/providers/${providerId}/volumes${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.volumes || [],
        pagination: response.pagination || {
          page: pagination?.page || 0,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get storage QoS policies
  async getQosPolicies(): Promise<StorageQosPolicy[]> {
    try {
      const response = await fetchPlatformApi<any>(
        '/storage/qos-policies', 
        this.platformId
      );
      
      return response.qos_policies || [];
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Create a new storage volume
  async createVolume(request: CreateVolumeRequest): Promise<StorageVolume> {
    try {
      const response = await postPlatformApi<any, CreateVolumeRequest>(
        '/storage/volumes',
        request,
        this.platformId
      );
      
      return response.volume;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get storage statistics (currently needs to be calculated from volumes data)
  async getStorageStats(): Promise<StorageStats> {
    try {
      // Fetch all volumes to calculate total storage
      // Using a large per_page to get all volumes in one request
      const response = await this.listStorageVolumes(
        undefined,
        { page: 0, per_page: 1000 }
      );
      
      // Calculate total storage from all volumes
      const totalStorage = response.data.reduce((sum, vol) => sum + vol.size_gb, 0);
      
      return {
        totalStorage,
        volumeCount: response.pagination ? response.pagination.total_count : response.data.length
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Calculate storage distribution by storage type
  async getStorageDistribution(): Promise<{ name: string; value: number }[]> {
    try {
      // Fetch all volumes to calculate distribution
      const volumesResponse = await this.listStorageVolumes(
        undefined,
        { page: 0, per_page: 1000 }
      );
      
      // Get storage classes to map IDs to types
      const classes = await this.listStorageClasses();
      
      // Create a map of storage class ID to type
      const classMap: Record<number, string> = {};
      classes.forEach(cls => {
        classMap[cls.id] = cls.storage_type;
      });
      
      // Calculate distribution by storage type
      const distributionMap: Record<string, number> = {};
      volumesResponse.data.forEach(volume => {
        const storageType = classMap[volume.storage_class_id] || 'unknown';
        
        if (!distributionMap[storageType]) {
          distributionMap[storageType] = 0;
        }
        
        distributionMap[storageType] += volume.size_gb;
      });
      
      // Convert to array format for the chart
      return Object.entries(distributionMap).map(([name, value]) => ({
        name,
        value
      }));
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
// import { StorageApiClient } from './StorageApiClient';
// import { DEFAULT_PLATFORM_ID } from './apiConfig';
//
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const storageClient = new StorageApiClient(platformId);
// const storageClasses = await storageClient.listStorageClasses();