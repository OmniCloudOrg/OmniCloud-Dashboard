"use client"

import React, { useState } from 'react';
import { 
  ResourceCard, 
  TabNavigation, 
  EmptyState,
  SearchFilter,
  InstanceCard,
  ModalContainer,
  MultiStepProgress,
  FormField,
  FormGroup,
  ModalFooter,
  DashboardHeader,
  DashboardGrid
} from '../components/ui';

import { 
  Server, 
  Cloud, 
  HardDrive, 
  Network, 
  RefreshCw, 
  Plus,
  Search
} from 'lucide-react';

const InfrastructureManagement = () => {
  const [activeTab, setActiveTab] = useState('instances');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  
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
  
  const tabs = [
    { id: 'instances', label: 'Instances' },
    { id: 'containers', label: 'Containers' },
    { id: 'volumes', label: 'Volumes' },
    { id: 'images', label: 'VM Images' }
  ];

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
        { value: 'azure', label: 'Azure' }
      ]
    }
  ];

  // Render container content for inactive tabs
  const renderEmptyTabContent = (icon, title) => (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          {`Manage your ${title.toLowerCase()} across different providers.`}
        </p>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto">
          <Plus size={16} />
          <span>{`Create ${title.slice(0, -1)}`}</span>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <DashboardHeader
        title="Infrastructure"
        onRefresh={() => console.log('Refreshing data...')}
        actionLabel="New Instance"
        onAction={() => setIsModalOpen(true)}
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
                      onSelect={setSelectedInstance} 
                    />
                  ))}
                </DashboardGrid>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No Instances Found"
                  description="We couldn't find any instances matching your search criteria. Try adjusting your filters or search query."
                  actionText="Clear Filters"
                  onAction={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setProviderFilter('all');
                  }}
                />
              )}
            </>
          )}
          
          {activeTab === 'containers' && renderEmptyTabContent(<Cloud size={32} />, "Containers")}
          {activeTab === 'volumes' && renderEmptyTabContent(<HardDrive size={32} />, "Volumes")}
          {activeTab === 'images' && renderEmptyTabContent(<Server size={32} />, "VM Images")}
        </div>
      </div>
      
      {/* Create Instance Modal */}
      <ModalContainer 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Instance"
      >
        <div className="space-y-6">
          <MultiStepProgress step={1} totalSteps={3} />
          
          <FormGroup title="Instance Details">
            <FormField
              label="Name"
              id="name"
              type="text"
              placeholder="my-instance"
              required
            />
            
            <FormGroup columns={2}>
              <FormField
                label="Provider"
                id="provider"
                type="select"
                options={[
                  { value: 'aws', label: 'AWS' },
                  { value: 'gcp', label: 'Google Cloud' },
                  { value: 'azure', label: 'Azure' },
                  { value: 'digitalocean', label: 'DigitalOcean' }
                ]}
              />
              <FormField
                label="Region"
                id="region"
                type="select"
                options={[
                  { value: 'us-east', label: 'US East (N. Virginia)' },
                  { value: 'us-west', label: 'US West (Oregon)' },
                  { value: 'eu-central', label: 'EU Central (Frankfurt)' },
                  { value: 'ap-southeast', label: 'Asia Pacific (Singapore)' }
                ]}
              />
            </FormGroup>
          </FormGroup>
          
          <ModalFooter
            onCancel={() => setIsModalOpen(false)}
            onSubmit={() => console.log('Creating instance...')}
            isMultiStep={true}
            step={1}
            totalSteps={3}
            submitText="Next"
          />
        </div>
      </ModalContainer>
    </div>
  );
};

export default InfrastructureManagement;