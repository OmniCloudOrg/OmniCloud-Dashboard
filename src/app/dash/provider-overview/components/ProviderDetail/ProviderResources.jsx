"use client"

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Server, 
  HardDrive, 
  ExternalLink, 
  Clock,
  Loader
} from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';

// Configure API base URL
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

/**
 * ProviderResources - Resources tab content for provider detail
 * Now integrated with instances API
 */
const ProviderResources = ({ provider }) => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceType, setResourceType] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

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
        const response = await fetch(`${apiBaseUrl}/providers/${provider.id}/instances`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setInstances(data.instances || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching instances:', err);
        setError('Failed to load instances data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, [provider]);

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

  // Format uptime in a human-readable way
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
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
        <h3 className="text-lg font-medium text-white mb-4">Compute Resources</h3>
        
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
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Storage Resources</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <HardDrive size={16} className="text-blue-400" />
                      <span className="text-sm font-medium text-white">bucket-{idx+1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">S3 Bucket</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{provider.regions[idx % provider.regions.length]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{(idx + 1) * 25} GB</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status="active" />
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ProviderResources };