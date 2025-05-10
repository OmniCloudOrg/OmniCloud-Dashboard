"use client"

import React, { useState, useEffect } from 'react';
import { 
  XCircle, 
  CheckCircle, 
  RefreshCw, 
  Terminal,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { 
  DashboardSection, 
  DataTable, 
  StatusBadge, 
  ProgressBar, 
  Button,
  ButtonGroup,
  IconButton
} from '../../components/ui';

/**
 * Application Instances Tab Component
 * Refactored to use the UI component library and fetch real data from API
 * Pagination modified to start at page 0
 */
const ApplicationInstances = ({ app }) => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Changed from 1 to 0
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
  
  // Format uptime in seconds to a human-readable format
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} days, ${hours} hours`;
  };
  
  // Function to fetch instances data from API with pagination
  const fetchInstances = async (page = currentPage, perPage = pageSize) => {
    try {
      setRefreshing(true);
      const response = await fetch(
        `${apiBaseUrl}/apps/${app?.id || 1}/instances?page=${page}&per_page=${perPage}`
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract instances and pagination information
      const { instances: instancesData, pagination } = data;
      
      // Update pagination state
      setCurrentPage(pagination.page);
      setPageSize(pagination.per_page);
      setTotalCount(pagination.total_count);
      setTotalPages(pagination.total_pages);
      
      // Transform API data to match the component's expected format
      const transformedData = instancesData.map(instance => ({
        id: instance.guid,
        status: instance.health_status === 'healthy' ? 'running' : 
               instance.status === 'running' ? 'warning' : 'stopped',
        region: `region-${instance.region_id}`,
        cpu: Math.round(instance.cpu_usage),
        memory: Math.round(instance.memory_usage),
        disk: Math.round(instance.disk_usage),
        uptime: formatUptime(instance.uptime),
        container_id: instance.container_id,
        container_ip: instance.container_ip,
        instance_index: instance.instance_index,
        restart_count: instance.restart_count,
        // Keep the original data for reference if needed
        raw: instance
      }));
      
      setInstances(transformedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching instances:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fetch data when component mounts or pagination changes
  useEffect(() => {
    fetchInstances(currentPage, pageSize);
    
    // Optional: Set up a refresh interval
    const refreshInterval = setInterval(() => fetchInstances(currentPage, pageSize), 30000); // Refresh every 30 seconds
    
    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(refreshInterval);
  }, [app?.id, currentPage, pageSize]); // Refetch when app ID, page, or page size changes
  
  // Handle instance actions
  const handleStartInstance = async (instance) => {
    try {
      await fetch(`${apiBaseUrl}/instances/${instance.id}/start`, {
        method: 'POST',
      });
      fetchInstances(); // Refresh data after action
    } catch (err) {
      console.error('Error starting instance:', err);
    }
  };
  
  const handleStopInstance = async (instance) => {
    try {
      await fetch(`${apiBaseUrl}/instances/${instance.id}/stop`, {
        method: 'POST',
      });
      fetchInstances(); // Refresh data after action
    } catch (err) {
      console.error('Error stopping instance:', err);
    }
  };
  
  const handleRestartInstance = async (instance) => {
    try {
      await fetch(`${apiBaseUrl}/instances/${instance.id}/restart`, {
        method: 'POST',
      });
      fetchInstances(); // Refresh data after action
    } catch (err) {
      console.error('Error restarting instance:', err);
    }
  };

  // Handle page change - updated to support 0-based pagination
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchInstances(page, pageSize);
    }
  };
  
  // Handle page size change - updated to reset to page 0
  const handlePageSizeChange = (size) => {
    // Reset to first page (page 0) when changing page size
    fetchInstances(0, size);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchInstances(currentPage, pageSize);
  };

  // Define table columns
  const columns = [
    {
      header: 'Instance ID',
      accessor: 'id',
      cell: (item) => <div className="text-sm font-medium text-white">{item.id}</div>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => <StatusBadge status={item.status} />
    },
    {
      header: 'Region',
      accessor: 'region',
      cell: (item) => <div className="text-sm text-slate-300">{item.region}</div>
    },
    {
      header: 'CPU',
      accessor: 'cpu',
      cell: (item) => <ProgressBar value={item.cpu} status={item.status} showLabel={true} />
    },
    {
      header: 'Memory',
      accessor: 'memory',
      cell: (item) => <ProgressBar value={item.memory} status={item.status} showLabel={true} />
    },
    {
      header: 'Uptime',
      accessor: 'uptime',
      cell: (item) => <div className="text-sm text-slate-300">{item.uptime}</div>
    },
    {
      header: '',
      accessor: 'actions',
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === 'running' ? (
            <IconButton
              icon={XCircle}
              variant="danger"
              size="sm"
              tooltip="Stop Instance"
              onClick={() => handleStopInstance(item)}
            />
          ) : (
            <IconButton
              icon={CheckCircle}
              variant="success"
              size="sm"
              tooltip="Start Instance"
              onClick={() => handleStartInstance(item)}
            />
          )}
          <IconButton
            icon={RefreshCw}
            variant="info"
            size="sm"
            tooltip="Restart Instance"
            onClick={() => handleRestartInstance(item)}
          />
          <IconButton
            icon={Terminal}
            variant="secondary"
            size="sm"
            tooltip="Console"
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          Instances ({totalCount})
          {loading && <span className="ml-2 text-sm text-slate-400">(Loading...)</span>}
        </h3>
        <ButtonGroup>
          <Button 
            variant="secondary" 
            size="sm"
            className="flex items-center align-middle"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant="primary" 
            size="sm"
          >
            Add Instance
          </Button>
        </ButtonGroup>
      </div>
      
      {error && (
        <div className="p-4 mb-4 text-red-400 bg-red-900/20 rounded-md">
          Error loading instances: {error}
        </div>
      )}
      
      {loading && instances.length === 0 ? (
        <div className="flex justify-center items-center h-32 text-slate-400">
          Loading instances data...
        </div>
      ) : (
        <>
          <DataTable 
            columns={columns} 
            data={instances} 
          />
          
          {/* Pagination Controls - updated to support 0-based pagination */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-slate-400">
              Showing {instances.length > 0 ? currentPage * pageSize + 1 : 0} to {currentPage * pageSize + instances.length} of {totalCount} instances
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || refreshing}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="px-2 text-white">
                  Page {currentPage + 1} of {totalPages || 1}
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1 || totalPages === 0 || refreshing}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      
      <div className="grid grid-cols-2 gap-6">
        <DashboardSection title="Auto Scaling Configuration">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Min Instances</span>
              <span className="text-white">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Max Instances</span>
              <span className="text-white">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scale Up Threshold</span>
              <span className="text-white">75% CPU for 5 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scale Down Threshold</span>
              <span className="text-white">30% CPU for 10 min</span>
            </div>
          </div>
        </DashboardSection>
        
        <DashboardSection title="Health Checks">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-400">Passing</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Endpoint</span>
              <span className="text-white">/health</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Interval</span>
              <span className="text-white">30 seconds</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Timeout</span>
              <span className="text-white">5 seconds</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Success Codes</span>
              <span className="text-white">200-299</span>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
};

export default ApplicationInstances;