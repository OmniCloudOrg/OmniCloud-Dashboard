"use client"

import React from 'react';
import { Cloud, Clock } from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';

/**
 * ProviderCard - Component for displaying cloud provider information
 */
const ProviderCard = ({ provider, onSelect }) => {
  const getProviderLogo = (name) => {
    switch (name.toLowerCase()) {
      case 'aws':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-yellow-500 font-bold text-lg">AWS</span>
          </div>
        );
      case 'gcp':
      case 'google cloud':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-500 font-bold text-xs">GCP</span>
          </div>
        );
      case 'azure':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-700 font-bold text-xs">Azure</span>
          </div>
        );
      case 'digital ocean':
      case 'digitalocean':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-400 font-bold text-xs">DO</span>
          </div>
        );
      default:
        return <Cloud size={32} className="text-blue-400" />;
    }
  };
  
  const getResourceCount = (resources) => {
    return Object.values(resources).reduce((sum, current) => sum + current, 0);
  };
  
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(provider)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getProviderLogo(provider.name)}
          <div>
            <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{provider.accountId}</div>
          </div>
        </div>
        <StatusIndicator status={provider.status} />
      </div>
      
      <div className="space-y-4 mb-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Resources</div>
            <div className="text-lg font-semibold text-white">{getResourceCount(provider.resources)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Regions</div>
            <div className="text-lg font-semibold text-white">{provider.regions.length}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {provider.regions.map((region, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">{region}</span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-800 pt-4">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={14} />
          <span>Updated {provider.lastUpdated}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          Manage
        </button>
      </div>
    </div>
  );
};

export { ProviderCard };