"use client"

import React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button, ButtonGroup, IconButton, Pagination } from '../../../components/ui';
import { PlatformStatus } from '@/components/platform/PlatformStatus';
import { useInstances } from '@/hooks/instances/useInstances';
import {
  InstancesTable,
  ConfigurationPanels,
  TerminalWindow
} from './components';

const ApplicationInstances = ({ app }) => {
  // Use custom hook for instance management
  const {
    instances,
    loading,
    error,
    refreshing,
    page,
    pageSize,
    totalCount,
    totalPages,
    openTerminals,
    handleInstanceAction,
    handlePageChange,
    handlePageSizeChange,
    openTerminal,
    closeTerminal,
    updateTerminalStatus,
    refresh
  } = useInstances(app);

  // Handle instance actions including terminal opening
  const handleAction = (instance, action) => {
    if (action === 'terminal') {
      openTerminal(instance);
    } else {
      handleInstanceAction(instance, action);
    }
  };

  if (loading && !instances.length) {
    return <PlatformStatus status="loading" message="Loading instances..." />;
  }

  if (error) {
    return <PlatformStatus status="error" message={error} onRetry={() => refresh()} />;
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Application Instances</h3>
        <IconButton
          icon={RefreshCw}
          variant="secondary"
          size="sm"
          tooltip="Refresh"
          className={refreshing ? 'animate-spin' : ''}
          onClick={() => refresh()}
          disabled={refreshing}
        />
      </div>

      {/* Instances table */}
      <InstancesTable
        instances={instances}
        loading={loading}
        onAction={handleAction}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Configuration panels */}
      <ConfigurationPanels />

      {/* Terminal windows */}
      {Array.from(openTerminals.values()).map((terminal) => (
        <TerminalWindow
          key={terminal.terminalId}
          instance={terminal.instance}
          terminalId={terminal.terminalId}
          status={terminal.status}
          onClose={() => closeTerminal(terminal.terminalId)}
          onStatusChange={(status) => updateTerminalStatus(terminal.terminalId, status)}
        />
      ))}
    </div>
  );
};

export default ApplicationInstances;