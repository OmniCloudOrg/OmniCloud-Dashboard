/**
 * Custom Hook for Instance Management
 * Handles instances fetching, actions, and terminal management
 */

import { useState, useEffect } from 'react';
import { ApplicationApiClient } from '@/utils/apiClient/apps';
import { getPlatformApiUrl, defaultFetchOptions } from '@/utils/apiConfig';
import { 
  DEFAULT_INSTANCE_PAGINATION, 
  INSTANCE_REFRESH_INTERVAL 
} from '@/data/instanceConstants';
import { transformInstance, generateTerminalId } from '@/utils/instances/instanceUtils';

export const useInstances = (app) => {
  // API client
  const [client] = useState(() => new ApplicationApiClient(app?.platform_id || 1));
  
  // Instance data state
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(DEFAULT_INSTANCE_PAGINATION.page);
  const [pageSize, setPageSize] = useState(DEFAULT_INSTANCE_PAGINATION.pageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Terminal management state
  const [openTerminals, setOpenTerminals] = useState(new Map());
  const [terminalCounter, setTerminalCounter] = useState(0);

  // Update client when app changes
  useEffect(() => {
    if (app?.platform_id) {
      client.setPlatformId(app.platform_id);
    }
  }, [app?.platform_id, client]);

  // Fetch instances
  const fetchInstances = async (newPage = page, newPageSize = pageSize) => {
    if (!app?.id) return;
    
    try {
      setRefreshing(true);
      const { data, pagination } = await client.listInstances(app.id, {
        page: newPage,
        per_page: newPageSize,
      });
      
      setInstances(data.map(transformInstance));
      setPage(newPage);
      setPageSize(newPageSize);
      setTotalCount(pagination.total_count);
      setTotalPages(pagination.total_pages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch instances');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on mount and setup auto-refresh
  useEffect(() => {
    if (!app?.id) return;
    
    fetchInstances();
    const interval = setInterval(() => fetchInstances(), INSTANCE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [app?.id]);

  // Instance action handler
  const handleInstanceAction = async (instance, action) => {
    if (!app?.id || !instance.id) return;
    
    try {
      const response = await fetch(
        getPlatformApiUrl(`/apps/${app.id}/instances/${instance.id}/${action}`, app.platform_id || 1),
        { ...defaultFetchOptions, method: 'PUT' }
      );
      
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      
      // Refresh instances after action
      fetchInstances();
    } catch (err) {
      setError(`Error ${action} instance: ${err.message}`);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchInstances(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    fetchInstances(0, newSize);
  };

  // Terminal management
  const openTerminal = (instance) => {
    const terminalId = generateTerminalId(instance.id, terminalCounter);
    
    setOpenTerminals(prev => {
      const newMap = new Map(prev);
      newMap.set(terminalId, {
        instance,
        terminalId,
        status: {
          isConnected: false,
          isConnecting: false,
          connectionError: null
        }
      });
      return newMap;
    });
    
    setTerminalCounter(prev => prev + 1);
  };

  const closeTerminal = (terminalId) => {
    setOpenTerminals(prev => {
      const newMap = new Map(prev);
      newMap.delete(terminalId);
      return newMap;
    });
  };

  const updateTerminalStatus = (terminalId, status) => {
    setOpenTerminals(prev => {
      const newMap = new Map(prev);
      const terminal = newMap.get(terminalId);
      if (terminal) {
        newMap.set(terminalId, {
          ...terminal,
          status
        });
      }
      return newMap;
    });
  };

  // Manual refresh
  const refresh = () => {
    fetchInstances();
  };

  return {
    // Data state
    instances,
    loading,
    error,
    refreshing,
    
    // Pagination state
    page,
    pageSize,
    totalCount,
    totalPages,
    
    // Terminal state
    openTerminals,
    
    // Actions
    handleInstanceAction,
    handlePageChange,
    handlePageSizeChange,
    openTerminal,
    closeTerminal,
    updateTerminalStatus,
    refresh
  };
};
