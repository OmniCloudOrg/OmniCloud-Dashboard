"use client"

import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCog, 
  CreditCard, 
  Server, 
  Database, 
  HardDrive, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Plus,
  Search,
  Lock,
  Key,
  Shield,
  BellRing,
  BarChart2,
  ChevronsUpDown,
  Edit,
  Trash,
  ExternalLink,
  Flag,
  WifiOff,
  AlertCircle,
  DollarSign,
  Clock,
  ArrowUpRight,
  Filter,
  MoreVertical
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Resource Card Component
const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : trend === 'down' ? <ArrowUpRight size={16} className="rotate-90" /> : null}
          {percentage}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

// Status Indicator Component
const StatusIndicator = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status) {
    case 'connected':
    case 'active':
    case 'healthy':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
      break;
    case 'disconnected':
    case 'inactive':
    case 'error':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <XCircle size={14} />;
      break;
    case 'connecting':
    case 'syncing':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <RefreshCw size={14} className="animate-spin" />;
      break;
    case 'warning':
    case 'limited':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Cloud Provider Card Component
const ProviderCard = ({ provider, onSelect }) => {
  const getProviderLogo = (name) => {
    switch (name.toLowerCase()) {
      case 'aws':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-yellow-500 font-bold text-lg">AWS</span>
          </div>
        );
      case 'gcp':
      case 'google cloud':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-500 font-bold text-xs">GCP</span>
          </div>
        );
      case 'azure':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-700 font-bold text-xs">Azure</span>
          </div>
        );
      case 'digital ocean':
      case 'digitalocean':
        return (
          <div className="h-8 w-8 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-400 font-bold text-xs">DO</span>
          </div>
        );
      default:
        return <Cloud size={32} className="text-blue-400" />;
    }
  };
  
  const getResourceCount = (resources) => {
    return Object.values(resources).reduce((sum, current) => sum + current, 0);
  };
  
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(provider)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {getProviderLogo(provider.name)}
          <div>
            <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{provider.accountId}</div>
          </div>
        </div>
        <StatusIndicator status={provider.status} />
      </div>
      
      <div className="space-y-4 mb-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Resources</div>
            <div className="text-lg font-semibold text-white">{getResourceCount(provider.resources)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-500">Regions</div>
            <div className="text-lg font-semibold text-white">{provider.regions.length}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {provider.regions.map((region, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded">{region}</span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-slate-800 pt-4">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={14} />
          <span>Updated {provider.lastUpdated}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          Manage
        </button>
      </div>
    </div>
  );
};

// Create Connection Modal Component
const CreateConnectionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const [selectedProvider, setSelectedProvider] = useState('aws');
  
  const providerOptions = [
    { value: 'aws', label: 'Amazon Web Services (AWS)' },
    { value: 'gcp', label: 'Google Cloud Platform (GCP)' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'digitalocean', label: 'DigitalOcean' },
    { value: 'custom', label: 'Custom / Other' }
  ];
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Connect Cloud Provider</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Cloud Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                {providerOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Connection Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="my-aws-production"
              />
            </div>
            
            {selectedProvider === 'aws' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Method</label>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="auth-key"
                        name="auth-method"
                        className="text-blue-500 bg-slate-800 border-slate-700"
                        defaultChecked
                      />
                      <label htmlFor="auth-key" className="ml-2 text-sm text-white">
                        Access Key & Secret Key
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="auth-role"
                        name="auth-method"
                        className="text-blue-500 bg-slate-800 border-slate-700"
                      />
                      <label htmlFor="auth-role" className="ml-2 text-sm text-white">
                        IAM Role
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Access Key ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="AKIAIOSFODNN7EXAMPLE"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Secret Access Key</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="••••••••••••••••••••••••••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Default Region</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-east-2">US East (Ohio)</option>
                    <option value="us-west-1">US West (N. California)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">EU (Ireland)</option>
                    <option value="eu-central-1">EU (Frankfurt)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
                  </select>
                </div>
              </div>
            )}
            
            {selectedProvider === 'gcp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Method</label>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="auth-key-json"
                        name="auth-method-gcp"
                        className="text-blue-500 bg-slate-800 border-slate-700"
                        defaultChecked
                      />
                      <label htmlFor="auth-key-json" className="ml-2 text-sm text-white">
                        Service Account Key (JSON)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="auth-workload"
                        name="auth-method-gcp"
                        className="text-blue-500 bg-slate-800 border-slate-700"
                      />
                      <label htmlFor="auth-workload" className="ml-2 text-sm text-white">
                        Workload Identity
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Service Account Key</label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      id="service-account-key"
                      className="hidden"
                    />
                    <label
                      htmlFor="service-account-key"
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer flex items-center"
                    >
                      <span className="text-slate-400">No file selected</span>
                    </label>
                    <button className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700">
                      Browse
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Upload your service account key JSON file</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Project ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="my-project-123456"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Default Region</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="us-central1">US Central (Iowa)</option>
                    <option value="us-east1">US East (South Carolina)</option>
                    <option value="us-west1">US West (Oregon)</option>
                    <option value="europe-west1">Europe West (Belgium)</option>
                    <option value="europe-west2">Europe West (London)</option>
                    <option value="asia-east1">Asia East (Taiwan)</option>
                    <option value="asia-southeast1">Asia Southeast (Singapore)</option>
                  </select>
                </div>
              </div>
            )}
            
            {selectedProvider === 'azure' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Method</label>
                  <div className="flex flex-col space-y-2 mt-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="auth-service-principal"
                        name="auth-method-azure"
                        className="text-blue-500 bg-slate-800 border-slate-700"
                        defaultChecked
                      />
                      <label htmlFor="auth-service-principal" className="ml-2 text-sm text-white">
                        Service Principal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="auth-managed-identity"
                        name="auth-method-azure"
                        className="text-blue-500 bg-slate-800 border-slate-700"
                      />
                      <label htmlFor="auth-managed-identity" className="ml-2 text-sm text-white">
                        Managed Identity
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Tenant ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="00000000-0000-0000-0000-000000000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Subscription ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="00000000-0000-0000-0000-000000000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Client ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="00000000-0000-0000-0000-000000000000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Client Secret</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="••••••••••••••••••••••••••••••••"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Default Region</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="eastus">East US</option>
                    <option value="eastus2">East US 2</option>
                    <option value="westus">West US</option>
                    <option value="westus2">West US 2</option>
                    <option value="centralus">Central US</option>
                    <option value="northeurope">North Europe</option>
                    <option value="westeurope">West Europe</option>
                    <option value="southeastasia">Southeast Asia</option>
                  </select>
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-400">Additional Options</label>
                <button className="text-xs text-blue-400 hover:text-blue-300">Show Advanced</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="read-only"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="read-only" className="ml-2 text-sm text-white">
                    Read-Only Access
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sync-resources"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="sync-resources" className="ml-2 text-sm text-white">
                    Automatically sync resources
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="cost-reporting"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="cost-reporting" className="ml-2 text-sm text-white">
                    Enable cost reporting
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Connect Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Provider Detail Component
const ProviderDetail = ({ provider, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: 'Resources' },
    { id: 'costs', label: 'Cost Management' },
    { id: 'quotas', label: 'Quotas & Limits' },
    { id: 'settings', label: 'Settings' }
  ];
  
  // Function to get provider-specific icon
  const getProviderIcon = () => {
    switch (provider.name.toLowerCase()) {
      case 'aws':
        return (
          <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-yellow-500 font-bold text-xl">AWS</span>
          </div>
        );
      case 'gcp':
      case 'google cloud':
        return (
          <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-500 font-bold text-xs">GCP</span>
          </div>
        );
      case 'azure':
        return (
          <div className="h-10 w-10 flex items-center justify-center bg-slate-800 rounded-lg">
            <span className="text-blue-700 font-bold text-xs">Azure</span>
          </div>
        );
      default:
        return <CloudCog size={32} className="text-blue-400" />;
    }
  };
  
  // Sample resource activity data
  const resourceActivity = [
    { date: '25 Feb', created: 5, deleted: 2, modified: 8 },
    { date: '24 Feb', created: 3, deleted: 1, modified: 6 },
    { date: '23 Feb', created: 7, deleted: 0, modified: 12 },
    { date: '22 Feb', created: 2, deleted: 4, modified: 5 },
    { date: '21 Feb', created: 0, deleted: 1, modified: 3 },
    { date: '20 Feb', created: 4, deleted: 2, modified: 7 },
    { date: '19 Feb', created: 6, deleted: 0, modified: 9 }
  ];
  
  // Sample cost data
  const costData = [
    { month: 'Jan', compute: 5200, storage: 2100, network: 1500, other: 800 },
    { month: 'Feb', compute: 5800, storage: 2300, network: 1600, other: 850 },
    { month: 'Mar', compute: 5500, storage: 2200, network: 1550, other: 900 },
    { month: 'Apr', compute: 6200, storage: 2400, network: 1700, other: 920 },
    { month: 'May', compute: 6800, storage: 2600, network: 1800, other: 950 },
    { month: 'Jun', compute: 7200, storage: 2800, network: 1900, other: 980 }
  ];
  
  // Sample quota data for the Quotas tab
  const quotaData = [
    { name: 'EC2 Instances (t3.micro)', limit: 100, used: 42, region: 'us-east-1' },
    { name: 'EC2 Instances (t3.medium)', limit: 50, used: 28, region: 'us-east-1' },
    { name: 'RDS Instances', limit: 40, used: 12, region: 'us-east-1' },
    { name: 'VPCs', limit: 5, used: 3, region: 'us-east-1' },
    { name: 'NAT Gateways', limit: 5, used: 2, region: 'us-east-1' },
    { name: 'Elastic IPs', limit: 5, used: 4, region: 'us-east-1' },
    { name: 'S3 Buckets', limit: 100, used: 27, region: 'global' }
  ];
  
  // Sample permissions data for Settings tab
  const permissionsData = [
    { name: 'Read EC2 Resources', status: 'granted' },
    { name: 'Modify EC2 Resources', status: 'granted' },
    { name: 'Read S3 Resources', status: 'granted' },
    { name: 'Modify S3 Resources', status: 'granted' },
    { name: 'Read RDS Resources', status: 'granted' },
    { name: 'Modify RDS Resources', status: 'granted' },
    { name: 'Read IAM Resources', status: 'granted' },
    { name: 'Modify IAM Resources', status: 'denied' },
    { name: 'Read Billing Information', status: 'granted' }
  ];
  
  // Sample events data for the Overview tab
  const recentEvents = [
    { type: 'sync', status: 'success', message: 'Resources synchronized successfully', time: '2 hours ago' },
    { type: 'quota', status: 'warning', message: 'Approaching S3 bucket limit (90%)', time: '1 day ago' },
    { type: 'sync', status: 'success', message: 'Resources synchronized successfully', time: '2 days ago' },
    { type: 'cost', status: 'warning', message: 'Monthly cost threshold exceeded', time: '3 days ago' },
    { type: 'sync', status: 'error', message: 'Failed to synchronize RDS resources', time: '5 days ago' }
  ];
  
  // Function to render different tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Resource Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {Object.entries(provider.resources).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="text-sm text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="text-2xl font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Resource Activity (7 days)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resourceActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(51, 65, 85, 0.5)',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="created" name="Created" fill="#3b82f6" />
                        <Bar dataKey="modified" name="Modified" fill="#f59e0b" />
                        <Bar dataKey="deleted" name="Deleted" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Estimated Monthly Cost</h3>
                  <div className="text-3xl font-bold text-white">${provider.monthlyCost.toLocaleString()}</div>
                  <div className="text-sm text-slate-400 mt-1">for current billing period</div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Current MTD Spend</span>
                      <span className="text-white">${Math.round(provider.monthlyCost * 0.8).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View Cost Details</button>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Set Alerts</button>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Recent Events</h3>
                  <div className="space-y-4">
                    {recentEvents.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg mt-0.5 ${
                          event.status === 'success' ? 'bg-green-500/10 text-green-400' :
                          event.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {event.status === 'success' ? <CheckCircle size={14} /> :
                           event.status === 'warning' ? <AlertTriangle size={14} /> :
                           <XCircle size={14} />}
                        </div>
                        <div>
                          <div className="text-sm text-slate-300">{event.message}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{event.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Regions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {provider.regions.map((region, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white">{region}</div>
                      <StatusIndicator status="connected" />
                    </div>
                    <div className="text-xs text-slate-500">
                      {Math.floor(Math.random() * 15) + 5} resources
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-3">
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                  <option value="all">All Types</option>
                  <option value="instance">Instances</option>
                  <option value="storage">Storage</option>
                  <option value="database">Databases</option>
                  <option value="networking">Networking</option>
                </select>
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                  <option value="all">All Regions</option>
                  {provider.regions.map((region, idx) => (
                    <option key={idx} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Compute Resources</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Server size={16} className="text-blue-400" />
                            <span className="text-sm font-medium text-white">instance-{idx+1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">t3.medium</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{provider.regions[idx % provider.regions.length]}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator status="active" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-400">{idx + 2} weeks ago</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-slate-400 hover:text-slate-300">
                              <ExternalLink size={16} />
                            </button>
                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Storage Resources</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <HardDrive size={16} className="text-blue-400" />
                            <span className="text-sm font-medium text-white">bucket-{idx+1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">S3 Bucket</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{provider.regions[idx % provider.regions.length]}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{(idx + 1) * 25} GB</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator status="active" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-slate-400 hover:text-slate-300">
                              <ExternalLink size={16} />
                            </button>
                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'costs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Cost Overview</h3>
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                <option value="6">Last 6 Months</option>
                <option value="3">Last 3 Months</option>
                <option value="12">Last 12 Months</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Monthly Costs</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costData}>
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
                      <Legend />
                      <Bar dataKey="compute" name="Compute" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="storage" name="Storage" stackId="a" fill="#10b981" />
                      <Bar dataKey="network" name="Network" stackId="a" fill="#8b5cf6" />
                      <Bar dataKey="other" name="Other" stackId="a" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Cost Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Compute', value: 5800 },
                          { name: 'Storage', value: 2300 },
                          { name: 'Network', value: 1600 },
                          { name: 'Other', value: 850 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`]}
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-slate-400">Total This Month:</span>
                    <span className="font-semibold text-white">${provider.monthlyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Projected:</span>
                    <span className="font-semibold text-white">${Math.round(provider.monthlyCost * 1.25).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Budget & Alerts</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Configure Budgets
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-white">Monthly Budget</div>
                    <div className="text-sm font-medium text-white">${Math.round(provider.monthlyCost * 1.2).toLocaleString()}</div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Current: ${Math.round(provider.monthlyCost * 0.8).toLocaleString()}</span>
                    <span>80% of budget</span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-800">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Alert Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Threshold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">Monthly Budget Alert</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">Actual Cost</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">80%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator status="warning" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">Budget Forecast Alert</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">Forecasted Cost</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">100%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator status="warning" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Edit
                          </button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">EC2 Cost Alert</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">Service Cost</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">$5,000</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusIndicator status="active" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-400 hover:text-blue-300 text-sm">
                            Edit
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'quotas':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                  <option value="all">All Regions</option>
                  {provider.regions.map((region, idx) => (
                    <option key={idx} value={region}>{region}</option>
                  ))}
                </select>
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                  <option value="all">All Services</option>
                  <option value="ec2">EC2</option>
                  <option value="rds">RDS</option>
                  <option value="s3">S3</option>
                  <option value="vpc">VPC</option>
                </select>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <RefreshCw size={16} />
                <span>Refresh Quotas</span>
              </button>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-medium text-white">Service Quotas & Limits</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service & Quota</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Used</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Limit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Usage</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {quotaData.map((quota, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{quota.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{quota.region}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{quota.used}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-300">{quota.limit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-32">
                            <div className="flex justify-between text-xs mb-1">
                              <span className={`${(quota.used / quota.limit) > 0.8 ? 'text-yellow-400' : 'text-slate-400'}`}>
                                {Math.round((quota.used / quota.limit) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  (quota.used / quota.limit) > 0.9 ? 'bg-red-500' :
                                  (quota.used / quota.limit) > 0.7 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`} 
                                style={{ width: `${(quota.used / quota.limit) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {(quota.used / quota.limit) > 0.7 ? (
                            <button className="text-blue-400 hover:text-blue-300 text-sm">
                              Request Increase
                            </button>
                          ) : (
                            <button className="text-slate-400 hover:text-slate-300 text-sm">
                              Monitor
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Quota Increase Requests</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service & Quota</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Current Limit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Requested Limit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">Elastic IPs</div>
                        <div className="text-xs text-slate-500">us-east-1</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">5</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">10</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusIndicator status="pending" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-400">2 days ago</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-300 text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Provider Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Provider Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue={provider.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Account ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue={provider.accountId}
                    disabled
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Default Region</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      defaultValue={provider.regions[0]}
                    >
                      {provider.regions.map((region, idx) => (
                        <option key={idx} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Sync Frequency</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      defaultValue="hourly"
                    >
                      <option value="realtime">Real-time</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="manual">Manual Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Authentication</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Credentials Status</label>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusIndicator status="active" />
                    <span className="text-sm text-slate-300">Credentials are valid and working</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Authentication Method</label>
                  <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                    <div className="text-sm">API Key</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Last Verified</label>
                  <div className="text-sm text-slate-300">2 hours ago</div>
                </div>
                
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Update Credentials
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4">Permissions</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-white">Permission Scan Results</div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Scan Now
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-800">
                    <thead>
                      <tr className="bg-slate-800/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Permission</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {permissionsData.map((perm, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{perm.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${perm.status === 'granted' ? 'text-green-400' : 'text-red-400'}`}>
                              {perm.status.charAt(0).toUpperCase() + perm.status.slice(1)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
                          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-white">Disconnect Provider</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    This will remove the connection to the provider. All associated resources will remain
                    on the provider but will no longer be visible in this dashboard.
                  </p>
                  <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Disconnect Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ChevronDown className="rotate-90" size={20} />
        </button>
        <div className="flex items-center gap-3">
          {getProviderIcon()}
          <div>
            <h1 className="text-2xl font-bold text-white">{provider.name}</h1>
            <div className="text-slate-400">{provider.accountId}</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <StatusIndicator status={provider.status} />
          <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
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
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Main Cloud Providers Management Component
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
    (provider.name.toLowerCase().includes(searchQuery.toLowerCase()) || provider.accountId.toLowerCase().includes(searchQuery.toLowerCase())) &&
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
              value={`${(10500 + 8200 + 7800 + 2500).toLocaleString()}`} 
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
                      formatter={(value) => [`${value.toLocaleString()}`]}
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