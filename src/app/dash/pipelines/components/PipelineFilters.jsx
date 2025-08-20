import React from 'react';
import { Search, GitBranch, Server } from 'lucide-react';
import { SearchFilter } from '@/app/dash/components/ui';
import { PIPELINE_STATUS_FILTERS } from '@/data/pipelineConstants';

const PipelineFilters = ({
  searchQuery,
  statusFilter,
  branchFilter,
  environmentFilter,
  onSearchChange,
  onStatusFilterChange,
  onBranchFilterChange,
  onEnvironmentFilterChange,
  availableBranches = [],
  availableEnvironments = []
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <SearchFilter
          placeholder="Search pipelines..."
          value={searchQuery}
          onChange={onSearchChange}
          icon={Search}
        />
      </div>

      {/* Status Filter */}
      <div className="sm:w-48">
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          {PIPELINE_STATUS_FILTERS.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {/* Branch Filter */}
      <div className="sm:w-48">
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={branchFilter}
          onChange={(e) => onBranchFilterChange(e.target.value)}
        >
          <option value="all">All Branches</option>
          {availableBranches.map(branch => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* Environment Filter */}
      <div className="sm:w-48">
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={environmentFilter}
          onChange={(e) => onEnvironmentFilterChange(e.target.value)}
        >
          <option value="all">All Environments</option>
          {availableEnvironments.map(env => (
            <option key={env} value={env}>
              {env.charAt(0).toUpperCase() + env.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PipelineFilters;
