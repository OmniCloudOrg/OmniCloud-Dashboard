"use client"

import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export const AlertsOverview = () => {
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
            <a href="/dash/alerts" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
            </a>
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

export default AlertsOverview;