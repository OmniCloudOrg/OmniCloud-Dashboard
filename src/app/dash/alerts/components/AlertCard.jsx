"use client"

import React from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreVertical, 
  Clock, 
  Server, 
  Activity, 
  User,
  Play,
  Terminal,
  CheckCircle,
  Share
} from 'lucide-react';
import { SeverityBadge } from '../../../../components/ui';

// Alert Card Component
export const AlertCard = ({ alert, expanded, onToggle, apiBaseUrl }) => {
  // Function to resolve alert
  const resolveAlert = async () => {
    try {
      // This would be the implementation to call the API to resolve an alert
      // For now it's a placeholder
      console.log(`Resolving alert ${alert.id} via ${apiBaseUrl}/alerts/${alert.id}/resolve`);
      // In a real implementation, you would refresh the alerts list after resolving
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  // Function to acknowledge alert
  const acknowledgeAlert = async () => {
    try {
      // This would be the implementation to call the API to acknowledge an alert
      console.log(`Acknowledging alert ${alert.id} via ${apiBaseUrl}/alerts/${alert.id}/acknowledge`);
      // In a real implementation, you would refresh the alerts list after acknowledging
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };
  
  return (
    <div 
      className={`border-b border-slate-800 ${expanded ? 'bg-slate-800/30' : 'hover:bg-slate-800/20'}`}
    >
      <div 
        className="px-4 py-3 flex items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-none pt-1">
          {expanded ? 
            <ChevronDown size={16} className="text-slate-400" /> : 
            <ChevronRight size={16} className="text-slate-400" />
          }
        </div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <SeverityBadge severity={alert.severity} />
            <div className="text-sm font-medium text-white truncate">{alert.title}</div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{alert.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Server size={12} />
              <span>{alert.source}</span>
            </div>
            {alert.service && (
              <div className="flex items-center gap-1">
                <Activity size={12} />
                <span>{alert.service}</span>
              </div>
            )}
            {alert.assignee && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{alert.assignee}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none flex items-center">
          <button className="p-1 text-slate-400 hover:text-slate-300">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-10 pb-4">
          <div className="bg-slate-900 p-4 rounded-lg">
            <div className="text-sm text-slate-300 whitespace-pre-line mb-4">
              {alert.description}
            </div>
            
            {alert.data && (
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto mb-4">
                {typeof alert.data === 'string' ? alert.data : JSON.stringify(alert.data, null, 2)}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Alert ID</div>
                <div className="text-slate-300 font-mono">{alert.id}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Alert Type</div>
                <div className="text-slate-300">{alert.rule || 'Manual Alert'}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">First Detected</div>
                <div className="text-slate-300">{alert.firstDetected || alert.timestamp}</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Status</div>
                <div className="text-slate-300 capitalize">{alert.status}</div>
              </div>
              {alert.resolvedAt && (
                <>
                  <div>
                    <div className="text-slate-500 mb-1">Resolved At</div>
                    <div className="text-slate-300">{alert.resolvedAt}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Resolved By</div>
                    <div className="text-slate-300">{alert.resolvedBy || 'System'}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1">
                <Play size={14} />
                <span>Runbook</span>
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1">
                <Terminal size={14} />
                <span>View Logs</span>
              </button>
            </div>
            
            <div className="flex gap-2">
              {(alert.status !== 'resolved' && alert.status !== 'auto_resolved') && (
                <>
                  {alert.status !== 'acknowledged' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeAlert();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      <span>Acknowledge</span>
                    </button>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      resolveAlert();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 text-xs flex items-center gap-1"
                  >
                    <CheckCircle size={14} />
                    <span>Resolve</span>
                  </button>
                </>
              )}
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1">
                <Share size={14} />
                <span>Escalate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};