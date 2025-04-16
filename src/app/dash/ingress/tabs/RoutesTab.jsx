"use client"

import React from 'react';
import { Search, Clock, Edit, Trash } from 'lucide-react';
import { 
  DataTable, 
  EmptyState,
  StatusBadge,
  Button
} from '../../components/ui';

const RoutesTab = ({ searchQuery, statusFilter, onClearFilters }) => {
  // Sample data
  const routes = [
    { id: 1, name: 'API Routes', path: '/api/*', target: 'api-gateway', method: 'ANY', status: 'active', lastUpdated: '2 days ago' },
    { id: 2, name: 'Authentication', path: '/auth/*', target: 'auth-service', method: 'ANY', status: 'active', lastUpdated: '5 days ago' },
    { id: 3, name: 'User API', path: '/api/users/*', target: 'user-service', method: 'ANY', status: 'active', lastUpdated: '1 week ago' },
    { id: 4, name: 'Legacy Redirect', path: '/old/*', target: 'redirect:/new', method: 'GET', status: 'active', lastUpdated: '2 weeks ago' },
    { id: 5, name: 'Webhooks', path: '/webhooks/*', target: 'webhook-service', method: 'POST', status: 'warning', lastUpdated: '3 days ago' },
    { id: 6, name: 'Beta Features', path: '/beta/*', target: 'beta-gateway', method: 'ANY', status: 'inactive', lastUpdated: '1 day ago' }
  ];
  
  // Filter data
  const filteredData = routes.filter(item => 
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.path.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );
  
  // Table columns
  const columns = [
    { 
      header: "Name", 
      accessor: "name", 
      cell: (item) => <div className="text-sm font-medium text-white">{item.name}</div> 
    },
    { 
      header: "Path", 
      accessor: "path", 
      cell: (item) => <div className="text-sm font-mono text-slate-300">{item.path}</div> 
    },
    { 
      header: "Target", 
      accessor: "target", 
      cell: (item) => <div className="text-sm text-slate-300">{item.target}</div> 
    },
    { 
      header: "Method", 
      accessor: "method", 
      cell: (item) => <div className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 inline-block">{item.method}</div> 
    },
    { 
      header: "Status", 
      accessor: "status", 
      cell: (item) => <StatusBadge status={item.status} /> 
    },
    { 
      header: "Last Updated", 
      accessor: "lastUpdated", 
      cell: (item) => (
        <div className="flex items-center text-sm text-slate-400">
          <Clock size={14} className="mr-1" />
          <span>{item.lastUpdated}</span>
        </div>
      )
    },
    { 
      header: "Actions", 
      accessor: "", 
      cellClassName: "text-right", 
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button icon={Edit} variant="transparent" size="sm" />
          <Button icon={Trash} variant="transparent" size="sm" />
          <Button variant="info" size="sm">Details</Button>
        </div>
      )
    }
  ];
  
  // Empty state
  const emptyState = (
    <EmptyState 
      icon={Search}
      title="No Routes Found"
      description="We couldn't find any routes matching your search criteria. Try adjusting your filters or search query."
      actionText="Clear Filters"
      onAction={onClearFilters}
    />
  );
  
  return (
    <DataTable
      columns={columns}
      data={filteredData}
      emptyState={emptyState}
    />
  );
};

export default RoutesTab;