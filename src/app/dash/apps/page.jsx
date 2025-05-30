"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  DashboardHeader, 
  DashboardGrid, 
  SearchFilter, 
  EmptyState
} from '../components/ui';
import ApplicationCard from './ApplicationCard';
import ApplicationDetail from './ApplicationDetail';
import CreateApplicationModal from './CreateApplicationModal';
import { ApplicationApiClient } from '@/utils/apiClient/apps';
import { usePlatform } from '@/components/context/PlatformContext';

// Debug utility
const debug = (label, data) => {
  console.log(`[ApplicationsManagement] ${label}:`, data);
};

const ApplicationsManagement = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(18);
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 0,
    page: 0,
    per_page: 18
  });

  // Early returns for platform issues
  if (platform === null || platform === undefined) {
    debug('Platform context is null/undefined', 'Showing loading state');
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading platform context...</span>
      </div>
    );
  }

  if (platformId === null || platformId === undefined) {
    debug('Platform ID is null/undefined', 'Waiting for platform selection');
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg max-w-md text-center">
          <div className="text-blue-700 font-medium mb-2">No Platform Selected</div>
          <div className="text-blue-600 text-sm">
            Please select a platform from the platform selector to view applications.
          </div>
        </div>
      </div>
    );
  }

  debug('Platform ID validated successfully', platformId);

  // Initialize API client with useMemo to prevent recreation
  const apiClient = React.useMemo(() => {
    try {
      const client = new ApplicationApiClient(platformId);
      debug('API client initialized successfully', { platformId });
      return client;
    } catch (initError) {
      debug('API client initialization failed', initError);
      throw initError;
    }
  }, [platformId]);

  // Handle API client initialization errors
  if (!apiClient) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
          <div className="text-red-700 font-medium mb-2">API Client Error</div>
          <div className="text-red-600 text-sm">
            Failed to initialize API client
          </div>
        </div>
      </div>
    );
  }

  // Fetch applications function
  const fetchApplications = useCallback(async (pageNum, itemsPerPage) => {
    debug('fetchApplications called', { pageNum, itemsPerPage, platformId });
    
    try {
      setLoading(true);
      setError(null);
      
      debug('Making API call to listApps', { page: pageNum, per_page: itemsPerPage });
      
      const result = await apiClient.listApps({
        page: pageNum,
        per_page: itemsPerPage
      });
      
      debug('API response received', {
        dataLength: result?.data?.length || 0,
        pagination: result?.pagination,
        fullResult: result
      });
      
      // Process the response
      const apps = result?.data || [];
      const paginationData = result?.pagination || {
        total_count: 0,
        total_pages: 0,
        page: pageNum,
        per_page: itemsPerPage
      };
      
      setApplications(apps);
      setPagination(paginationData);
      
      // Sync page state if needed
      if (paginationData.page !== pageNum) {
        debug('Syncing page state', { expected: pageNum, actual: paginationData.page });
        setPage(paginationData.page);
      }
      
      debug('State updated successfully', {
        appsCount: apps.length,
        pagination: paginationData
      });
      
    } catch (fetchError) {
      debug('fetchApplications error', fetchError);
      
      const errorMessage = `Failed to load applications: ${fetchError.message}`;
      setError(errorMessage);
      setApplications([]);
      setPagination({
        total_count: 0,
        total_pages: 0,
        page: 0,
        per_page: itemsPerPage
      });
    } finally {
      setLoading(false);
    }
  }, [apiClient, platformId]);

  // Effect for fetching applications
  useEffect(() => {
    debug('useEffect triggered for fetchApplications', { page, perPage });
    fetchApplications(page, perPage);
  }, [page, perPage, fetchApplications]);

  // Format application data
  const formatAppData = useCallback((app) => {
    debug('Formatting app data', app);
    
    try {
      const status = app.maintenance_mode ? 'maintenance' : 'running';
      const lastUpdated = new Date(app.updated_at).toLocaleDateString();
      
      const formatted = {
        id: app.id,
        name: app.name,
        description: app.git_repo,
        version: app.git_branch,
        status: status,
        region: `region-${app.region_id}`,
        lastUpdated: lastUpdated,
        platform_id: platformId,
        gitRepo: app.git_repo,
        gitBranch: app.git_branch,
        orgId: app.org_id,
        maintenanceMode: app.maintenance_mode,
        containerImageUrl: app.container_image_url,
        createdAt: new Date(app.created_at).toLocaleDateString(),
        instanceCount: app.instance_count || 0
      };
      
      debug('App data formatted', { original: app.id, formatted: formatted.id });
      return formatted;
    } catch (formatError) {
      debug('Error formatting app data', { app, error: formatError });
      return null;
    }
  }, [platformId]);

  // Filter applications
  const filteredApps = React.useMemo(() => {
    debug('Filtering applications', {
      totalApps: applications.length,
      searchQuery,
      statusFilter,
      regionFilter,
      gitBranchFilter
    });
    
    const formatted = applications
      .map(formatAppData)
      .filter(app => app !== null);
    
    const filtered = formatted.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesRegion = regionFilter === 'all' || app.region === regionFilter;
      const matchesGitBranch = gitBranchFilter === 'all' || app.version === gitBranchFilter;
      
      return matchesSearch && matchesStatus && matchesRegion && matchesGitBranch;
    });
    
    debug('Applications filtered', {
      formatted: formatted.length,
      filtered: filtered.length
    });
    
    return filtered;
  }, [applications, formatAppData, searchQuery, statusFilter, regionFilter, gitBranchFilter]);

  // Extract filter options
  const { uniqueRegions, uniqueGitBranches, filterOptions } = React.useMemo(() => {
    const regions = [...new Set(applications.map(app => `region-${app.region_id}`))];
    const branches = [...new Set(applications.filter(app => app.git_branch).map(app => app.git_branch))];
    
    const options = [
      {
        value: statusFilter,
        onChange: (e) => setStatusFilter(e.target.value),
        options: [
          { value: 'all', label: 'All Statuses' },
          { value: 'running', label: 'Running' },
          { value: 'maintenance', label: 'Maintenance' }
        ]
      },
      {
        value: regionFilter,
        onChange: (e) => setRegionFilter(e.target.value),
        options: [
          { value: 'all', label: 'All Regions' },
          ...regions.map(region => ({ 
            value: region, 
            label: region.replace('region-', 'Region ').toUpperCase()
          }))
        ]
      },
      {
        value: gitBranchFilter,
        onChange: (e) => setGitBranchFilter(e.target.value),
        options: [
          { value: 'all', label: 'All Branches' },
          ...branches.map(branch => ({ 
            value: branch, 
            label: branch.charAt(0).toUpperCase() + branch.slice(1)
          }))
        ]
      }
    ];
    
    debug('Filter options generated', { regions, branches, options });
    
    return {
      uniqueRegions: regions,
      uniqueGitBranches: branches,
      filterOptions: options
    };
  }, [applications, statusFilter, regionFilter, gitBranchFilter]);

  // Pagination helpers
  const getPageNumbers = useCallback(() => {
    const totalPages = pagination.total_pages;
    const currentPage = pagination.page;
    
    let pageNumbers = [0];
    
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages - 1);
    }
    
    const result = [...new Set(pageNumbers)].sort((a, b) => a - b);
    debug('Page numbers calculated', { totalPages, currentPage, pageNumbers: result });
    
    return result;
  }, [pagination.total_pages, pagination.page]);

  // Event handlers
  const handleCreateApplication = async (applicationData) => {
    debug('handleCreateApplication called', applicationData);
    
    try {
      setLoading(true);
      
      const result = await apiClient.createApp({
        name: applicationData.name,
        org_id: applicationData.orgId,
        memory: applicationData.memory || 512,
        instances: applicationData.instances || 1
      });
      
      debug('Application created successfully', result);
      
      setIsModalOpen(false);
      setPage(0);
      await fetchApplications(0, perPage);
      
    } catch (createError) {
      debug('Error creating application', createError);
      setError(`Failed to create application: ${createError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApp = async (app) => {
    debug('handleSelectApp called', app);
    
    try {
      setLoading(true);
      
      const [appWithInstances, appStats] = await Promise.all([
        apiClient.getAppWithInstances(app.id),
        apiClient.getAppStats(app.id)
      ]);
      
      const enrichedApp = {
        ...app,
        instances: appWithInstances.instances,
        stats: appStats
      };
      
      debug('App data enriched', { appId: app.id, enrichedApp });
      setSelectedApp(enrichedApp);
      
    } catch (selectError) {
      debug('Error selecting application', selectError);
      setError(`Failed to load application details: ${selectError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    debug('Page change requested', { from: page, to: newPage });
    setPage(newPage);
  };

  const handlePerPageChange = (newPerPage) => {
    debug('Per page change requested', { from: perPage, to: newPerPage });
    setPerPage(newPerPage);
    setPage(0);
  };

  const clearFilters = () => {
    debug('Clearing all filters');
    setSearchQuery('');
    setStatusFilter('all');
    setRegionFilter('all');
    setGitBranchFilter('all');
  };

  // Render application detail view
  if (selectedApp) {
    debug('Rendering application detail view', selectedApp.id);
    return (
      <ApplicationDetail 
        app={selectedApp} 
        onBack={() => setSelectedApp(null)} 
        apiClient={apiClient}
      />
    );
  }

  // Main render
  debug('Rendering main applications view', {
    loading,
    error: !!error,
    applicationsCount: applications.length,
    filteredAppsCount: filteredApps.length,
    pagination
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Applications"
        actionLabel="New Application"
        onAction={() => setIsModalOpen(true)}
        actionIcon={Plus}
      />
      
      {/* Initial loading state */}
      {loading && applications.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading applications...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <div className="text-red-700 font-medium">Error</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <button 
            onClick={() => fetchApplications(page, perPage)}
            className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search applications..."
            filters={filterOptions}
            className="mb-6"
          />
          
          {/* Subtle loading indicator for subsequent loads */}
          {loading && applications.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-md shadow-lg z-20 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-transparent mr-2"></div>
              <span>Updating...</span>
            </div>
          )}
          
          <DashboardGrid columns={3} gap={6}>
            {filteredApps.map(app => (
              <ApplicationCard 
                key={app.id} 
                app={app} 
                onSelect={() => handleSelectApp(app)} 
              />
            ))}
            
            {filteredApps.length === 0 && applications.length > 0 && (
              <EmptyState
                icon={Search}
                title="No Applications Found"
                description="No applications match your current search and filter criteria."
                actionText="Clear Filters"
                onAction={clearFilters}
              />
            )}
            
            {applications.length === 0 && !loading && (
              <EmptyState
                icon={Plus}
                title="No Applications Yet"
                description="Get started by creating your first application."
                actionText="Create Application"
                onAction={() => setIsModalOpen(true)}
              />
            )}
          </DashboardGrid>
          
          {/* Pagination */}
          {pagination.total_count > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t border-gray-200 pt-4 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{pagination.page * pagination.per_page + 1}</span> to{" "}
                <span className="font-medium text-gray-700">
                  {Math.min((pagination.page + 1) * pagination.per_page, pagination.total_count)}
                </span>{" "}
                of <span className="font-medium text-gray-700">{pagination.total_count}</span> applications
              </div>
              
              <div className="inline-flex rounded-md">
                <button
                  onClick={() => handlePageChange(Math.max(0, page - 1))}
                  disabled={page === 0 || loading}
                  className={`relative inline-flex items-center px-3 py-2 rounded-l-md ${
                    page === 0 || loading
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span className="sr-only">Previous</span>
                </button>
                
                {getPageNumbers().map((pageNum, idx, array) => {
                  const needsEllipsisBefore = idx > 0 && pageNum > array[idx - 1] + 1;
                  
                  return (
                    <React.Fragment key={pageNum}>
                      {needsEllipsisBefore && (
                        <span className="relative inline-flex items-center px-4 py-2 bg-slate-800 text-slate-400">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`relative inline-flex items-center px-4 py-2 ${
                          pageNum === page
                            ? "z-10 bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    </React.Fragment>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(pagination.total_pages - 1, page + 1))}
                  disabled={page >= pagination.total_pages - 1 || loading}
                  className={`relative inline-flex items-center px-3 py-2 rounded-r-md ${
                    page >= pagination.total_pages - 1 || loading
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <ChevronRight size={16} />
                  <span className="sr-only">Next</span>
                </button>
              </div>
              
              <div className="flex items-center text-sm text-slate-400 sm:ml-2">
                <span className="mr-2">Show:</span>
                <select
                  value={perPage}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  className="bg-slate-800 text-slate-200 rounded-md border-slate-700 text-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value={18}>18</option>
                  <option value={36}>36</option>
                  <option value={72}>72</option>
                  <option value={108}>108</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
      
      {isModalOpen && (
        <CreateApplicationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleCreateApplication}
          apiClient={apiClient}
        />
      )}
    </div>
  );
};

export default ApplicationsManagement;