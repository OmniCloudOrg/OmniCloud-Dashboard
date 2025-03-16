import React, { useState, useMemo } from 'react';
import { SearchCode, ChevronDown } from 'lucide-react';

// Types for filter configurations
export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  id: string;
  label: string;
  options: FilterOption[];
  icon: React.ComponentType<{ size?: number, className?: string }>;
};

export type ColumnConfig<T> = {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
};

export type DataTableProps<T> = {
  data: T[];
  columns: ColumnConfig<T>[];
  filterConfigs?: FilterConfig[];
  searchKeys?: (keyof T)[];
  onRowClick?: (item: T) => void;
  initialPageSize?: number;
};

// Reusable Filter Dropdown Component
export const FilterDropdown = ({ 
  value, 
  onChange, 
  options, 
  icon: Icon, 
  label 
}: { 
  value: string, 
  onChange: (value: string) => void, 
  options: FilterOption[], 
  icon: React.ComponentType<{ size?: number, className?: string }>, 
  label?: string 
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2 text-white w-full"
      aria-label={label}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <Icon className="absolute left-3 top-2.5 text-slate-400" size={18} />
    <ChevronDown className="absolute right-2 top-2.5 text-slate-400" size={18} />
  </div>
);

// Flexible Data Table Component
export const DataTable = <T extends { id: number }>({
  data,
  columns,
  filterConfigs = [],
  searchKeys = [],
  onRowClick,
  initialPageSize = 10
}: DataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null, direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === '' || searchKeys.some(key => 
        String(item[key]).toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Additional filters
      const matchesFilters = Object.entries(filters).every(([filterId, value]) => 
        value === 'all' || item[filterId as keyof T] === value
      );

      return matchesSearch && matchesFilters;
    });
  }, [data, searchQuery, searchKeys, filters]);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) 
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) 
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Handle sorting
  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Filter Bar */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <SearchCode className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dynamic Filters */}
          {filterConfigs.map(filterConfig => (
            <FilterDropdown
              key={filterConfig.id}
              value={filters[filterConfig.id] || 'all'}
              onChange={(value) => setFilters(prev => ({
                ...prev,
                [filterConfig.id]: value
              }))}
              options={filterConfig.options}
              icon={filterConfig.icon}
              label={filterConfig.label}
            />
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {columns.map(column => (
                <th 
                  key={String(column.key)} 
                  className={`text-left text-sm font-medium text-slate-400 px-6 py-4 ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.header}
                  {sortConfig.key === column.key && (
                    <span className="ml-2">
                      {sortConfig.direction === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr 
                key={item.id} 
                className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors"
                onClick={() => onRowClick?.(item)}
              >
                {columns.map(column => (
                  <td 
                    key={String(column.key)} 
                    className="px-6 py-4 text-white text-sm"
                  >
                    {column.render 
                      ? column.render(item[column.key], item) 
                      : String(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-slate-800">
            <div className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-4 py-2 bg-slate-800 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;