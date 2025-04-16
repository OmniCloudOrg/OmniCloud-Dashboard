"use client"

import React from 'react';
import { 
  Search, 
  Server, 
  HardDrive, 
  ExternalLink, 
  Clock
} from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';

/**
 * ProviderResources - Resources tab content for provider detail
 */
const ProviderResources = ({ provider }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-3">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="all">All Types</option>
            <option value="instance">Instances</option>
            <option value="storage">Storage</option>
            <option value="database">Databases</option>
            <option value="networking">Networking</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="all">All Regions</option>
            {provider.regions.map((region, idx) => (
              <option key={idx} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Compute Resources</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Server size={16} className="text-blue-400" />
                      <span className="text-sm font-medium text-white">instance-{idx+1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">t3.medium</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{provider.regions[idx % provider.regions.length]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status="active" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-400">{idx + 2} weeks ago</div>
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