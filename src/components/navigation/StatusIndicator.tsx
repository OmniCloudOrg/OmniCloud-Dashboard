import React from 'react';
import { StatusIndicatorProps, StatusMetrics } from '../../types';

/**
 * Status indicator component with tooltip for system health
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Health metrics to display in tooltip
  const healthMetrics: Record<string, StatusMetrics> = {
    healthy: {
      ping: '18ms',
      uptime: '99.99%',
      cpu: '23%',
      memory: '41%',
      services: '47/47 operational',
    },
    warning: {
      ping: '86ms',
      uptime: '99.82%',
      cpu: '78%',
      memory: '62%',
      services: '45/47 operational',
    },
    critical: {
      ping: '320ms',
      uptime: '95.4%',
      cpu: '92%',
      memory: '87%',
      services: '39/47 operational',
    },
    unknown: {
      ping: 'N/A',
      uptime: 'N/A',
      cpu: 'N/A',
      memory: 'N/A',
      services: 'N/A',
    }
  };

  const metrics = healthMetrics[status] || healthMetrics.unknown;

  return (
    <div className="group relative flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} transition-all duration-300 shadow-sm shadow-current`} />
      <span className="text-sm font-medium capitalize">{status}</span>
      
      {/* Tooltip - appears on hover */}
      <div className="absolute left-full top-0 ml-2 w-52 bg-slate-800 rounded-lg shadow-xl p-3 
                      invisible group-hover:visible opacity-0 group-hover:opacity-100 
                      transition-all duration-200 z-10 text-xs
                      border border-slate-700 backdrop-blur-sm">
        <div className="font-medium text-white mb-2">System Health</div>
        
        <div className="space-y-2 text-slate-300">
          <div className="flex justify-between items-center">
            <span>Ping:</span>
            <span className={`font-medium ${
              status === 'critical' ? 'text-red-400' : 
              status === 'warning' ? 'text-amber-400' : 
              'text-green-400'
            }`}>{metrics.ping}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Uptime:</span>
            <span className="font-medium">{metrics.uptime}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span>CPU:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  parseInt(metrics.cpu) > 80 ? 'bg-red-500' : 
                  parseInt(metrics.cpu) > 60 ? 'bg-amber-500' : 
                  'bg-green-500'
                }`} style={{ width: metrics.cpu }}></div>
              </div>
              <span className="font-medium">{metrics.cpu}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Memory:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  parseInt(metrics.memory) > 80 ? 'bg-red-500' : 
                  parseInt(metrics.memory) > 60 ? 'bg-amber-500' : 
                  'bg-green-500'
                }`} style={{ width: metrics.memory }}></div>
              </div>
              <span className="font-medium">{metrics.memory}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span>Services:</span>
            <span className={`font-medium ${
              status === 'critical' ? 'text-red-400' : 
              status === 'warning' ? 'text-amber-400' : 
              'text-green-400'
            }`}>{metrics.services}</span>
          </div>
        </div>
        
        {/* Arrow pointer */}
        <div className="absolute right-full top-2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
      </div>
    </div>
  );
};

export default StatusIndicator;