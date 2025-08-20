import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { DashboardHeader, Button } from '@/app/dash/components/ui';

const ApplicationHeader = ({
  totalCount,
  loading,
  onRefresh,
  onCreateApplication
}) => {
  return (
    <DashboardHeader
      title="Applications"
      subtitle={`Manage and monitor your deployed applications (${totalCount})`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateApplication}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Application
          </Button>
        </div>
      }
    />
  );
};

export default ApplicationHeader;
