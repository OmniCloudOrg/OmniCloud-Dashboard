"use client"

import React, { useState } from 'react';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  Cloud, 
  Server,
  Database,
  Box, 
  CreditCard, 
  AlertCircle, 
  Activity,
  Check,
  X, 
  ArrowRight,
  RefreshCw,
  Zap,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Clock,
  AlertTriangle,
  Info,
  Rocket,
  Layers,
  Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
        {trend === 'up' ? <ArrowUp size={16} /> : trend === 'down' ? <ArrowDown size={16} /> : null}
        {percentage}%
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  </div>
);

// Status Card Component
const StatusCard = ({ title, status, icon: Icon, details }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
        'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}>
        {status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Critical'}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-lg ${
        status === 'healthy' ? 'bg-green-500/10 text-green-400' :
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
        'bg-red-500/10 text-red-400'
      }`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-sm text-slate-400">{details}</div>
      </div>
    </div>
  </div>
);

// Multi-region Status Overview Component
const MultiRegionStatus = () => {
  // Sample data - in a real app this would be fetched
  const regions = [
    { name: 'us-east', provider: 'AWS', status: 'healthy', apps: 24, instances: 52 },
    { name: 'us-west', provider: 'GCP', status: 'healthy', apps: 18, instances: 43 },
    { name: 'eu-central', provider: 'Azure', status: 'warning', apps: 12, instances: 28 },
    { name: 'ap-southeast', provider: 'AWS', status: 'healthy', apps: 15, instances: 36 },
    { name: 'on-prem', provider: 'On-Prem', status: 'critical', apps: 8, instances: 15 }
  ];
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-lg font-medium text-white">Multi-Cloud Status</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Region</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Apps</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {regions.map((region, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{region.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Cloud size={16} className="text-slate-400" />
                    <div className="text-sm text-slate-300">{region.provider}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center gap-2 ${
                    region.status === 'healthy' ? 'text-green-400' :
                    region.status === 'warning' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      region.status === 'healthy' ? 'bg-green-400' :
                      region.status === 'warning' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></div>
                    <div className="text-sm capitalize">{region.status}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{region.apps}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{region.instances}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  // Sample data - in a real app this would be fetched
  const activities = [
    { 
      type: 'deployment',
      status: 'success',
      title: 'API Gateway Deployment',
      timestamp: '10 minutes ago',
      details: 'Deployment to production completed successfully', 
      user: 'sarah.jenkins',
      target: 'api-gateway',
    },
    { 
      type: 'alert',
      status: 'critical',
      title: 'High CPU Usage',
      timestamp: '25 minutes ago',
      details: 'Instance i-abc123 CPU usage exceeded 90%', 
      user: 'system',
      target: 'auth-service',
    },
    { 
      type: 'scaling',
      status: 'info',
      title: 'Auto-scaling Event',
      timestamp: '45 minutes ago',
      details: 'Added 2 instances to user-service', 
      user: 'system',
      target: 'user-service',
    },
    { 
      type: 'build',
      status: 'success',
      title: 'Image Build Completed',
      timestamp: '1 hour ago',
      details: 'Container image frontend:v1.2.0 built successfully', 
      user: 'james.wilson',
      target: 'frontend',
    },
    { 
      type: 'config',
      status: 'info',
      title: 'Configuration Updated',
      timestamp: '2 hours ago',
      details: 'Environment variables updated for payment-service', 
      user: 'michelle.lee',
      target: 'payment-service',
    }
  ];
  
  // Icon mapping based on activity type
  const getActivityIcon = (type, status) => {
    switch (type) {
      case 'deployment':
        return status === 'success' ? <Rocket size={16} /> : <AlertCircle size={16} />;
      case 'alert':
        return <AlertTriangle size={16} />;
      case 'scaling':
        return <Layers size={16} />;
      case 'build':
        return <Box size={16} />;
      case 'config':
        return <Settings size={16} />;
      default:
        return <Info size={16} />;
    }
  };
  
  // Background color mapping based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400';
      case 'critical':
        return 'bg-red-500/10 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'info':
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Recent Activity</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="divide-y divide-slate-800">
        {activities.map((activity, idx) => (
          <div key={idx} className="p-4 hover:bg-slate-800/30">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg mt-1 ${getStatusColor(activity.status)}`}>
                {getActivityIcon(activity.type, activity.status)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="font-medium text-white">{activity.title}</div>
                  <div className="text-sm text-slate-400 flex items-center gap-1">
                    <Clock size={14} />
                    {activity.timestamp}
                  </div>
                </div>
                <div className="text-sm text-slate-400 mt-1">{activity.details}</div>
                <div className="flex items-center gap-6 mt-2 text-xs">
                  <div className="text-slate-500">User: <span className="text-slate-300">{activity.user}</span></div>
                  <div className="text-slate-500">Target: <span className="text-slate-300">{activity.target}</span></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Resource Usage Chart Component
const ResourceUsageChart = () => {
  const [timeRange, setTimeRange] = useState('24h');
  
  // Sample data - in a real app this would be fetched
  const data = [
    { time: '00:00', cpu: 32, memory: 45, disk: 56, network: 21 },
    { time: '03:00', cpu: 40, memory: 48, disk: 56, network: 24 },
    { time: '06:00', cpu: 35, memory: 50, disk: 57, network: 18 },
    { time: '09:00', cpu: 65, memory: 59, disk: 58, network: 45 },
    { time: '12:00', cpu: 75, memory: 68, disk: 58, network: 52 },
    { time: '15:00', cpu: 60, memory: 63, disk: 59, network: 40 },
    { time: '18:00', cpu: 50, memory: 55, disk: 59, network: 30 },
    { time: '21:00', cpu: 45, memory: 52, disk: 60, network: 25 },
  ];
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Resource Usage</h3>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
                name="CPU" 
                stroke="#3b82f6" 
                fillOpacity={1}
                fill="url(#colorCpu)" 
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                name="Memory" 
                stroke="#10b981" 
                fillOpacity={1}
                fill="url(#colorMemory)" 
              />
              <Area 
                type="monotone" 
                dataKey="disk" 
                name="Disk" 
                stroke="#f59e0b" 
                fillOpacity={1}
                fill="url(#colorDisk)" 
              />
              <Area 
                type="monotone" 
                dataKey="network" 
                name="Network" 
                stroke="#8b5cf6" 
                fillOpacity={1}
                fill="url(#colorNetwork)" 
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
            <span className="text-sm text-slate-300">Disk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-slate-300">Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Running Services Component
const RunningServices = () => {
  // Sample data - in a real app this would be fetched
  const services = [
    { name: 'API Gateway', status: 'healthy', instances: 3, cpu: 42, memory: 65, provider: 'AWS' },
    { name: 'Auth Service', status: 'healthy', instances: 2, cpu: 28, memory: 54, provider: 'AWS' },
    { name: 'User Service', status: 'warning', instances: 4, cpu: 78, memory: 82, provider: 'GCP' },
    { name: 'Payment Service', status: 'healthy', instances: 2, cpu: 35, memory: 48, provider: 'Azure' },
    { name: 'Notification Service', status: 'critical', instances: 1, cpu: 92, memory: 87, provider: 'On-Prem' }
  ];
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Running Services</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instances</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">CPU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Memory</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {services.map((service, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{service.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center gap-2 ${
                    service.status === 'healthy' ? 'text-green-400' :
                    service.status === 'warning' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-400' :
                      service.status === 'warning' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}></div>
                    <div className="text-sm capitalize">{service.status}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">{service.instances}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${
                        service.cpu < 50 ? 'bg-green-500' :
                        service.cpu < 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${service.cpu}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{service.cpu}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${
                        service.memory < 50 ? 'bg-green-500' :
                        service.memory < 80 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${service.memory}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{service.memory}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{service.provider}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Build Status Component
const BuildStatus = () => {
  // Sample data - in a real app this would be fetched
  const builds = [
    { name: 'frontend', version: 'v1.2.3', status: 'running', progress: 75, provider: 'GitHub', updated: '2 min ago' },
    { name: 'api-service', version: 'v2.0.1', status: 'success', progress: 100, provider: 'GitLab', updated: '15 min ago' },
    { name: 'auth-service', version: 'v1.5.0', status: 'failed', progress: 100, provider: 'GitHub', updated: '45 min ago' },
    { name: 'user-service', version: 'v1.1.2', status: 'queued', progress: 0, provider: 'Bitbucket', updated: '1 hr ago' }
  ];
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;
    
    switch (status) {
      case 'running':
        bgColor = 'bg-blue-500/10';
        textColor = 'text-blue-400';
        icon = <RefreshCw size={12} className="animate-spin" />;
        break;
      case 'success':
        bgColor = 'bg-green-500/10';
        textColor = 'text-green-400';
        icon = <Check size={12} />;
        break;
      case 'failed':
        bgColor = 'bg-red-500/10';
        textColor = 'text-red-400';
        icon = <X size={12} />;
        break;
      case 'queued':
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        icon = <Clock size={12} />;
        break;
      default:
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        icon = null;
    }
    
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon}
        <span className="capitalize">{status}</span>
      </div>
    );
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Recent Builds</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="divide-y divide-slate-800">
        {builds.map((build, idx) => (
          <div key={idx} className="p-4 hover:bg-slate-800/30">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 rounded-lg p-2">
                <Rocket size={20} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-white truncate">{build.name}</div>
                  <StatusBadge status={build.status} />
                </div>
                <div className="text-sm text-slate-400 mt-1">{build.version} • {build.provider}</div>
                {build.status === 'running' && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${build.progress}%` }}></div>
                    </div>
                  </div>
                )}
                <div className="text-xs text-slate-500 mt-2">Updated {build.updated}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Cost Overview Component
const CostOverview = () => {
  // Sample data - in a real app this would be fetched
  const [period, setPeriod] = useState('month');
  
  const costData = [
    { name: 'AWS', value: 12500, color: '#FF9900' },
    { name: 'GCP', value: 8200, color: '#4285F4' },
    { name: 'Azure', value: 5800, color: '#0078D4' },
    { name: 'On-Prem', value: 3500, color: '#6B7280' }
  ];
  
  const dailyCosts = [
    { day: 'Mon', aws: 520, gcp: 340, azure: 240, onprem: 145 },
    { day: 'Tue', aws: 580, gcp: 320, azure: 260, onprem: 145 },
    { day: 'Wed', aws: 620, gcp: 380, azure: 290, onprem: 145 },
    { day: 'Thu', aws: 540, gcp: 340, azure: 230, onprem: 145 },
    { day: 'Fri', aws: 490, gcp: 290, azure: 190, onprem: 145 },
    { day: 'Sat', aws: 420, gcp: 240, azure: 170, onprem: 145 },
    { day: 'Sun', aws: 380, gcp: 220, azure: 150, onprem: 145 }
  ];
  
  const totalCost = costData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Cost Overview</h3>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">${(totalCost/1000).toFixed(1)}k</div>
              <div className="text-sm text-slate-400">Total Spend</div>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="text-sm font-medium text-slate-400 mb-4">Daily Cost Breakdown</div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyCosts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="aws" stackId="a" fill="#FF9900" name="AWS" />
                  <Bar dataKey="gcp" stackId="a" fill="#4285F4" name="GCP" />
                  <Bar dataKey="azure" stackId="a" fill="#0078D4" name="Azure" />
                  <Bar dataKey="onprem" stackId="a" fill="#6B7280" name="On-Prem" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Alerts Overview Component
const AlertsOverview = () => {
  // Sample data - in a real app this would be fetched
  const alerts = [
    { 
      title: 'High CPU Usage', 
      severity: 'critical', 
      service: 'user-service', 
      timestamp: '15 min ago',
      message: 'CPU usage above 90% for 5 minutes'
    },
    { 
      title: 'Memory Leak Detected', 
      severity: 'warning', 
      service: 'auth-service', 
      timestamp: '45 min ago',
      message: 'Memory consumption growing linearly'
    },
    { 
      title: 'SSL Certificate Expiring', 
      severity: 'warning', 
      service: 'api-gateway', 
      timestamp: '2 hours ago',
      message: 'Certificate will expire in 5 days'
    },
    { 
      title: 'High API Latency', 
      severity: 'warning', 
      service: 'payment-service', 
      timestamp: '3 hours ago',
      message: 'P95 latency above 500ms for 10 minutes'
    },
    { 
      title: 'Disk Space Low', 
      severity: 'critical', 
      service: 'database', 
      timestamp: '4 hours ago',
      message: 'Less than 10% disk space remaining'
    }
  ];
  
  // Severity icon and color mapping
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical':
        return { icon: <AlertCircle size={16} />, color: 'bg-red-500/10 text-red-400' };
      case 'warning':
        return { icon: <AlertTriangle size={16} />, color: 'bg-yellow-500/10 text-yellow-400' };
      case 'info':
      default:
        return { icon: <Info size={16} />, color: 'bg-blue-500/10 text-blue-400' };
    }
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Active Alerts</h3>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="divide-y divide-slate-800">
        {alerts.map((alert, idx) => {
          const { icon, color } = getSeverityStyles(alert.severity);
          
          return (
            <div key={idx} className="p-4 hover:bg-slate-800/30">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${color}`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium text-white">{alert.title}</div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      alert.severity === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      alert.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {alert.severity}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{alert.message}</div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm text-slate-500">Service: <span className="text-slate-300">{alert.service}</span></div>
                    <div className="text-xs text-slate-400">{alert.timestamp}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Dashboard Overview Component
const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Zap size={16} />
            <span>Quick Actions</span>
          </button>
        </div>
      </div>
      
      {/* Resource Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Total Applications" 
          value="56" 
          percentage="8" 
          trend="up" 
          icon={Box} 
          color="bg-blue-500/10 text-blue-400" 
        />
        <ResourceCard 
          title="Running Instances" 
          value="128" 
          percentage="12" 
          trend="up" 
          icon={Server} 
          color="bg-green-500/10 text-green-400" 
        />
        <ResourceCard 
          title="CPU Utilization" 
          value="62%" 
          percentage="5" 
          trend="down" 
          icon={Cpu} 
          color="bg-purple-500/10 text-purple-400" 
        />
        <ResourceCard 
          title="Monthly Cost" 
          value="$15.2k" 
          percentage="3" 
          trend="up" 
          icon={CreditCard} 
          color="bg-amber-500/10 text-amber-400" 
        />
      </div>
      
      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          title="Platform Health" 
          status="healthy" 
          icon={Activity} 
          details="All systems operational" 
        />
        <StatusCard 
          title="API Gateway" 
          status="warning" 
          icon={Server} 
          details="High latency in us-west region" 
        />
        <StatusCard 
          title="Database Cluster" 
          status="healthy" 
          icon={Database} 
          details="All replicas in sync" 
        />
      </div>
      
      {/* Multi-Region Status */}
      <MultiRegionStatus />
      
      {/* Resource Usage Chart */}
      <ResourceUsageChart />
      
      {/* Two-column layout for remaining components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RunningServices />
        <CostOverview />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsOverview />
        <BuildStatus />
      </div>
      
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default DashboardOverview;