"use client"

import React, { useState } from 'react';
import { 
  SearchFilter, 
  EmptyState, 
  InstanceCard,
  DashboardGrid
} from '../../components/ui';
import { Search, Plus } from 'lucide-react';

const VolumesTab = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  providerFilter, 
  onClearFilters,
  onSelectVolume,
  filters 
}) => {
  // Sample volume data
  const volumes = [
    {
      id: 'vol-0abc1234def56789a',
      name: 'Data Storage',
      status: 'attached',
      type: 'gp2',
      size: '500 GB',
      iops: '3000',
      throughput: '125 MiB/s',
      provider: 'aws'
    },
    {
      id: 'vol-0bcd2345efg67890b',
      name: 'Backup Volume',
      status: 'available',
      type: 'standard',
      size: '1 TB',
      iops: '1500',
      throughput: '50 MiB/s',
      provider: 'gcp'
    },
    {
      id: 'vol-0cde3456fgh78901c',
      name: 'Database Logs',
      status: 'in-use',
      type: 'io1',
      size: '250 GB',
      iops: '5000',
      throughput: '250 MiB/s',
      provider: 'aws'
    },
  ];

  // State for creating new volume
  const [isCreateVolumeModalOpen, setIsCreateVolumeModalOpen] = useState(false);

  // Filter volumes based on search and filters
  const filteredVolumes = volumes.filter(volume => {
    const matchesSearch = volume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          volume.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || volume.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || volume.provider === providerFilter;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  return (
    <>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search volumes..."
        filters={filters}
        className="mb-6"
        onCreateNew={() => setIsCreateVolumeModalOpen(true)}
        createNewLabel="Create Volume"
      />
      
      {filteredVolumes.length > 0 ? (
        <DashboardGrid columns={3}>
          {filteredVolumes.map(volume => (
            <InstanceCard 
              key={volume.id} 
              instance={volume} 
              onSelect={onSelectVolume} 
            />
          ))}
        </DashboardGrid>
      ) : (
        <EmptyState
          icon={Search}
          title="No Volumes Found"
          description="We couldn't find any volumes matching your search criteria. Try adjusting your filters or search query."
          actionText="Create Volume"
          onAction={() => setIsCreateVolumeModalOpen(true)}
        />
      )}

      {/* Create Volume Modal - to be implemented */}
      {isCreateVolumeModalOpen && (
        <CreateVolumeModal 
          isOpen={isCreateVolumeModalOpen}
          onClose={() => setIsCreateVolumeModalOpen(false)}
        />
      )}
    </>
  );
};

// Placeholder for CreateVolumeModal - you'll want to implement this similar to CreateInstanceModal
const CreateVolumeModal = ({ isOpen, onClose }) => {
  return (
    <div>
      {/* Modal implementation similar to CreateInstanceModal */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default VolumesTab;