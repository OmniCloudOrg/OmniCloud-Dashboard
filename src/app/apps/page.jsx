"use client"

import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { 
  Box, 
  Clock, 
  AlertCircle, 
  Tag, 
  Info, 
  Zap, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Filter, 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Cloud, 
  Terminal, 
  Trash2, 
  Edit, 
  Clipboard, 
  Eye, 
  Download, 
  MoreVertical,
  RefreshCw,
  ChevronDown,
  BarChart2,
  Settings,
  Server,
  CheckSquare,
  Activity,
  Lock,
  Network,
  HardDrive
} from 'lucide-react';

// Application Card Component
const ApplicationCard = ({ app, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'stopped':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'deploying':
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
        return <CheckCircle size={14} />;
      case 'stopped':
        return <XCircle size={14} />;
      case 'deploying':
        return <RefreshCw size={14} className="animate-spin" />;
      case 'warning':
        return <AlertCircle size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(app)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Box size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{app.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{app.description}</div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${getStatusColor(app.status)}`}>
          {getStatusIcon(app.status)}
          <span className="capitalize">{app.status}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Instances</div>
          <div className="text-sm text-white">{app.instances}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Version</div>
          <div className="text-sm text-white">{app.version}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Region</div>
          <div className="text-sm text-white">{app.region}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Runtime</div>
          <div className="text-sm text-white">{app.runtime}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Updated {app.lastUpdated}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300">
          View Details
        </button>
      </div>
    </div>
  );
};

// Create Application Modal Component
const CreateApplicationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    region: 'us-east',
    runtime: 'nodejs18',
    source: 'github',
    repository: '',
    branch: 'main',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    instances: 1,
    memory: 512,
    environment: []
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting application:', formData);
    onClose();
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Application Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="my-awesome-app"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Describe your application"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Region</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="us-east">US East (N. Virginia)</option>
                    <option value="us-west">US West (Oregon)</option>
                    <option value="eu-central">EU Central (Frankfurt)</option>
                    <option value="ap-southeast">Asia Pacific (Singapore)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Runtime</label>
                  <select
                    name="runtime"
                    value={formData.runtime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="nodejs18">Node.js 18</option>
                    <option value="nodejs16">Node.js 16</option>
                    <option value="python3.9">Python 3.9</option>
                    <option value="go1.19">Go 1.19</option>
                    <option value="java17">Java 17</option>
                    <option value="ruby3.1">Ruby 3.1</option>
                    <option value="dotnet6">.NET 6</option>
                    <option value="php8.1">PHP 8.1</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Source Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Source Type</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="github">GitHub</option>
                  <option value="gitlab">GitLab</option>
                  <option value="bitbucket">Bitbucket</option>
                  <option value="custom">Custom Git</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Repository URL</label>
                <input
                  type="text"
                  name="repository"
                  value={formData.repository}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="main"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Auto Deploy</label>
                  <select
                    name="autoDeploy"
                    value={formData.autoDeploy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Build Command</label>
                <input
                  type="text"
                  name="buildCommand"
                  value={formData.buildCommand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="npm run build"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Start Command</label>
                <input
                  type="text"
                  name="startCommand"
                  value={formData.startCommand}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="npm start"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Resources & Scaling</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Instances</label>
                <input
                  type="number"
                  name="instances"
                  value={formData.instances}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">Number of instances to deploy</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Memory (MB)</label>
                <select
                  name="memory"
                  value={formData.memory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="256">256 MB</option>
                  <option value="512">512 MB</option>
                  <option value="1024">1 GB</option>
                  <option value="2048">2 GB</option>
                  <option value="4096">4 GB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Auto Scaling</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="autoScaling"
                      value="enabled"
                      className="text-blue-500 bg-slate-800 border-slate-700"
                    />
                    <span className="ml-2 text-white">Enabled</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="autoScaling"
                      value="disabled"
                      className="text-blue-500 bg-slate-800 border-slate-700"
                      defaultChecked
                    />
                    <span className="ml-2 text-white">Disabled</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Environment Variables</label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="space-y-3">
                    {formData.environment.map((env, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={env.key}
                          placeholder="KEY"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={env.value}
                          placeholder="VALUE"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                        <button className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-red-400 hover:text-red-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="flex items-center gap-2 text-blue-400 text-sm"
                      onClick={() => setFormData({
                        ...formData,
                        environment: [...formData.environment, { key: '', value: '' }]
                      })}
                    >
                      <Plus size={16} />
                      Add Environment Variable
                    </button>
                  </div>
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create New Application</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle size={24} />
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
                  {step > i ? <CheckCircle size={16} /> : i}
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-0.5 ${
                    step > i ? 'bg-green-500/50' : 'bg-slate-700'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
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
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                >
                  Create Application
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Application Detail Component
const ApplicationDetail = ({ app, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'instances', label: 'Instances' },
    { id: 'deployments', label: 'Deployments' },
    { id: 'logs', label: 'Logs' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'settings', label: 'Settings' }
  ];
  
  const getStatusBadge = (status) => {
    const statusColors = {
      running: 'bg-green-500/10 text-green-400 border-green-500/20',
      stopped: 'bg-red-500/10 text-red-400 border-red-500/20',
      deploying: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    
    const statusIcons = {
      running: <CheckCircle size={14} />,
      stopped: <XCircle size={14} />,
      deploying: <RefreshCw size={14} className="animate-spin" />,
      warning: <AlertCircle size={14} />,
    };
    
    return (
      <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${statusColors[status] || 'bg-slate-500/10 text-slate-400'}`}>
        {statusIcons[status] || <Info size={14} />}
        <span className="capitalize">{status}</span>
      </div>
    );
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ApplicationOverview app={app} />;
      case 'instances':
        return <ApplicationInstances app={app} />;
      case 'deployments':
        return <ApplicationDeployments app={app} />;
      case 'logs':
        return <ApplicationLogs app={app} />;
      case 'metrics':
        return <ApplicationMetrics app={app} />;
      case 'settings':
        return <ApplicationSettings app={app} />;
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
        <div>
          <h1 className="text-2xl font-bold text-white">{app.name}</h1>
          <div className="text-slate-400">{app.description}</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {getStatusBadge(app.status)}
          <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
            <Settings size={18} />
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

// Application Overview Tab
const ApplicationOverview = ({ app }) => {
  const stats = [
    { label: 'Uptime', value: '99.99%', icon: Activity },
    { label: 'Response Time', value: '243ms', icon: Zap },
    { label: 'Error Rate', value: '0.01%', icon: AlertCircle },
    { label: 'Deployments', value: app.deployments || 23, icon: GitBranch }
  ];
  
  // Sample environment variables - in a real app these would come from the API
  const envVars = [
    { key: 'NODE_ENV', value: 'production' },
    { key: 'API_URL', value: 'https://api.example.com' },
    { key: 'LOG_LEVEL', value: 'info' },
    { key: 'DATABASE_URL', value: '********' }
  ];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900/80 rounded-lg text-blue-400">
                <stat.icon size={18} />
              </div>
              <div>
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="text-xl font-semibold text-white">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Application Details</h3>
          <div className="bg-slate-800/50 rounded-lg divide-y divide-slate-700/50">
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Version</span>
              <span className="text-white">{app.version}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Runtime</span>
              <span className="text-white">{app.runtime}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Region</span>
              <span className="text-white">{app.region}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Created</span>
              <span className="text-white">{app.created || '2 months ago'}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Last Update</span>
              <span className="text-white">{app.lastUpdated}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Repository</span>
              <a href="#" className="text-blue-400 hover:underline">View on GitHub</a>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Environment Variables</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              Edit
            </button>
          </div>
          <div className="bg-slate-800/50 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {envVars.map((env, idx) => (
                <div key={idx} className="flex items-center border-b border-slate-700/50 last:border-0">
                  <div className="flex-1 px-4 py-3 font-mono text-sm">
                    <span className="text-blue-400">{env.key}</span>
                    <span className="text-slate-400"> = </span>
                    <span className="text-green-400">{env.value}</span>
                  </div>
                  <div className="px-2">
                    <button className="p-1 text-slate-400 hover:text-white">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm">
            View All
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 border-b border-slate-700/50 last:border-0">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg mt-1">
                <GitBranch size={16} />
              </div>
              <div>
                <div className="font-medium text-white">Deployment Completed</div>
                <div className="text-sm text-slate-400 mt-1">Version v1.2.{3-i} was successfully deployed</div>
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <Clock size={12} className="mr-1" /> {i * 2} days ago • by john.doe
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Application Instances Tab
const ApplicationInstances = ({ app }) => {
  // Sample instances data - in a real app these would come from the API
  const instances = [
    { id: 'i-1234567a', status: 'running', region: 'us-east', cpu: 23, memory: 45, uptime: '14 days, 3 hours' },
    { id: 'i-1234567b', status: 'running', region: 'us-east', cpu: 52, memory: 68, uptime: '14 days, 3 hours' },
    { id: 'i-1234567c', status: 'warning', region: 'us-west', cpu: 89, memory: 72, uptime: '12 days, 7 hours' },
    { id: 'i-1234567d', status: 'stopped', region: 'eu-central', cpu: 0, memory: 0, uptime: '0 days, 0 hours' }
  ];
  
  const getStatusBadge = (status) => {
    const statusColors = {
      running: 'bg-green-500/10 text-green-400 border-green-500/20',
      stopped: 'bg-red-500/10 text-red-400 border-red-500/20',
      warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    
    return (
      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-slate-500/10 text-slate-400'}`}>
        <span className="capitalize">{status}</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Instances ({instances.length})</h3>
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 text-sm">
            Refresh
          </button>
          <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 text-sm">
            Add Instance
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800/30 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-slate-700/50">
          <thead>
            <tr className="bg-slate-800/70">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instance ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">CPU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Memory</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Uptime</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {instances.map((instance) => (
              <tr key={instance.id} className="hover:bg-slate-700/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{instance.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(instance.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{instance.region}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-full rounded-full ${
                          instance.cpu < 50 ? 'bg-green-500' :
                          instance.cpu < 80 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${instance.status === 'stopped' ? 0 : instance.cpu}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-300">{instance.status === 'stopped' ? '0' : instance.cpu}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-slate-700 rounded-full h-1.5 mr-2">
                      <div 
                        className={`h-full rounded-full ${
                          instance.memory < 50 ? 'bg-green-500' :
                          instance.memory < 80 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${instance.status === 'stopped' ? 0 : instance.memory}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-300">{instance.status === 'stopped' ? '0' : instance.memory}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{instance.uptime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {instance.status === 'running' ? (
                      <button className="p-1 text-red-400 hover:text-red-300">
                        <XCircle size={18} />
                      </button>
                    ) : (
                      <button className="p-1 text-green-400 hover:text-green-300">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button className="p-1 text-blue-400 hover:text-blue-300">
                      <RefreshCw size={18} />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-300">
                      <Terminal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Auto Scaling Configuration</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Min Instances</span>
              <span className="text-white">2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Max Instances</span>
              <span className="text-white">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scale Up Threshold</span>
              <span className="text-white">75% CPU for 5 min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Scale Down Threshold</span>
              <span className="text-white">30% CPU for 10 min</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Health Checks</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-400">Passing</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Endpoint</span>
              <span className="text-white">/health</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Interval</span>
              <span className="text-white">30 seconds</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Timeout</span>
              <span className="text-white">5 seconds</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Success Codes</span>
              <span className="text-white">200-299</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const ApplicationDeployments = ({ app }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-white">Deployment History</h3>
    <div className="bg-slate-800/50 rounded-lg divide-y divide-slate-700/50">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-start gap-4">
          <div className="p-2 rounded-lg mt-1 bg-blue-500/10 text-blue-400">
            <GitBranch size={16} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="font-medium text-white">v1.2.{7-i}</div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                i > 1 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                i === 1 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' : 
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {i > 1 ? 'Success' : i === 1 ? 'In Progress' : 'Failed'}
              </div>
            </div>
            <div className="text-sm text-slate-400 mt-1">
              Deployed from branch <span className="text-blue-400">main</span> • commit <span className="text-blue-400">a1b2c3d</span>
            </div>
            <div className="flex items-center text-xs text-slate-500 mt-2">
              <Clock size={12} className="mr-1" /> {i === 1 ? 'Started 5 minutes ago' : i === 2 ? 'Yesterday' : `${i} days ago`} • by john.doe
            </div>
          </div>
          <div>
            <button className="text-blue-400 hover:text-blue-300 text-sm">Details</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ApplicationLogs = ({ app }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-white">Logs</h3>
      <div className="flex items-center gap-3">
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option>All Instances</option>
          <option>i-1234567a</option>
          <option>i-1234567b</option>
          <option>i-1234567c</option>
        </select>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option>Last 1 hour</option>
          <option>Last 6 hours</option>
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
        </select>
        <button className="px-3 py-1.5 bg-slate-800 rounded-lg text-white hover:bg-slate-700 text-sm">
          <Download size={16} />
        </button>
      </div>
    </div>
    
    <div className="bg-slate-800/50 rounded-lg p-4 font-mono text-sm">
      <div className="max-h-96 overflow-y-auto space-y-2">
        <div className="text-green-400">[2025-02-25 12:34:56] [INFO] Server started on port 3000</div>
        <div className="text-blue-400">[2025-02-25 12:35:01] [INFO] Connected to database</div>
        <div className="text-blue-400">[2025-02-25 12:35:05] [INFO] User authenticated: john.doe</div>
        <div className="text-blue-400">[2025-02-25 12:36:12] [INFO] GET /api/users 200 15ms</div>
        <div className="text-yellow-400">[2025-02-25 12:36:25] [WARN] Rate limit reached for IP: 192.168.1.1</div>
        <div className="text-blue-400">[2025-02-25 12:37:30] [INFO] POST /api/items 201 32ms</div>
        <div className="text-red-400">[2025-02-25 12:39:45] [ERROR] Invalid JWT token</div>
        <div className="text-blue-400">[2025-02-25 12:40:12] [INFO] GET /api/products 200 28ms</div>
        <div className="text-blue-400">[2025-02-25 12:41:09] [INFO] GET /api/orders 200 42ms</div>
        <div className="text-red-400">[2025-02-25 12:42:33] [ERROR] Database query failed: Timeout</div>
        <div className="text-blue-400">[2025-02-25 12:43:15] [INFO] Database connection retried successfully</div>
        <div className="text-blue-400">[2025-02-25 12:44:01] [INFO] GET /api/dashboard 200 64ms</div>
        <div className="text-yellow-400">[2025-02-25 12:45:22] [WARN] High memory usage: 82%</div>
        <div className="text-blue-400">[2025-02-25 12:46:07] [INFO] GET /api/stats 200 47ms</div>
        <div className="text-blue-400">[2025-02-25 12:47:18] [INFO] User logged out: john.doe</div>
      </div>
    </div>
  </div>
);

const ApplicationMetrics = ({ app }) => {
  // Sample metrics data - in a real app this would come from the API
  const cpuData = [
    { time: '12:00', value: 32 },
    { time: '12:10', value: 40 },
    { time: '12:20', value: 45 },
    { time: '12:30', value: 38 },
    { time: '12:40', value: 55 },
    { time: '12:50', value: 62 },
    { time: '13:00', value: 58 },
    { time: '13:10', value: 45 },
    { time: '13:20', value: 40 },
    { time: '13:30', value: 42 },
    { time: '13:40', value: 48 },
    { time: '13:50', value: 50 },
    { time: '14:00', value: 47 }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Performance Metrics</h3>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option>Last 1 hour</option>
          <option>Last 6 hours</option>
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-4">CPU Usage</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1}
                  fill="url(#colorCpu)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-4">Memory Usage</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData.map(item => ({ ...item, value: item.value + 10 }))}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#colorMemory)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-4">Requests per Second</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData.map(item => ({ 
                ...item, 
                value: Math.floor(Math.random() * 100 + 150)
              }))}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fillOpacity={1}
                  fill="url(#colorRequests)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-4">Response Time (ms)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuData.map(item => ({ 
                ...item, 
                value: Math.floor(Math.random() * 100 + 200)
              }))}>
                <defs>
                  <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  fillOpacity={1}
                  fill="url(#colorResponse)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Top Routes</h4>
          <div className="space-y-2">
            {[
              { route: '/api/users', requests: 24500, time: 43 },
              { route: '/api/products', requests: 18200, time: 67 },
              { route: '/api/auth/login', requests: 12300, time: 92 },
              { route: '/api/orders', requests: 9800, time: 120 },
              { route: '/api/dashboard', requests: 6500, time: 156 }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="font-mono text-slate-300">{item.route}</div>
                <div className="text-slate-400">{(item.requests/1000).toFixed(1)}k requests</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Status Codes</h4>
          <div className="space-y-2">
            {[
              { code: '200 OK', count: 68500, color: 'bg-green-500' },
              { code: '201 Created', count: 12300, color: 'bg-green-500' },
              { code: '304 Not Modified', count: 8200, color: 'bg-blue-500' },
              { code: '401 Unauthorized', count: 3600, color: 'bg-yellow-500' },
              { code: '404 Not Found', count: 2100, color: 'bg-yellow-500' },
              { code: '500 Server Error', count: 850, color: 'bg-red-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                <div className="font-mono text-slate-300">{item.code}</div>
                <div className="text-slate-400 ml-auto">{(item.count/1000).toFixed(1)}k</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Cache Hit Ratio</h4>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-bold text-white mb-2">76.4%</div>
            <div className="text-sm text-slate-400">Cache Hit Ratio</div>
            <div className="w-full mt-4 bg-slate-700 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '76.4%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationSettings = ({ app }) => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-medium text-white mb-4">General Settings</h3>
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Application Name</label>
            <input
              type="text"
              defaultValue={app.name}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea
              defaultValue={app.description}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Region</label>
              <select
                defaultValue={app.region}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="us-east">US East (N. Virginia)</option>
                <option value="us-west">US West (Oregon)</option>
                <option value="eu-central">EU Central (Frankfurt)</option>
                <option value="ap-southeast">Asia Pacific (Singapore)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Runtime</label>
              <select
                defaultValue={app.runtime}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="nodejs18">Node.js 18</option>
                <option value="nodejs16">Node.js 16</option>
                <option value="python3.9">Python 3.9</option>
                <option value="go1.19">Go 1.19</option>
                <option value="java17">Java 17</option>
                <option value="ruby3.1">Ruby 3.1</option>
                <option value="dotnet6">.NET 6</option>
                <option value="php8.1">PHP 8.1</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium text-white mb-4">Environment Variables</h3>
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="space-y-4">
          {[
            { key: 'NODE_ENV', value: 'production' },
            { key: 'API_URL', value: 'https://api.example.com' },
            { key: 'LOG_LEVEL', value: 'info' }
          ].map((env, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={env.key}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="KEY"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  defaultValue={env.value}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="VALUE"
                />
              </div>
              <button className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-red-400 hover:text-red-300">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button className="flex items-center gap-2 mt-4 text-blue-400 text-sm">
            <Plus size={16} />
            Add Environment Variable
          </button>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Custom Domain</h3>
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Add a custom domain to your application. You'll need to configure DNS settings at your domain registrar.</p>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Domain</label>
              <input
                type="text"
                placeholder="app.example.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Domain
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Security</h3>
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">IP Restrictions</label>
              <textarea
                placeholder="Enter IP addresses or CIDR blocks, one per line"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="force-ssl"
                className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                defaultChecked
              />
              <label htmlFor="force-ssl" className="ml-2 text-sm text-slate-300">
                Force HTTPS
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium text-red-400">Delete Application</h4>
            <p className="text-sm text-slate-400 mt-1">Once you delete an application, there is no going back. Please be certain.</p>
            <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Delete Application
            </button>
          </div>
          <div className="pt-6 border-t border-red-500/10">
            <h4 className="text-base font-medium text-red-400">Transfer Ownership</h4>
            <p className="text-sm text-slate-400 mt-1">Transfer this application to another team or organization.</p>
            <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
              Transfer Application
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

// Main Applications Management Component
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
  
  return (
    <div className="space-y-6">
      {!selectedApp ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              New Application
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search applications..."
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
                <option value="deploying">Deploying</option>
                <option value="warning">Warning</option>
              </select>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Regions</option>
                <option value="us-east">US East</option>
                <option value="us-west">US West</option>
                <option value="eu-central">EU Central</option>
                <option value="ap-southeast">AP Southeast</option>
              </select>
              <select
                value={runtimeFilter}
                onChange={(e) => setRuntimeFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Runtimes</option>
                <option value="nodejs18">Node.js 18</option>
                <option value="nodejs16">Node.js 16</option>
                <option value="python3.9">Python 3.9</option>
                <option value="go1.19">Go 1.19</option>
                <option value="java17">Java 17</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map(app => (
              <ApplicationCard 
                key={app.id} 
                app={app} 
                onSelect={setSelectedApp} 
              />
            ))}
            {filteredApps.length === 0 && (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Search size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Applications Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any applications matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setRegionFilter('all');
                    setRuntimeFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <ApplicationDetail app={selectedApp} onBack={() => setSelectedApp(null)} />
      )}
      
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