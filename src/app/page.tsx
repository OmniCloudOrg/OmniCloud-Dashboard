"use client"
import React, { useState } from 'react';
import { Home, AppWindow, Settings, Server, Users, Bell, BarChart2, Terminal, ChevronLeft, Plus, Cloud, ArrowUpRight, MessageCircleWarning } from 'lucide-react';

const navigationItems = [
  { id: 'home', icon: Home, label: 'Dashboard', hoverColor: 'hover:text-blue-400' },
  { id: 'apps', icon: AppWindow, label: 'Applications', hoverColor: 'hover:text-blue-400' },
  { id: 'monitoring', icon: BarChart2, label: 'Monitoring', hoverColor: 'hover:text-blue-400' },
  { id: 'alerts', icon: MessageCircleWarning, label: 'Alerts', hoverColor: 'hover:text-blue-400' },
  { id: 'users', icon: Users, label: 'Users', hoverColor: 'hover:text-blue-400' },
  { id: 'notifications', icon: Bell, label: 'Notifications', hoverColor: 'hover:text-blue-400' },
  { id: 'settings', icon: Settings, label: 'Settings', hoverColor: 'hover:text-blue-400' }
];

const apps = [
  {
    id: 1,
    name: 'E-commerce API',
    status: 'Active',
    type: 'API Service',
    instances: [
      { id: 1, name: 'prod-1', status: 'running', region: 'us-east-1', memory: '2GB', cpu: '50%', uptime: '99.9%' },
      { id: 2, name: 'prod-2', status: 'running', region: 'us-west-1', memory: '2GB', cpu: '35%', uptime: '99.8%' }
    ]
  },
  {
    id: 2,
    name: 'Authentication Service',
    status: 'Active',
    type: 'Security',
    instances: [
      { id: 3, name: 'auth-1', status: 'running', region: 'us-east-1', memory: '1GB', cpu: '25%', uptime: '99.99%' },
      { id: 4, name: 'auth-2', status: 'stopped', region: 'eu-west-1', memory: '1GB', cpu: '0%', uptime: '0%' }
    ]
  }
];

const ModernCloudPanel = () => {
  const [activeSection, setActiveSection] = useState('apps');
  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <nav className="w-64 border-r border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-8">
          <Cloud className="text-blue-400" size={24} />
          <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">Omni Dashboard</h1>
        </div>
        
        <ul className="space-y-1">
          {navigationItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  setSelectedApp(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${activeSection === item.id 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-blue-400'}`}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {selectedApp ? (
            <>
              {/* App Detail Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedApp.name}</h2>
                    <p className="text-sm text-slate-400">{selectedApp.type}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Plus size={18} />
                  New Instance
                </button>
              </div>

              <div className="grid gap-6">
                {/* Status Overview */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Total Instances</h3>
                    <p className="text-2xl font-semibold text-white">{selectedApp.instances.length}</p>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Active Instances</h3>
                    <p className="text-2xl font-semibold text-white">
                      {selectedApp.instances.filter(i => i.status === 'running').length}
                    </p>
                  </div>
                  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Average Uptime</h3>
                    <p className="text-2xl font-semibold text-white">99.9%</p>
                  </div>
                </div>

                {/* Instances */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Instance Overview</h3>
                  <div className="space-y-4">
                    {selectedApp.instances.map(instance => (
                      <div key={instance.id} 
                        className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white">{instance.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border shadow-lg
                                ${instance.status === 'running' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-emerald-500/20' 
                                  : 'bg-red-500/10 text-red-400 border-red-500 shadow-red-500/20'}`}>
                                {instance.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400">Region: {instance.region}</p>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-sm space-y-1">
                              <div className="text-slate-400">CPU: <span className="text-white">{instance.cpu}</span></div>
                              <div className="text-slate-400">Memory: <span className="text-white">{instance.memory}</span></div>
                            </div>
                            <button className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 transition-colors">
                              <ArrowUpRight size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Settings */}
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Quick Settings</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-10 h-6 bg-slate-700 rounded-full peer peer-checked:bg-blue-500"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-4"></div>
                        </div>
                        <span className="text-sm font-medium text-white">Auto Scaling</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Environment</label>
                      <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                        <option>Production</option>
                        <option>Staging</option>
                        <option>Development</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Apps Grid */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-white">Applications</h2>
                <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  <Plus size={18} />
                  New Application
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-left hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500 shadow-lg shadow-emerald-500/20">
                        {app.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">{app.type}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{app.instances.length} Instances</span>
                        <span className="text-blue-400">View Details →</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModernCloudPanel;