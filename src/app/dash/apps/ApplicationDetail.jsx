"use client"

import React, { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';
import { TabNavigation } from '../components/ui/common-components';
import { StatusBadge } from '../components/ui/status-components';

// Import tab components 
import ApplicationOverview from    './tabs/Overview';
import ApplicationInstances from   './tabs/instances/root';
import ApplicationDeployments from './tabs/Deployments';
import ApplicationLogs from        './tabs/Logs';
import ApplicationMetrics from     './tabs/Metrics';
import ApplicationSettings from    './tabs/Settings';

/**
 * Application Detail Component - Shows detailed view of a single application
 * Refactored to use the UI component library
 */
const ApplicationDetail = ({ app, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'instances', label: 'Instances' },
    { id: 'deployments', label: 'Deployments' },
    { id: 'logs', label: 'Logs' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'settings', label: 'Settings' }
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ApplicationOverview app={app} />;
      case 'instances':
        return <ApplicationInstances app={app} />;
      case 'deployments':
        return <ApplicationDeployments app={app} />;
      case 'logs':
        return <ApplicationLogs app={app} />;
      case 'metrics':
        return <ApplicationMetrics app={app} />;
      case 'settings':
        return <ApplicationSettings app={app} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6 h-full min-h-full">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ChevronDown className="rotate-90" size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{app.name}</h1>
          <div className="text-slate-400">{app.description}</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <StatusBadge status={app.status} />
          <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden h-full min-h-full flex flex-col">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className={activeTab === 'logs' ? 'flex-1 overflow-y-scroll' : 'p-6 flex-1 overflow-y-scroll'}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;