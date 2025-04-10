"use client"

import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCog,
  RefreshCw, 
  Plus, 
  Search,
  CreditCard,
  Server,
  Database
} from 'lucide-react';

// Component imports
import { ResourceCard } from '../components/ui/card-components';
import { ProviderCard } from './components/ProviderCard';
import { CreateConnectionModal } from './components/CreateConnectionModal';
import { ProviderDetail } from './components/ProviderDetail';

// Chart components
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CloudProvidersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Sample data for cloud providers
  const providers = [
    { 
      id: 1, 
      name: 'AWS', 
      accountId: '123456789012', 
      status: 'connected', 
      regions: ['us-east-1', 'us-west-1', 'eu-central-1', 'ap-southeast-1'],
      resources: { instances: 42, volumes: 68, databases: 12, loadBalancers: 8, buckets: 15 },
      monthlyCost: 10500,
      lastUpdated: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Google Cloud', 
      accountId: 'my-project-123456', 
      status: 'connected', 
      regions: ['us-central1', 'us-east1', 'europe-west1', 'asia-east1'],
      resources: { instances: 36, volumes: 52, databases: 8, loadBalancers: 6, buckets: 10 },
      monthlyCost: 8200,
      lastUpdated: '1 day ago'
    },
    { 
      id: 3, 
      name: 'Azure', 
      accountId: 'subscription-abcdef1234', 
      status: 'warning', 
      regions: ['eastus', 'westus', 'northeurope', 'southeastasia'],
      resources: { instances: 28, volumes: 45, databases: 6, loadBalancers: 4, buckets: 12 },
      monthlyCost: 7800,
      lastUpdated: '5 hours ago'
    },
    { 
      id: 4, 
      name: 'DigitalOcean', 
      accountId: 'acct_abcdef1234567890', 
      status: 'connected', 
      regions: ['nyc1', 'sfo2', 'ams3', 'sgp1'],
      resources: { instances: 15, volumes: 20, databases: 4, loadBalancers: 2, buckets: 5 },
      monthlyCost: 2500,
      lastUpdated: '3 days ago'
    }
  ];
  
  // Filter providers based on search query and status filter
  const filteredProviders = providers.filter(provider => 
    (provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     provider.accountId.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || provider.status === statusFilter)
  );
  
  // Cost data for charts
  const costData = [
    { month: 'Sep', aws: 9500, gcp: 7800, azure: 7200, digitalocean: 2300 },
    { month: 'Oct', aws: 9800, gcp: 7900, azure: 7400, digitalocean: 2350 },
    { month: 'Nov', aws: 10100, gcp: 8000, azure: 7500, digitalocean: 2400 },
    { month: 'Dec', aws: 10300, gcp: 8100, azure: 7600, digitalocean: 2450 },
    { month: 'Jan', aws: 10400, gcp: 8150, azure: 7700, digitalocean: 2475 },
    { month: 'Feb', aws: 10500, gcp: 8200, azure: 7800, digitalocean: 2500 }
  ];
  
  return (
    <div className="space-y-6">
      {selectedProvider ? (
        <ProviderDetail 
          provider={selectedProvider} 
          onBack={() => setSelectedProvider(null)} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Cloud Providers</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Connect Provider</span>
              </button>
            </div>
          </div>
          
          {/* Resource Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard 
              title="Total Monthly Cost" 
              value={`$${(10500 + 8200 + 7800 + 2500).toLocaleString()}`} 
              percentage="3" 
              trend="up" 
              icon={CreditCard} 
              color="bg-blue-500/10 text-blue-400" 
              subtitle="Across all providers"
            />
            <ResourceCard 
              title="Total Instances" 
              value="121" 
              icon={Server} 
              color="bg-green-500/10 text-green-400" 
            />
            <ResourceCard 
              title="Total Storage" 
              value="2.3 TB" 
              icon={Database} 
              color="bg-purple-500/10 text-purple-400" 
            />
            <ResourceCard 
              title="Active Regions" 
              value="16" 
              icon={CloudCog} 
              color="bg-amber-500/10 text-amber-400" 
            />
          </div>
          
          {/* Cost Overview Chart */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Cloud Cost Trends</h3>
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
                <option value="6m">Last 6 Months</option>
                <option value="3m">Last 3 Months</option>
                <option value="1y">Last Year</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costData}>
                    <defs>
                      <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorGcp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDigitalocean" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`]}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(51, 65, 85, 0.5)',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="aws" 
                      stroke="#f59e0b" 
                      fillOpacity={1}
                      fill="url(#colorAws)" 
                      name="AWS"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gcp" 
                      stroke="#3b82f6" 
                      fillOpacity={1}
                      fill="url(#colorGcp)" 
                      name="Google Cloud"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="azure" 
                      stroke="#0ea5e9" 
                      fillOpacity={1}
                      fill="url(#colorAzure)" 
                      name="Azure"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="digitalocean" 
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorDigitalocean)" 
                      name="DigitalOcean"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm text-slate-300">AWS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-300">Google Cloud</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                  <span className="text-sm text-slate-300">Azure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-300">DigitalOcean</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Providers List */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-3 self-end">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="connected">Connected</option>
                    <option value="warning">Warning</option>
                    <option value="disconnected">Disconnected</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map(provider => (
                  <ProviderCard 
                    key={provider.id} 
                    provider={provider} 
                    onSelect={setSelectedProvider} 
                  />
                ))}
                
                {filteredProviders.length === 0 && (
                  <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                    <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                      <CloudCog size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No Providers Found</h3>
                    <p className="text-slate-400 mb-4 text-center max-w-lg">
                      We couldn't find any cloud providers matching your search criteria.
                      Try adjusting your filters or search query.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Create Connection Modal */}
          <CreateConnectionModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default CloudProvidersManagement;