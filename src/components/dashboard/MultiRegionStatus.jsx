"use client"

import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, ExternalLink } from 'lucide-react';

export const MultiRegionStatus = () => {
  // State for regions data
  const [regions, setRegions] = useState([
    { name: 'us-east', provider: 'AWS', status: 'healthy', apps: 24, instances: 52 },
    { name: 'us-west', provider: 'GCP', status: 'healthy', apps: 18, instances: 43 },
    { name: 'eu-central', provider: 'Azure', status: 'warning', apps: 12, instances: 28 },
    { name: 'ap-southeast', provider: 'AWS', status: 'healthy', apps: 15, instances: 36 },
    { name: 'on-prem', provider: 'On-Prem', status: 'critical', apps: 8, instances: 15 }
  ]);
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Update with new data (for demo, we'll just randomize some values)
      const updatedRegions = regions.map(region => ({
        ...region,
        apps: Math.max(1, region.apps + Math.floor(Math.random() * 5) - 2),
        instances: Math.max(1, region.instances + Math.floor(Math.random() * 10) - 5),
        status: Math.random() > 0.8 
          ? ['healthy', 'warning', 'critical'][Math.floor(Math.random() * 3)] 
          : region.status
      }));
      
      setRegions(updatedRegions);
      setIsLoading(false);
    }, 800);
  };
  
  // Provider icon mapping
  const getProviderIcon = (provider) => {
    switch(provider) {
      case 'AWS':
        return <Cloud size={16} className="text-amber-400" />;
      case 'GCP':
        return <Cloud size={16} className="text-blue-400" />;
      case 'Azure':
        return <Cloud size={16} className="text-blue-600" />;
      case 'On-Prem':
        return <Cloud size={16} className="text-slate-400" />;
      default:
        return <Cloud size={16} className="text-slate-400" />;
    }
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Multi-Cloud Status</h3>
        <button 
          onClick={refreshData} 
          disabled={isLoading}
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Apps</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {regions.map((region, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{region.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getProviderIcon(region.provider)}
                    <div className="text-sm text-slate-300">{region.provider}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center gap-2 ${
                    region.status === 'healthy' ? 'text-green-400' :
                    region.status === 'warning' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      region.status === 'healthy' ? 'bg-green-400' :
                      region.status === 'warning' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></div>
                    <div className="text-sm capitalize">{region.status}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{region.apps}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{region.instances}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                    <span>Details</span>
                    <ExternalLink size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultiRegionStatus;