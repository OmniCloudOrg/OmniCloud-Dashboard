/**
 * Custom Hook for Audit Logs Management
 * Handles audit logs fetching, filtering, and state management
 */

import { useState, useEffect, useMemo } from 'react';
import { AuditLogApiClient } from '@/utils/apiClient/audit_log';
import { usePlatform } from '@/components/context/PlatformContext';
import { 
  DEFAULT_PAGINATION, 
  DEFAULT_SELECTED_EVENT_TYPES 
} from '@/data/auditConstants';
import {
  calculateEventTypeCounts,
  calculateSeverityCounts,
  generateActivityData,
  filterAuditLogs
} from '@/utils/audit/auditUtils';

export const useAuditLogs = () => {
  const platform = usePlatform();
  const platformId = platform?.selectedPlatformId;

  // API client initialization
  const auditClient = useMemo(() => {
    if (!platformId) return null;
    return new AuditLogApiClient(platformId);
  }, [platformId]);

  // State management
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState(DEFAULT_SELECTED_EVENT_TYPES);
  const [timeRange, setTimeRange] = useState('24h');
  const [expandedLog, setExpandedLog] = useState(null);

  // Derived state
  const [eventTypeCounts, setEventTypeCounts] = useState({});
  const [severityCounts, setSeverityCounts] = useState({ high: 0, medium: 0, low: 0 });
  const [activityData, setActivityData] = useState([]);

  // Platform validation
  const platformStatus = useMemo(() => {
    if (platform === null || platform === undefined) {
      return { status: 'loading', message: 'Loading platform context...' };
    }
    if (platformId === null || platformId === undefined) {
      return { status: 'no-platform', message: 'Please select a platform to view audit logs.' };
    }
    if (!auditClient) {
      return { status: 'client-error', message: `Failed to initialize audit log API client for platform ${platformId}` };
    }
    return { status: 'ready' };
  }, [platform, platformId, auditClient]);

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    if (!auditClient) return;

    setLoading(true);
    try {
      const response = await auditClient.listAuditLogs({
        page: pagination.page,
        per_page: pagination.per_page
      });
      
      console.log("Fetched audit logs:", response);
      
      const logs = response.data || [];
      setAuditLogs(logs);
      setPagination(response.pagination || {
        page: 1,
        per_page: 10,
        total_count: logs.length,
        total_pages: 1
      });
      
      // Calculate derived data
      setEventTypeCounts(calculateEventTypeCounts(logs));
      setSeverityCounts(calculateSeverityCounts(logs));
      setActivityData(generateActivityData(logs));
      
      setError(null);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchAuditLogs();
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Filter handlers
  const toggleEventTypeFilter = (type) => {
    setSelectedEventTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEventTypes(DEFAULT_SELECTED_EVENT_TYPES);
  };

  // Log expansion handlers
  const toggleLogExpansion = (logId) => {
    setExpandedLog(prev => prev === logId ? null : logId);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => 
    filterAuditLogs(auditLogs, searchQuery, selectedEventTypes),
    [auditLogs, searchQuery, selectedEventTypes]
  );

  // Load data when dependencies change
  useEffect(() => {
    if (auditClient) {
      fetchAuditLogs();
    }
  }, [auditClient, pagination.page, pagination.per_page]);

  return {
    // Platform status
    platformStatus,
    platformId,
    auditClient,
    
    // Data state
    auditLogs,
    filteredLogs,
    loading,
    error,
    pagination,
    eventTypeCounts,
    severityCounts,
    activityData,
    
    // Filter state
    searchQuery,
    setSearchQuery,
    selectedEventTypes,
    timeRange,
    setTimeRange,
    expandedLog,
    
    // Actions
    handleRefresh,
    handlePageChange,
    toggleEventTypeFilter,
    clearFilters,
    toggleLogExpansion
  };
};
