import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// Base interfaces
interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  type?: 'select' | 'multiselect';
}

interface ColumnConfig<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

// Search Input Component
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  clearable?: boolean;
  loading?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onSubmit,
  className = '',
  size = 'md',
  clearable = true,
  loading = false
}) => {
  const sizeClasses = {
    sm: 'pl-8 pr-8 py-1.5 text-sm',
    md: 'pl-10 pr-10 py-2 text-sm',
    lg: 'pl-12 pr-12 py-3 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 20
  };

  const iconPositions = {
    sm: 'left-2.5 top-1.5',
    md: 'left-3 top-2.5',
    lg: 'left-3.5 top-3.5'
  };

  const clearPositions = {
    sm: 'right-2.5 top-1.5',
    md: 'right-3 top-2.5',
    lg: 'right-3.5 top-3.5'
  };

  return (
    <div className={`relative ${className}`}>
      <Search 
        className={`absolute ${iconPositions[size]} text-slate-400 pointer-events-none`} 
        size={iconSizes[size]} 
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${sizeClasses[size]} bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors`}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit && onSubmit()}
      />
      {loading && (
        <div className={`absolute ${clearPositions[size]}`}>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        </div>
      )}
      {clearable && value && !loading && (
        <button
          onClick={() => onChange('')}
          className={`absolute ${clearPositions[size]} text-slate-400 hover:text-slate-300 transition-colors`}
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </div>
  );
};

// Filter Component
interface FilterDropdownProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: FilterOption[];
  icon?: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  label?: string;
  placeholder?: string;
  type?: 'select' | 'multiselect';
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  icon: Icon,
  label,
  placeholder = 'All',
  type = 'select',
  className = ''
}) => {
  if (type === 'select') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2 text-white w-full focus:outline-none focus:border-blue-500"
          aria-label={label}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {Icon && <Icon className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" size={18} />}
        <ChevronDown className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" size={18} />
      </div>
    );
  }

  // Multiselect implementation would go here
  return <div>Multiselect not implemented yet</div>;
};

// Data Table Component
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnConfig<T>[];
  keyField?: keyof T;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  keyField = 'id' as keyof T,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  striped = false,
  hoverable = true,
  compact = false
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc'
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = useCallback((key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const paddingClass = compact ? 'px-4 py-2' : 'px-6 py-4';

  if (loading) {
    return (
      <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden ${className}`}>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              {columns.map(column => (
                <th 
                  key={String(column.key)} 
                  className={`text-${column.align || 'left'} text-sm font-medium text-slate-400 ${paddingClass} ${column.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="text-blue-400">
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={`text-center text-slate-400 ${paddingClass}`}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <tr 
                  key={String(item[keyField])}
                  className={`
                    border-b border-slate-800 last:border-0 
                    ${striped && index % 2 === 1 ? 'bg-slate-800/30' : ''}
                    ${hoverable ? 'hover:bg-slate-800/30' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    transition-colors
                  `}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map(column => (
                    <td 
                      key={String(column.key)} 
                      className={`${paddingClass} text-white text-sm text-${column.align || 'left'}`}
                    >
                      {column.render 
                        ? column.render(item[column.key], item) 
                        : String(item[column.key] || '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo = true,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = ''
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="flex items-center gap-4">
        {showInfo && (
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
        )}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-white hover:bg-slate-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Combined Search, Filter, and Table Component
interface SearchableDataTableProps<T extends Record<string, any>> extends Omit<DataTableProps<T>, 'data'> {
  data: T[];
  searchKeys?: (keyof T)[];
  filterConfigs?: FilterConfig[];
  searchPlaceholder?: string;
  pageSize?: number;
  showPagination?: boolean;
  showPageSizeSelector?: boolean;
  defaultFilters?: Record<string, string>;
}

export const SearchableDataTable = <T extends Record<string, any>>({
  data,
  columns,
  searchKeys = [],
  filterConfigs = [],
  searchPlaceholder = 'Search...',
  pageSize: initialPageSize = 10,
  showPagination = true,
  showPageSizeSelector = false,
  defaultFilters = {},
  ...tableProps
}: SearchableDataTableProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = !searchQuery || searchKeys.some(key => 
        String(item[key] || '').toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Additional filters
      const matchesFilters = Object.entries(filters).every(([filterId, value]) => 
        value === 'all' || item[filterId as keyof T] === value
      );

      return matchesSearch && matchesFilters;
    });
  }, [data, searchQuery, searchKeys, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!showPagination) return filteredData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      {(searchKeys.length > 0 || filterConfigs.length > 0) && (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-4">
            {searchKeys.length > 0 && (
              <div className="flex-1">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                />
              </div>
            )}

            {filterConfigs.map(filterConfig => (
              <FilterDropdown
                key={filterConfig.id}
                value={filters[filterConfig.id] || 'all'}
                onChange={(value) => setFilters(prev => ({
                  ...prev,
                  [filterConfig.id]: value as string
                }))}
                options={filterConfig.options}
                icon={filterConfig.icon}
                label={filterConfig.label}
                type={filterConfig.type}
              />
            ))}
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={paginatedData}
        columns={columns}
        {...tableProps}
      />

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPageSize={showPageSizeSelector}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
    </div>
  );
};

export default SearchableDataTable;