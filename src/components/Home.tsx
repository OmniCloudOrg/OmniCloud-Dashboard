import React, { useState } from 'react';
import { 
  Home, AppWindow, Settings, Users, Bell, 
  BarChart2, MessageCircleWarning, Plus, 
  ChevronLeft, Activity, BarChart, User,
  Cloud, Database, Cpu, MemoryStick, HardDrive,
  Network, GitBranch, Box, Layers, Shield,
  Globe, Workflow, Terminal, Share2, Gauge,
  Server, AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const regionData = [
  { name: 'us-west', instances: 45, cpu: 78, memory: 82, status: 'healthy' },
  { name: 'us-east', instances: 62, cpu: 65, memory: 75, status: 'healthy' },
  { name: 'eu-central', instances: 38, cpu: 45, memory: 60, status: 'degraded' },
  { name: 'ap-south', instances: 29, cpu: 55, memory: 68, status: 'healthy' },
];

const serviceMetrics = [
  { service: 'api-gateway', latency: 42, requests: 1250, errors: 12, uptime: 99.99 },
  { service: 'auth-service', latency: 28, requests: 890, errors: 5, uptime: 99.95 },
  { service: 'data-processor', latency: 85, requests: 450, errors: 8, uptime: 99.90 },
  { service: 'notification', latency: 15, requests: 680, errors: 3, uptime: 99.99 },
];

const securityEvents = [
  { type: 'auth_failure', count: 15, severity: 'medium', timestamp: '10m ago' },
  { type: 'rate_limit', count: 8, severity: 'low', timestamp: '15m ago' },
  { type: 'ssl_expire', count: 1, severity: 'high', timestamp: '1h ago' },
];

const performanceData = [
  { time: '00:00', cpu: 45, memory: 62, network: 30 },
  { time: '04:00', cpu: 55, memory: 65, network: 35 },
  { time: '08:00', cpu: 75, memory: 78, network: 45 },
  { time: '12:00', cpu: 85, memory: 85, network: 55 },
  { time: '16:00', cpu: 70, memory: 72, network: 40 },
  { time: '20:00', cpu: 60, memory: 68, network: 35 },
  { time: '08:00', cpu: 75, memory: 78, network: 45 },
  { time: '00:00', cpu: 45, memory: 62, network: 30 },
  { time: '04:00', cpu: 55, memory: 65, network: 35 },
  { time: '08:00', cpu: 75, memory: 78, network: 45 },
  { time: '12:00', cpu: 85, memory: 85, network: 55 },
  { time: '16:00', cpu: 70, memory: 72, network: 40 },
  { time: '20:00', cpu: 60, memory: 68, network: 35 },
  { time: '08:00', cpu: 75, memory: 78, network: 45 },
  { time: '12:00', cpu: 85, memory: 85, network: 55 },
  { time: '16:00', cpu: 70, memory: 72, network: 40 },
  { time: '20:00', cpu: 60, memory: 68, network: 35 },
];

const QuickStatCard = ({ title, value, trend, trendUp, icon, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-semibold mt-1">{value}</p>
      </div>
    </div>
  );
};

const ResourceCard = ({ title, used, total, icon, color }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg p-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-slate-400 text-sm">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <div className="text-white font-medium">{used}</div>
          <div className="text-slate-500 text-sm">/ {total}</div>
        </div>
      </div>
    </div>
    <div className="mt-3 bg-slate-700/30 rounded-full h-2">
      <div 
        className={`h-full rounded-full ${color.replace('text-', 'bg-').replace('/10', '/70')}`} 
        style={{ width: `${(parseInt(used) / parseInt(total)) * 100}%` }}
      />
    </div>
  </div>
);

const DeploymentItem = ({ name, status, environment, timestamp }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${
        status === 'success' ? 'bg-green-500' : 
        status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
      }`} />
      <div>
        <p className="text-white font-medium">{name}</p>
        <p className="text-slate-400 text-sm">{environment}</p>
      </div>
    </div>
    <div className="text-slate-400 text-sm">{timestamp}</div>
  </div>
);

const DashboardView = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats Section */}
      <div className="grid grid-cols-4 gap-6">
        <QuickStatCard 
          title="Total Applications"
          value="24"
          trend="+3"
          trendUp={true}
          icon={<Box size={20} />}
          color="blue"
        />
        <QuickStatCard 
          title="Active Instances"
          value="142"
          trend="+12"
          trendUp={true}
          icon={<Cloud size={20} />}
          color="green"
        />
        <QuickStatCard 
          title="Critical Alerts"
          value="8"
          trend="-2"
          trendUp={false}
          icon={<Bell size={20} />}
          color="orange"
        />
        <QuickStatCard 
          title="Active Users"
          value="1.2k"
          trend="+8%"
          trendUp={true}
          icon={<Users size={20} />}
          color="purple"
        />
      </div>

      {/* Platform Health & Resources */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" />
                <Line type="monotone" dataKey="memory" stroke="#10b981" />
                <Line type="monotone" dataKey="network" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Resource Allocation</h3>
          <div className="grid gap-4">
            <ResourceCard
              title="CPU Usage"
              used="68"
              total="100"
              icon={<Cpu size={20} />}
              color="text-blue-500/10"
            />
            <ResourceCard
              title="Memory Usage"
              used="12"
              total="16"
              icon={<MemoryStick size={20} />}
              color="text-green-500/10"
            />
            <ResourceCard
              title="Storage Usage"
              used="1.8"
              total="2.0"
              icon={<HardDrive size={20} />}
              color="text-purple-500/10"
            />
          </div>
        </div>
      </div>

      {/* Recent Activity & Deployments */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Deployments</h3>
            <button className="text-slate-400 hover:text-white text-sm">View all</button>
          </div>
          <div className="divide-y divide-slate-800">
            <DeploymentItem
              name="frontend-service"
              status="success"
              environment="production"
              timestamp="5m ago"
            />
            <DeploymentItem
              name="auth-api"
              status="pending"
              environment="staging"
              timestamp="12m ago"
            />
            <DeploymentItem
              name="message-queue"
              status="failed"
              environment="development"
              timestamp="25m ago"
            />
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">System Events</h3>
            <button className="text-slate-400 hover:text-white text-sm">View all</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Activity size={16} />
              </div>
              <div>
                <p className="text-white">Auto-scaling triggered</p>
                <p className="text-slate-400 text-sm">frontend-service scaled to 5 instances</p>
                <p className="text-slate-500 text-sm mt-1">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Database size={16} />
              </div>
              <div>
                <p className="text-white">Database backup completed</p>
                <p className="text-slate-400 text-sm">Successfully backed up 1.2GB of data</p>
                <p className="text-slate-500 text-sm mt-1">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Network size={16} />
              </div>
              <div>
                <p className="text-white">Network latency alert</p>
                <p className="text-slate-400 text-sm">Increased latency detected in us-west region</p>
                <p className="text-slate-500 text-sm mt-1">32 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Regional Overview</h3>
            <button className="text-slate-400 hover:text-white text-sm">Manage</button>
          </div>
          <div className="space-y-4">
            {regionData.map((region) => (
              <div key={region.name} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-slate-400" />
                    <span className="text-white font-medium">{region.name}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    region.status === 'healthy' ? 'bg-green-500/10 text-green-500' : 
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {region.status}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-1">Instances</div>
                    <div className="text-white font-medium">{region.instances}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-1">CPU</div>
                    <div className="text-white font-medium">{region.cpu}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-400 text-xs mb-1">Memory</div>
                    <div className="text-white font-medium">{region.memory}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Service Mesh</h3>
            <button className="text-slate-400 hover:text-white text-sm">Details</button>
          </div>
          <div className="space-y-4">
            {serviceMetrics.map((service) => (
              <div key={service.service} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Share2 size={16} className="text-slate-400" />
                    <span className="text-white font-medium">{service.service}</span>
                  </div>
                  <div className="text-slate-400 text-sm">{service.uptime}% uptime</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-slate-900/50 rounded">
                    <div className="text-slate-400 mb-1">Latency</div>
                    <div className="text-white font-medium">{service.latency}ms</div>
                  </div>
                  <div className="text-center p-2 bg-slate-900/50 rounded">
                    <div className="text-slate-400 mb-1">Requests</div>
                    <div className="text-white font-medium">{service.requests}</div>
                  </div>
                  <div className="text-center p-2 bg-slate-900/50 rounded">
                    <div className="text-slate-400 mb-1">Errors</div>
                    <div className="text-white font-medium">{service.errors}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Security Center</h3>
            <button className="text-slate-400 hover:text-white text-sm">View All</button>
          </div>
          
          {/* Security Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Security Score</span>
              <span className="text-white font-medium">85/100</span>
            </div>
            <div className="h-2 bg-slate-700/30 rounded-full">
              <div className="h-full w-4/5 bg-green-500 rounded-full" />
            </div>
          </div>

          {/* Security Checks */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-slate-800/50 rounded-lg text-center">
              <Shield size={20} className="text-green-500 mx-auto mb-2" />
              <div className="text-white font-medium">24/24</div>
              <div className="text-slate-400 text-sm">Checks Passed</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg text-center">
              <AlertTriangle size={20} className="text-yellow-500 mx-auto mb-2" />
              <div className="text-white font-medium">2</div>
              <div className="text-slate-400 text-sm">Warnings</div>
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.type} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    event.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                    event.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {event.type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </p>
                    <p className="text-slate-400 text-xs">{event.count} occurrences</p>
                  </div>
                </div>
                <div className="text-slate-400 text-sm">{event.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container Orchestration */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Container Registry</h3>
            <button className="text-slate-400 hover:text-white text-sm">Browse Images</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-white">Staging Cluster</span>
              </div>
              <div className="text-slate-400">8 nodes</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-white">Development Cluster</span>
              </div>
              <div className="text-slate-400">4 nodes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Mesh and Networking */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Network Policies</h3>
            <button className="text-slate-400 hover:text-white text-sm">Configure</button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-green-500" />
                  <span className="text-white">Ingress Rules</span>
                </div>
                <span className="text-slate-400">12 active</span>
              </div>
              <div className="text-slate-400 text-sm">Last updated 2h ago</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-blue-500" />
                  <span className="text-white">Egress Rules</span>
                </div>
                <span className="text-slate-400">8 active</span>
              </div>
              <div className="text-slate-400 text-sm">Last updated 4h ago</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-purple-500" />
                  <span className="text-white">Security Groups</span>
                </div>
                <span className="text-slate-400">5 active</span>
              </div>
              <div className="text-slate-400 text-sm">Last updated 1d ago</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Load Balancers</h3>
            <button className="text-slate-400 hover:text-white text-sm">Manage</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Network size={16} className="text-green-500" />
                  <span className="text-white">Primary LB</span>
                </div>
                <div className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">Healthy</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Throughput</div>
                  <div className="text-white font-medium">1.2 GB/s</div>
                </div>
                <div>
                  <div className="text-slate-400">Connections</div>
                  <div className="text-white font-medium">8.5k</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Network size={16} className="text-blue-500" />
                  <span className="text-white">Secondary LB</span>
                </div>
                <div className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">Healthy</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Throughput</div>
                  <div className="text-white font-medium">800 MB/s</div>
                </div>
                <div>
                  <div className="text-slate-400">Connections</div>
                  <div className="text-white font-medium">5.2k</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Service Discovery</h3>
            <button className="text-slate-400 hover:text-white text-sm">View All</button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">Registered Services</span>
                <span className="text-slate-400">28</span>
              </div>
              <div className="h-1.5 bg-slate-700/30 rounded-full">
                <div className="h-full w-3/4 bg-green-500 rounded-full" />
              </div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">Health Checks</span>
                <span className="text-slate-400">96%</span>
              </div>
              <div className="h-1.5 bg-slate-700/30 rounded-full">
                <div className="h-full w-11/12 bg-blue-500 rounded-full" />
              </div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white">DNS Resolution</span>
                <span className="text-slate-400">99.9%</span>
              </div>
              <div className="h-1.5 bg-slate-700/30 rounded-full">
                <div className="h-full w-full bg-purple-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;