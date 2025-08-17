"use client"

import React from 'react';
import { Github, Server, Shield } from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';
import { FormField } from '../../../../../components/ui';

/**
 * ProviderSettings - Settings tab content for provider detail
 */
const ProviderSettings = ({ provider }) => {
  // Sample permissions data for Settings tab
  const permissionsData = [
    { name: 'Read EC2 Resources', status: 'granted' },
    { name: 'Modify EC2 Resources', status: 'granted' },
    { name: 'Read S3 Resources', status: 'granted' },
    { name: 'Modify S3 Resources', status: 'granted' },
    { name: 'Read RDS Resources', status: 'granted' },
    { name: 'Modify RDS Resources', status: 'granted' },
    { name: 'Read IAM Resources', status: 'granted' },
    { name: 'Modify IAM Resources', status: 'denied' },
    { name: 'Read Billing Information', status: 'granted' }
  ];
  
  return (
    <div className="space-y-8">
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Provider Settings</h3>
        <div className="space-y-6">
          <FormField
            label="Provider Name"
            id="provider-name"
            value={provider.name}
          />
          
          <FormField
            label="Account ID"
            id="account-id"
            value={provider.accountId}
            disabled={true}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Default Region"
              id="default-region"
              type="select"
              options={provider.regions.map(region => ({ value: region, label: region }))}
              value={provider.regions[0]}
            />
            
            <FormField
              label="Sync Frequency"
              id="sync-frequency"
              type="select"
              options={[
                { value: 'realtime', label: 'Real-time' },
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'manual', label: 'Manual Only' }
              ]}
              value="hourly"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Authentication</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Credentials Status</label>
            <div className="flex items-center gap-2 mt-2">
              <StatusIndicator status="active" />
              <span className="text-sm text-slate-300">Credentials are valid and working</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Method</label>
            <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
              <div className="text-sm">API Key</div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Last Verified</label>
            <div className="text-sm text-slate-300">2 hours ago</div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Update Credentials
          </button>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Permissions</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-white">Permission Scan Results</div>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              Scan Now
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Permission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {permissionsData.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{perm.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${perm.status === 'granted' ? 'text-green-400' : 'text-red-400'}`}>
                        {perm.status.charAt(0).toUpperCase() + perm.status.slice(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium text-white">Disconnect Provider</h4>
            <p className="text-sm text-slate-400 mt-1">
              This will remove the connection to the provider. All associated resources will remain
              on the provider but will no longer be visible in this dashboard.
            </p>
                          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Disconnect Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProviderSettings };