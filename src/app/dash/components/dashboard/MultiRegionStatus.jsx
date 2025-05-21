"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Cloud, RefreshCw, ExternalLink, AlertTriangle, Globe } from 'lucide-react';
import { PaginatedContainer } from '@/components/ui/PaginatedContainer';
import { RegionsApiClient } from '@/utils/apiClient/regions';
import { DEFAULT_PLATFORM_ID } from '@/utils/apiConfig';

export const MultiRegionStatus = () => {
  // State for regions data
  const [allRegions, setAllRegions] = useState([]);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true);
  
  // State for error handling
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Show 5 items per page
  
  // Initialize API client
  const platformId = Number(DEFAULT_PLATFORM_ID || 1);
  const regionsClient = useMemo(() => new RegionsApiClient(platformId), [platformId]);
  
  // Function to fetch region data
  const fetchRegionData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch provider regions from the API client
      const data = await regionsClient.listProviderRegions();
      setAllRegions(data);
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
  
  // Calculate paginated data and total pages using useMemo for performance
  const { paginatedRegions, totalPages } = useMemo(() => {
    const total = Math.ceil(allRegions.length / itemsPerPage);
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    
    return {
      paginatedRegions: allRegions.slice(start, end),
      totalPages: total || 1 // Ensure at least 1 page even when no data
    };
  }, [allRegions, currentPage, itemsPerPage]);
  
  // Handle page navigation
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
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
    <PaginatedContainer
      title="Multi-Provider Status"
      titleIcon={<Globe size={18} className="text-blue-400" />}
      viewAllLink="/dash/regions"
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevious={handlePrevPage}
      onNext={handleNextPage}
      debug={false}
      actionButton={
        <button 
          onClick={fetchRegionData} 
          disabled={isLoading}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>{isLoading ? "Loading..." : "Refresh"}</span>
        </button>
      }
    >
      {error && (
        <div className="p-4 bg-red-900/20 border-b border-red-900 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-red-400 text-sm">Error loading region data: {error}</span>
        </div>
      )}
      
      <div className="overflow-x-auto">
        {isLoading && allRegions.length === 0 ? (
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
              {paginatedRegions.map((item) => {
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
              {(paginatedRegions.length === 0 && !isLoading) && (
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
    </PaginatedContainer>
  );
};

export default MultiRegionStatus;