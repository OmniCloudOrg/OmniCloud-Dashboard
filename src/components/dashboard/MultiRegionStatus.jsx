"use client"

import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

export const MultiRegionStatus = () => {
  // State for regions data
  const [regions, setRegions] = useState([]);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  
  // State for error handling
  const [error, setError] = useState(null);
  
  // API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
  
  // Function to fetch region data
  const fetchRegionData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch regions from the API
      const response = await fetch(`${apiBaseUrl}/provider_regions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setRegions(data);
    } catch (err) {
      console.error('Error fetching region data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchRegionData();
  }, []);
  
  // Provider icon mapping
  const getProviderIcon = (provider) => {
    switch(provider) {
      case 'aws':
        return <Cloud size={16} className="text-amber-400" />;
      case 'gcp':
        return <Cloud size={16} className="text-blue-400" />;
      case 'azure':
        return <Cloud size={16} className="text-blue-600" />;
      default:
        return <Cloud size={16} className="text-slate-400" />;
    }
  };
  
  // Function to determine status color based on binding_status
  const getStatusInfo = (bindingStatus) => {
    switch(bindingStatus) {
      case 'active':
        return {
          status: 'healthy',
          statusClass: 'text-green-400',
          dotClass: 'bg-green-400'
        };
      case 'warning':
        return {
          status: 'warning',
          statusClass: 'text-yellow-400',
          dotClass: 'bg-yellow-400'
        };
      case 'inactive':
      case 'error':
        return {
          status: 'critical',
          statusClass: 'text-red-400',
          dotClass: 'bg-red-400'
        };
      default:
        return {
          status: bindingStatus,
          statusClass: 'text-slate-400',
          dotClass: 'bg-slate-400'
        };
    }
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Multi-Cloud Status</h3>
        <button 
          onClick={fetchRegionData} 
          disabled={isLoading}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>{isLoading ? "Loading..." : "Refresh"}</span>
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-900/20 border-b border-red-900 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-red-400 text-sm">Error loading region data: {error}</span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        {isLoading && regions.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <RefreshCw size={24} className="mx-auto mb-4 animate-spin" />
            <p>Loading region data...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {regions.map((item) => {
                const region = item.region;
                const statusInfo = getStatusInfo(item.binding_status);
                
                return (
                  <tr key={region.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{region.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getProviderIcon(item.provider_name)}
                        <div className="text-sm text-slate-300">{item.provider_name.toUpperCase()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-2 ${statusInfo.statusClass}`}>
                        <div className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`}></div>
                        <div className="text-sm capitalize">{statusInfo.status}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {new Date(region.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                        <span>Details</span>
                        <ExternalLink size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {regions.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No regions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MultiRegionStatus;