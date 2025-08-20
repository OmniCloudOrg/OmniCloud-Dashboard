import { useState, useEffect, useCallback } from 'react';
import { ApplicationApiClient } from '@/utils/apiClient/apps';
import { usePlatform } from '@/components/context/PlatformContext';
import { transformApplication, filterApplications } from '@/utils/appUtils';
import { APP_PAGINATION_DEFAULTS } from '@/data/appConstants';

// Debug utility
const debug = (label, data) => {
  console.log(`[useApplications] ${label}:`, data);
};

export const useApplications = () => {
  // Platform context with comprehensive debugging
  const platform = usePlatform();
  
  debug('Platform context received', platform);
  debug('Platform type', typeof platform);
  debug('Platform keys', platform ? Object.keys(platform) : 'null/undefined');
  
  const platformId = platform?.selectedPlatformId;
  debug('Platform ID extracted', { platformId, type: typeof platformId });

  // State management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [gitBranchFilter, setGitBranchFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(APP_PAGINATION_DEFAULTS.perPage);
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 0,
    page: 0,
    per_page: APP_PAGINATION_DEFAULTS.perPage
  });

  // Initialize client
  const [client] = useState(() => new ApplicationApiClient(platformId));

  // Update client when platform changes
  useEffect(() => {
    if (platformId && client) {
      debug('Updating client with new platform ID', platformId);
      client.setPlatformId(platformId);
    }
  }, [platformId, client]);

  // Fetch applications
  const fetchApplications = useCallback(async (options = {}) => {
    const {
      page: requestPage = page,
      per_page: requestPerPage = perPage,
      search = searchQuery,
      status = statusFilter,
      region = regionFilter,
      git_branch = gitBranchFilter
    } = options;

    // Validate platform ID
    if (!platformId) {
      debug('No platform ID available, skipping fetch');
      setError('No platform selected');
      setLoading(false);
      return;
    }

    try {
      debug('Fetching applications', {
        platformId,
        page: requestPage,
        per_page: requestPerPage,
        search,
        status,
        region,
        git_branch
      });

      setLoading(true);
      setError(null);

      const response = await client.listApps({
        page: requestPage,
        per_page: requestPerPage,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        region: region !== 'all' ? region : undefined,
        git_branch: git_branch !== 'all' ? git_branch : undefined
      });

      debug('API response received', response);

      // Transform and filter applications
      const transformedApps = response.data.map(transformApplication);
      const filteredApps = filterApplications(transformedApps, {
        search,
        status,
        region,
        git_branch
      });

      setApplications(filteredApps);
      setPagination(response.pagination || {
        total_count: filteredApps.length,
        total_pages: 1,
        page: requestPage,
        per_page: requestPerPage
      });
      setPage(requestPage);
      setPerPage(requestPerPage);

      debug('Applications updated', {
        count: filteredApps.length,
        pagination: response.pagination
      });

    } catch (err) {
      debug('Error fetching applications', err);
      setError(err.message || 'Failed to fetch applications');
      setApplications([]);
      setPagination({
        total_count: 0,
        total_pages: 0,
        page: 0,
        per_page: requestPerPage
      });
    } finally {
      setLoading(false);
    }
  }, [
    platformId, 
    client, 
    page, 
    perPage, 
    searchQuery, 
    statusFilter, 
    regionFilter, 
    gitBranchFilter
  ]);

  // Refresh applications
  const refresh = useCallback(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Handle filter changes
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setPage(0);
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
    setPage(0);
  }, []);

  const handleRegionFilterChange = useCallback((region) => {
    setRegionFilter(region);
    setPage(0);
  }, []);

  const handleGitBranchFilterChange = useCallback((branch) => {
    setGitBranchFilter(branch);
    setPage(0);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    fetchApplications({ page: newPage });
  }, [fetchApplications]);

  const handlePerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(0);
    fetchApplications({ page: 0, per_page: newPerPage });
  }, [fetchApplications]);

  // Application actions
  const createApplication = useCallback(async (appData) => {
    if (!platformId) {
      throw new Error('No platform selected');
    }

    try {
      debug('Creating application', appData);
      const response = await client.createApp(appData);
      debug('Application created successfully', response);
      
      // Refresh the list
      await fetchApplications();
      return response;
    } catch (err) {
      debug('Error creating application', err);
      throw err;
    }
  }, [platformId, client, fetchApplications]);

  const deleteApplication = useCallback(async (appId) => {
    if (!platformId || !appId) {
      throw new Error('Invalid parameters for deletion');
    }

    try {
      debug('Deleting application', appId);
      await client.deleteApp(appId);
      debug('Application deleted successfully');
      
      // Refresh the list
      await fetchApplications();
    } catch (err) {
      debug('Error deleting application', err);
      throw err;
    }
  }, [platformId, client, fetchApplications]);

  // Initial fetch when platform ID becomes available
  useEffect(() => {
    if (platformId) {
      fetchApplications();
    }
  }, [platformId, fetchApplications]);

  // Filtered applications for client-side filtering
  const filteredApplications = filterApplications(applications, {
    search: searchQuery,
    status: statusFilter,
    region: regionFilter,
    git_branch: gitBranchFilter
  });

  return {
    // Data
    applications: filteredApplications,
    loading,
    error,
    pagination,
    
    // Filters
    searchQuery,
    statusFilter,
    regionFilter,
    gitBranchFilter,
    
    // Actions
    refresh,
    createApplication,
    deleteApplication,
    
    // Filter handlers
    handleSearchChange,
    handleStatusFilterChange,
    handleRegionFilterChange,
    handleGitBranchFilterChange,
    
    // Pagination handlers
    handlePageChange,
    handlePerPageChange,
    
    // Computed values
    hasApplications: filteredApplications.length > 0,
    currentPage: page,
    totalPages: pagination.total_pages,
    totalCount: pagination.total_count,
    perPage
  };
};
