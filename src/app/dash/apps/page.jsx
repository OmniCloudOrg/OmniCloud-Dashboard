"use client"

import React, { useState } from 'react';
import ApplicationHeader from './components/ApplicationHeader';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationGrid from './components/ApplicationGrid';
import ApplicationPagination from './components/ApplicationPagination';
import ApplicationDetail from './ApplicationDetail';
import CreateApplicationModal from './CreateApplicationModal';
import { PlatformStatus } from '@/components/platform/PlatformStatus';
import { useApplications } from '@/hooks/useApplications';

const ApplicationsManagement = () => {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Use applications hook for all state management
  const {
    applications,
    loading,
    error,
    searchQuery,
    statusFilter,
    regionFilter,
    gitBranchFilter,
    currentPage,
    totalPages,
    totalCount,
    perPage,
    refresh,
    createApplication,
    handleSearchChange,
    handleStatusFilterChange,
    handleRegionFilterChange,
    handleGitBranchFilterChange,
    handlePageChange,
    handlePerPageChange
  } = useApplications();

  // Handlers
  const handleCreateApplication = () => {
    setIsModalOpen(true);
  };

  const handleApplicationSelect = (app) => {
    setSelectedApp(app);
  };

  const handleApplicationClose = () => {
    setSelectedApp(null);
  };

  const handleCreateSubmit = async (appData) => {
    try {
      await createApplication(appData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create application:', err);
      // Error handling could be improved with toast notifications
    }
  };

  // Show application detail if selected
  if (selectedApp) {
    return (
      <ApplicationDetail 
        app={selectedApp} 
        onBack={handleApplicationClose}
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
      <ApplicationHeader
        totalCount={totalCount}
        loading={loading}
        onRefresh={refresh}
        onCreateApplication={handleCreateApplication}
      />

      {/* Filters */}
      <ApplicationFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        regionFilter={regionFilter}
        gitBranchFilter={gitBranchFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onRegionFilterChange={handleRegionFilterChange}
        onGitBranchFilterChange={handleGitBranchFilterChange}
      />

      {/* Applications Grid */}
      <ApplicationGrid
        applications={applications}
        loading={loading}
        onApplicationSelect={handleApplicationSelect}
        selectedApp={selectedApp}
      />

      {/* Pagination */}
      {totalCount > 0 && (
        <ApplicationPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}

      {/* Create Application Modal */}
      {isModalOpen && (
        <CreateApplicationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleCreateSubmit}
        />
      )}
    </div>
  );
};

export default ApplicationsManagement;