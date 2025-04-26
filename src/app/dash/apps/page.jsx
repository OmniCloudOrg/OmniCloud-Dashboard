"use client"

import React, { useState, useEffect } from 'react';
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

const ApplicationsManagement = () => {
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
  const [perPage, setPerPage] = useState(18); // Set default to 18 as requested
  const [pagination, setPagination] = useState({
    total_count: 0,
    total_pages: 0,
    page: 0,
    per_page: 18
  });
  
  // Function to fetch applications
  const fetchApplications = async (pageNum = page, itemsPerPage = perPage) => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
      const response = await fetch(`${apiBaseUrl}/apps?page=${pageNum}&per_page=${itemsPerPage}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.apps || !data.pagination) {
        throw new Error('Invalid API response format');
      }
      
      // Store apps and pagination data
      setApplications(data.apps);
      setPagination(data.pagination);
      
      // Update page state to match API response (in case they don't align)
      if (data.pagination.page !== pageNum) {
        setPage(data.pagination.page);
      }
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
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
  };
  
  // Fetch applications on initial load and when page/perPage changes
  useEffect(() => {
    fetchApplications(page, perPage);
  }, [page, perPage]);
  
  // Map API data to application card format
  const formatAppData = (app) => {
    // Determine application status based on maintenance_mode
    const status = app.maintenance_mode ? 'maintenance' : 'running';
    
    // Format the last updated date
    const lastUpdated = new Date(app.updated_at).toLocaleDateString();
    
    return {
      id: app.id,
      name: app.name,
      description: app.git_repo,
      version: app.git_branch,
      status: status,
      region: `region-${app.region_id}`,
      lastUpdated: lastUpdated,
      // Additional fields that might be needed for detailed view
      gitRepo: app.git_repo,
      gitBranch: app.git_branch,
      orgId: app.org_id,
      maintenanceMode: app.maintenance_mode,
      containerImageUrl: app.container_image_url,
      createdAt: new Date(app.created_at).toLocaleDateString(),
      instanceCount: app.instance_count || 0
    };
  };
  
  // Filter apps based on search and filters
  const filteredApps = applications
    .map(formatAppData)
    .filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesRegion = regionFilter === 'all' || app.region === regionFilter;
      const matchesGitBranch = gitBranchFilter === 'all' || app.version === gitBranchFilter;
      
      return matchesSearch && matchesStatus && matchesRegion && matchesGitBranch;
    });

  // Extract unique regions, statuses, and git branches for filter options
  const uniqueRegions = [...new Set(applications.map(app => `region-${app.region_id}`))];
  const uniqueGitBranches = [...new Set(applications.map(app => app.git_branch))];
  
  // Define filter options
  const filterOptions = [
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
        ...uniqueRegions.map(region => ({ 
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
        ...uniqueGitBranches.map(branch => ({ 
          value: branch, 
          label: branch.charAt(0).toUpperCase() + branch.slice(1)
        }))
      ]
    }
  ];
  
  // Determine the page numbers to display
  const getPageNumbers = () => {
    const totalPages = pagination.total_pages;
    const currentPage = pagination.page;
    
    // Always show first page, last page, current page, and 1 page on each side of current
    let pageNumbers = [0]; // First page (0-indexed)
    
    // Pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    
    // Last page if we have more than 1 page
    if (totalPages > 1) {
      pageNumbers.push(totalPages - 1);
    }
    
    // Sort and deduplicate
    return [...new Set(pageNumbers)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();
  
  // Handle application detail view
  if (selectedApp) {
    return <ApplicationDetail app={selectedApp} onBack={() => setSelectedApp(null)} />;
  }
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Applications"
        actionLabel="New Application"
        onAction={() => setIsModalOpen(true)}
        actionIcon={Plus}
      />
      
      {loading && applications.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
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
          
          {/* No overlay loading indicator to prevent flashing */}
          {loading && applications.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-md shadow-lg z-20 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-transparent mr-2"></div>
              <span>Loading applications...</span>
            </div>
          )}
          
          <DashboardGrid columns={3} gap={6}>
            {filteredApps.map(app => (
              <ApplicationCard 
                key={app.id} 
                app={app} 
                onSelect={setSelectedApp} 
              />
            ))}
            
            {filteredApps.length === 0 && (
              <EmptyState
                icon={Search}
                title="No Applications Found"
                description="We couldn't find any applications matching your search criteria. Try adjusting your filters or search query."
                actionText="Clear Filters"
                onAction={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setRegionFilter('all');
                  setGitBranchFilter('all');
                }}
              />
            )}
          </DashboardGrid>
          
          {/* Enhanced Pagination controls */}
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
                {/* Previous page button */}
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
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
                
                {/* Page number buttons */}
                {pageNumbers.map((pageNum, idx) => {
                  // Check if we need to add ellipsis
                  const needsEllipsisBefore = idx > 0 && pageNum > pageNumbers[idx - 1] + 1;
                  
                  return (
                    <React.Fragment key={pageNum}>
                      {needsEllipsisBefore && (
                        <span className="relative inline-flex items-center px-4 py-2 bg-slate-800 text-slate-400">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => setPage(pageNum)}
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
                
                {/* Next page button */}
                <button
                  onClick={() => setPage(Math.min(pagination.total_pages - 1, page + 1))}
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
              
              {/* Per page selector */}
              <div className="flex items-center text-sm text-slate-400 sm:ml-2">
                <span className="mr-2">Show:</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    const newPerPage = Number(e.target.value);
                    setPerPage(newPerPage);
                    setPage(0); // Reset to first page when changing items per page
                  }}
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
          onSuccess={() => {
            // Refresh the applications list after creating a new one
            setPage(0);  // Reset to first page
            fetchApplications(0, perPage);
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsManagement;