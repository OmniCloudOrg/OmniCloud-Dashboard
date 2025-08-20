"use client"

import React from 'react';
import { 
  Terminal, 
  AlertCircle, 
  AlertTriangle, 
  Server
} from 'lucide-react';

// Import consolidated components
import { DashboardPageLayout, ConsolidatedResourceCard } from '@/components/ui';
import { useDashboardState } from '@/hooks/common/useDashboardState';

// Import tabs (these would be refactored next)
import LiveLogsTab from './tabs/LiveLogsTab';
import StructuredLogsTab from './tabs/StructuredLogsTab';
import LogInsightsTab from './tabs/LogInsightsTab';

// Import modals (these would be replaced with UniversalModal next)
import SaveSearchModal from './modals/SaveSearchModal';
import AlertRuleModal from './modals/AlertRuleModal';

const LogsManagement = () => {
  // Use consolidated dashboard state management
  const {
    activeTab,
    handleTabChange,
    refresh
  } = useDashboardState({
    initialTab: 'live'
  });

  // Modal states (would be moved to useDashboardState in Phase 2)
  const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = React.useState(false);

  // Sample log data for metrics (would be moved to data constants)
  const logMetrics = {
    total: 250,
    error: 15,
    warn: 35,
    services: 8
  };

  // Tabs configuration
  const tabs = [
    { id: 'live', label: 'Live Logs', icon: Terminal },
    { id: 'structured', label: 'Structured View', icon: AlertCircle },
    { id: 'insights', label: 'Insights', icon: AlertTriangle }
  ];

  // Metrics cards configuration
  const metricsCards = [
    <ConsolidatedResourceCard 
      key="total"
      title="Total Logs" 
      value={logMetrics.total.toLocaleString()} 
      percentage={12} 
      trend="up" 
      icon={Terminal} 
      color="bg-blue-500/10 text-blue-400" 
      subtitle="Last hour"
    />,
    <ConsolidatedResourceCard 
      key="errors"
      title="Error Logs" 
      value={logMetrics.error} 
      percentage={5} 
      trend="up" 
      icon={AlertCircle} 
      color="bg-red-500/10 text-red-400" 
    />,
    <ConsolidatedResourceCard 
      key="warnings"
      title="Warning Logs" 
      value={logMetrics.warn} 
      icon={AlertTriangle} 
      color="bg-yellow-500/10 text-yellow-400" 
    />,
    <ConsolidatedResourceCard 
      key="services"
      title="Services" 
      value={logMetrics.services} 
      icon={Server} 
      color="bg-purple-500/10 text-purple-400" 
    />
  ];

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'live':
        return <LiveLogsTab onSaveSearch={() => setIsSaveModalOpen(true)} />;
      case 'structured':
        return <StructuredLogsTab onSaveSearch={() => setIsSaveModalOpen(true)} />;
      case 'insights':
        return <LogInsightsTab />;
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardPageLayout
        title="Logs"
        onRefresh={refresh}
        actionLabel="Create Alert"
        onAction={() => setIsAlertModalOpen(true)}
        actionIcon={AlertCircle}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        metricsSection={metricsCards}
        showFilters={false} // Tabs handle their own filtering
      >
        {renderTabContent()}
      </DashboardPageLayout>

      {/* Modals - Phase 2 would replace these with UniversalModal */}
      <SaveSearchModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
      />
      <AlertRuleModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)} 
      />
    </>
  );
};

export default LogsManagement;
