/**
 * Audit Log Entry Component
 * Displays a single audit log entry with expand/collapse functionality
 */

import React from 'react';
import { 
  Calendar, 
  User, 
  Activity, 
  Settings, 
  Server, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { 
  getUserName, 
  getResourceType, 
  getActionDisplay, 
  getSeverity, 
  getSeverityConfig, 
  getEventTypeFromAction, 
  formatTimestamp 
} from '@/utils/audit/auditUtils';

const AuditLogEntry = ({ 
  log, 
  isExpanded, 
  onToggleExpansion, 
  auditClient 
}) => {
  const severity = getSeverity(log.action);
  const severityConfig = getSeverityConfig(severity);

  return (
    <div>
      <div 
        className="px-4 py-3 flex items-start cursor-pointer" 
        onClick={() => onToggleExpansion(log.id)}
      >
        <div className="flex-none pt-1">
          {isExpanded ? (
            <ChevronDown size={16} className="text-slate-400" />
          ) : (
            <ChevronRight size={16} className="text-slate-400" />
          )}
        </div>
        
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-2 rounded-lg ${severityConfig.color}`}>
              <Activity size={16} />
            </div>
            <div className="text-sm font-medium text-white truncate">
              {getActionDisplay(log.action, log.resource_type, auditClient)}
            </div>
          </div>
          
          <div className="text-sm text-slate-400 truncate mb-1">
            {getResourceType(log.resource_type)} #{log.resource_id || 'N/A'}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatTimestamp(log.timestamp || log.created_at, auditClient)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{getUserName(log.user_id)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity size={14} />
              <span>{getEventTypeFromAction(log.action || '')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings size={14} />
              <span>{log.source || 'API'}</span>
            </div>
            {log.ip && (
              <div className="hidden md:flex items-center gap-1">
                <Server size={14} />
                <span className="font-mono">{log.ip}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-800">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-300 mb-1">Details</div>
              <div className="text-sm text-slate-400">
                {log.details || `${log.action || 'Action'} on ${log.resource_type || 'resource'} ${log.resource_id || ''}`}
              </div>
            </div>
            
            {/* Log Record JSON */}
            <div>
              <div className="text-sm font-medium text-slate-300 mb-2">Log Record</div>
              <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs">
                <pre className="text-slate-400">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-slate-500">Organization:</span>
                <span className="ml-2 text-slate-300">{log.org_id || 'N/A'}</span>
              </div>
              {log.ip && (
                <div>
                  <span className="text-slate-500">IP Address:</span>
                  <span className="ml-2 text-slate-300 font-mono">{log.ip}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500">Log ID:</span>
                <span className="ml-2 text-slate-300 font-mono">{log.id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogEntry;
