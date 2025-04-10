"use client"

import React from 'react';
import { RefreshCw, Plus, Search } from 'lucide-react';
import { TabNavigation } from './common-components';
import { SearchFilter } from './common-components';

/**
 * DashboardHeader - A reusable header component for dashboard pages
 * Used across all dashboard pages for consistent header styling
 */
export const DashboardHeader = ({ 
  title, 
  onRefresh, 
  actionLabel, 
  onAction,
  actionIcon: ActionIcon = Plus,
  children
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="flex items-center gap-4">
        {children}
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        )}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ActionIcon size={16} />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * DashboardSection - A reusable section component for dashboard pages
 * Used across all dashboard pages for consistent section styling
 */
export const DashboardSection = ({ 
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
          {action && (
            action
          )}
          {actionLabel && onAction && (
            <button 
              onClick={onAction}
              className="text-blue-400 hover:text-blue-300 text-sm"
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
 * DashboardLayout - A reusable layout component for dashboard pages
 * Combines header, tab navigation, search/filter, and content sections
 */
export const DashboardLayout = ({ 
  title,
  onRefresh,
  actionLabel,
  onAction,
  headerActions,
  tabs,
  activeTab,
  setActiveTab,
  searchFilterProps,
  children
}) => {
  return (
    <div className="space-y-6">
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
export const DashboardGrid = ({ 
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
  
  const gapClass = `gap-${gap}`;
  
  return (
    <div className={`grid ${columnsClass[columns]} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * DataTable - A reusable table component for dashboard pages
 * Used across dashboard pages for displaying tabular data
 */
export const DataTable = ({ 
  columns, 
  data, 
  emptyState,
  className = ""
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      {data && data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-800/30">
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                  >
                    {column.cell ? column.cell(item) : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        emptyState
      )}
    </div>
  );
};

/**
 * Pagination - A reusable pagination component for dashboard pages
 * Used across dashboard pages for table pagination
 */
export const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      {totalItems && (
        <div className="text-sm text-slate-400">
          Showing {Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage)} of {totalItems} items
        </div>
      )}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 text-sm ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};