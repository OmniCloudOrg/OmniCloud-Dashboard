"use client"

import React, { useState } from 'react';
import PipelineHeader from './components/PipelineHeader';
import PipelineFilters from './components/PipelineFilters';
import PipelineTabs from './components/PipelineTabs';
import PipelineMetrics from './components/PipelineMetrics';
import PipelineGrid from './components/PipelineGrid';
import PipelinePagination from './components/PipelinePagination';
import { CreatePipelineModal } from './components/CreatePipelineModal';
import { PipelineDetail } from './components/PipelineDetail';
import { BuildsTable } from './components/BuildsTable';
import { ArtifactsTable } from './components/ArtifactsTable';
import { EnvironmentsGrid } from './components/EnvironmentsGrid';
import { PlatformStatus } from '@/components/platform/PlatformStatus';
import { usePipelines } from '@/hooks/usePipelines';
import { getUniqueFilterValues } from '@/utils/pipelineUtils';
import { SAMPLE_BUILDS, SAMPLE_ARTIFACTS, SAMPLE_ENVIRONMENTS } from '@/data/pipelineConstants';

const CiCdManagement = () => {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Use pipelines hook for all state management
  const {
    pipelines,
    allPipelines,
    filteredCount,
    metrics,
    loading,
    error,
    refreshing,
    searchQuery,
    statusFilter,
    branchFilter,
    environmentFilter,
    activeTab,
    selectedPipeline,
    page,
    pageSize,
    totalPages,
    totalCount,
    createPipeline,
    runPipeline,
    refresh,
    handleSearchChange,
    handleStatusFilterChange,
    handleBranchFilterChange,
    handleEnvironmentFilterChange,
    handleTabChange,
    handlePipelineSelect,
    handlePageChange,
    handlePageSizeChange
  } = usePipelines();

  // Get unique filter values
  const availableBranches = getUniqueFilterValues(allPipelines, 'branch');
  const availableEnvironments = getUniqueFilterValues(allPipelines, 'environment');

  // Handlers
  const handleCreatePipeline = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (pipelineData) => {
    try {
      await createPipeline(pipelineData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create pipeline:', err);
    }
  };

  // Show pipeline detail if selected
  if (selectedPipeline) {
    return (
      <PipelineDetail 
        pipeline={selectedPipeline} 
        onBack={() => handlePipelineSelect(null)}
      />
    );
  }

  // Show error state
  if (error) {
    return (
      <PlatformStatus 
        status="error" 
        message={error} 
        onRetry={refresh} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PipelineHeader
        totalCount={totalCount}
        loading={loading || refreshing}
        onRefresh={refresh}
        onCreatePipeline={handleCreatePipeline}
      />

      {/* Metrics Cards */}
      <PipelineMetrics 
        metrics={metrics}
        loading={loading}
      />

      {/* Tabs */}
      <PipelineTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        metrics={metrics}
      />

      {/* Tab Content */}
      {activeTab === 'pipelines' && (
        <>
          {/* Filters */}
          <PipelineFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            branchFilter={branchFilter}
            environmentFilter={environmentFilter}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
            onBranchFilterChange={handleBranchFilterChange}
            onEnvironmentFilterChange={handleEnvironmentFilterChange}
            availableBranches={availableBranches}
            availableEnvironments={availableEnvironments}
          />

          {/* Pipelines Grid */}
          <PipelineGrid
            pipelines={pipelines}
            loading={loading}
            onPipelineSelect={handlePipelineSelect}
            onRunPipeline={runPipeline}
            selectedPipeline={selectedPipeline}
          />

          {/* Pagination */}
          {totalCount > 0 && (
            <PipelinePagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </>
      )}

      {activeTab === 'builds' && (
        <BuildsTable data={SAMPLE_BUILDS} />
      )}

      {activeTab === 'artifacts' && (
        <ArtifactsTable data={SAMPLE_ARTIFACTS} />
      )}

      {activeTab === 'environments' && (
        <EnvironmentsGrid data={SAMPLE_ENVIRONMENTS} />
      )}

      {/* Create Pipeline Modal */}
      {isCreateModalOpen && (
        <CreatePipelineModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={handleCreateSubmit}
        />
      )}
    </div>
  );
};

export default CiCdManagement;