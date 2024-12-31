"use client"
import React, { useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Home, AppWindow, Settings, Users, Bell, BarChart2, MessageCircleWarning, Plus, ChevronLeft, ArrowUpRight, Activity, BarChart, User } from 'lucide-react';

// Core components
import { Navigation } from '../components/Navigation';

// Screens
import AppList from '../components/AppList';

// 'Applications' Screen Components
import { StatusOverview } from '../components/AppScreen/StatusOverview';
import { InstanceMetrics } from '../components/AppScreen/InstanceMetrics';
import { InstanceControls } from '../components/AppScreen/InstanceControls';
import { Config } from '../components/AppScreen/AppConfig';

// 'Alerts' Screen Components
import AlertsView from '../components/AlertList';

// 'Monitoring' Screen Components
import MonitoringView from '../components/Monitoring';

// 'Users' Screen Components
import UserList from '../components/UserList';

// 'Settings' Screen Components
import SettingsView from '../components/PlatformSettings';

// Navigation items configuration
const navigationItems = [
  { id: 'home', icon: Home, label: 'Dashboard' },
  { id: 'apps', icon: AppWindow, label: 'Applications' },
  { id: 'monitoring', icon: BarChart2, label: 'Monitoring' },
  { id: 'alerts', icon: MessageCircleWarning, label: 'Alerts' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'settings', icon: Settings, label: 'Settings' }
];

// Mock data generators
const generateMetricsData = (hours = 24) => {
  return Array.from({ length: hours }, (_, i) => ({
    time: `${i}:00`,
    cpu: Math.floor(Math.random() * 40 + 30),
    memory: Math.floor(Math.random() * 30 + 40),
    requests: Math.floor(Math.random() * 1000 + 500),
  }));
};

// Sample apps data
const apps = [
  {
    id: 1,
    name: 'E-commerce API',
    status: 'Active',
    type: 'API Service',
    autoScaling: true,
    minInstances: 2,
    maxInstances: 6,
    targetCPU: 70,
    instances: [
      { 
        id: 1, 
        name: 'prod-1', 
        status: 'running', 
        region: 'us-east-1', 
        memory: '2GB', 
        cpu: '50%', 
        uptime: '99.9%', 
        metrics: generateMetricsData() 
      },
      { 
        id: 2, 
        name: 'prod-2', 
        status: 'running', 
        region: 'us-west-1', 
        memory: '2GB', 
        cpu: '35%', 
        uptime: '99.8%', 
        metrics: generateMetricsData() 
      }
    ]
  },
  {
    id: 2,
    name: 'Authentication Service',
    status: 'Active',
    type: 'Security',
    autoScaling: false,
    minInstances: 1,
    maxInstances: 4,
    targetCPU: 80,
    instances: [
      { 
        id: 3, 
        name: 'auth-1', 
        status: 'running',
        region: 'us-east-1', 
        memory: '1GB', 
        cpu: '25%', 
        uptime: '99.99%', 
        metrics: generateMetricsData() 
      },
      { 
        id: 4, 
        name: 'auth-2', 
        status: 'stopped', 
        region: 'eu-west-1', 
        memory: '1GB', 
        cpu: '0%', 
        uptime: '0%', 
        metrics: generateMetricsData() 
      }
    ]
  }
];

// Section Components
const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-6">
      <QuickStatCard 
        title="Total Apps"
        value="24"
        trend="+3"
        trendUp={true}
        icon={<Activity size={20} />}
        color="blue"
      />
      <QuickStatCard 
        title="Active Instances"
        value="142"
        trend="+12"
        trendUp={true}
        icon={<BarChart size={20} />}
        color="green"
      />
      <QuickStatCard 
        title="Alert Events"
        value="8"
        trend="-2"
        trendUp={false}
        icon={<Activity size={20} />}
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
    
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
        {/* System health metrics here */}
      </div>
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Resource Usage</h3>
        {/* Resource usage chart here */}
      </div>
    </div>
  </div>
);

const AppDetailView = ({ app, onBack, onInstanceAction, onScalingUpdate, selectedInstance, setSelectedInstance }) => (
  <>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-white">{app.name}</h2>
          <p className="text-sm text-slate-400">{app.type}</p>
        </div>
      </div>
      <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
        <Plus size={18} />
        New Instance
      </button>
    </div>

    <div className="grid gap-6">
      <StatusOverview app={app} />
      <Config app={app} onUpdate={onScalingUpdate} />
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Instance Overview</h3>
        <div className="space-y-4">
          {app.instances.map(instance => (
            <div key={instance.id} 
              className={`bg-slate-800/50 border rounded-xl p-4 transition-colors
                ${selectedInstance?.id === instance.id 
                  ? 'border-blue-500/50' 
                  : 'border-slate-700/50 hover:border-blue-500/50'}`}
            >
              <div className="flex justify-between items-center mb-4">
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
                <div className="flex items-center gap-4">
                  <div className="text-sm space-y-1">
                    <div className="text-slate-400">CPU: <span className="text-white">{instance.cpu}</span></div>
                    <div className="text-slate-400">Memory: <span className="text-white">{instance.memory}</span></div>
                  </div>
                  <InstanceControls 
                    instance={instance}
                    onAction={onInstanceAction}
                    onSelect={setSelectedInstance}
                    isSelected={selectedInstance?.id === instance.id}
                  />
                </div>
              </div>
              
              {selectedInstance?.id === instance.id && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <InstanceMetrics instance={instance} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const NotificationsView = () => (
  <div className="space-y-6">
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">System Notifications</h3>
      {/* Add notifications content */}
    </div>
  </div>
);

// Helper Components
const QuickStatCard = ({ title, value, trend, trendUp, icon, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend}
          <ArrowUpRight size={16} className={!trendUp ? 'rotate-180' : ''} />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold text-white">{value}</h3>
        <p className="text-sm text-slate-400">{title}</p>
      </div>
    </div>
  );
};

const ModernCloudPanel = () => {
  const [activeSection, setActiveSection] = useState('apps');
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedInstance, setSelectedInstance] = useState(null);

  const handleInstanceAction = (instance, action) => {
    console.log(`Performing ${action} on instance ${instance.name}`);
  };

  const handleScalingUpdate = (settings) => {
    console.log('Updating scaling settings:', settings);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setSelectedApp(null);
    setSelectedInstance(null);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <DashboardView />;
      case 'apps':
        return selectedApp ? (
          <AppDetailView 
            app={selectedApp}
            onBack={() => setSelectedApp(null)}
            onInstanceAction={handleInstanceAction}
            onScalingUpdate={handleScalingUpdate}
            selectedInstance={selectedInstance}
            setSelectedInstance={setSelectedInstance}
          />
        ) : (
          <AppList apps={apps} onSelectApp={setSelectedApp} />
        );
      case 'monitoring':
        return <MonitoringView />;
      case 'alerts':
        return <AlertsView />;
      case 'users':
        return <UserList />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Navigation 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        navigationItems={navigationItems}
      />

      <main className="flex-1 overflow-auto">
      <ThemeSwitcher />
        <div className="max-w-7xl mx-auto p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default ModernCloudPanel;