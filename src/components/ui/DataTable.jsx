import React, { useState } from 'react';
import { 
  ChevronUp, ChevronDown, MoreHorizontal, 
  Eye, Edit, Trash2, ExternalLink 
} from 'lucide-react';
import Button from './Button';
import StatusBadge from './StatusBadge';
import { EmptyState } from './Layout';

/**
 * DataTable Component
 * Replaces multiple table implementations across features
 * Used in BuildsTable, ArtifactsTable, LogsTable, etc.
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyStateProps = {},
  sortable = true,
  selectable = false,
  actions = [],
  onRowClick,
  onSort,
  sortBy,
  sortOrder,
  className = '',
  rowClassName = '',
  headerClassName = '',
  cellClassName = ''
}) => {
  const [internalSortBy, setInternalSortBy] = useState('');
  const [internalSortOrder, setInternalSortOrder] = useState('asc');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Use internal sort if not controlled
  const currentSortBy = sortBy || internalSortBy;
  const currentSortOrder = sortOrder || internalSortOrder;

  const handleSort = (columnKey) => {
    if (!sortable) return;

    const newOrder = currentSortBy === columnKey && currentSortOrder === 'asc' ? 'desc' : 'asc';
    
    if (onSort) {
      onSort(columnKey, newOrder);
    } else {
      setInternalSortBy(columnKey);
      setInternalSortOrder(newOrder);
    }
  };

  const handleRowSelect = (rowId, isSelected) => {
    const newSelected = new Set(selectedRows);
    if (isSelected) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allIds = data.map((row, index) => row.id || index);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Render cell content based on column type
  const renderCellContent = (row, column) => {
    const value = row[column.key];

    switch (column.type) {
      case 'status':
        return <StatusBadge status={value} variant={column.statusVariant} />;
      
      case 'badge':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${column.badgeColors?.[value] || 'bg-slate-200 text-slate-800'}`}>
            {value}
          </span>
        );
      
      case 'date':
        return (
          <span className="text-slate-300">
            {column.format ? column.format(value) : value}
          </span>
        );
      
      case 'link':
        return (
          <a 
            href={column.href ? column.href(row) : '#'}
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            target={column.external ? '_blank' : '_self'}
            rel={column.external ? 'noopener noreferrer' : undefined}
          >
            {value}
            {column.external && <ExternalLink size={12} />}
          </a>
        );
      
      case 'custom':
        return column.render ? column.render(value, row) : value;
      
      default:
        return value;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead>
            <tr className={`bg-slate-800/50 ${headerClassName}`}>
              {selectable && <th className="w-12 px-3 py-3"></th>}
              {columns.map((column, index) => (
                <th key={index} className={`px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider ${column.headerClassName || ''}`}>
                  {column.title}
                </th>
              ))}
              {actions.length > 0 && <th className="w-20 px-3 py-3"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse">
                {selectable && <td className="px-3 py-4"><div className="w-4 h-4 bg-slate-700 rounded"></div></td>}
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  </td>
                ))}
                {actions.length > 0 && <td className="px-3 py-4"><div className="w-8 h-4 bg-slate-700 rounded"></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No data found"
        description="There are no items to display at the moment."
        {...emptyStateProps}
      />
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className={`bg-slate-800/50 ${headerClassName}`}>
            {selectable && (
              <th className="w-12 px-3 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800 text-blue-500"
                />
              </th>
            )}
            
            {columns.map((column, index) => (
              <th 
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider ${column.headerClassName || ''}`}
              >
                {sortable && column.sortable !== false ? (
                  <button
                    onClick={() => handleSort(column.key)}
                    className="flex items-center gap-1 hover:text-white transition-colors group"
                  >
                    {column.title}
                    <div className="flex flex-col">
                      <ChevronUp 
                        size={12} 
                        className={`${currentSortBy === column.key && currentSortOrder === 'asc' ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}
                      />
                      <ChevronDown 
                        size={12} 
                        className={`-mt-1 ${currentSortBy === column.key && currentSortOrder === 'desc' ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}
                      />
                    </div>
                  </button>
                ) : (
                  column.title
                )}
              </th>
            ))}
            
            {actions.length > 0 && (
              <th className="w-20 px-3 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-800">
          {data.map((row, rowIndex) => {
            const rowId = row.id || rowIndex;
            const isSelected = selectedRows.has(rowId);
            
            return (
              <tr 
                key={rowId}
                className={`
                  hover:bg-slate-800/30 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                  ${isSelected ? 'bg-blue-500/10' : ''}
                  ${rowClassName}
                `}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable && (
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                      className="rounded border-slate-600 bg-slate-800 text-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-slate-300 ${cellClassName} ${column.className || ''}`}
                  >
                    {renderCellContent(row, column)}
                  </td>
                ))}
                
                {actions.length > 0 && (
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          className="p-2"
                          title={action.label}
                        >
                          {action.icon || <MoreHorizontal size={16} />}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Common action configurations
 */
export const tableActions = {
  view: (onClick) => ({
    label: 'View',
    icon: <Eye size={16} />,
    onClick
  }),
  edit: (onClick) => ({
    label: 'Edit',
    icon: <Edit size={16} />,
    onClick
  }),
  delete: (onClick) => ({
    label: 'Delete',
    icon: <Trash2 size={16} />,
    onClick
  })
};

/**
 * Common column configurations
 */
export const tableColumns = {
  status: (key = 'status', title = 'Status', variant = 'default') => ({
    key,
    title,
    type: 'status',
    statusVariant: variant
  }),
  date: (key, title, format = null) => ({
    key,
    title,
    type: 'date',
    format
  }),
  link: (key, title, href = null, external = false) => ({
    key,
    title,
    type: 'link',
    href,
    external
  })
};

export default DataTable;
