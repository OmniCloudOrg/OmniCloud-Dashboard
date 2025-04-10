"use client"

import React from 'react';
import { 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  MoreVertical, 
  Copy, 
  Bookmark, 
  Share,
  Server,
  User,
  Zap,
  AlertCircle,
  AlertTriangle,
  Info,
  Terminal,
  Activity,
  CheckCircle
} from 'lucide-react';

// Log Level Badge Component
export const LogLevelBadge = ({ level }) => {
  let bgColor, textColor, icon;
  
  switch (level.toLowerCase()) {
    case 'error':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <AlertCircle size={14} />;
      break;
    case 'warn':
    case 'warning':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    case 'info':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <Info size={14} />;
      break;
    case 'debug':
      bgColor = 'bg-purple-500/10';
      textColor = 'text-purple-400';
      icon = <Terminal size={14} />;
      break;
    case 'trace':
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = <Activity size={14} />;
      break;
    default:
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="uppercase">{level}</span>
    </div>
  );
};

// Log Entry Component
export const LogEntry = ({ log, expanded, onToggle }) => {
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
            <LogLevelBadge level={log.level} />
            <div className="text-sm font-medium text-white truncate">{log.message}</div>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{log.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <Server size={12} />
              <span>{log.service}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{log.user || 'system'}</span>
            </div>
            {log.requestId && (
              <div className="hidden md:flex items-center gap-1">
                <Zap size={12} />
                <span className="font-mono">{log.requestId}</span>
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
          <div className="bg-slate-900 p-4 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
              <Copy size={14} />
              <span>Copy</span>
            </button>
            <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
              <Bookmark size={14} />
              <span>Save</span>
            </button>
            <button className="text-slate-400 hover:text-slate-300 text-xs flex items-center gap-1">
              <Share size={14} />
              <span>Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helpful utility components for logs
export const LogContextMenu = ({ log, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
      <div className="py-1">
        <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
          <Copy size={14} />
          Copy Log Details
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
          <Bookmark size={14} />
          Save to Favorites
        </button>
        <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2">
          <Terminal size={14} />
          View Raw Log
        </button>
        <div className="border-t border-slate-700 my-1"></div>
        <button 
          onClick={onClose}
          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
        >
          <AlertCircle size={14} />
          Report Issue
        </button>
      </div>
    </div>
  );
};

export default {
  LogLevelBadge,
  LogEntry,
  LogContextMenu
};