"use client"

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';

/**
 * ProviderQuotas - Quotas & Limits tab content for provider detail
 */
const ProviderQuotas = ({ provider }) => {
  // Sample quota data for the Quotas tab
  const quotaData = [
    { name: 'EC2 Instances (t3.micro)', limit: 100, used: 42, region: 'us-east-1' },
    { name: 'EC2 Instances (t3.medium)', limit: 50, used: 28, region: 'us-east-1' },
    { name: 'RDS Instances', limit: 40, used: 12, region: 'us-east-1' },
    { name: 'VPCs', limit: 5, used: 3, region: 'us-east-1' },
    { name: 'NAT Gateways', limit: 5, used: 2, region: 'us-east-1' },
    { name: 'Elastic IPs', limit: 5, used: 4, region: 'us-east-1' },
    { name: 'S3 Buckets', limit: 100, used: 27, region: 'global' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="all">All Regions</option>
            {provider.regions.map((region, idx) => (
              <option key={idx} value={region}>{region}</option>
            ))}
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="all">All Services</option>
            <option value="ec2">EC2</option>
            <option value="rds">RDS</option>
            <option value="s3">S3</option>
            <option value="vpc">VPC</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <RefreshCw size={16} />
          <span>Refresh Quotas</span>
        </button>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-medium text-white">Service Quotas & Limits</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service & Quota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {quotaData.map((quota, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{quota.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{quota.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{quota.used}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{quota.limit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`${(quota.used / quota.limit) > 0.8 ? 'text-yellow-400' : 'text-slate-400'}`}>
                          {Math.round((quota.used / quota.limit) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            (quota.used / quota.limit) > 0.9 ? 'bg-red-500' :
                            (quota.used / quota.limit) > 0.7 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} 
                          style={{ width: `${(quota.used / quota.limit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {(quota.used / quota.limit) > 0.7 ? (
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Request Increase
                      </button>
                    ) : (
                      <button className="text-slate-400 hover:text-slate-300 text-sm">
                        Monitor
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Quota Increase Requests</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service & Quota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Current Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Requested Limit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">Elastic IPs</div>
                  <div className="text-xs text-slate-500">us-east-1</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">5</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">10</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusIndicator status="pending" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-400">2 days ago</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-slate-400 hover:text-slate-300 text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ProviderQuotas };