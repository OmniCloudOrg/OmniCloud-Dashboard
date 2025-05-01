"use client"

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Server, 
  HardDrive, 
  ExternalLink, 
  Clock,
  Loader,
  Database
} from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';

// Configure API base URL
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

/**
 * ProviderResources - Resources tab content for provider detail
 * Now integrated with instances and volumes API
 */
const ProviderResources = ({ provider }) => {
  const [instances, setInstances] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volumesLoading, setVolumesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volumesError, setVolumesError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceType, setResourceType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  
  // Pagination state for instances
  const [instancesPage, setInstancesPage] = useState(0);
  const [instancesPerPage, setInstancesPerPage] = useState(5);
  const [instancesTotalCount, setInstancesTotalCount] = useState(0);
  const [instancesTotalPages, setInstancesTotalPages] = useState(0);
  
  // Pagination state for volumes
  const [volumesPage, setVolumesPage] = useState(0);
  const [volumesPerPage, setVolumesPerPage] = useState(5);
  const [volumesTotalCount, setVolumesTotalCount] = useState(0);
  const [volumesTotalPages, setVolumesTotalPages] = useState(0);

  // Fetch instances data
  useEffect(() => {
    const fetchInstances = async () => {
      if (!provider || !provider.id) {
        setError('No provider ID available');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/providers/${provider.id}/instances?page=${instancesPage}&per_page=${instancesPerPage}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setInstances(data.instances || []);
        
        // Set pagination data if available
        if (data.pagination) {
          setInstancesTotalCount(data.pagination.total_count || 0);
          setInstancesTotalPages(data.pagination.total_pages || 0);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching instances:', err);
        setError('Failed to load instances data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, [provider, instancesPage, instancesPerPage]);

  // Fetch volumes data
  useEffect(() => {
    const fetchVolumes = async () => {
      if (!provider || !provider.id) {
        setVolumesError('No provider ID available');
        setVolumesLoading(false);
        return;
      }
      
      try {
        setVolumesLoading(true);
        const response = await fetch(`${apiBaseUrl}/storage/providers/${provider.id}/volumes?page=${volumesPage}&per_page=${volumesPerPage}`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        // Extract volumes from the nested structure
        const extractedVolumes = [];
        if (data.volumes && data.volumes.regions) {
          data.volumes.regions.forEach(regionData => {
            if (regionData.volumes) {
              regionData.volumes.forEach(volume => {
                // Add region information to each volume
                extractedVolumes.push({
                  ...volume,
                  region: regionData.region.name
                });
              });
            }
          });
        }
        setVolumes(extractedVolumes);
        
        // Set pagination data if available
        if (data.pagination) {
          setVolumesTotalCount(data.pagination.total_count || 0);
          setVolumesTotalPages(data.pagination.total_pages || 0);
        }
        
        setVolumesError(null);
      } catch (err) {
        console.error('Error fetching volumes:', err);
        setVolumesError('Failed to load volumes data. Please try again later.');
      } finally {
        setVolumesLoading(false);
      }
    };

    fetchVolumes();
  }, [provider, volumesPage, volumesPerPage]);

  // Filter instances based on search term and filters
  const filteredInstances = instances && Array.isArray(instances) ? instances.filter(instance => {
    const matchesSearch = searchTerm === '' || 
      instance.guid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instance.container_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResourceType = resourceType === 'all' || 
      (resourceType === 'instance' && instance.instance_type === 'nodejs');
    
    // Region filtering would be applied here if the API supported multiple regions
    // For now, we're just showing instances from region 1
    
    return matchesSearch && matchesResourceType;
  }) : [];

  // Filter volumes based on search term and filters
  const filteredVolumes = volumes && Array.isArray(volumes) ? volumes.filter(volume => {
    const matchesSearch = searchTerm === '' || 
      volume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volume.storage_class.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResourceType = resourceType === 'all' || resourceType === 'storage';
    
    const matchesRegion = selectedRegion === 'all' || volume.region === selectedRegion;
    
    return matchesSearch && matchesResourceType && matchesRegion;
  }) : [];

  // Format uptime in a human-readable way
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle pagination for instances
  const handleInstancesPageChange = (newPage) => {
    if (newPage >= 0 && newPage < instancesTotalPages) {
      setInstancesPage(newPage);
    }
  };
  
  // Handle pagination for volumes
  const handleVolumesPageChange = (newPage) => {
    if (newPage >= 0 && newPage < volumesTotalPages) {
      setVolumesPage(newPage);
    }
  };
  
  // Handle per page change for instances
  const handleInstancesPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setInstancesPerPage(value);
    setInstancesPage(0); // Reset to first page when changing items per page
  };
  
  // Handle per page change for volumes
  const handleVolumesPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setVolumesPerPage(value);
    setVolumesPage(0); // Reset to first page when changing items per page
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <select 
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="instance">Instances</option>
            <option value="storage">Storage</option>
            <option value="database">Databases</option>
            <option value="networking">Networking</option>
          </select>
          <select 
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            {provider.regions.map((region, idx) => (
              <option key={idx} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">App Instances</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading instances...</span>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-200">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instance Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Container ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">CPU / Memory</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Uptime</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredInstances.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                      No resources found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredInstances.map((instance) => (
                    <tr key={instance.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Server size={16} className="text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            instance-{instance.instance_index}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{instance.instance_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {instance.container_id.substring(0, 15)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status={instance.health_status === "healthy" ? "active" : "warning"} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {instance.cpu_usage.toFixed(1)}% / {instance.memory_usage.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-slate-400">
                          <Clock size={14} className="mr-1" />
                          {formatUptime(instance.uptime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-slate-400 hover:text-slate-300">
                            <ExternalLink size={16} />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination controls for instances */}
        {!loading && !error && filteredInstances.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-400">
              <span>Show</span>
              <select
                value={instancesPerPage}
                onChange={handleInstancesPerPageChange}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleInstancesPageChange(0)}
                disabled={instancesPage === 0}
                className={`px-3 py-1 rounded ${instancesPage === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                First
              </button>
              <button
                onClick={() => handleInstancesPageChange(instancesPage - 1)}
                disabled={instancesPage === 0}
                className={`px-3 py-1 rounded ${instancesPage === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-slate-300">
                Page {instancesPage + 1} of {Math.max(1, instancesTotalPages)}
              </span>
              <button
                onClick={() => handleInstancesPageChange(instancesPage + 1)}
                disabled={instancesPage >= instancesTotalPages - 1}
                className={`px-3 py-1 rounded ${instancesPage >= instancesTotalPages - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                Next
              </button>
              <button
                onClick={() => handleInstancesPageChange(instancesTotalPages - 1)}
                disabled={instancesPage >= instancesTotalPages - 1}
                className={`px-3 py-1 rounded ${instancesPage >= instancesTotalPages - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Storage Resources</h3>
        
        {volumesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-slate-400">Loading volumes...</span>
          </div>
        ) : volumesError ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-200">
            {volumesError}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredVolumes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                      No volumes found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredVolumes.map((volume) => (
                    <tr key={volume.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <HardDrive size={16} className="text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            {volume.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{volume.storage_class}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{volume.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">{volume.size_gb} GB</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status={
                          volume.status === "Mounted" ? "active" : 
                          volume.status === "Provisioned" ? "pending" :
                          volume.status === "Deleting" ? "warning" : 
                          "inactive"
                        } />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">
                          {formatDate(volume.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-slate-400 hover:text-slate-300">
                            <ExternalLink size={16} />
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination controls for volumes */}
        {!volumesLoading && !volumesError && filteredVolumes.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-400">
              <span>Show</span>
              <select
                value={volumesPerPage}
                onChange={handleVolumesPerPageChange}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVolumesPageChange(0)}
                disabled={volumesPage === 0}
                className={`px-3 py-1 rounded ${volumesPage === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                First
              </button>
              <button
                onClick={() => handleVolumesPageChange(volumesPage - 1)}
                disabled={volumesPage === 0}
                className={`px-3 py-1 rounded ${volumesPage === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-slate-300">
                Page {volumesPage + 1} of {Math.max(1, volumesTotalPages)}
              </span>
              <button
                onClick={() => handleVolumesPageChange(volumesPage + 1)}
                disabled={volumesPage >= volumesTotalPages - 1}
                className={`px-3 py-1 rounded ${volumesPage >= volumesTotalPages - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                Next
              </button>
              <button
                onClick={() => handleVolumesPageChange(volumesTotalPages - 1)}
                disabled={volumesPage >= volumesTotalPages - 1}
                className={`px-3 py-1 rounded ${volumesPage >= volumesTotalPages - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-white hover:bg-slate-800'}`}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProviderResources };