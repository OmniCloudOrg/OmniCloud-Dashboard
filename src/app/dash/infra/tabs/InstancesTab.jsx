"use client"

import React from 'react';
import { Search } from 'lucide-react';
import { 
  SearchFilter, 
  EmptyState, 
  InstanceCard,
  DashboardGrid
} from '../../components/ui';

const InstancesTab = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  providerFilter, 
  onClearFilters,
  onSelectInstance,
  filters 
}) => {
  // Sample instance data
  const instances = [
    {
      id: 'i-0abc1234def56789a',
      name: 'Web Server',
      status: 'running',
      type: 't3.medium',
      zone: 'us-east-1a',
      cpu: 42,
      memory: 65,
      uptime: '14 days, 7 hours',
      provider: 'aws'
    },
    {
      id: 'i-0bcd2345efg67890b',
      name: 'API Server',
      status: 'running',
      type: 'm5.large',
      zone: 'us-east-1b',
      cpu: 78,
      memory: 82,
      uptime: '30 days, 12 hours',
      provider: 'aws'
    },
    {
      id: 'i-0cde3456fgh78901c',
      name: 'Database Primary',
      status: 'warning',
      type: 'r6g.xlarge',
      zone: 'us-east-1c',
      cpu: 89,
      memory: 74,
      uptime: '45 days, 3 hours',
      provider: 'aws'
    },
    {
      id: 'vm-abcdef123456',
      name: 'Frontend Service',
      status: 'running',
      type: 'n2-standard-2',
      zone: 'us-central1-a',
      cpu: 35,
      memory: 48,
      uptime: '7 days, 22 hours',
      provider: 'gcp'
    },
    {
      id: 'vm-bcdefg234567',
      name: 'Cache Server',
      status: 'stopped',
      type: 'n2-standard-4',
      zone: 'us-central1-b',
      cpu: 0,
      memory: 0,
      uptime: '0 days, 0 hours',
      provider: 'gcp'
    },
    {
      id: 'i-0def4567ghi89012d',
      name: 'Analytics Worker',
      status: 'provisioning',
      type: 'c5.xlarge',
      zone: 'us-west-2a',
      cpu: 5,
      memory: 10,
      uptime: '0 days, 1 hour',
      provider: 'aws'
    },
  ];

  // Filter instances based on search and filters
  const filteredInstances = instances.filter(instance => {
    const matchesSearch = instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          instance.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || instance.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || instance.provider === providerFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  return (
    <>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search instances..."
        filters={filters}
        className="mb-6"
      />
      
      {filteredInstances.length > 0 ? (
        <DashboardGrid columns={3}>
          {filteredInstances.map(instance => (
            <InstanceCard 
              key={instance.id} 
              instance={instance} 
              onSelect={onSelectInstance} 
            />
          ))}
        </DashboardGrid>
      ) : (
        <EmptyState
          icon={Search}
          title="No Instances Found"
          description="We couldn't find any instances matching your search criteria. Try adjusting your filters or search query."
          actionText="Clear Filters"
          onAction={onClearFilters}
        />
      )}
    </>
  );
};

export default InstancesTab;