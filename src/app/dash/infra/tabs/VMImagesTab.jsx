"use client"

import React, { useState } from 'react';
import { 
  SearchFilter, 
  EmptyState, 
  InstanceCard,
  DashboardGrid
} from '../../components/ui';
import { Search, Plus } from 'lucide-react';

const VMImagesTab = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  providerFilter, 
  onClearFilters,
  onSelectVMImage,
  filters 
}) => {
  // Sample VM image data
  const vmImages = [
    {
      id: 'img-0abc1234def56789a',
      name: 'Ubuntu 22.04 LTS',
      status: 'available',
      version: 'v1.2.3',
      architecture: 'x86_64',
      size: '2.5 GB',
      type: 'public',
      provider: 'aws'
    },
    {
      id: 'img-0bcd2345efg67890b',
      name: 'Windows Server 2022',
      status: 'available',
      version: 'v2.0.1',
      architecture: 'x86_64',
      size: '5.7 GB',
      type: 'marketplace',
      provider: 'azure'
    },
    {
      id: 'img-0cde3456fgh78901c',
      name: 'Custom Backend Server',
      status: 'private',
      version: 'v3.1.0',
      architecture: 'x86_64',
      size: '8.2 GB',
      type: 'private',
      provider: 'gcp'
    },
  ];

  // State for creating new VM image
  const [isCreateVMImageModalOpen, setIsCreateVMImageModalOpen] = useState(false);

  // Filter VM images based on search and filters
  const filteredVMImages = vmImages.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          image.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || image.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || image.provider === providerFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  return (
    <>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search VM images..."
        filters={filters}
        className="mb-6"
        onCreateNew={() => setIsCreateVMImageModalOpen(true)}
        createNewLabel="Create VM Image"
      />
      
      {filteredVMImages.length > 0 ? (
        <DashboardGrid columns={3}>
          {filteredVMImages.map(image => (
              <InstanceCard 
              key={image.id} 
              instance={image} 
              onSelect={onSelectVMImage} 
            />
          ))}
        </DashboardGrid>
      ) : (
        <EmptyState
          icon={Search}
          title="No VM Images Found"
          description="We couldn't find any VM images matching your search criteria. Try adjusting your filters or search query."
          actionText="Create VM Image"
          onAction={() => setIsCreateVMImageModalOpen(true)}
        />
      )}

      {/* Create VM Image Modal - to be implemented */}
      {isCreateVMImageModalOpen && (
        <CreateVMImageModal 
          isOpen={isCreateVMImageModalOpen}
          onClose={() => setIsCreateVMImageModalOpen(false)}
        />
      )}
    </>
  );
};

// Placeholder for CreateVMImageModal - you'll want to implement this similar to CreateInstanceModal
const CreateVMImageModal = ({ isOpen, onClose }) => {
  return (
    <div>
      {/* Modal implementation similar to CreateInstanceModal */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default VMImagesTab;