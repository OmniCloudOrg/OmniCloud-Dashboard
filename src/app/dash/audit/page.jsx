"use client"

import React, { useState } from 'react';
import { Calendar, RefreshCw, Download, Filter, BarChart2, Settings } from 'lucide-react';
import { 
  DashboardHeader, 
  DashboardSection, 
  Button,
  IconButton,
  AreaChartComponent,
  ChartContainer
} from '../components/ui';
import { 
  TabNavigation
} from '../components/ui/common-components';
import { PlatformStatusHandler } from '@/components/platform/PlatformStatus';
import { TIME_RANGE_OPTIONS } from '@/data/auditConstants';
import { useAuditLogs } from '@/hooks/audit/useAuditLogs';
import {
  AuditMetricsCards,
  SavedFiltersPanel,
  SeverityDistribution,
  AuditSearchFilters,
  AuditLogsList
} from './components';
import ExportLogsModal from './ExportLogsModal';
import FilterModal from './FilterModal';

/**
 * Main Audit Logs Component - Refactored for scalability
 * Uses custom hooks and componentized UI
 */
const AuditLogs = () => {
  // Local state for modals and view
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [view, setView] = useState('detailed'); // 'detailed' or 'summary'
  
  // Use custom hook for audit logs management
  const {
    platformStatus,
    platformId,
    auditClient,
    filteredLogs,
    loading,
    error,
    pagination,
    eventTypeCounts,
    severityCounts,
    activityData,
    searchQuery,
    setSearchQuery,
    selectedEventTypes,
    timeRange,
    setTimeRange,
    expandedLog,
    handleRefresh,
    handlePageChange,
    toggleEventTypeFilter,
    clearFilters,
    toggleLogExpansion
  } = useAuditLogs();

  return (
    <PlatformStatusHandler platformStatus={platformStatus} platformId={platformId}>
      <div className="space-y-6">
        <DashboardHeader
          title="Audit Logs"
          actionLabel="Export"
          actionIcon={Download}
          onAction={() => setIsExportModalOpen(true)}
        >
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Platform: {platformId}
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              {TIME_RANGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="secondary" icon={Calendar}>
              Calendar
            </Button>
            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </DashboardHeader>
        
        {/* Audit Logs Metrics Cards */}
        <AuditMetricsCards 
          totalEvents={pagination.total_count}
          eventTypeCounts={eventTypeCounts}
          loading={loading}
        />
        
        {/* Audit Activity Chart and Saved Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartContainer 
            title="Audit Activity" 
            className="lg:col-span-2"
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          >
            <AreaChartComponent
              data={activityData}
              dataKey="count"
              colors={['#3b82f6']}
              xAxisDataKey="time"
              showGrid={true}
              gradientId="colorEventCount"
            />
          </ChartContainer>
          
          <SavedFiltersPanel />
        </div>
        
        {/* Severity Distribution */}
        <SeverityDistribution 
          severityCounts={severityCounts}
          totalCount={pagination.total_count}
        />
        
        {/* Audit Logs Search and Filters */}
        <DashboardSection 
          title={
            <TabNavigation
              tabs={[
                { id: 'detailed', label: 'Detailed View' },
                { id: 'summary', label: 'Summary View' }
              ]}
              activeTab={view}
              onTabChange={setView}
            />
          }
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Filter}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Advanced Filters
              </Button>
              <IconButton
                icon={BarChart2}
                variant="transparent"
                size="sm"
                tooltip="View Charts"
              />
              <IconButton
                icon={Settings}
                variant="transparent"
                size="sm"
                tooltip="Settings"
              />
            </div>
          }
        >
          <div>
            <AuditSearchFilters 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedEventTypes={selectedEventTypes}
              onToggleEventType={toggleEventTypeFilter}
              loading={loading}
            />
            
            {/* Audit Log Results */}
            <AuditLogsList 
              logs={filteredLogs}
              loading={loading}
              error={error}
              expandedLog={expandedLog}
              onToggleExpansion={toggleLogExpansion}
              auditClient={auditClient}
              pagination={pagination}
              onPageChange={handlePageChange}
              onClearFilters={clearFilters}
            />
          </div>
        </DashboardSection>
        
        {/* Modals */}
        <ExportLogsModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
      </div>
    </PlatformStatusHandler>
  );
};

export default AuditLogs;