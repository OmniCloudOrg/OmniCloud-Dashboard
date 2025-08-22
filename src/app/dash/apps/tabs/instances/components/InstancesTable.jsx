/**
 * Instances Table Component
 * Displays instances in a data table with pagination
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DataTable, Button, ProgressBar } from '../../../../components/ui';
import { INSTANCE_PAGE_SIZES } from '@/data/instanceConstants';
import { getPaginationInfo } from '@/utils/instances/instanceUtils';
import InstanceStatus from './InstanceStatus';
import InstanceActions from './InstanceActions';

const InstancesTable = ({ 
  instances, 
  page, 
  pageSize, 
  totalCount, 
  totalPages, 
  refreshing,
  onPageChange, 
  onPageSizeChange, 
  onInstanceAction 
}) => {
  const columns = [
    {
      header: 'Instance ID',
      accessor: 'id',
      cell: (item) => <div className="text-sm font-medium text-white">{item.id}</div>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => <InstanceStatus status={item.status} />
    },
    {
      header: 'Region',
      accessor: 'region',
      cell: (item) => <div className="text-sm text-slate-300">{item.region}</div>
    },
    {
      header: 'CPU',
      accessor: 'cpu',
      cell: (item) => <ProgressBar value={item.cpu} status={item.status} showLabel={true} />
    },
    {
      header: 'Memory',
      accessor: 'memory',
      cell: (item) => <ProgressBar value={item.memory} status={item.status} showLabel={true} />
    },
    {
      header: 'Uptime',
      accessor: 'uptime',
      cell: (item) => <div className="text-sm text-slate-300">{item.uptime}</div>
    },
    {
      header: '',
      accessor: 'actions',
      cell: (item) => (
        <InstanceActions 
          instance={item} 
          onAction={onInstanceAction}
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      <DataTable columns={columns} data={instances} />
      
      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-slate-400">
          {getPaginationInfo(instances, page, pageSize, totalCount)}
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {INSTANCE_PAGE_SIZES.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0 || refreshing}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="px-2 text-white">
              Page {page + 1} of {totalPages || 1}
            </div>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1 || refreshing}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstancesTable;
