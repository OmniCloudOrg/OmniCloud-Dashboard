import React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchFilter } from '@/app/dash/components/ui';
import { APP_FILTER_CONFIG } from '@/data/appConstants';

const ApplicationFilters = ({
  searchQuery,
  statusFilter,
  regionFilter,
  gitBranchFilter,
  onSearchChange,
  onStatusFilterChange,
  onRegionFilterChange,
  onGitBranchFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="flex-1">
        <SearchFilter
          placeholder="Search applications..."
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
          {APP_FILTER_CONFIG.status.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Region Filter */}
      <div className="sm:w-48">
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={regionFilter}
          onChange={(e) => onRegionFilterChange(e.target.value)}
        >
          {APP_FILTER_CONFIG.region.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Git Branch Filter */}
      <div className="sm:w-48">
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={gitBranchFilter}
          onChange={(e) => onGitBranchFilterChange(e.target.value)}
        >
          {APP_FILTER_CONFIG.git_branch.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ApplicationFilters;
