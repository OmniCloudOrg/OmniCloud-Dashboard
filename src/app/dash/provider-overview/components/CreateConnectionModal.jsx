"use client"

import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { FormField, FormGroup } from '../../components/ui/form-components';

/**
 * CreateConnectionModal - Modal for connecting a new cloud provider
 */
const CreateConnectionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const [selectedProvider, setSelectedProvider] = useState('aws');
  
  const providerOptions = [
    { value: 'aws', label: 'Amazon Web Services (AWS)' },
    { value: 'gcp', label: 'Google Cloud Platform (GCP)' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'digitalocean', label: 'DigitalOcean' },
    { value: 'custom', label: 'Custom / Other' }
  ];
  
  const renderProviderForm = () => {
    switch (selectedProvider) {
      case 'aws':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Method</label>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="auth-managed-identity"
                    name="auth-method-azure"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="auth-managed-identity" className="ml-2 text-sm text-white">
                    Managed Identity
                  </label>
                </div>
              </div>
            </div>
            
            <FormField
              label="Tenant ID"
              id="tenant-id"
              placeholder="00000000-0000-0000-0000-000000000000"
            />
            
            <FormField
              label="Subscription ID"
              id="subscription-id"
              placeholder="00000000-0000-0000-0000-000000000000"
            />
            
            <FormField
              label="Client ID"
              id="client-id"
              placeholder="00000000-0000-0000-0000-000000000000"
            />
            
            <FormField
              label="Client Secret"
              id="client-secret"
              type="password"
              placeholder="••••••••••••••••••••••••••••••••"
            />
            
            <FormField
              label="Default Region"
              id="azure-region"
              type="select"
              options={[
                { value: 'eastus', label: 'East US' },
                { value: 'eastus2', label: 'East US 2' },
                { value: 'westus', label: 'West US' },
                { value: 'westus2', label: 'West US 2' },
                { value: 'centralus', label: 'Central US' },
                { value: 'northeurope', label: 'North Europe' },
                { value: 'westeurope', label: 'West Europe' },
                { value: 'southeastasia', label: 'Southeast Asia' }
              ]}
            />
          </div>
        );
      
      default:
        return (
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <p className="text-slate-300">Please select a cloud provider to see specific configuration options.</p>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Connect Cloud Provider</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <FormField
              label="Cloud Provider"
              id="provider-type"
              type="select"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              options={providerOptions}
            />
            
            <FormField
              label="Connection Name"
              id="connection-name"
              placeholder="my-aws-production"
            />
            
            {renderProviderForm()}
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-400">Additional Options</label>
                <button className="text-xs text-blue-400 hover:text-blue-300">Show Advanced</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="read-only"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="read-only" className="ml-2 text-sm text-white">
                    Read-Only Access
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sync-resources"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="sync-resources" className="ml-2 text-sm text-white">
                    Automatically sync resources
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cost-reporting"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="cost-reporting" className="ml-2 text-sm text-white">
                    Enable cost reporting
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Connect Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreateConnectionModal };