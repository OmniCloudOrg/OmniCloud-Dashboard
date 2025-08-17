import React from 'react';
import { RefreshCw, Plus, Search, LucideIcon } from 'lucide-react';
import Button from './Button';

// Layout Component Interfaces
interface DashboardHeaderProps {
  title: string;
  onRefresh?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon | React.ComponentType<{ size?: number }>;
  children?: React.ReactNode;
  className?: string;
}

interface DashboardSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

interface DashboardLayoutProps {
  title: string;
  onRefresh?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  headerActions?: React.ReactNode;
  tabs?: Array<{ id: string; label: string }>;
  activeTab?: string;
  setActiveTab?: (tabId: string) => void;
  searchFilterProps?: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchPlaceholder?: string;
    filters?: Array<{
      value: string;
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
      options: Array<{ value: string; label: string }>;
    }>;
  };
  children: React.ReactNode;
  className?: string;
}

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}

interface TabNavigationProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  className?: string;
}

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPlaceholder?: string;
  filters?: Array<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{ value: string; label: string }>;
  }>;
  className?: string;
}

interface EmptyStateProps {
  icon: LucideIcon | React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * DashboardHeader - A reusable header component for dashboard pages
 * Used across all dashboard pages for consistent header styling
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  onRefresh, 
  actionLabel, 
  onAction,
  actionIcon: ActionIcon = Plus,
  children,
  className = ""
}) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex items-center gap-4">
        {children}
        {onRefresh && (
          <Button
            onClick={onRefresh}
            variant="secondary"
            icon={RefreshCw}
            size="md"
          >
            Refresh
          </Button>
        )}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            icon={ActionIcon}
            size="md"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * DashboardSection - A reusable section component for dashboard pages
 * Used across all dashboard pages for consistent section styling
 */
export const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  title, 
  children, 
  className = "",
  action,
  actionLabel,
  onAction
}) => {
  return (
    <div className={`bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">{title}</h3>
          {action && action}
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

/**
 * TabNavigation - A reusable tab navigation component
 * Used across dashboard pages for tab switching
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  setActiveTab,
  className = ""
}) => {
  return (
    <div className={`border-b border-slate-800 ${className}`}>
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-400 border-b-2 border-blue-500' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * SearchFilter - A reusable search and filter component
 * Used across all dashboard pages for filtering content
 */
export const SearchFilter: React.FC<SearchFilterProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  searchPlaceholder = "Search...",
  filters = [],
  className = ""
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 items-start md:items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      
      {filters.length > 0 && (
        <div className="flex gap-3 self-end">
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={filter.onChange}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * EmptyState - A reusable empty state component
 * Used across dashboard pages when no data is found
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText,
  onAction,
  className = ""
}) => {
  return (
    <div className={`py-12 flex flex-col items-center justify-center ${className}`}>
      <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">{title}</h3>
      <p className="text-slate-400 mb-4 text-center max-w-lg">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

/**
 * DashboardLayout - A reusable layout component for dashboard pages
 * Combines header, tab navigation, search/filter, and content sections
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  title,
  onRefresh,
  actionLabel,
  onAction,
  headerActions,
  tabs,
  activeTab,
  setActiveTab,
  searchFilterProps,
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <DashboardHeader 
        title={title}
        onRefresh={onRefresh}
        actionLabel={actionLabel}
        onAction={onAction}
      >
        {headerActions}
      </DashboardHeader>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        {tabs && activeTab && setActiveTab && (
          <TabNavigation 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        )}
        
        <div className="p-6">
          {searchFilterProps && (
            <div className="mb-6">
              <SearchFilter {...searchFilterProps} />
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * DashboardGrid - A reusable grid component for dashboard cards
 * Used across dashboard pages for displaying card grids
 */
export const DashboardGrid: React.FC<DashboardGridProps> = ({ 
  children, 
  columns = 3, 
  gap = 6,
  className = ""
}) => {
  const columnsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };
  
  return (
    <div className={`grid ${columnsClass[columns]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

/**
 * StatusIndicator - A reusable component for displaying status
 * Used across multiple dashboards for showing status badges
 */
export const StatusIndicator: React.FC<{ 
  status: string; 
  className?: string; 
}> = ({ status, className = "" }) => {
  let bgColor, textColor;
  
  switch (status.toLowerCase()) {
    case 'active':
    case 'verified':
    case 'running':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      break;
    case 'inactive':
    case 'unverified':
    case 'stopped':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      break;
    case 'pending':
    case 'deploying':
    case 'provisioning':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
  }
  
  return (
    <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${bgColor} ${textColor} border border-current/20 ${className}`}>
      <span className="capitalize">{status === 'verified' ? 'Verified' : status === 'unverified' ? 'Unverified' : status}</span>
    </div>
  );
};

export default {
  DashboardHeader,
  DashboardSection,
  DashboardLayout,
  DashboardGrid,
  TabNavigation,
  SearchFilter,
  EmptyState,
  StatusIndicator
};