"use client"

import React, { useState } from 'react';
import { 
  CloudCog,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';
import { DashboardLayout, DashboardSection } from '../../components/ui/layout-components';

// Import tab content components
import { ProviderOverview } from './ProviderDetail/ProviderOverview';
import { ProviderResources } from './ProviderDetail/ProviderResources';
import { ProviderCosts } from './ProviderDetail/ProviderCosts';
import { ProviderQuotas } from './ProviderDetail/ProviderQuotas';
import { ProviderSettings } from './ProviderDetail/ProviderSettings';

/**
 * ProviderDetail - Component for detailed cloud provider view
 */
const ProviderDetail = ({ provider, onBack }) => {
  // Ensure provider exists
  if (!provider) {
    return null; // Or a loading state or error message
  }
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: 'Resources' },
    { id: 'costs', label: 'Cost Management' },
    { id: 'quotas', label: 'Quotas & Limits' },
    { id: 'settings', label: 'Settings' }
  ];
  
  // Function to get provider-specific icon
  const getProviderIcon = () => {
    // Safety check for provider name
    const providerName = provider?.name?.toLowerCase() || '';
    
    switch (providerName) {
      case 'aws':
        return (
          <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-yellow-500 font-bold text-xl">AWS</span>
          </div>
        );
      case 'gcp':
      case 'google cloud':
        return (
          <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-500 font-bold text-xs">GCP</span>
          </div>
        );
      case 'azure':
        return (
          <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-700 font-bold text-xs">Azure</span>
          </div>
        );
      default:
        return <CloudCog size={32} className="text-blue-400" />;
    }
  };
  
  // Custom title with back button and provider info
  const CustomTitle = () => (
    <div className="flex items-center gap-3">
      <button 
        onClick={onBack}
        className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
      >
        <ChevronDown className="rotate-90" size={20} />
      </button>
      {getProviderIcon()}
      <div>
        <h2 className="text-2xl font-bold text-white">{provider.name || 'Provider Details'}</h2>
        <div className="text-slate-400">{provider.accountId || ''}</div>
      </div>
    </div>
  );
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProviderOverview provider={provider} />;
      case 'resources':
        return <ProviderResources provider={provider} />;
      case 'costs':
        return <ProviderCosts provider={provider} />;
      case 'quotas':
        return <ProviderQuotas provider={provider} />;
      case 'settings':
        return <ProviderSettings provider={provider} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Custom header section */}
      <div className="flex justify-between items-center">
        <CustomTitle />
        <div className="flex items-center gap-3">
          <StatusIndicator status={provider.status || 'unknown'} />
          <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Tab navigation and content */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-blue-400 border-b-2 border-blue-500' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export { ProviderDetail };