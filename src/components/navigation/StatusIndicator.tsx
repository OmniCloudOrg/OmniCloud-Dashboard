import React, { useState, useRef, useEffect } from 'react';
import { StatusIndicatorProps, StatusMetrics } from '../../types';
import { createPortal } from 'react-dom';

/**
 * Status indicator component with floating tooltip for system health
 * Tooltip is rendered in a portal to avoid containment issues
 */
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
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
  
  // Calculate tooltip position based on indicator position
  useEffect(() => {
    if (!showTooltip || !indicatorRef.current) return;
    
    const updatePosition = () => {
      if (!indicatorRef.current) return;
      
      const rect = indicatorRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // w-80 = 20rem = 320px
      
      // Position the tooltip to the right of the indicator by default
      let left = rect.right + 8;
      let top = rect.top - 4;
      
      // Check if the tooltip would go off the right edge of the viewport
      if (left + tooltipWidth > window.innerWidth) {
        // Position to the left instead
        left = rect.left - tooltipWidth - 8;
      }
      
      // Check if tooltip would go off the bottom of the viewport
      const tooltipHeight = tooltipRef.current?.offsetHeight || 180;
      if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight - 12;
      }
      
      // Make sure tooltip doesn't go above the viewport
      if (top < 12) {
        top = 12;
      }
      
      setTooltipPosition({ top, left });
    };
    
    updatePosition();
    
    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showTooltip]);

  // Create tooltip component to be rendered in portal
  const Tooltip = () => {
    if (!showTooltip) return null;
    
    return createPortal(
      <div 
        ref={tooltipRef}
        className="fixed z-50 w-80 bg-slate-900 rounded-lg shadow-xl p-4 
                  border border-slate-700 backdrop-blur-sm
                  transition-opacity duration-200
                  animate-fadeIn"
        style={{ 
          top: `${tooltipPosition.top}px`, 
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="font-medium text-white mb-3 text-base border-b border-slate-700 pb-2">System Health Status</div>
        
        <div className="space-y-3 text-slate-300">
          {/* Overview Section */}
          <div className="mb-2">
            <div className="text-sm font-medium mb-1 text-slate-200">Status Overview</div>
            <p className="text-xs text-slate-400 mb-2">
              System health monitoring as of {new Date().toLocaleTimeString()} on {new Date().toLocaleDateString()}
            </p>
            
            <div className={`text-sm p-2 rounded border ${
              status === 'critical' ? 'border-red-800 bg-red-950/30 text-red-200' : 
              status === 'warning' ? 'border-amber-800 bg-amber-950/30 text-amber-200' : 
              'border-green-800 bg-green-950/30 text-green-200'
            }`}>
              {status === 'critical' ? 'Critical issues detected. Immediate attention required.' :
               status === 'warning' ? 'Performance degradation detected. Monitor closely.' :
               'All systems operating within normal parameters.'}
            </div>
          </div>
          
          {/* Metrics Section */}
          <div>
            <div className="text-sm font-medium mb-2 text-slate-200">Performance Metrics</div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Ping:</span>
                  <span className={`font-medium text-sm ${
                    status === 'critical' ? 'text-red-400' : 
                    status === 'warning' ? 'text-amber-400' : 
                    'text-green-400'
                  }`}>{metrics.ping}</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    status === 'critical' ? 'bg-red-500' : 
                    status === 'warning' ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`} style={{ width: status === 'critical' ? '90%' : status === 'warning' ? '50%' : '20%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Uptime:</span>
                  <span className="font-medium text-sm">{metrics.uptime}</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-blue-500`} 
                    style={{ width: `${parseFloat(metrics.uptime.replace('%', ''))}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">CPU:</span>
                  <span className="font-medium text-sm">{metrics.cpu}</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    parseInt(metrics.cpu) > 80 ? 'bg-red-500' : 
                    parseInt(metrics.cpu) > 60 ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`} style={{ width: metrics.cpu }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Memory:</span>
                  <span className="font-medium text-sm">{metrics.memory}</span>
                </div>
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    parseInt(metrics.memory) > 80 ? 'bg-red-500' : 
                    parseInt(metrics.memory) > 60 ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`} style={{ width: metrics.memory }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Services Section */}
          <div>
            <div className="text-sm font-medium mb-1 text-slate-200">Service Status</div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-xs">Operational:</span>
              <span className={`font-medium text-sm ${
                status === 'critical' ? 'text-red-400' : 
                status === 'warning' ? 'text-amber-400' : 
                'text-green-400'
              }`}>{metrics.services}</span>
            </div>
            <div className="mt-1 mb-2 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${
                status === 'critical' ? 'bg-red-500' : 
                status === 'warning' ? 'bg-amber-500' : 
                'bg-green-500'
              }`} style={{ 
                width: `${parseInt(metrics.services.split('/')[0]) / parseInt(metrics.services.split('/')[1]) * 100}%` 
              }}></div>
            </div>
            
            {/* Add maintenance info based on status */}
            {status !== 'healthy' && (
              <div className={`text-xs p-2 rounded ${
                status === 'critical' ? 'bg-red-950/30 text-red-200' : 
                'bg-amber-950/30 text-amber-200'
              }`}>
                {status === 'critical' 
                  ? 'Emergency maintenance in progress. ETA: 45min' 
                  : 'Scheduled maintenance window: Today, 2:00 AM UTC'}
              </div>
            )}
          </div>
          
          {/* Recommendations */}
          <div className="border-t border-slate-700 pt-2">
            <div className="text-xs text-slate-400">
              {status === 'critical' 
                ? 'Please contact your system administrator immediately.' 
                : status === 'warning'
                ? 'Consider scaling resources if this persists.'
                : 'System is running optimally.'}
            </div>
          </div>
        </div>
        
        {/* Arrow pointer */}
        <div 
          className="absolute w-2 h-2 bg-slate-800 rotate-45 border-slate-700"
          style={{
            right: tooltipPosition.left > window.innerWidth / 2 ? 'calc(100% - 1px)' : 'auto',
            left: tooltipPosition.left > window.innerWidth / 2 ? 'auto' : 'calc(100% - 1px)',
            top: '12px',
            borderWidth: tooltipPosition.left > window.innerWidth / 2 ? '1px 0 0 1px' : '0 1px 1px 0'
          }}
        ></div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div 
        ref={indicatorRef}
        className="relative flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} transition-all duration-300 shadow-sm shadow-current`} />
        <span className="text-sm font-medium capitalize">{status}</span>
      </div>
      
      <Tooltip />
      
      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default StatusIndicator;