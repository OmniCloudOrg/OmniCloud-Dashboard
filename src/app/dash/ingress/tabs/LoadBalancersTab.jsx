"use client"

import React from 'react';
import { Server, Settings, BarChart2 } from 'lucide-react';
import { 
  DataTable, 
  EmptyState,
  StatusBadge,
  Button
} from '../../components/ui';

const LoadBalancersTab = ({ searchQuery, statusFilter, onClearFilters }) => {
  // Sample data
  const loadBalancers = [
    { id: 1, name: 'Main Load Balancer', type: 'Application', targets: 6, status: 'active', region: 'us-east' },
    { id: 2, name: 'API Load Balancer', type: 'Network', targets: 4, status: 'active', region: 'us-east' },
    { id: 3, name: 'EU Load Balancer', type: 'Application', targets: 3, status: 'active', region: 'eu-central' },
    { id: 4, name: 'Staging Load Balancer', type: 'Application', targets: 2, status: 'active', region: 'us-west' },
    { id: 5, name: 'Internal Services', type: 'Network', targets: 5, status: 'active', region: 'us-east' }
  ];
  
  // Filter data
  const filteredData = loadBalancers.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
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
      header: "Type", 
      accessor: "type", 
      cell: (item) => <div className="text-sm text-slate-300">{item.type}</div> 
    },
    { 
      header: "Region", 
      accessor: "region", 
      cell: (item) => <div className="text-sm text-slate-300">{item.region}</div> 
    },
    { 
      header: "Status", 
      accessor: "status", 
      cell: (item) => <StatusBadge status={item.status} /> 
    },
    { 
      header: "Targets", 
      accessor: "targets", 
      cell: (item) => <div className="text-sm text-slate-300">{item.targets} instances</div> 
    },
    { 
      header: "Actions", 
      accessor: "", 
      cellClassName: "text-right", 
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button icon={Settings} variant="transparent" size="sm" />
          <Button icon={BarChart2} variant="transparent" size="sm" />
          <Button variant="info" size="sm">Manage</Button>
        </div>
      )
    }
  ];
  
  // Empty state
  const emptyState = (
    <EmptyState 
      icon={Server}
      title="No Load Balancers Found"
      description="We couldn't find any load balancers matching your search criteria."
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

export default LoadBalancersTab;