import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { DashboardHeader, Button } from '@/app/dash/components/ui';

const PipelineHeader = ({
  totalCount,
  loading,
  onRefresh,
  onCreatePipeline
}) => {
  return (
    <DashboardHeader
      title="CI/CD Pipelines"
      subtitle={`Manage and monitor your continuous integration and deployment pipelines (${totalCount})`}
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
            onClick={onCreatePipeline}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Pipeline
          </Button>
        </div>
      }
    />
  );
};

export default PipelineHeader;
