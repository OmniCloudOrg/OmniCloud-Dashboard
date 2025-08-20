import { useState, useEffect, useCallback } from 'react';
import { transformPipeline, filterPipelines, calculatePipelineMetrics } from '@/utils/pipelineUtils';
import { SAMPLE_PIPELINES, PIPELINE_PAGINATION_DEFAULTS } from '@/data/pipelineConstants';

// Debug utility
const debug = (label, data) => {
  console.log(`[usePipelines] ${label}:`, data);
};

export const usePipelines = () => {
  // State management
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [environmentFilter, setEnvironmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pipelines');
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PIPELINE_PAGINATION_DEFAULTS.pageSize);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch pipelines (simulated with sample data for now)
  const fetchPipelines = useCallback(async () => {
    try {
      debug('Fetching pipelines');
      setRefreshing(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Transform sample data
      const transformedPipelines = SAMPLE_PIPELINES.map(transformPipeline);
      setPipelines(transformedPipelines);
      
      debug('Pipelines fetched successfully', {
        count: transformedPipelines.length
      });
    } catch (err) {
      debug('Error fetching pipelines', err);
      setError('Failed to fetch pipelines');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Filter pipelines based on current filters
  const filteredPipelines = useCallback(() => {
    const filters = {
      search: searchQuery,
      status: statusFilter,
      branch: branchFilter,
      environment: environmentFilter
    };

    const filtered = filterPipelines(pipelines, filters);
    debug('Pipelines filtered', {
      total: pipelines.length,
      filtered: filtered.length,
      filters
    });

    return filtered;
  }, [pipelines, searchQuery, statusFilter, branchFilter, environmentFilter]);

  // Get paginated pipelines
  const paginatedPipelines = useCallback(() => {
    const filtered = filteredPipelines();
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    
    return filtered.slice(startIndex, endIndex);
  }, [filteredPipelines, page, pageSize]);

  // Calculate metrics for current filtered pipelines
  const metrics = useCallback(() => {
    const filtered = filteredPipelines();
    return calculatePipelineMetrics(filtered);
  }, [filteredPipelines]);

  // Pagination calculations
  const totalCount = filteredPipelines().length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Create new pipeline
  const createPipeline = useCallback(async (pipelineData) => {
    try {
      debug('Creating pipeline', pipelineData);
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPipeline = {
        id: Date.now().toString(),
        ...pipelineData,
        status: 'pending',
        lastRun: new Date().toISOString(),
        duration: 0,
        buildNumber: 1
      };

      const transformedPipeline = transformPipeline(newPipeline);
      setPipelines(prev => [transformedPipeline, ...prev]);
      
      debug('Pipeline created successfully', transformedPipeline);
      return transformedPipeline;
    } catch (err) {
      debug('Error creating pipeline', err);
      throw new Error('Failed to create pipeline');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update pipeline
  const updatePipeline = useCallback(async (pipelineId, updates) => {
    try {
      debug('Updating pipeline', { pipelineId, updates });
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setPipelines(prev => prev.map(pipeline => 
        pipeline.id === pipelineId 
          ? { ...pipeline, ...updates }
          : pipeline
      ));
      
      debug('Pipeline updated successfully');
    } catch (err) {
      debug('Error updating pipeline', err);
      throw new Error('Failed to update pipeline');
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete pipeline
  const deletePipeline = useCallback(async (pipelineId) => {
    try {
      debug('Deleting pipeline', pipelineId);
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setPipelines(prev => prev.filter(pipeline => pipeline.id !== pipelineId));
      
      // Clear selection if deleted pipeline was selected
      if (selectedPipeline?.id === pipelineId) {
        setSelectedPipeline(null);
      }
      
      debug('Pipeline deleted successfully');
    } catch (err) {
      debug('Error deleting pipeline', err);
      throw new Error('Failed to delete pipeline');
    } finally {
      setLoading(false);
    }
  }, [selectedPipeline]);

  // Run pipeline
  const runPipeline = useCallback(async (pipelineId) => {
    try {
      debug('Running pipeline', pipelineId);
      
      // Update status to running
      await updatePipeline(pipelineId, {
        status: 'running',
        lastRun: new Date().toISOString()
      });

      // Simulate pipeline execution
      setTimeout(async () => {
        const success = Math.random() > 0.3; // 70% success rate
        await updatePipeline(pipelineId, {
          status: success ? 'success' : 'failed',
          duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
          buildNumber: Math.floor(Math.random() * 100) + 1
        });
      }, 3000);
      
    } catch (err) {
      debug('Error running pipeline', err);
      throw new Error('Failed to run pipeline');
    }
  }, [updatePipeline]);

  // Event handlers
  const handleSearchChange = useCallback((query) => {
    debug('Search query changed', query);
    setSearchQuery(query);
    setPage(0); // Reset to first page
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    debug('Status filter changed', status);
    setStatusFilter(status);
    setPage(0);
  }, []);

  const handleBranchFilterChange = useCallback((branch) => {
    debug('Branch filter changed', branch);
    setBranchFilter(branch);
    setPage(0);
  }, []);

  const handleEnvironmentFilterChange = useCallback((environment) => {
    debug('Environment filter changed', environment);
    setEnvironmentFilter(environment);
    setPage(0);
  }, []);

  const handleTabChange = useCallback((tab) => {
    debug('Tab changed', tab);
    setActiveTab(tab);
  }, []);

  const handlePipelineSelect = useCallback((pipeline) => {
    debug('Pipeline selected', pipeline?.id);
    setSelectedPipeline(pipeline);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    debug('Page changed', { from: page, to: newPage });
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  }, [page, totalPages]);

  const handlePageSizeChange = useCallback((newSize) => {
    debug('Page size changed', { from: pageSize, to: newSize });
    setPageSize(newSize);
    setPage(0);
  }, [pageSize]);

  const refresh = useCallback(() => {
    debug('Refreshing pipelines');
    fetchPipelines();
  }, [fetchPipelines]);

  // Initial fetch
  useEffect(() => {
    fetchPipelines();
  }, [fetchPipelines]);

  // Auto-refresh running pipelines
  useEffect(() => {
    const runningPipelines = pipelines.filter(p => p.status === 'running');
    
    if (runningPipelines.length > 0) {
      debug('Setting up auto-refresh for running pipelines', runningPipelines.length);
      const interval = setInterval(() => {
        // In a real app, this would fetch only the running pipelines
        fetchPipelines();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [pipelines, fetchPipelines]);

  return {
    // Data
    pipelines: paginatedPipelines(),
    allPipelines: pipelines,
    filteredCount: totalCount,
    metrics: metrics(),
    
    // State
    loading,
    error,
    refreshing,
    searchQuery,
    statusFilter,
    branchFilter,
    environmentFilter,
    activeTab,
    selectedPipeline,
    
    // Pagination
    page,
    pageSize,
    totalPages,
    totalCount,
    
    // Actions
    createPipeline,
    updatePipeline,
    deletePipeline,
    runPipeline,
    refresh,
    
    // Event handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleBranchFilterChange,
    handleEnvironmentFilterChange,
    handleTabChange,
    handlePipelineSelect,
    handlePageChange,
    handlePageSizeChange
  };
};
