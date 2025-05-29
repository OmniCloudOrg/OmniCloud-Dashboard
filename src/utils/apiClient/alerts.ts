// AlertsApiClient.ts
// API client for alerts that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface Alert {
  id: number;
  alert_type: string;
  message: string;
  service: string;
  severity: string; // 'critical', 'warning', 'info'
  status: string;   // 'active', 'acknowledged', 'resolved', 'auto_resolved'
  timestamp: string;
  resource_id?: string;
  resource_type?: string;
  details?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AcknowledgeAlertRequest {
  acknowledged_by: string;
  notes?: string;
}

export interface ResolveAlertRequest {
  resolved_by: string;
  resolution_notes?: string;
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
export class AlertsApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // List all alerts with pagination
  async listAlerts(params: PaginationParams): Promise<PaginatedResponse<Alert>> {
    try {
      const queryString = `?page=${params.page}&per_page=${params.per_page}`;
      
      const response = await fetchPlatformApi<any>(
        `/alerts${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.alerts || [],
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

  // Get alerts for a specific service
  async getAlertsByService(service: string, params: PaginationParams): Promise<PaginatedResponse<Alert>> {
    try {
      const queryString = `?page=${params.page}&per_page=${params.per_page}&service=${encodeURIComponent(service)}`;
      
      const response = await fetchPlatformApi<any>(
        `/alerts/by-service${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.alerts || [],
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

  // Get a specific alert by ID
  async getAlert(alertId: number): Promise<Alert> {
    try {
      return await fetchPlatformApi<Alert>(
        `/alerts/${alertId}`, 
        this.platformId
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Acknowledge an alert
  async acknowledgeAlert(alertId: number, request: AcknowledgeAlertRequest): Promise<Alert> {
    try {
      return await postPlatformApi<Alert>(
        `/alerts/${alertId}/acknowledge`,
        this.platformId,
        request,
        'PUT'
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Resolve an alert
  async resolveAlert(alertId: number, request: ResolveAlertRequest): Promise<Alert> {
    try {
      return await postPlatformApi<Alert>(
        `/alerts/${alertId}/resolve`,
        this.platformId,
        request,
        'PUT'
      );
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Get alert statistics
  async getAlertStats(): Promise<{
    active_count: number;
    critical_count: number;
    warning_count: number;
    info_count: number;
  }> {
    try {
      return await fetchPlatformApi<any>(
        '/alerts/stats', 
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
// import { AlertsApiClient } from './AlertsApiClient';
// import { DEFAULT_PLATFORM_ID } from './apiConfig';
//
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const alertsClient = new AlertsApiClient(platformId);
// const alertsResponse = await alertsClient.listAlerts({ page: 0, per_page: 10 });