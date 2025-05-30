// AuditLogApiClient.ts
// API client for audit log management that leverages the centralized apiConfig

import { 
  fetchPlatformApi, 
  postPlatformApi, 
  putPlatformApi,
  deletePlatformApi,
  getPlatformApiUrl,
  defaultFetchOptions
} from '@/utils/apiConfig';

// Type definitions based on server models
export interface AuditLog {
  id?: number;
  user_id: number;
  org_id: number;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  timestamp?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAuditLogRequest {
  user_id: number;
  org_id: number;
  action: string;
  resource_type: string;
  resource_id?: string | null;
}

export interface AuditLogFilter {
  user_id?: number;
  org_id?: number;
  action?: string;
  resource_type?: string;
  resource_id?: string;
  start_date?: string;
  end_date?: string;
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

// Common audit log actions (can be extended based on your needs)
export const AUDIT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  LOGIN: 'login',
  LOGOUT: 'logout',
  DEPLOY: 'deploy',
  SCALE: 'scale',
  START: 'start',
  STOP: 'stop',
  RESTART: 'restart',
  BACKUP: 'backup',
  RESTORE: 'restore',
  CONFIGURE: 'configure',
} as const;

// Common resource types (can be extended based on your needs)
export const RESOURCE_TYPES = {
  APPLICATION: 'application',
  INSTANCE: 'instance',
  DEPLOYMENT: 'deployment',
  STORAGE: 'storage',
  VOLUME: 'volume',
  PROVIDER: 'provider',
  USER: 'user',
  ORGANIZATION: 'organization',
  ALERT: 'alert',
  RULE: 'rule',
  PLATFORM: 'platform',
} as const;

// API client class
export class AuditLogApiClient {
  private platformId: number;

  constructor(platformId: number) {
    this.platformId = platformId;
  }

  // Set platform ID
  setPlatformId(platformId: number): void {
    this.platformId = platformId;
  }

  // Create a new audit log entry
  async createAuditLog(request: CreateAuditLogRequest): Promise<AuditLog> {
    try {
      const response = await postPlatformApi<any, CreateAuditLogRequest>(
        '/audit_log',
        request,
        this.platformId
      );
      
      return response;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // List all audit logs with pagination
  async listAuditLogs(
    pagination?: PaginationParams,
    filter?: AuditLogFilter
  ): Promise<PaginatedResponse<AuditLog>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      // Add filter parameters (for future server-side filtering support)
      if (filter) {
        if (filter.user_id !== undefined) queryParams.append('user_id', filter.user_id.toString());
        if (filter.org_id !== undefined) queryParams.append('org_id', filter.org_id.toString());
        if (filter.action) queryParams.append('action', filter.action);
        if (filter.resource_type) queryParams.append('resource_type', filter.resource_type);
        if (filter.resource_id) queryParams.append('resource_id', filter.resource_id);
        if (filter.start_date) queryParams.append('start_date', filter.start_date);
        if (filter.end_date) queryParams.append('end_date', filter.end_date);
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/audit_logs${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.audit_logs || [],
        pagination: response.pagination || {
          page: pagination?.page || 1,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // List audit logs for a specific application
  async listAuditLogsForApp(
    appId: number,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (pagination) {
        queryParams.append('page', pagination.page.toString());
        queryParams.append('per_page', pagination.per_page.toString());
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetchPlatformApi<any>(
        `/audit_logs/${appId}${queryString}`, 
        this.platformId
      );
      
      return {
        data: response.audit_logs || [],
        pagination: response.pagination || {
          page: pagination?.page || 1,
          per_page: pagination?.per_page || 10,
          total_count: 0,
          total_pages: 0
        }
      };
    } catch (error) {
      throw this.formatError(error);
    }
  }

  // Convenience method to log an action
  async logAction(
    userId: number,
    orgId: number,
    action: string,
    resourceType: string,
    resourceId?: string
  ): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      org_id: orgId,
      action,
      resource_type: resourceType,
      resource_id: resourceId || null
    });
  }

  // Convenience methods for common actions
  async logApplicationAction(
    userId: number,
    orgId: number,
    action: string,
    appId: number
  ): Promise<AuditLog> {
    return this.logAction(
      userId,
      orgId,
      action,
      RESOURCE_TYPES.APPLICATION,
      appId.toString()
    );
  }

  async logDeploymentAction(
    userId: number,
    orgId: number,
    action: string,
    deploymentId: number
  ): Promise<AuditLog> {
    return this.logAction(
      userId,
      orgId,
      action,
      RESOURCE_TYPES.DEPLOYMENT,
      deploymentId.toString()
    );
  }

  async logStorageAction(
    userId: number,
    orgId: number,
    action: string,
    volumeId: number
  ): Promise<AuditLog> {
    return this.logAction(
      userId,
      orgId,
      action,
      RESOURCE_TYPES.VOLUME,
      volumeId.toString()
    );
  }

  async logUserAction(
    userId: number,
    orgId: number,
    action: string,
    targetUserId?: number
  ): Promise<AuditLog> {
    return this.logAction(
      userId,
      orgId,
      action,
      RESOURCE_TYPES.USER,
      targetUserId?.toString()
    );
  }

  // Client-side filtering helper (for when server-side filtering isn't implemented)
  filterAuditLogs(logs: AuditLog[], filter: AuditLogFilter): AuditLog[] {
    return logs.filter(log => {
      if (filter.user_id !== undefined && log.user_id !== filter.user_id) {
        return false;
      }
      if (filter.org_id !== undefined && log.org_id !== filter.org_id) {
        return false;
      }
      if (filter.action && log.action !== filter.action) {
        return false;
      }
      if (filter.resource_type && log.resource_type !== filter.resource_type) {
        return false;
      }
      if (filter.resource_id && log.resource_id !== filter.resource_id) {
        return false;
      }
      if (filter.start_date && log.timestamp && new Date(log.timestamp) < new Date(filter.start_date)) {
        return false;
      }
      if (filter.end_date && log.timestamp && new Date(log.timestamp) > new Date(filter.end_date)) {
        return false;
      }
      return true;
    });
  }

  // Get unique values for filter dropdowns
  getUniqueActions(logs: AuditLog[]): string[] {
    return [...new Set(logs.map(log => log.action))].filter(Boolean).sort();
  }

  getUniqueResourceTypes(logs: AuditLog[]): string[] {
    return [...new Set(logs.map(log => log.resource_type))].filter(Boolean).sort();
  }

  getUniqueUsers(logs: AuditLog[]): number[] {
    return [...new Set(logs.map(log => log.user_id))].filter(Boolean).sort((a, b) => a - b);
  }

  // Helper to format timestamps
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    // For older entries, show the actual date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Helper to get a human-readable action description
  getActionDescription(action: string, resourceType: string): string {
    const actionMap: Record<string, string> = {
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
      view: 'Viewed',
      login: 'Logged in',
      logout: 'Logged out',
      deploy: 'Deployed',
      scale: 'Scaled',
      start: 'Started',
      stop: 'Stopped',
      restart: 'Restarted',
      backup: 'Backed up',
      restore: 'Restored',
      configure: 'Configured'
    };

    const resourceMap: Record<string, string> = {
      application: 'application',
      instance: 'instance',
      deployment: 'deployment',
      storage: 'storage',
      volume: 'volume',
      provider: 'provider',
      user: 'user',
      organization: 'organization',
      alert: 'alert',
      rule: 'rule',
      platform: 'platform'
    };

    const actionText = actionMap[action] || action;
    const resourceText = resourceMap[resourceType] || resourceType;
    
    return `${actionText} ${resourceText}`;
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
// import { AuditLogApiClient, AUDIT_ACTIONS, RESOURCE_TYPES } from './AuditLogApiClient';
// import { DEFAULT_PLATFORM_ID } from './apiConfig';
//
// const platformId = Number(DEFAULT_PLATFORM_ID);
// const auditClient = new AuditLogApiClient(platformId);
// 
// // List all audit logs
// const logs = await auditClient.listAuditLogs({ page: 1, per_page: 20 });
//
// // Log an application deployment
// await auditClient.logApplicationAction(
//   userId, 
//   orgId, 
//   AUDIT_ACTIONS.DEPLOY, 
//   appId
// );
//
// // List logs for a specific app
// const appLogs = await auditClient.listAuditLogsForApp(appId, { page: 1, per_page: 10 });