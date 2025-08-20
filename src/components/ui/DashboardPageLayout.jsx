import React from 'react';
import { DashboardHeader, TabNavigation, SearchFilter } from './Layout';
import Button from './Button';
import { RefreshCw, Filter, X } from 'lucide-react';

/**
 * DashboardPageLayout Component
 * Wraps the common header + filters + tabs + content pattern
 * Used across 15+ dashboard pages to reduce boilerplate
 */
const DashboardPageLayout = ({
  // Header props
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  actionLabel,
  onAction,
  actionIcon,
  headerActions,
  
  // Tab props
  tabs,
  activeTab,
  onTabChange,
  
  // Filter props
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  hasFilters = false,
  onClearFilters,
  showFilters = true,
  
  // Content props
  children,
  loading = false,
  error,
  
  // Metrics/Stats section
  metricsSection,
  
  // Layout props
  className = '',
  contentClassName = '',
  
  // Advanced props
  sidebarContent,
  fullWidth = false
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <DashboardHeader title={title} className="mb-0">
            {headerActions}
          </DashboardHeader>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {onRefresh && (
            <Button
              variant="ghost"
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
          )}
          
          {onAction && actionLabel && (
            <Button
              variant="primary"
              onClick={onAction}
              className="flex items-center gap-2"
            >
              {actionIcon}
              {actionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Section */}
      {metricsSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsSection}
        </div>
      )}

      {/* Main Content */}
      <div className={`${fullWidth ? '' : 'max-w-7xl mx-auto'}`}>
        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Tabbed Content */}
        {tabs && tabs.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={onTabChange}
            />
            
            <div className={`p-6 ${contentClassName}`}>
              {/* Filters Section */}
              {showFilters && (onSearchChange || filters.length > 0) && (
                <div className="mb-6">
                  <FiltersSection
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    searchPlaceholder={searchPlaceholder}
                    filters={filters}
                    hasFilters={hasFilters}
                    onClearFilters={onClearFilters}
                  />
                </div>
              )}
              
              {/* Content */}
              <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
                {children}
              </div>
            </div>
          </div>
        )}

        {/* Non-tabbed Content */}
        {(!tabs || tabs.length === 0) && (
          <div className="space-y-6">
            {/* Filters Section */}
            {showFilters && (onSearchChange || filters.length > 0) && (
              <FiltersSection
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                searchPlaceholder={searchPlaceholder}
                filters={filters}
                hasFilters={hasFilters}
                onClearFilters={onClearFilters}
              />
            )}
            
            {/* Content */}
            <div className={`${loading ? 'opacity-50 pointer-events-none' : ''} ${contentClassName}`}>
              {children}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      {sidebarContent && (
        <div className="lg:col-span-1">
          {sidebarContent}
        </div>
      )}
    </div>
  );
};

/**
 * Filters Section Component
 */
const FiltersSection = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  filters,
  hasFilters,
  onClearFilters
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      {/* Search Input */}
      {onSearchChange && (
        <div className="flex-1">
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={onSearchChange}
            searchPlaceholder={searchPlaceholder}
          />
        </div>
      )}
      
      {/* Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {filters.map((filter, index) => (
          <FilterControl key={index} {...filter} />
        ))}
        
        {/* Clear Filters Button */}
        {hasFilters && onClearFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-400 hover:text-white flex items-center gap-2"
          >
            <X size={14} />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Individual Filter Control Component
 */
const FilterControl = ({ 
  type = 'select', 
  label, 
  value, 
  onChange, 
  options = [],
  placeholder = 'All'
}) => {
  switch (type) {
    case 'select':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="all">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      
    case 'multiselect':
      // For complex multiselect, would need a dropdown component
      return (
        <div className="relative">
          <button className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm flex items-center gap-2">
            <Filter size={14} />
            {label}
          </button>
          {/* Dropdown would go here */}
        </div>
      );
      
    default:
      return null;
  }
};

/**
 * Common filter configurations
 */
export const commonFilters = {
  status: (value, onChange, options = []) => ({
    type: 'select',
    label: 'Status',
    value,
    onChange: (val) => onChange('status', val),
    options: options.length > 0 ? options : [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' }
    ],
    placeholder: 'All Statuses'
  }),
  
  type: (value, onChange, options = []) => ({
    type: 'select',
    label: 'Type',
    value,
    onChange: (val) => onChange('type', val),
    options,
    placeholder: 'All Types'
  }),
  
  severity: (value, onChange) => ({
    type: 'select',
    label: 'Severity',
    value,
    onChange: (val) => onChange('severity', val),
    options: [
      { value: 'critical', label: 'Critical' },
      { value: 'high', label: 'High' },
      { value: 'medium', label: 'Medium' },
      { value: 'low', label: 'Low' }
    ],
    placeholder: 'All Severities'
  }),
  
  region: (value, onChange, regions = []) => ({
    type: 'select',
    label: 'Region',
    value,
    onChange: (val) => onChange('region', val),
    options: regions,
    placeholder: 'All Regions'
  })
};

export default DashboardPageLayout;
