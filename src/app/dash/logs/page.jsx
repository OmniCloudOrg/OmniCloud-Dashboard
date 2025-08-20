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
import { 
  ConsolidatedResourceCard, 
  DashboardHeader, 
  DashboardGrid,
  UniversalModal,
  TabNavigation 
} from '@/components/ui';

// Import tabs
import LiveLogsTab from './tabs/LiveLogsTab';
import StructuredLogsTab from './tabs/StructuredLogsTab';
import LogInsightsTab from './tabs/LogInsightsTab';

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
        <ConsolidatedResourceCard 
          title="Total Logs" 
          value={logLevelCounts.total.toLocaleString()} 
          percentage="12" 
          trend="up" 
          icon={Terminal} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="Last hour"
        />
        <ConsolidatedResourceCard 
          title="Error Logs" 
          value={logLevelCounts.error} 
          percentage="5" 
          trend="up" 
          icon={AlertCircle} 
          color="bg-red-500/10 text-red-400" 
        />
        <ConsolidatedResourceCard 
          title="Warning Logs" 
          value={logLevelCounts.warn} 
          icon={AlertTriangle} 
          color="bg-yellow-500/10 text-yellow-400" 
        />
        <ConsolidatedResourceCard 
          title="Services" 
          value="8" 
          icon={Server} 
          color="bg-purple-500/10 text-purple-400" 
        />
      </DashboardGrid>
      
      {/* Tab Navigation and Content */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
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
      <UniversalModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Search Query"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Query Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="Enter query name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              rows={3}
              placeholder="Enter description..."
            />
          </div>
        </div>
      </UniversalModal>
      
      <UniversalModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)}
        title="Create Alert Rule"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Alert Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="Enter alert name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Condition
            </label>
            <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
              <option>Error rate exceeds threshold</option>
              <option>Warning count increases</option>
              <option>Service becomes unavailable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Threshold
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="Enter threshold..."
            />
          </div>
        </div>
      </UniversalModal>
    </div>
  );
};

export default LogsManagement;