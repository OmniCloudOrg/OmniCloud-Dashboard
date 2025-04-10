"use client"

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { 
  DashboardHeader, 
  DashboardGrid, 
  SearchFilter, 
  EmptyState
} from '../components/ui';
import ApplicationCard from './ApplicationCard';
import ApplicationDetail from './ApplicationDetail';
import CreateApplicationModal from './CreateApplicationModal';

// Sample app data
const sampleApps = [
  {
    id: 1,
    name: 'API Gateway',
    description: 'Main API gateway service for user-facing applications',
    version: '1.2.5',
    status: 'running',
    instances: 4,
    region: 'us-east',
    runtime: 'nodejs18',
    lastUpdated: '2 days ago',
    deployments: 32
  },
  {
    id: 2,
    name: 'User Service',
    description: 'Authentication and user management service',
    version: '2.0.1',
    status: 'running',
    instances: 2,
    region: 'us-east',
    runtime: 'go1.19',
    lastUpdated: '5 days ago',
    deployments: 18
  },
  {
    id: 3,
    name: 'Payment Processor',
    description: 'Handles payment processing and validation',
    version: '1.5.3',
    status: 'warning',
    instances: 3,
    region: 'eu-central',
    runtime: 'java17',
    lastUpdated: '1 week ago',
    deployments: 24
  },
  {
    id: 4,
    name: 'Analytics Backend',
    description: 'Processes and aggregates analytics data',
    version: '0.9.2',
    status: 'deploying',
    instances: 2,
    region: 'us-west',
    runtime: 'python3.9',
    lastUpdated: '3 hours ago',
    deployments: 15
  },
  {
    id: 5,
    name: 'Admin Dashboard',
    description: 'Admin control panel for internal users',
    version: '3.1.0',
    status: 'stopped',
    instances: 0,
    region: 'ap-southeast',
    runtime: 'nodejs18',
    lastUpdated: '2 weeks ago',
    deployments: 45
  },
  {
    id: 6,
    name: 'Notification Service',
    description: 'Manages email, SMS, and push notifications',
    version: '1.1.7',
    status: 'running',
    instances: 2,
    region: 'us-east',
    runtime: 'nodejs16',
    lastUpdated: '3 days ago',
    deployments: 29
  }
];

const ApplicationsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [runtimeFilter, setRuntimeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Filter apps based on search and filters
  const filteredApps = sampleApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || app.region === regionFilter;
    const matchesRuntime = runtimeFilter === 'all' || app.runtime === runtimeFilter;
    
    return matchesSearch && matchesStatus && matchesRegion && matchesRuntime;
  });

  // Define filter options
  const filterOptions = [
    {
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'running', label: 'Running' },
        { value: 'stopped', label: 'Stopped' },
        { value: 'deploying', label: 'Deploying' },
        { value: 'warning', label: 'Warning' }
      ]
    },
    {
      value: regionFilter,
      onChange: (e) => setRegionFilter(e.target.value),
      options: [
        { value: 'all', label: 'All Regions' },
        { value: 'us-east', label: 'US East' },
        { value: 'us-west', label: 'US West' },
        { value: 'eu-central', label: 'EU Central' },
        { value: 'ap-southeast', label: 'AP Southeast' }
      ]
    },
    {
      value: runtimeFilter,
      onChange: (e) => setRuntimeFilter(e.target.value),
      options: [
        { value: 'all', label: 'All Runtimes' },
        { value: 'nodejs18', label: 'Node.js 18' },
        { value: 'nodejs16', label: 'Node.js 16' },
        { value: 'python3.9', label: 'Python 3.9' },
        { value: 'go1.19', label: 'Go 1.19' },
        { value: 'java17', label: 'Java 17' }
      ]
    }
  ];
  
  if (selectedApp) {
    return <ApplicationDetail app={selectedApp} onBack={() => setSelectedApp(null)} />;
  }
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Applications"
        actionLabel="New Application"
        onAction={() => setIsModalOpen(true)}
        actionIcon={Plus}
      />
      
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search applications..."
        filters={filterOptions}
        className="mb-6"
      />
      
      <DashboardGrid columns={3} gap={6}>
        {filteredApps.map(app => (
          <ApplicationCard 
            key={app.id} 
            app={app} 
            onSelect={setSelectedApp} 
          />
        ))}
        
        {filteredApps.length === 0 && (
          <EmptyState
            icon={Search}
            title="No Applications Found"
            description="We couldn't find any applications matching your search criteria. Try adjusting your filters or search query."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setRegionFilter('all');
              setRuntimeFilter('all');
            }}
          />
        )}
      </DashboardGrid>
      
      {isModalOpen && (
        <CreateApplicationModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ApplicationsManagement;