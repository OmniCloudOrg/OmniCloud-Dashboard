"use client"

import React from 'react';
import { Shield, RefreshCw, Download } from 'lucide-react';
import { 
  DataTable, 
  EmptyState,
  StatusBadge,
  Button
} from '../../components/ui';

const CertificatesTab = ({ searchQuery, statusFilter, onClearFilters }) => {
  // Sample data
  const certificates = [
    { id: 1, domain: 'example.com', type: 'Let\'s Encrypt', expiresAt: '2025-05-15', status: 'active', coverage: 'example.com, *.example.com' },
    { id: 2, domain: 'api.example.com', type: 'Let\'s Encrypt', expiresAt: '2025-05-10', status: 'active', coverage: 'api.example.com' },
    { id: 3, domain: 'app.example.com', type: 'Custom', expiresAt: '2025-06-20', status: 'active', coverage: 'app.example.com' },
    { id: 4, domain: 'staging.example.com', type: 'Let\'s Encrypt', expiresAt: '2025-04-08', status: 'warning', coverage: 'staging.example.com' },
    { id: 5, domain: 'beta.example.com', type: 'Let\'s Encrypt', expiresAt: '2024-03-25', status: 'inactive', coverage: 'beta.example.com' }
  ];
  
  // Filter data
  const filteredData = certificates.filter(item => 
    item.domain.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === 'all' || item.status === statusFilter)
  );
  
  // Table columns
  const columns = [
    { 
      header: "Domain", 
      accessor: "domain", 
      cell: (item) => <div className="text-sm font-medium text-white">{item.domain}</div> 
    },
    { 
      header: "Type", 
      accessor: "type", 
      cell: (item) => <div className="text-sm text-slate-300">{item.type}</div> 
    },
    { 
      header: "Coverage", 
      accessor: "coverage", 
      cell: (item) => <div className="text-sm text-slate-300">{item.coverage}</div> 
    },
    { 
      header: "Status", 
      accessor: "status", 
      cell: (item) => <StatusBadge status={item.status} /> 
    },
    { 
      header: "Expires", 
      accessor: "expiresAt", 
      cell: (item) => <div className="text-sm text-slate-300">{item.expiresAt}</div> 
    },
    { 
      header: "Actions", 
      accessor: "", 
      cellClassName: "text-right", 
      cell: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button icon={RefreshCw} variant="transparent" size="sm" />
          <Button icon={Download} variant="transparent" size="sm" />
          <Button variant="info" size="sm">Details</Button>
        </div>
      )
    }
  ];
  
  // Empty state
  const emptyState = (
    <EmptyState 
      icon={Shield}
      title="No Certificates Found"
      description="We couldn't find any certificates matching your search criteria."
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

export default CertificatesTab;