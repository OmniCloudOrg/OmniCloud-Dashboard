/**
 * Audit Metrics Cards Component
 * Displays key audit metrics in resource cards
 */

import React from 'react';
import { Activity, Shield, User, Settings } from 'lucide-react';
import { DashboardGrid, ResourceCard } from '../../components/ui';

const AuditMetricsCards = ({ 
  totalEvents, 
  eventTypeCounts, 
  loading 
}) => {
  const securityEvents = eventTypeCounts.security || 0;
  const userActions = (eventTypeCounts.login || 0) + (eventTypeCounts.access || 0);
  const systemChanges = 
    (eventTypeCounts.deployment || 0) + 
    (eventTypeCounts.setting || 0) + 
    (eventTypeCounts.permission || 0);

  return (
    <DashboardGrid columns={4} gap={6}>
      <ResourceCard 
        title="Total Events" 
        value={totalEvents.toLocaleString()} 
        icon={Activity} 
        color="bg-blue-500/10 text-blue-400" 
        subtitle="Total Records"
        isLoading={loading}
      />
      <ResourceCard 
        title="Security Events" 
        value={securityEvents} 
        icon={Shield} 
        color="bg-red-500/10 text-red-400" 
        subtitle="High priority"
        isLoading={loading}
      />
      <ResourceCard 
        title="User Actions" 
        value={userActions} 
        icon={User} 
        color="bg-green-500/10 text-green-400" 
        subtitle="Login & access"
        isLoading={loading}
      />
      <ResourceCard 
        title="System Changes" 
        value={systemChanges} 
        icon={Settings} 
        color="bg-purple-500/10 text-purple-400" 
        subtitle="Configuration & deployments"
        isLoading={loading}
      />
    </DashboardGrid>
  );
};

export default AuditMetricsCards;
