"use client"

import React from 'react';
import { 
  Activity, 
  Zap, 
  AlertCircle, 
  GitBranch, 
  Clock, 
  Eye
} from 'lucide-react';
import { 
  DashboardGrid, 
  DashboardSection, 
  StatsCard,
  DetailItem
} from '../../components/ui';

/**
 * Application Overview Tab Component
 * Refactored to use the UI component library
 */
const ApplicationOverview = ({ app }) => {
  const stats = [
    { label: 'Uptime', value: '99.99%', icon: Activity, color: 'blue' },
    { label: 'Response Time', value: '243ms', icon: Zap, color: 'green' },
    { label: 'Error Rate', value: '0.01%', icon: AlertCircle, color: 'red' },
    { label: 'Deployments', value: app.deployments || 23, icon: GitBranch, color: 'purple' }
  ];
  
  // Sample environment variables - in a real app these would come from the API
  const envVars = [
    { key: 'NODE_ENV', value: 'production' },
    { key: 'API_URL', value: 'https://api.example.com' },
    { key: 'LOG_LEVEL', value: 'info' },
    { key: 'DATABASE_URL', value: '********' }
  ];

  // Sample recent activities
  const recentActivities = [
    {
      title: 'Deployment Completed',
      description: 'Version v1.2.3 was successfully deployed',
      time: '2 days ago',
      user: 'john.doe',
      icon: GitBranch
    },
    {
      title: 'Deployment Completed',
      description: 'Version v1.2.2 was successfully deployed',
      time: '4 days ago',
      user: 'john.doe',
      icon: GitBranch
    },
    {
      title: 'Deployment Completed',
      description: 'Version v1.2.1 was successfully deployed',
      time: '6 days ago',
      user: 'john.doe',
      icon: GitBranch
    }
  ];
  
  return (
    <div className="space-y-8">
      <DashboardGrid columns={4}>
        {stats.map((stat, idx) => (
          <StatsCard
            key={idx}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </DashboardGrid>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSection title="Application Details">
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
        </DashboardSection>
        
        <DashboardSection 
          title="Environment Variables"
          actionLabel="Edit"
          onAction={() => console.log('Edit environment variables')}
        >
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
        </DashboardSection>
      </div>
      
      <DashboardSection 
        title="Recent Activity"
        actionLabel="View All"
        onAction={() => console.log('View all activities')}
      >
        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 border-b border-slate-700/50 last:border-0">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg mt-1">
                <activity.icon size={16} />
              </div>
              <div>
                <div className="font-medium text-white">{activity.title}</div>
                <div className="text-sm text-slate-400 mt-1">{activity.description}</div>
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <Clock size={12} className="mr-1" /> {activity.time} • by {activity.user}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardSection>
    </div>
  );
};

export default ApplicationOverview;