"use client"

import React, { useState } from 'react';
import { 
  Server, 
  HardDrive, 
  Cloud, 
  Cpu, 
  Memory, 
  Network, 
  Shield, 
  Globe, 
  Zap, 
  RefreshCw, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  ArrowUpDown,
  Check,
  X,
  AlertTriangle,
  Clock,
  ChevronDown,
  Settings,
  Terminal,
  Power,
  Download,
  Upload
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Resource Card Component
const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-sm ${
        trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
      }`}>
        {trend === 'up' ? <ArrowUpDown size={16} className="rotate-180" /> : trend === 'down' ? <ArrowUpDown size={16} className="rotate-0" /> : null}
        {percentage}%
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  </div>
);

// Instance Card Component
const InstanceCard = ({ instance, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'stopped':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'provisioning':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Check size={14} />;
      case 'stopped':
        return <X size={14} />;
      case 'provisioning':
        return <RefreshCw size={14} className="animate-spin" />;
      case 'warning':
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(instance)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Server size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{instance.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{instance.id}</div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${getStatusColor(instance.status)}`}>
          {getStatusIcon(instance.status)}
          <span className="capitalize">{instance.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Type</div>
          <div className="text-sm text-white">{instance.type}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Zone</div>
          <div className="text-sm text-white">{instance.zone}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">CPU Usage</div>
          <div className="flex items-center">
            <div className="w-full bg-slate-800 rounded-full h-1.5 mr-2">
              <div 
                className={`h-full rounded-full ${
                  instance.cpu < 50 ? 'bg-green-500' :
                  instance.cpu < 80 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${instance.status === 'running' ? instance.cpu : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400">{instance.status === 'running' ? instance.cpu : 0}%</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Memory</div>
          <div className="flex items-center">
            <div className="w-full bg-slate-800 rounded-full h-1.5 mr-2">
              <div 
                className={`h-full rounded-full ${
                  instance.memory < 50 ? 'bg-green-500' :
                  instance.memory < 80 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${instance.status === 'running' ? instance.memory : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400">{instance.status === 'running' ? instance.memory : 0}%</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Uptime: {instance.uptime}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-white">
            <Terminal size={14} />
          </button>
          <button className="text-slate-400 hover:text-white">
            <Power size={14} />
          </button>
          <button className="text-blue-400 hover:text-blue-300">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Instance Modal Component
const CreateInstanceModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create New Instance</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="flex items-center mb-6">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step === i 
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400' 
                      : step > i 
                        ? 'border-green-500 bg-green-500/20 text-green-400' 
                        : 'border-slate-700 bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > i ? <Check size={16} /> : i}
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-0.5 ${
                    step > i ? 'bg-green-500/50' : 'bg-slate-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Instance Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="my-instance"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Provider</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="aws">AWS</option>
                      <option value="gcp">Google Cloud</option>
                      <option value="azure">Azure</option>
                      <option value="digitalocean">DigitalOcean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Region</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="us-east">US East (N. Virginia)</option>
                      <option value="us-west">US West (Oregon)</option>
                      <option value="eu-central">EU Central (Frankfurt)</option>
                      <option value="ap-southeast">Asia Pacific (Singapore)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Machine Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Instance Type</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="t3.micro">t3.micro (2 vCPU, 1 GB RAM)</option>
                    <option value="t3.small">t3.small (2 vCPU, 2 GB RAM)</option>
                    <option value="t3.medium">t3.medium (2 vCPU, 4 GB RAM)</option>
                    <option value="m5.large">m5.large (2 vCPU, 8 GB RAM)</option>
                    <option value="c5.large">c5.large (2 vCPU, 4 GB RAM, Compute Optimized)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Operating System</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ubuntu20">Ubuntu 20.04 LTS</option>
                    <option value="ubuntu22">Ubuntu 22.04 LTS</option>
                    <option value="debian11">Debian 11</option>
                    <option value="amazonlinux">Amazon Linux 2</option>
                    <option value="centos7">CentOS 7</option>
                    <option value="windows2019">Windows Server 2019</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Storage</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Type</label>
                      <select
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="gp3">General Purpose SSD (gp3)</option>
                        <option value="io2">Provisioned IOPS SSD (io2)</option>
                        <option value="st1">Throughput Optimized HDD (st1)</option>
                        <option value="sc1">Cold HDD (sc1)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Size (GB)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        defaultValue="50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Network & Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">VPC</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="default">Default VPC</option>
                    <option value="vpc-1">Production VPC</option>
                    <option value="vpc-2">Development VPC</option>
                    <option value="vpc-3">Testing VPC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Security Group</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="sg-1">Web Server (HTTP/HTTPS)</option>
                    <option value="sg-2">SSH Access</option>
                    <option value="sg-3">Database Access</option>
                    <option value="sg-4">Custom Security Group</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">SSH Key</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="key-1">development-key</option>
                    <option value="key-2">production-key</option>
                    <option value="key-3">personal-key</option>
                    <option value="new">Create New Key Pair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">User Data (Optional)</label>
                  <textarea
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                    rows={4}
                    placeholder="#!/bin/bash&#10;# Startup script for instance"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Create Instance
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Infrastructure Page
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Infrastructure</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>New Instance</span>
          </button>
        </div>
      </div>
      
      {/* Resource Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
      
      {/* Tabs for different resource types */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-blue-400 border-b-2 border-blue-500' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {activeTab === 'instances' && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search instances..."
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
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                  <option value="provisioning">Provisioning</option>
                  <option value="warning">Warning</option>
                </select>
                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all">All Providers</option>
                  <option value="aws">AWS</option>
                  <option value="gcp">Google Cloud</option>
                  <option value="azure">Azure</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstances.map(instance => (
                <InstanceCard 
                  key={instance.id} 
                  instance={instance} 
                  onSelect={setSelectedInstance} 
                />
              ))}
              {filteredInstances.length === 0 && (
                <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                  <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">No Instances Found</h3>
                  <p className="text-slate-400 mb-4 text-center max-w-lg">
                    We couldn't find any instances matching your search criteria.
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setProviderFilter('all');
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'containers' && (
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Cloud size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Container Management</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Manage your containers across different providers and orchestration platforms.
                </p>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto">
                  <Plus size={16} />
                  <span>Launch Container</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'volumes' && (
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <HardDrive size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Storage Volumes</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Create and manage persistent storage volumes for your instances and containers.
                </p>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto">
                  <Plus size={16} />
                  <span>Create Volume</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'images' && (
          <div className="p-6">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Server size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Virtual Machine Images</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Manage custom VM images and templates for faster deployment.
                </p>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto">
                  <Plus size={16} />
                  <span>Create Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Instance Modal */}
      {isModalOpen && (
        <CreateInstanceModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default InfrastructureManagement;