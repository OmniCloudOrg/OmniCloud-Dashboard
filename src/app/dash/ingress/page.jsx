"use client"

import React, { useState } from 'react';
import { Network, Globe, Shield, AlignLeft, Plus } from 'lucide-react';
import { 
  ConsolidatedResourceCard, 
  DashboardHeader,
  TabNavigation,
  SearchFilter,
  UniversalModal,
} from '@/components/ui';

// Import components
import NetworkTrafficChart from './components/NetworkTrafficChart';

// Import tabs
import RoutesTab from './tabs/RoutesTab';
import DomainsTab from './tabs/DomainsTab';
import CertificatesTab from './tabs/CertificatesTab';
import LoadBalancersTab from './tabs/LoadBalancersTab';

const NetworkingManagement = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  
  // Tab configuration
  const tabs = [
    { id: 'routes', label: 'Routes' },
    { id: 'loadbalancers', label: 'Load Balancers' },
    { id: 'domains', label: 'Domains' },
    { id: 'certificates', label: 'Certificates' }
  ];
  
  // Action button config based on active tab
  const getActionButtonLabel = () => {
    switch (activeTab) {
      case 'domains': return 'Add Domain';
      case 'routes': return 'Create Route';
      case 'certificates': return 'Add Certificate';
      case 'loadbalancers': return 'Add Load Balancer';
      default: return 'Add New';
    }
  };
  
  // Handle action button click based on active tab
  const handleActionClick = () => {
    if (activeTab === 'domains') setIsDomainModalOpen(true);
    else if (activeTab === 'routes') setIsRouteModalOpen(true);
    // Add handlers for other tabs as needed
  };
  
  // Clear filters helper
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };
  
  // Get active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'routes':
        return (
          <RoutesTab 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            onClearFilters={handleClearFilters} 
          />
        );
      case 'domains':
        return (
          <DomainsTab 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            onClearFilters={handleClearFilters} 
          />
        );
      case 'certificates':
        return (
          <CertificatesTab 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            onClearFilters={handleClearFilters} 
          />
        );
      case 'loadbalancers':
        return (
          <LoadBalancersTab 
            searchQuery={searchQuery} 
            statusFilter={statusFilter} 
            onClearFilters={handleClearFilters} 
          />
        );
      default:
        return null;
    }
  };
  
  // Get filter options based on active tab
  const getFilterOptions = () => {
    const statusOptions = [
      { value: 'all', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'warning', label: 'Warning' }
    ];
    
    // Add domain-specific options
    if (activeTab === 'domains') {
      statusOptions.push(
        { value: 'verified', label: 'Verified' },
        { value: 'unverified', label: 'Unverified' }
      );
    }
    
    const filters = [
      {
        value: statusFilter,
        onChange: (e) => setStatusFilter(e.target.value),
        options: statusOptions
      }
    ];
    
    // Add tab-specific filters
    if (activeTab === 'routes') {
      filters.push({
        value: 'all',
        onChange: () => {},
        options: [
          { value: 'all', label: 'All Services' },
          { value: 'api', label: 'API Gateway' },
          { value: 'auth', label: 'Auth Service' },
          { value: 'user', label: 'User Service' }
        ]
      });
    } else if (activeTab === 'domains') {
      filters.push({
        value: 'all',
        onChange: () => {},
        options: [
          { value: 'all', label: 'All Types' },
          { value: 'primary', label: 'Primary' },
          { value: 'api', label: 'API' },
          { value: 'app', label: 'Application' }
        ]
      });
    }
    
    return filters;
  };
  
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Networking"
        onRefresh={() => {}} 
        actionLabel={getActionButtonLabel()}
        onAction={handleActionClick}
        actionIcon={Plus}
      />
      
      {/* Resource Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ConsolidatedResourceCard 
          title="Network Traffic" 
          value="2.4 GB/s" 
          percentage="8" 
          trend="upArrow" 
          icon={Network} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="1.5 GB/s inbound, 0.9 GB/s outbound"
        />
        <ConsolidatedResourceCard 
          title="Active Routes" 
          value="42" 
          icon={AlignLeft} 
          color="bg-green-500/10 text-green-400" 
        />
        <ConsolidatedResourceCard 
          title="Custom Domains" 
          value="12" 
          icon={Globe} 
          color="bg-purple-500/10 text-purple-400" 
        />
        <ConsolidatedResourceCard 
          title="SSL Certificates" 
          value="15" 
          icon={Shield} 
          color="bg-amber-500/10 text-amber-400" 
          subtitle="2 certificates expiring soon"
        />
      </div>
      
      {/* Traffic Chart */}
      <NetworkTrafficChart />
      
      {/* Tabs for different networking components */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <div className="p-6">
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder={`Search ${activeTab}...`}
            filters={getFilterOptions()}
            className="mb-6"
          />
          
          {renderActiveTabContent()}
        </div>
      </div>
      
      {/* Modals */}
      <UniversalModal 
        isOpen={isDomainModalOpen} 
        onClose={() => setIsDomainModalOpen(false)}
        title="Add Custom Domain"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Domain Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type
            </label>
            <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
              <option>Primary</option>
              <option>API</option>
              <option>Application</option>
            </select>
          </div>
        </div>
      </UniversalModal>
      
      <UniversalModal 
        isOpen={isRouteModalOpen} 
        onClose={() => setIsRouteModalOpen(false)}
        title="Create Route"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Route Path
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="/api/v1/*"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Service
            </label>
            <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
              <option>API Gateway</option>
              <option>Auth Service</option>
              <option>User Service</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Port
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              placeholder="8080"
            />
          </div>
        </div>
      </UniversalModal>
    </div>
  );
};

export default NetworkingManagement;