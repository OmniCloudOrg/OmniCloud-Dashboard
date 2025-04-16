"use client"

import React, { useState } from 'react';
import { 
  Terminal, 
  AlertCircle, 
  AlertTriangle, 
  Server,
  RefreshCw,
  AlertCircle as ACircle,
  Download,
  BarChart2,
  Settings
} from 'lucide-react';

// Import UI components
import { ResourceCard, DashboardHeader, DashboardGrid } from '../components/ui';

// Import tabs
import LiveLogsTab from './tabs/LiveLogsTab';
import StructuredLogsTab from './tabs/StructuredLogsTab';
import LogInsightsTab from './tabs/LogInsightsTab';

// Import modals
import SaveSearchModal from './modals/SaveSearchModal';
import AlertRuleModal from './modals/AlertRuleModal';

const LogsManagement = () => {
  // State for tabs and modals
  const [activeTab, setActiveTab] = useState('live');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Tabs configuration
  const tabs = [
    { id: 'live', label: 'Live Logs', icon: Terminal },
    { id: 'structured', label: 'Structured View', icon: BarChart2 },
    { id: 'insights', label: 'Insights', icon: AlertCircle }
  ];

  // Sample log data for metrics
  const logLevelCounts = {
    total: 250,
    error: 15,
    warn: 35,
    info: 150,
    debug: 50
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <DashboardHeader
        title="Logs"
        onRefresh={() => console.log('Refreshing logs...')}
        actionLabel="Create Alert"
        onAction={() => setIsAlertModalOpen(true)}
        actionIcon={ACircle}
      />
      
      {/* Log Metrics Cards */}
      <DashboardGrid columns={4}>
        <ResourceCard 
          title="Total Logs" 
          value={logLevelCounts.total.toLocaleString()} 
          percentage="12" 
          trend="up" 
          icon={Terminal} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="Last hour"
        />
        <ResourceCard 
          title="Error Logs" 
          value={logLevelCounts.error} 
          percentage="5" 
          trend="up" 
          icon={AlertCircle} 
          color="bg-red-500/10 text-red-400" 
        />
        <ResourceCard 
          title="Warning Logs" 
          value={logLevelCounts.warn} 
          icon={AlertTriangle} 
          color="bg-yellow-500/10 text-yellow-400" 
        />
        <ResourceCard 
          title="Services" 
          value="8" 
          icon={Server} 
          color="bg-purple-500/10 text-purple-400" 
        />
      </DashboardGrid>
      
      {/* Tab Navigation and Content */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        {/* Custom Tab Navigation */}
        <div className="flex border-b border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 transition-colors 
                ${activeTab === tab.id 
                  ? 'bg-blue-600/10 text-blue-400 border-b-2 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800/30'}
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'live' && (
            <LiveLogsTab 
              onSaveSearch={() => setIsSaveModalOpen(true)}
            />
          )}
          
          {activeTab === 'structured' && (
            <StructuredLogsTab 
              onSaveSearch={() => setIsSaveModalOpen(true)}
            />
          )}
          
          {activeTab === 'insights' && (
            <LogInsightsTab />
          )}
        </div>
      </div>
      
      {/* Modals */}
      <SaveSearchModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
      />
      <AlertRuleModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)} 
      />
    </div>
  );
};

export default LogsManagement;