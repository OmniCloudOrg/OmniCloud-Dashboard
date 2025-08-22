"use client"

import React, { useState } from 'react';
import { 
  Activity, 
  BarChart2, 
  AlertCircle, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  Cpu, 
  Database, 
  HardDrive, 
  Network, 
  Server,
  DownloadCloud,
  MemoryStick,
  UploadCloud,
  RefreshCw,
  Search, 
  Filter,
  ChevronDown,
  Heart,
  Settings,
  Share2,
  AlarmClock,
  X,
  CheckCircle,
  Save,
  Maximize2,
  Eye,
  Download,
  MoreVertical,
  Layers,
  Target,
  GitCommit,
  Zap
} from 'lucide-react';
import { ConsolidatedResourceCard } from '../../../components/ui';
import { TabNavigation } from '../components/ui/common-components';
import Modal from '../../../components/ui/Modal';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

// Import mock data
import {
  MONITORING_CHART_DATA,
  MONITORING_OVERVIEW_CHART_DATA,
  MONITORING_ALERTS,
  MONITORING_DASHBOARDS,
  MONITORING_DASHBOARD_PREVIEWS,
  MONITORING_TABS,
  TIME_RANGE_OPTIONS,
  SERVICE_TYPES,
  SEVERITY_LEVELS
} from '@/data';

// Alert Card Component
const AlertCard = ({ alert }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={14} />;
      case 'warning':
        return <AlertCircle size={14} />;
      case 'info':
        return <CheckCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 border-b border-slate-800 last:border-0">
      <div className={`p-2 rounded-lg mt-1 ${getSeverityColor(alert.severity)}`}>
        {getSeverityIcon(alert.severity)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="font-medium text-white truncate pr-2">{alert.title}</div>
          <div className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${getSeverityColor(alert.severity)}`}>
            {alert.severity}
          </div>
        </div>
        <div className="text-sm text-slate-400 mt-1">{alert.message}</div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-slate-500 gap-2">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{alert.time}</span>
            </div>
            <div className="text-slate-500">Service: <span className="text-slate-400">{alert.service}</span></div>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-xs">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ dashboard, onSelect }) => {
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/30 transition-all"
      onClick={() => onSelect(dashboard)}
    >
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">{dashboard.name}</h3>
        <div className="flex items-center gap-2">
          {dashboard.starred && (
            <div className="text-yellow-400">
              <Heart size={16} fill="currentColor" />
            </div>
          )}
          <div className="text-slate-400">
            <MoreVertical size={16} />
          </div>
        </div>
      </div>
      <div className="p-4 h-48 overflow-hidden">{dashboard.preview}</div>
      <div className="px-6 py-3 border-t border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock size={14} />
          <span>Updated {dashboard.updatedAt}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-slate-400 hover:text-slate-300">
            <Share2 size={14} />
          </button>
          <button className="text-slate-400 hover:text-slate-300">
            <Settings size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Alert Rule Modal
const CreateAlertModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Alert Rule"
      size="lg"
    >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Rule Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="High CPU Usage Alert"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Alert when CPU usage exceeds threshold"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Metric</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="cpu">CPU Usage</option>
                  <option value="memory">Memory Usage</option>
                  <option value="disk">Disk Usage</option>
                  <option value="network">Network Traffic</option>
                  <option value="response-time">Response Time</option>
                  <option value="error-rate">Error Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Resources</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Resources</option>
                  <option value="instances">Instances</option>
                  <option value="containers">Containers</option>
                  <option value="databases">Databases</option>
                  <option value="custom">Custom Query</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Condition</label>
                <select
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="above">is above</option>
                  <option value="below">is below</option>
                  <option value="equal">is equal to</option>
                  <option value="not-equal">is not equal to</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Threshold</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">For Duration</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="5"
                  />
                  <select
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="seconds">Seconds</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Severity</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="severity"
                    value="critical"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <span className="ml-2 text-white">Critical</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="severity"
                    value="warning"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                    defaultChecked
                  />
                  <span className="ml-2 text-white">Warning</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="severity"
                    value="info"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <span className="ml-2 text-white">Info</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Notifications</h4>
              <div className="space-y-3 bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-email"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="notify-email" className="ml-2 text-sm text-slate-300">
                    Email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-slack"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="notify-slack" className="ml-2 text-sm text-slate-300">
                    Slack
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-webhook"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="notify-webhook" className="ml-2 text-sm text-slate-300">
                    Webhook
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notify-pagerduty"
                    className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="notify-pagerduty" className="ml-2 text-sm text-slate-300">
                    PagerDuty
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
              Create Alert Rule
            </button>
          </div>
    </Modal>
  );
};

// Create Dashboard Modal
const CreateDashboardModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Dashboard" size="lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Dashboard Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="My Dashboard"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Dashboard description"
            rows={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Template</label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="border border-blue-500 bg-blue-500/10 rounded-lg p-3 cursor-pointer">
              <div className="text-blue-400 mb-2">
                <Layers size={20} />
              </div>
              <div className="text-sm font-medium text-white">Blank</div>
              <div className="text-xs text-slate-400 mt-1">Start from scratch</div>
            </div>
            <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-3 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5">
              <div className="text-slate-400 mb-2">
                <Server size={20} />
              </div>
              <div className="text-sm font-medium text-white">Infrastructure</div>
              <div className="text-xs text-slate-400 mt-1">Server & resource metrics</div>
            </div>
            <div className="border border-slate-700 bg-slate-800/50 rounded-lg p-3 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5">
              <div className="text-slate-400 mb-2">
                <Zap size={20} />
              </div>
              <div className="text-sm font-medium text-white">Application</div>
              <div className="text-xs text-slate-400 mt-1">App performance metrics</div>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Variables</label>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-slate-300 mb-3">
              <span>Add dashboard variables for dynamic filtering</span>
              <button className="text-blue-400 hover:text-blue-300 text-xs">
                + Add Variable
              </button>
            </div>
            <div className="text-xs text-slate-500 italic">
              No variables configured
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="starred-dashboard"
              className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
            />
            <label htmlFor="starred-dashboard" className="ml-2 text-sm text-slate-300">
              Add to starred dashboards
            </label>
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
          Create Dashboard
        </button>
      </div>
    </Modal>
  );
};

// Main Monitoring Dashboard Component
const MonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  
  // Sample data for charts
  const { cpu: cpuData, memory: memoryData, disk: diskData, network: networkData } = MONITORING_CHART_DATA;
  
  // Sample alerts data
  const alerts = MONITORING_ALERTS;
  
  // Sample dashboards data
  const dashboards = MONITORING_DASHBOARD_PREVIEWS.map(dashboard => ({
    ...dashboard,
    preview: createDashboardPreview(dashboard)
  }));
  
  // Helper function to create dashboard previews
  function createDashboardPreview(dashboard) {
    if (dashboard.name === 'Infrastructure Overview') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dashboard.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            <Area type="monotone" dataKey="memory" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
            <Area type="monotone" dataKey="disk" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else if (dashboard.name === 'Application Performance') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dashboard.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Line type="monotone" dataKey="latency" stroke="#8b5cf6" dot={false} />
            <Line type="monotone" dataKey="errors" stroke="#ef4444" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (dashboard.name === 'Database Metrics') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dashboard.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Bar dataKey="a" fill="#3b82f6" name="Primary" />
            <Bar dataKey="b" fill="#8b5cf6" name="Replica" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    return null;
  }

  const tabs = MONITORING_TABS;
  
  // Sample chart for the metric cards
  const createSparkline = (data, color) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((value, index) => ({ value }))}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Monitoring</h2>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => activeTab === 'alerts' ? setIsAlertModalOpen(true) : setIsDashboardModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>{activeTab === 'alerts' ? 'New Alert Rule' : 'New Dashboard'}</span>
          </button>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ConsolidatedResourceCard 
                title="CPU Utilization" 
                value="62%" 
                percentage={5}
                subtitle={status === 'warning' ? 'Warning' : 'Healthy'}
                trend="up"
                icon={Cpu} 
                color="bg-blue-500/10 text-blue-400"
                onClick={() => {}}
              />
              <ConsolidatedResourceCard 
                title="Memory Usage" 
                value="68%" 
                percentage={3}
                subtitle={status === 'warning' ? 'Warning' : 'Healthy'}
                trend="up"
                icon={MemoryStick} 
                color="bg-green-500/10 text-green-400"
                onClick={() => {}}
              />
              <ConsolidatedResourceCard 
                title="Disk Usage" 
                value="52%" 
                percentage={2}
                subtitle="Healthy"
                trend="up"
                icon={HardDrive} 
                color="bg-amber-500/10 text-amber-400"
                onClick={() => {}}
              />
              <ConsolidatedResourceCard 
                title="Network Traffic" 
                value="210 MB/s" 
                percentage={-4}
                subtitle="Healthy"
                trend="down"
                icon={Network} 
                color="bg-purple-500/10 text-purple-400"
                onClick={() => {}}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">System Resource Usage</h3>
                    <div className="flex items-center gap-3">
                      <select
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white"
                      >
                        <option value="all">All Resources</option>
                        <option value="web">Web Servers</option>
                        <option value="api">API Servers</option>
                        <option value="db">Databases</option>
                      </select>
                      <button className="text-slate-400 hover:text-slate-300">
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={MONITORING_OVERVIEW_CHART_DATA}
                        >
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cpu" 
                            stroke="#3b82f6" 
                            fillOpacity={1}
                            fill="url(#colorCpu)" 
                            name="CPU"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="memory" 
                            stroke="#10b981" 
                            fillOpacity={1}
                            fill="url(#colorMemory)" 
                            name="Memory"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="disk" 
                            stroke="#f59e0b" 
                            fillOpacity={1}
                            fill="url(#colorDisk)" 
                            name="Disk I/O"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="network" 
                            stroke="#8b5cf6" 
                            fillOpacity={1}
                            fill="url(#colorNetwork)" 
                            name="Network"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-300">CPU</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-slate-300">Memory</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-slate-300">Disk I/O</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-slate-300">Network</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">Active Alerts</h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      View All
                    </button>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {alerts.slice(0, 4).map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Network Traffic</h3>
                  <button className="text-slate-400 hover:text-slate-300">
                    <Maximize2 size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { time: '00:00', in: 120, out: 80 },
                          { time: '02:00', in: 150, out: 100 },
                          { time: '04:00', in: 180, out: 120 },
                          { time: '06:00', in: 210, out: 140 },
                          { time: '08:00', in: 240, out: 160 },
                          { time: '10:00', in: 270, out: 180 },
                          { time: '12:00', in: 300, out: 200 },
                          { time: '14:00', in: 330, out: 220 },
                          { time: '16:00', in: 300, out: 200 },
                          { time: '18:00', in: 270, out: 180 },
                          { time: '20:00', in: 240, out: 160 },
                          { time: '22:00', in: 210, out: 140 }
                        ]}
                      >
                        <defs>
                          <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
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
                          dataKey="in" 
                          stroke="#3b82f6" 
                          fillOpacity={1}
                          fill="url(#colorIn)" 
                          name="Inbound"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="out" 
                          stroke="#ef4444" 
                          fillOpacity={1}
                          fill="url(#colorOut)" 
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
                      <span className="text-sm font-medium text-white">210 MB/s</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <UploadCloud size={14} className="text-red-500" />
                        <span className="text-sm text-red-400">Outbound</span>
                      </div>
                      <span className="text-sm font-medium text-white">140 MB/s</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Application Health</h3>
                  <button className="text-slate-400 hover:text-slate-300">
                    <Maximize2 size={16} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Response Time</div>
                      <div className="text-2xl font-bold text-white mb-1">142 ms</div>
                      <div className="flex items-center text-xs text-green-400">
                        <ArrowUpRight size={12} className="rotate-180 mr-1" />
                        <span>12% decrease</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="text-sm text-slate-400 mb-1">Error Rate</div>
                      <div className="text-2xl font-bold text-white mb-1">0.42%</div>
                      <div className="flex items-center text-xs text-green-400">
                        <ArrowUpRight size={12} className="rotate-180 mr-1" />
                        <span>0.1% decrease</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { time: '00:00', latency: 150, errors: 0.5 },
                          { time: '02:00', latency: 155, errors: 0.6 },
                          { time: '04:00', latency: 160, errors: 0.7 },
                          { time: '06:00', latency: 170, errors: 0.8 },
                          { time: '08:00', latency: 180, errors: 0.9 },
                          { time: '10:00', latency: 175, errors: 0.8 },
                          { time: '12:00', latency: 165, errors: 0.6 },
                          { time: '14:00', latency: 155, errors: 0.5 },
                          { time: '16:00', latency: 150, errors: 0.4 },
                          { time: '18:00', latency: 145, errors: 0.4 },
                          { time: '20:00', latency: 140, errors: 0.3 },
                          { time: '22:00', latency: 135, errors: 0.3 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis yAxisId="left" stroke="#94a3b8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(51, 65, 85, 0.5)',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="latency" 
                          stroke="#3b82f6" 
                          name="Response Time (ms)"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="errors" 
                          stroke="#ef4444" 
                          name="Error Rate (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Dashboards Tab */}
        {activeTab === 'dashboards' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Search dashboards..."
                className="w-full max-w-md px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-3">
                <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                  <button className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700">
                    All
                  </button>
                  <button className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700">
                    Starred
                  </button>
                  <button className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700">
                    Recent
                  </button>
                </div>
                <select
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="updated">Last Updated</option>
                  <option value="created">Date Created</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map(dashboard => (
                <DashboardCard 
                  key={dashboard.id} 
                  dashboard={dashboard} 
                  onSelect={() => {}}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full max-w-md px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-3">
                <select
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
                <select
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="all">All Services</option>
                  <option value="api">API Gateway</option>
                  <option value="database">Database</option>
                  <option value="storage">Storage</option>
                </select>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Active Alerts</h3>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    2 Critical
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    3 Warning
                  </div>
                </div>
              </div>
              <div>
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Alert Rules</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Manage Rules
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Metric</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">High CPU Utilization</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">CPU Usage</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">&gt; 90% for 5 min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                          Critical
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-slate-300">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-slate-400 hover:text-slate-300">
                            <Eye size={16} />
                          </button>
                          <button className="text-slate-400 hover:text-slate-300">
                            <Settings size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">Memory Usage Warning</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">Memory Usage</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">&gt; 85% for 10 min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 w-fit">
                          Warning
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-slate-300">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-slate-400 hover:text-slate-300">
                            <Eye size={16} />
                          </button>
                          <button className="text-slate-400 hover:text-slate-300">
                            <Settings size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">API Latency Alert</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">Response Time</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-300">&gt; 300ms for 5 min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 w-fit">
                          Warning
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm text-slate-300">Active</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-slate-400 hover:text-slate-300">
                            <Eye size={16} />
                          </button>
                          <button className="text-slate-400 hover:text-slate-300">
                            <Settings size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Metrics Explorer Tab */}
        {activeTab === 'metrics' && (
          <div className="p-6 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-medium text-white">Metrics Explorer</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Metric</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="cpu">CPU Usage</option>
                      <option value="memory">Memory Usage</option>
                      <option value="disk">Disk Usage</option>
                      <option value="network">Network Traffic</option>
                      <option value="response-time">Response Time</option>
                      <option value="throughput">Throughput</option>
                      <option value="error-rate">Error Rate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Resource</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Resources</option>
                      <option value="web-servers">Web Servers</option>
                      <option value="api-servers">API Servers</option>
                      <option value="databases">Databases</option>
                      <option value="cache">Cache Servers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Aggregation</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="avg">Average</option>
                      <option value="max">Maximum</option>
                      <option value="min">Minimum</option>
                      <option value="sum">Sum</option>
                      <option value="count">Count</option>
                      <option value="p95">P95</option>
                      <option value="p99">P99</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Time Range</label>
                    <select
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="1h">Last Hour</option>
                      <option value="6h">Last 6 Hours</option>
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mb-6">
                  <button className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 flex items-center gap-2">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
                    Apply
                  </button>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { time: '00:00', value: 30 },
                        { time: '02:00', value: 32 },
                        { time: '04:00', value: 35 },
                        { time: '06:00', value: 40 },
                        { time: '08:00', value: 45 },
                        { time: '10:00', value: 50 },
                        { time: '12:00', value: 60 },
                        { time: '14:00', value: 55 },
                        { time: '16:00', value: 50 },
                        { time: '18:00', value: 45 },
                        { time: '20:00', value: 40 },
                        { time: '22:00', value: 35 }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        dot={false}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-slate-300 mb-2">Statistics</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <div className="text-xs text-slate-400">Average</div>
                      <div className="text-sm font-medium text-white">43.1%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Min</div>
                      <div className="text-sm font-medium text-white">30.0%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Max</div>
                      <div className="text-sm font-medium text-white">60.0%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">P95</div>
                      <div className="text-sm font-medium text-white">57.0%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">P99</div>
                      <div className="text-sm font-medium text-white">59.4%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <CreateAlertModal 
        isOpen={isAlertModalOpen} 
        onClose={() => setIsAlertModalOpen(false)} 
      />
      
      <CreateDashboardModal 
        isOpen={isDashboardModalOpen} 
        onClose={() => setIsDashboardModalOpen(false)} 
      />
    </div>
  );
};

export default MonitoringDashboard;