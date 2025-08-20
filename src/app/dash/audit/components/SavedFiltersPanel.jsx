/**
 * Saved Filters Panel Component
 * Displays saved filter queries with actions
 */

import React from 'react';
import { SAVED_FILTERS } from '@/data/auditConstants';
import { DashboardSection } from '../../components/ui';

const SavedFiltersPanel = () => {
  return (
    <DashboardSection title="Saved Filters">
      <div className="divide-y divide-slate-800">
        {SAVED_FILTERS.map((filter) => (
          <div key={filter.id} className="p-4 hover:bg-slate-800/30">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium text-white">{filter.name}</div>
              <button className="text-blue-400 hover:text-blue-300 text-xs">
                Apply
              </button>
            </div>
            <div className="text-xs font-mono bg-slate-800 rounded p-1.5 mb-2 text-slate-400">
              {filter.query}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>By {filter.createdBy}</span>
              <span>Used {filter.lastRun}</span>
            </div>
          </div>
        ))}
        <div className="p-3">
          <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300">
            Save Current Filter
          </button>
        </div>
      </div>
    </DashboardSection>
  );
};

export default SavedFiltersPanel;
