"use client"

import React, { useState } from 'react';
import { 
  Network, 
  Globe, 
  Shield, 
  Lock, 
  Server, 
  Wifi, 
  BarChart2, 
  Plus, 
  RefreshCw, 
  Search, 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  Tag,
  DownloadCloud,
  UploadCloud,
  ExternalLink,
  ChevronDown,
  Filter,
  Settings,
  MoreVertical,
  ArrowUpDown,
  Edit,
  Trash,
  AlignLeft,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
          {trend === 'up' ? <ArrowUpDown size={16} className="rotate-180" /> : trend === 'down' ? <ArrowUpDown size={16} className="rotate-0" /> : null}
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
    case 'active':
    case 'verified':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <Check size={14} />;
      break;
    case 'inactive':
    case 'unverified':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <X size={14} />;
      break;
    case 'pending':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <RefreshCw size={14} className="animate-spin" />;
      break;
    case 'warning':
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
      <span className="capitalize">{status === 'verified' ? 'Verified' : status === 'unverified' ? 'Unverified' : status}</span>
    </div>
  );
};

// Create Domain Modal Component
const CreateDomainModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Add Custom Domain</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Domain Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Application</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Application</option>
                <option value="web-app">Web App</option>
                <option value="api-gateway">API Gateway</option>
                <option value="static-content">Static Content</option>
                <option value="landing-page">Landing Page</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Environment</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                  <option value="testing">Testing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Protocol</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="https">HTTPS</option>
                  <option value="http">HTTP</option>
                </select>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-2">SSL/TLS Certificate</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="auto-certificate"
                    name="certificate-type"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="auto-certificate" className="ml-2 text-sm text-white">
                    Auto-managed Certificate (Let's Encrypt)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="custom-certificate"
                    name="certificate-type"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="custom-certificate" className="ml-2 text-sm text-white">
                    Upload Custom Certificate
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 mt-1">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-400">DNS Configuration Required</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    After adding this domain, you'll need to configure DNS records with your domain registrar.
                    We'll provide the necessary records once the domain is added.
                  </p>
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
              Add Domain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Route Modal Component
const CreateRouteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Route</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Route Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="api-route"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Source Path</label>
              <div className="flex items-center gap-2">
                <select
                  className="w-1/3 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="api.example.com">api.example.com</option>
                  <option value="app.example.com">app.example.com</option>
                  <option value="example.com">example.com</option>
                </select>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="/api/v1/*"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Target Service</label>
              <select
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Target Service</option>
                <option value="api-gateway">API Gateway</option>
                <option value="user-service">User Service</option>
                <option value="auth-service">Auth Service</option>
                <option value="product-service">Product Service</option>
                <option value="custom">Custom Target</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Method</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ANY">ANY</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  defaultValue="10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Advanced Options
              </label>
              
              <div className="bg-slate-800/50 p-4 rounded-lg space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">Enable Authentication</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="toggle" 
                        id="auth-toggle" 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                      />
                      <label 
                        htmlFor="auth-toggle" 
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">CORS Enabled</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        name="toggle" 
                        id="cors-toggle" 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                        defaultChecked
                      />
                      <label 
                        htmlFor="cors-toggle" 
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer"
                      ></label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Rate Limit (req/min)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Request Timeout (sec)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue="30"
                  />
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
              Create Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Networking Page Component
const NetworkingManagement = () => {
  const [activeTab, setActiveTab] = useState('routes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  
  // Sample data
  const routes = [
    { id: 1, name: 'API Routes', path: '/api/*', target: 'api-gateway', method: 'ANY', status: 'active', lastUpdated: '2 days ago' },
    { id: 2, name: 'Authentication', path: '/auth/*', target: 'auth-service', method: 'ANY', status: 'active', lastUpdated: '5 days ago' },
    { id: 3, name: 'User API', path: '/api/users/*', target: 'user-service', method: 'ANY', status: 'active', lastUpdated: '1 week ago' },
    { id: 4, name: 'Legacy Redirect', path: '/old/*', target: 'redirect:/new', method: 'GET', status: 'active', lastUpdated: '2 weeks ago' },
    { id: 5, name: 'Webhooks', path: '/webhooks/*', target: 'webhook-service', method: 'POST', status: 'warning', lastUpdated: '3 days ago' },
    { id: 6, name: 'Beta Features', path: '/beta/*', target: 'beta-gateway', method: 'ANY', status: 'inactive', lastUpdated: '1 day ago' }
  ];
  
  const domains = [
    { id: 1, name: 'example.com', type: 'Primary', application: 'Web App', status: 'verified', lastVerified: '2 days ago' },
    { id: 2, name: 'api.example.com', type: 'API', application: 'API Gateway', status: 'verified', lastVerified: '5 days ago' },
    { id: 3, name: 'app.example.com', type: 'Application', application: 'Dashboard', status: 'verified', lastVerified: '1 week ago' },
    { id: 4, name: 'staging.example.com', type: 'Staging', application: 'Staging Environment', status: 'verified', lastVerified: '3 days ago' },
    { id: 5, name: 'beta.example.com', type: 'Testing', application: 'Beta Features', status: 'unverified', lastVerified: 'Never' }
  ];
  
  const certificates = [
    { id: 1, domain: 'example.com', type: 'Let\'s Encrypt', expiresAt: '2025-05-15', status: 'active', coverage: 'example.com, *.example.com' },
    { id: 2, domain: 'api.example.com', type: 'Let\'s Encrypt', expiresAt: '2025-05-10', status: 'active', coverage: 'api.example.com' },
    { id: 3, domain: 'app.example.com', type: 'Custom', expiresAt: '2025-06-20', status: 'active', coverage: 'app.example.com' },
    { id: 4, domain: 'staging.example.com', type: 'Let\'s Encrypt', expiresAt: '2025-04-08', status: 'warning', coverage: 'staging.example.com' },
    { id: 5, domain: 'beta.example.com', type: 'Let\'s Encrypt', expiresAt: '2024-03-25', status: 'inactive', coverage: 'beta.example.com' }
  ];
  
  const loadBalancers = [
    { id: 1, name: 'Main Load Balancer', type: 'Application', targets: 6, status: 'active', region: 'us-east' },
    { id: 2, name: 'API Load Balancer', type: 'Network', targets: 4, status: 'active', region: 'us-east' },
    { id: 3, name: 'EU Load Balancer', type: 'Application', targets: 3, status: 'active', region: 'eu-central' },
    { id: 4, name: 'Staging Load Balancer', type: 'Application', targets: 2, status: 'active', region: 'us-west' },
    { id: 5, name: 'Internal Services', type: 'Network', targets: 5, status: 'active', region: 'us-east' }
  ];
  
  const tabs = [
    { id: 'routes', label: 'Routes' },
    { id: 'loadbalancers', label: 'Load Balancers' },
    { id: 'domains', label: 'Domains' },
    { id: 'certificates', label: 'Certificates' }
  ];
  
  // Filter data based on search query and status filter
  const getFilteredData = () => {
    switch (activeTab) {
      case 'routes':
        return routes.filter(item => 
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.path.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'domains':
        return domains.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'certificates':
        return certificates.filter(item => 
          item.domain.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'loadbalancers':
        return loadBalancers.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      default:
        return [];
    }
  };
  
  // Render content based on active tab
  const renderTabContent = () => {
    const filteredData = getFilteredData();
    
    switch (activeTab) {
      case 'routes':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Path</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{route.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-slate-300">{route.path}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{route.target}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 inline-block">{route.method}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={route.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock size={14} className="mr-1" />
                        <span>{route.lastUpdated}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <Edit size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Trash size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Routes Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any routes matching your search criteria.
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
        );
        
      case 'domains':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Domain Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Application</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((domain) => (
                  <tr key={domain.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-white">{domain.name}</div>
                        <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-300">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{domain.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{domain.application}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={domain.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock size={14} className="mr-1" />
                        <span>{domain.lastVerified}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <RefreshCw size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Trash size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Globe size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Domains Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any domains matching your search criteria.
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
        );
        
      case 'certificates':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Domain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{cert.domain}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{cert.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{cert.coverage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={cert.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{cert.expiresAt}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <RefreshCw size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <Download size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Certificates Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any certificates matching your search criteria.
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
        );
        
      case 'loadbalancers':
        return (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Targets</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredData.map((lb) => (
                  <tr key={lb.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{lb.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{lb.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{lb.region}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusIndicator status={lb.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{lb.targets} instances</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-slate-400 hover:text-slate-300">
                          <Settings size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-300">
                          <BarChart2 size={16} />
                        </button>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Server size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Load Balancers Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any load balancers matching your search criteria.
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
        );
        
      default:
        return null;
    }
  };
  
  // Traffic data for charts
  const trafficData = [
    { time: '00:00', inbound: 120, outbound: 80 },
    { time: '02:00', inbound: 150, outbound: 100 },
    { time: '04:00', inbound: 180, outbound: 120 },
    { time: '06:00', inbound: 210, outbound: 140 },
    { time: '08:00', inbound: 240, outbound: 160 },
    { time: '10:00', inbound: 270, outbound: 180 },
    { time: '12:00', inbound: 300, outbound: 200 },
    { time: '14:00', inbound: 330, outbound: 220 },
    { time: '16:00', inbound: 300, outbound: 200 },
    { time: '18:00', inbound: 270, outbound: 180 },
    { time: '20:00', inbound: 240, outbound: 160 },
    { time: '22:00', inbound: 210, outbound: 140 }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Networking</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => activeTab === 'domains' ? setIsDomainModalOpen(true) : activeTab === 'routes' ? setIsRouteModalOpen(true) : null}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>{activeTab === 'domains' ? 'Add Domain' : activeTab === 'routes' ? 'Create Route' : activeTab === 'certificates' ? 'Add Certificate' : 'Add Load Balancer'}</span>
          </button>
        </div>
      </div>
      
      {/* Resource Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Network Traffic" 
          value="2.4 GB/s" 
          percentage="8" 
          trend="up" 
          icon={Network} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="1.5 GB/s inbound, 0.9 GB/s outbound"
        />
        <ResourceCard 
          title="Active Routes" 
          value="42" 
          icon={AlignLeft} 
          color="bg-green-500/10 text-green-400" 
        />
        <ResourceCard 
          title="Custom Domains" 
          value="12" 
          icon={Globe} 
          color="bg-purple-500/10 text-purple-400" 
        />
        <ResourceCard 
          title="SSL Certificates" 
          value="15" 
          icon={Shield} 
          color="bg-amber-500/10 text-amber-400" 
          subtitle="2 certificates expiring soon"
        />
      </div>
      
      {/* Traffic Chart */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Network Traffic</h3>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div className="p-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value) => [`${value} MB/s`]}
                />
                <Area 
                  type="monotone" 
                  dataKey="inbound" 
                  stroke="#3b82f6" 
                  fillOpacity={1}
                  fill="url(#colorInbound)" 
                  name="Inbound"
                />
                <Area 
                  type="monotone" 
                  dataKey="outbound" 
                  stroke="#ef4444" 
                  fillOpacity={1}
                  fill="url(#colorOutbound)" 
                  name="Outbound"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <DownloadCloud size={14} className="text-blue-500" />
                <span className="text-sm text-blue-400">Inbound</span>
              </div>
              <span className="text-sm font-medium text-white">1.5 GB/s</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <UploadCloud size={14} className="text-red-500" />
                <span className="text-sm text-red-400">Outbound</span>
              </div>
              <span className="text-sm font-medium text-white">0.9 GB/s</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for different networking components */}
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
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="warning">Warning</option>
                {activeTab === 'domains' && (
                  <>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </>
                )}
              </select>
              
              {activeTab === 'routes' && (
                <select
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all">All Services</option>
                  <option value="api">API Gateway</option>
                  <option value="auth">Auth Service</option>
                  <option value="user">User Service</option>
                </select>
              )}
              
              {activeTab === 'domains' && (
                <select
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="all">All Types</option>
                  <option value="primary">Primary</option>
                  <option value="api">API</option>
                  <option value="app">Application</option>
                </select>
              )}
            </div>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
      
      {/* Modals */}
      <CreateDomainModal isOpen={isDomainModalOpen} onClose={() => setIsDomainModalOpen(false)} />
      <CreateRouteModal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} />
    </div>
  );
};

export default NetworkingManagement;