import React from 'react';
import ApplicationCard from '../ApplicationCard';
import { EmptyState } from '@/app/dash/components/ui';
import { Package } from 'lucide-react';

const ApplicationGrid = ({
  applications,
  loading,
  onApplicationSelect,
  selectedApp
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-slate-800 rounded-lg p-6 h-48">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-700 rounded w-2/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-slate-700 rounded w-16"></div>
                <div className="h-6 bg-slate-700 rounded w-20"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-8 bg-slate-700 rounded w-24"></div>
                <div className="h-8 bg-slate-700 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No applications found"
        description="Get started by creating your first application"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {applications.map(app => (
        <ApplicationCard
          key={app.id}
          app={app}
          onSelect={onApplicationSelect}
          isSelected={selectedApp?.id === app.id}
        />
      ))}
    </div>
  );
};

export default ApplicationGrid;
