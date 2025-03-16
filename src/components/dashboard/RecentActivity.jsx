"use client"

import React from 'react';
import { AlertCircle, AlertTriangle, Layers, Box, Settings, Info, Rocket, Clock } from 'lucide-react';

export const RecentActivity = () => {
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
            <a href="/dash/audit" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
            </a>
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