"use client"

import React, { useState } from 'react';
import { 
  SearchFilter, 
  EmptyState, 
  InstanceCard,
  DashboardGrid
} from '../../components/ui';
import { Search, Plus } from 'lucide-react';

const ContainersTab = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  providerFilter, 
  onClearFilters,
  onSelectContainer,
  filters 
}) => {
  // Sample container data
  const containers = [
    {
      id: 'container-01',
      name: 'Frontend App',
      status: 'running',
      image: 'react-frontend:v1.2.3',
      cpu: 25,
      memory: 42,
      uptime: '14 days, 7 hours',
      provider: 'docker'
    },
    {
      id: 'container-02',
      name: 'Backend API',
      status: 'running',
      image: 'node-backend:v2.0.1',
      cpu: 45,
      memory: 65,
      uptime: '30 days, 12 hours',
      provider: 'kubernetes'
    },
    {
      id: 'container-03',
      name: 'Redis Cache',
      status: 'stopped',
      image: 'redis:6.2-alpine',
      cpu: 0,
      memory: 0,
      uptime: '0 days, 0 hours',
      provider: 'docker'
    },
  ];

  // State for creating new container
  const [isCreateContainerModalOpen, setIsCreateContainerModalOpen] = useState(false);

  // Filter containers based on search and filters
  const filteredContainers = containers.filter(container => {
    const matchesSearch = container.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          container.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || container.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || container.provider === providerFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  return (
    <>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search containers..."
        filters={filters}
        className="mb-6"
        onCreateNew={() => setIsCreateContainerModalOpen(true)}
        createNewLabel="Create Container"
      />
      
      {filteredContainers.length > 0 ? (
        <DashboardGrid columns={3}>
          {filteredContainers.map(container => (
            <InstanceCard 
              key={container.id} 
              instance={container} 
              onSelect={onSelectContainer} 
            />
          ))}
        </DashboardGrid>
      ) : (
        <EmptyState
          icon={Search}
          title="No Containers Found"
          description="We couldn't find any containers matching your search criteria. Try adjusting your filters or search query."
          actionText="Create Container"
          onAction={() => setIsCreateContainerModalOpen(true)}
        />
      )}

      {/* Create Container Modal - to be implemented */}
      {isCreateContainerModalOpen && (
        <CreateContainerModal 
          isOpen={isCreateContainerModalOpen}
          onClose={() => setIsCreateContainerModalOpen(false)}
        />
      )}
    </>
  );
};

// Placeholder for CreateContainerModal - you'll want to implement this similar to CreateInstanceModal
const CreateContainerModal = ({ isOpen, onClose }) => {
  return (
    <div>
      {/* Modal implementation similar to CreateInstanceModal */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ContainersTab;