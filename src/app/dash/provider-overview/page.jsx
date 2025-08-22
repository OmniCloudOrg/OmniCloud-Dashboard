"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Cloud, 
  CloudCog,
  RefreshCw, 
  Plus, 
  Search,
  CreditCard,
  Server,
  Database,
  AlertTriangle
} from 'lucide-react';

// Component imports
import { ResourceCard } from '../../../components/ui';
import { CreateConnectionModal } from './components/CreateConnectionModal';
import { ProviderDetail } from './components/ProviderDetail';

// API Client import
import { ProvidersApiClient } from '@/utils/apiClient/providers';

// Platform context import
import { usePlatform } from '@/components/context/PlatformContext';

// Chart components
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Import mock data
import { PROVIDER_COST_DATA } from '@/data';

/**
 * Cloud Providers Management Dashboard
 * 
 * Displays a list of cloud providers with their status and resource metrics.
 * Allows filtering by status and search by name or account ID.
 */
const CloudProvidersManagement = () => {
  // Get platform context
  const platform = usePlatform();
  const platformId = platform?.selectedPlatformId;

  // Initialize API client with useMemo to prevent recreation and handle platform changes
  const providersClient = useMemo(() => {
    if (!platformId) return null;
    return new ProvidersApiClient(platformId);
  }, [platformId]);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Data State
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 18,
    total_count: 0,
    total_pages: 0
  });

  // Sample data for provider resources (would normally come from another API endpoint)
  const providerResources = {
    1: { 
      resourceMetric: '106452 hours',
      monthlyCost: 10500,
      lastUpdated: '2 hours ago',
      regions: ['us-east-1', 'us-west-1', 'eu-central-1', 'ap-southeast-1'],
      accountId: 'account-1'
    },
    2: { 
      resourceMetric: '83121 day',
      monthlyCost: 8200,
      lastUpdated: '1 day ago',
      regions: ['us-central1', 'us-east1', 'europe-west1', 'asia-east1'],
      accountId: 'account-2'
    },
    3: { 
      resourceMetric: '78955 hours',
      monthlyCost: 7800,
      lastUpdated: '5 hours ago',
      regions: ['eastus', 'westus', 'northeurope', 'southeastasia'],
      accountId: 'account-3'
    }
  };

  // Early returns for platform issues
  if (platform === null || platform === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading platform context...</span>
      </div>
    );
  }

  if (platformId === null || platformId === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg max-w-md text-center">
          <div className="text-blue-700 font-medium mb-2">No Platform Selected</div>
          <div className="text-blue-600 text-sm">
            Please select a platform from the platform selector to view cloud providers.
          </div>
        </div>
      </div>
    );
  }

  // Handle API client initialization errors
  if (!providersClient) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
          <div className="text-red-700 font-medium mb-2">API Client Error</div>
          <div className="text-red-600 text-sm">
            Failed to initialize providers API client for platform {platformId}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Fetch providers from API
   * @param {number} page - Page number to fetch
   * @param {number} perPage - Number of items per page
   * @param {boolean} isRefresh - Whether this is a refresh operation
   */
  const fetchProviders = useCallback(async (page = 0, perPage = 18, isRefresh = false) => {
    if (!providersClient) return;

    try {
      isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      setError(null);

      // Use the API client to fetch providers
      const response = await providersClient.listProviders({
        page: page,
        per_page: perPage
      });
      
      // Update pagination data
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
      // Combine API data with the resource data
      const enrichedProviders = response.data.map(provider => ({
        ...provider,
        accountId: providerResources[provider.id]?.accountId || `account-${provider.id}`,
        resourceMetric: providerResources[provider.id]?.resourceMetric || 'N/A',
        monthlyCost: providerResources[provider.id]?.monthlyCost || 0,
        lastUpdated: providerResources[provider.id]?.lastUpdated || 'N/A',
        regions: providerResources[provider.id]?.regions || [],
        // Map API status to UI status
        status: provider.status === 'active' ? 'connected' : provider.status
      }));
      
      setProviders(enrichedProviders);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching providers');
      console.error('Error fetching providers:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [providersClient]);

  // Initial data fetch
  useEffect(() => {
    if (providersClient) {
      fetchProviders();
    }
  }, [fetchProviders, providersClient]);
  
  // Handle refresh button click
  const handleRefresh = () => {
    fetchProviders(pagination.page, pagination.per_page, true);
  };
  
  // Filter providers based on search query and status filter
  const filteredProviders = providers.filter(provider => {
    // Defensive check for provider object
    if (!provider) return false;
    
    // Search query matching
    const displayNameMatch = provider.display_name ? 
      provider.display_name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const nameMatch = provider.name ? 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const accountIdMatch = provider.accountId ? 
      provider.accountId.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
    // Status filter matching
    const statusMatch = 
      statusFilter === 'all' || 
      (statusFilter === 'connected' && provider.status === 'connected') ||
      (statusFilter === 'warning' && provider.status === 'warning') ||
      (statusFilter === 'depricated' && provider.status === 'depricated') ||
      (statusFilter === 'disconnected' && provider.status === 'disconnected');
    
    return (displayNameMatch || nameMatch || accountIdMatch) && statusMatch;
  });
  
  // Calculate totals for resource cards
  const totalMonthlyCost = providers.reduce((sum, provider) => sum + (provider.monthlyCost || 0), 0);
  
  // Count active regions
  const uniqueRegions = new Set();
  providers.forEach(provider => {
    if (provider.regions && Array.isArray(provider.regions)) {
      provider.regions.forEach(region => uniqueRegions.add(region));
    }
  });
  
  // Cost data for charts (would normally come from another API endpoint)
  const costData = PROVIDER_COST_DATA;

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.total_pages) {
      fetchProviders(newPage, pagination.per_page);
    }
  };

  // Render provider detail view if a provider is selected
  if (selectedProvider) {
    try {
      return (
        <ProviderDetail 
          provider={selectedProvider} 
          onBack={() => setSelectedProvider(null)} 
          platformId={platformId}
        />
      );
    } catch (error) {
      console.error('Error rendering provider detail:', error);
      // If there's an error in the detail view, reset the selection and show the main view
      setSelectedProvider(null);
      setError('Error displaying provider details. Please try again.');
      return null; // This will cause a re-render with the main view
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Cloud Providers</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Platform: {platformId}
          </div>
          <button 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <Plus size={16} />
            <span>Connect Provider</span>
          </button>
        </div>
      </div>
      
      {/* Resource Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Total Monthly Cost" 
          value={`$${totalMonthlyCost.toLocaleString()}`} 
          percentage="3" 
          trend="up" 
          icon={CreditCard} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="Across all providers"
          isLoading={isLoading}
        />
        <ResourceCard 
          title="Total Resources" 
          value={providers.length.toString()} 
          icon={Server} 
          color="bg-green-500/10 text-green-400"
          isLoading={isLoading}
        />
        <ResourceCard 
          title="Total Storage" 
          value="2.3 TB" 
          icon={Database} 
          color="bg-purple-500/10 text-purple-400"
          isLoading={isLoading}
        />
        <ResourceCard 
          title="Active Regions" 
          value={uniqueRegions.size.toString()} 
          icon={CloudCog} 
          color="bg-amber-500/10 text-amber-400"
          isLoading={isLoading}
        />
      </div>
      
      {/* Cost Overview Chart */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Cloud Cost Trends</h3>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
            <option value="6m">Last 6 Months</option>
            <option value="3m">Last 3 Months</option>
            <option value="1y">Last Year</option>
            <option value="ytd">Year to Date</option>
          </select>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costData}>
                    <defs>
                      <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGcp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="aws" 
                      stroke="#f59e0b" 
                      fillOpacity={1}
                      fill="url(#colorAws)" 
                      name="Amazon Web Services"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gcp" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorGcp)" 
                      name="Google Cloud Platform"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="azure" 
                      stroke="#0ea5e9" 
                      fillOpacity={1}
                      fill="url(#colorAzure)" 
                      name="Microsoft Azure"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-slate-300">AWS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-300">GCP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                  <span className="text-sm text-slate-300">Azure</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Providers List */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex gap-3 self-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                disabled={isLoading}
              >
                <option value="all">All Statuses</option>
                <option value="connected">Connected</option>
                <option value="warning">Warning</option>
                <option value="depricated">Depricated</option>
                <option value="disconnected">Disconnected</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
              <div className="p-4 bg-red-500/20 rounded-full text-red-400 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Error Loading Providers</h3>
              <p className="text-slate-400 mb-4 text-center max-w-lg">
                {error}
              </p>
              <button
                onClick={handleRefresh}
                className="text-blue-400 hover:text-blue-300"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map(provider => (
                  <div key={provider.id} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Cloud className="text-blue-400" size={24} />
                        <div>
                          <h3 className="text-lg font-medium text-white">{provider.display_name}</h3>
                          <p className="text-sm text-slate-400">{provider.accountId}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                        provider.status === 'connected' ? 'bg-green-500/20 text-green-400' : 
                        provider.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 
                        provider.status === 'offline' ? 'bg-red-500/20 text-red-400' :
                        provider.status === 'maintenance' ? 'bg-blue-500/20 text-blue-400' :
                        provider.status === 'deprecated' ? 'bg-gray-500/20 text-gray-400' :
                        provider.status === 'paused' ? 'bg-purple-500/20 text-purple-400' :
                        provider.status === 'error' ? 'bg-pink-500/20 text-pink-400' :
                        provider.status === 'in-progress' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
                        {provider.status === 'connected' ? 'Connected' : 
                        provider.status === 'warning' ? 'Warning' : 
                        provider.status === 'offline' ? 'Disconnected' :
                        provider.status === 'maintenance' ? 'Maintenance' :
                        provider.status === 'deprecated' ? 'Deprecated' :
                        provider.status === 'paused' ? 'Paused' :
                        provider.status === 'error' ? 'Error' :
                        provider.status === 'in-progress' ? 'In Progress' :
                        'Unknown'}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-xs uppercase text-slate-500 mb-1">Resources</h4>
                        <p className="text-sm text-white">{provider.resourceMetric}</p>
                      </div>
                      <div>
                        <h4 className="text-xs uppercase text-slate-500 mb-1">Regions</h4>
                        <p className="text-sm text-white">{provider.regions.length}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {provider.regions.map((region, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-800 rounded-md text-xs text-slate-300">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
                      <div className="flex items-center text-xs text-slate-400">
                        <span className="mr-1">Updated</span>
                        {provider.lastUpdated}
                      </div>
                      <button 
                        onClick={() => {
                          // Ensure the provider object is valid and has all required properties
                          if (provider && provider.id) {
                            // Create a safe copy of the provider with all required properties
                            const safeProvider = {
                              ...provider,
                              // Ensure these properties exist with fallback values
                              resources: provider.resources || {},
                              regions: provider.regions || [],
                              status: provider.status || 'unknown'
                            };
                            setSelectedProvider(safeProvider);
                          } else {
                            console.error('Invalid provider object:', provider);
                          }
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
                
                {filteredProviders.length === 0 && providers.length > 0 && (
                  <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                    <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                      <CloudCog size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No Providers Found</h3>
                    <p className="text-slate-400 mb-4 text-center max-w-lg">
                      We couldn't find any cloud providers matching your search criteria.
                      Try adjusting your filters or search query.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
              
              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 0 || isLoading || isRefreshing}
                      className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: pagination.total_pages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        disabled={isLoading || isRefreshing}
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          pagination.page === index 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.total_pages - 1 || isLoading || isRefreshing}
                      className="px-3 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Create Connection Modal */}
      {providersClient && (
        <CreateConnectionModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onProviderAdded={handleRefresh}
          platformId={platformId}
        />
      )}
    </div>
  );
};

export default CloudProvidersManagement;