"use client"

import React from 'react';
import { 
  Clock, 
  User, 
  Tag, 
  Server, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical,
  Eye,
  FileText,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import EventTypeBadge from './EventTypeBadge';
import { ExpandableCard, IconButton } from '../components/ui';

/**
 * Audit Log Entry Component - Displays a single audit log entry with expandable details
 * Refactored to use the UI component library
 */
const AuditLogEntry = ({ log, expanded, onToggle }) => {
  // Get severity icon based on log severity
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'low':
        return <Info size={16} className="text-blue-400" />;
      default:
        return null;
    }
  };

  // Create metadata components for ExpandableCard
  const metadata = (
    <>
      <div className="flex items-center gap-1">
        <Clock size={12} />
        <span>{log.timestamp}</span>
      </div>
      <div className="flex items-center gap-1">
        <User size={12} />
        <span>{log.user}</span>
      </div>
      <div className="flex items-center gap-1">
        <Tag size={12} />
        <span>{log.resource}</span>
      </div>
      {log.ip && (
        <div className="hidden md:flex items-center gap-1">
          <Server size={12} />
          <span className="font-mono">{log.ip}</span>
        </div>
      )}
    </>
  );

  // Create actions component for ExpandableCard
  const actions = (
    <button className="p-1 text-slate-400 hover:text-slate-300">
      <MoreVertical size={16} />
    </button>
  );

  // Create expanded details content
  const details = (
    <div className="text-sm text-slate-300 space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Event ID</div>
          <div className="font-mono">{log.id}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Resource Type</div>
          <div>{log.resourceType}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Source</div>
          <div>{log.source}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Location</div>
          <div>{log.location}</div>
        </div>
      </div>
      
      {log.changes && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Changes</div>
          <div className="bg-slate-800 rounded p-2 font-mono text-xs overflow-x-auto">
            {typeof log.changes === 'string' ? log.changes : JSON.stringify(log.changes, null, 2)}
          </div>
        </div>
      )}
      
      {log.details && (
        <div>
          <div className="text-xs text-slate-500 mb-1">Additional Details</div>
          <div className="text-xs">{log.details}</div>
        </div>
      )}
    </div>
  );

  // Create expandedContent for ExpandableCard
  const expandedContent = (
    <div className="mt-3 flex justify-end gap-2">
      <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
        <Eye size={14} />
        <span>View Related Events</span>
      </button>
      <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
        <FileText size={14} />
        <span>Export</span>
      </button>
      <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
        <ExternalLink size={14} />
        <span>Open in SIEM</span>
      </button>
    </div>
  );

  console.log("The type of onToggle is: ", typeof onToggle);
  console.log("The type of log is: ", typeof log);
  console.log("The type of expanded is: ", typeof expanded);

  console.log("the value of log is: ", log);
  console.log("the value of expanded is: ", expanded);
  console.log("the value of onToggle is: ", onToggle);

  return (
    <ExpandableCard
      item={log}
      expanded={expanded}
      onToggle={onToggle}
      title={log.action}
      badge={<EventTypeBadge type={log.eventType} />}
      subtitle={null}
      metadata={metadata}
      actions={actions}
      details={details}
      expandedContent={expandedContent}
    />
  );
};

export { AuditLogEntry };