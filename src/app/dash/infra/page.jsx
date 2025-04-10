"use client"

import React, { useState } from 'react';
import { 
  ResourceCard, 
  TabNavigation, 
  DashboardHeader,
  DashboardGrid
} from '../components/ui';

import { 
  Server, 
  Cloud, 
  HardDrive, 
  Network, 
  Plus
} from 'lucide-react';

// Import tabs
import InstancesTab from './tabs/InstancesTab';
import ContainersTab from './tabs/ContainersTab';
import VolumesTab from './tabs/VolumesTab';
import VMImagesTab from './tabs/VMImagesTab';

// Import modals
import CreateInstanceModal from './modals/CreateInstanceModal';

const InfrastructureManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  
  const tabs = [
    { id: 'instances', label: 'Instances' },
    { id: 'containers', label: 'Containers' },
    { id: 'volumes', label: 'Volumes' },
    { id: 'images', label: 'VM Images' }
  ];

  // Clear filters helper
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setProviderFilter('all');
  };

  // Filter configuration for SearchFilter component
  const filters = [
    {
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'running', label: 'Running' },
        { value: 'stopped', label: 'Stopped' },
        { value: 'provisioning', label: 'Provisioning' },
        { value: 'warning', label: 'Warning' }
      ]
    },
    {
      value: providerFilter,
      onChange: (e) => setProviderFilter(e.target.value),
      options: [
        { value: 'all', label: 'All Providers' },
        { value: 'aws', label: 'AWS' },
        { value: 'gcp', label: 'Google Cloud' },
        { value: 'azure', label: 'Azure' },
        { value: 'docker', label: 'Docker' },
        { value: 'kubernetes', label: 'Kubernetes' }
      ]
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <DashboardHeader
        title="Infrastructure"
        onRefresh={() => console.log('Refreshing data...')}
        actionLabel="New Instance"
        onAction={() => setIsModalOpen(true)}
        actionIcon={Plus}
      />
      
      {/* Resource Stats */}
      <DashboardGrid columns={4}>
        <ResourceCard 
          title="Total Instances" 
          value="128" 
          percentage="12" 
          trend="up" 
          icon={Server} 
          color="bg-blue-500/10 text-blue-400" 
        />
        <ResourceCard 
          title="Running Containers" 
          value="342" 
          percentage="8" 
          trend="up" 
          icon={Cloud} 
          color="bg-green-500/10 text-green-400" 
        />
        <ResourceCard 
          title="Storage Usage" 
          value="3.8 TB" 
          percentage="2" 
          trend="up" 
          icon={HardDrive} 
          color="bg-purple-500/10 text-purple-400" 
        />
        <ResourceCard 
          title="Network Traffic" 
          value="2.4 GB/s" 
          percentage="5" 
          trend="down" 
          icon={Network} 
          color="bg-amber-500/10 text-amber-400" 
        />
      </DashboardGrid>
      
      {/* Tab Navigation and Content */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className="p-6">
          {activeTab === 'instances' && (
            <InstancesTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              providerFilter={providerFilter}
              onClearFilters={handleClearFilters}
              onSelectInstance={setSelectedInstance}
              filters={filters}
            />
          )}
          
          {activeTab === 'containers' && (
            <ContainersTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              providerFilter={providerFilter}
              onClearFilters={handleClearFilters}
              onSelectContainer={(container) => console.log('Selected container:', container)}
              filters={filters}
            />
          )}
          
          {activeTab === 'volumes' && (
            <VolumesTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              providerFilter={providerFilter}
              onClearFilters={handleClearFilters}
              onSelectVolume={(volume) => console.log('Selected volume:', volume)}
              filters={filters}
            />
          )}
          
          {activeTab === 'images' && (
            <VMImagesTab
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              providerFilter={providerFilter}
              onClearFilters={handleClearFilters}
              onSelectVMImage={(image) => console.log('Selected VM image:', image)}
              filters={filters}
            />
          )}
        </div>
      </div>
      
      {/* Create Instance Modal */}
      <CreateInstanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default InfrastructureManagement;