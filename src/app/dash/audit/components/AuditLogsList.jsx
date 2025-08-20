/**
 * Audit Logs List Component
 * Renders the list of audit log entries with pagination
 */

import React from 'react';
import { Search } from 'lucide-react';
import { EmptyState, Button } from '../../components/ui';
import AuditLogEntry from './AuditLogEntry';

const AuditLogsList = ({ 
  logs, 
  loading, 
  error, 
  expandedLog, 
  onToggleExpansion, 
  auditClient,
  pagination,
  onPageChange,
  onClearFilters
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center text-red-400">
        {error}. Please try refreshing the page.
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No Audit Logs Found"
        description="We couldn't find any audit logs matching your search criteria. Try adjusting your filters or search query."
        actionText="Clear Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <>
      <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
        <div className="divide-y divide-slate-800">
          {logs.map((log) => (
            <AuditLogEntry
              key={log.id}
              log={log}
              isExpanded={expandedLog === log.id}
              onToggleExpansion={onToggleExpansion}
              auditClient={auditClient}
            />
          ))}
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-slate-400">
          Showing {logs.length} of {pagination.total_count} audit logs
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-400">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={pagination.page >= pagination.total_pages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default AuditLogsList;
