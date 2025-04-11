"use client"

import React from 'react';
import { Globe, Clock, RefreshCw, Trash, ExternalLink } from 'lucide-react';
import { 
  DataTable, 
  EmptyState,
  StatusBadge,
  Button
} from '../../components/ui';

const DomainsTab = ({ searchQuery, statusFilter, onClearFilters }) => {
  // Sample data
  const domains = [
    { id: 1, name: 'example.com', type: 'Primary', application: 'Web App', status: 'verified', lastVerified: '2 days ago' },
    { id: 2, name: 'api.example.com', type: 'API', application: 'API Gateway', status: 'verified', lastVerified: '5 days ago' },
    { id: 3, name: 'app.example.com', type: 'Application', application: 'Dashboard', status: 'verified', lastVerified: '1 week ago' },
    { id: 4, name: 'staging.example.com', type: 'Staging', application: 'Staging Environment', status: 'verified', lastVerified: '3 days ago' },
    { id: 5, name: 'beta.example.com', type: 'Testing', application: 'Beta Features', status: 'unverified', lastVerified: 'Never' }
  ];
  
  // Filter data
  const filteredData = domains.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );
  
  // Table columns
  const columns = [
    { 
      header: "Domain Name", 
      accessor: "name", 
      cell: (item) => (
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-white">{item.name}</div>
          <a href={`https://${item.name}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300">
            <ExternalLink size={14} />
          </a>
        </div>
      )
    },
    { 
      header: "Type", 
      accessor: "type", 
      cell: (item) => <div className="text-sm text-slate-300">{item.type}</div> 
    },
    { 
      header: "Application", 
      accessor: "application", 
      cell: (item) => <div className="text-sm text-slate-300">{item.application}</div> 
    },
    { 
      header: "Status", 
      accessor: "status", 
      cell: (item) => <StatusBadge status={item.status} /> 
    },
    { 
      header: "Verified", 
      accessor: "lastVerified", 
      cell: (item) => (
        <div className="flex items-center text-sm text-slate-400">
          <Clock size={14} className="mr-1" />
          <span>{item.lastVerified}</span>
        </div>
      )
    },
    { 
      header: "Actions", 
      accessor: "", 
      cellClassName: "text-right", 
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button icon={RefreshCw} variant="transparent" size="sm" />
          <Button icon={Trash} variant="transparent" size="sm" />
          <Button variant="info" size="sm">Manage</Button>
        </div>
      )
    }
  ];
  
  // Empty state
  const emptyState = (
    <EmptyState 
      icon={Globe}
      title="No Domains Found"
      description="We couldn't find any domains matching your search criteria."
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

export default DomainsTab;