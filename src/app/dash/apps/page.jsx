"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
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
  const [perPage, setPerPage] = useState(72);
  const [totalApps, setTotalApps] = useState(0);
  
  // Function to fetch applications
  const fetchApplications = async (pageNum = page, itemsPerPage = perPage) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8002/api/v1/apps?page=${pageNum}&per_page=${itemsPerPage}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Assuming the API returns total count in headers or in response
      // Update this according to your actual API response structure
      const totalCount = response.headers.get('X-Total-Count') || data.total || data.length;
      setTotalApps(parseInt(totalCount, 10));
      
      // If your API returns data wrapped in a data property, adjust accordingly
      setApplications(Array.isArray(data) ? data : data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch applications on initial load and when page/perPage changes
  useEffect(() => {
    fetchApplications();
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
      createdAt: new Date(app.created_at).toLocaleDateString()
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
      
      {loading ? (
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
          
          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-6 border-t pt-4">
            <div className="text-sm text-gray-700">
              {totalApps > 0 ? (
                <>
                  Showing <span className="font-medium">{page * perPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min((page + 1) * perPage, totalApps)}
                  </span>{" "}
                  of <span className="font-medium">{totalApps}</span> applications
                </>
              ) : (
                <span>No applications found</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const newPage = Math.max(0, page - 1);
                  setPage(newPage);
                }}
                disabled={page === 0}
                className={`px-3 py-1 rounded-md ${
                  page === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              
              {totalApps > 0 && [...Array(Math.ceil(totalApps / perPage)).keys()].slice(
                Math.max(0, page - 1),
                Math.min(Math.ceil(totalApps / perPage), page + 4)
              ).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                  }}
                  className={`px-3 py-1 rounded-md ${
                    pageNum === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}
              
              <button
                onClick={() => {
                  const newPage = page + 1;
                  setPage(newPage);
                }}
                disabled={totalApps === 0 || page >= Math.ceil(totalApps / perPage) - 1}
                className={`px-3 py-1 rounded-md ${
                  totalApps === 0 || page >= Math.ceil(totalApps / perPage) - 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </div>
          </div>
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