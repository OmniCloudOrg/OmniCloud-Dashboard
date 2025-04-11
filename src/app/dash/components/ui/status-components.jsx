"use client"

import React from 'react';
import { Check, X, RefreshCw, AlertTriangle, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

/**
 * StatusBadge - A reusable status badge component with icons
 * Used across dashboard pages for displaying status with icons
 */
export const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'active':
      case 'verified':
      case 'success':
      case 'resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'stopped':
      case 'inactive':
      case 'unverified':
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'provisioning':
      case 'deploying':
      case 'pending':
      case 'in progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'running':
      case 'active':
      case 'verified':
      case 'success':
      case 'resolved':
        return <Check size={14} />;
      case 'stopped':
      case 'inactive':
      case 'unverified':
      case 'failed':
        return <X size={14} />;
      case 'provisioning':
      case 'deploying':
      case 'pending':
      case 'in progress':
        return <RefreshCw size={14} className="animate-spin" />;
      case 'warning':
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="capitalize">{status}</span>
    </div>
  );
};

/**
 * LogLevelBadge - A reusable badge component for log levels
 * Used in log management dashboard
 */
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
      icon = <Code size={14} />;
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

/**
 * SeverityBadge - A reusable badge component for alert severity
 * Used in alerts management dashboard
 */
export const SeverityBadge = ({ severity }) => {
  let bgColor, textColor, icon;
  
  switch (severity.toLowerCase()) {
    case 'critical':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <AlertCircle size={14} />;
      break;
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
    case 'resolved':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="capitalize">{severity}</span>
    </div>
  );
};

/**
 * ProgressBar - A reusable progress bar component
 * Used for resource usage indicators across dashboard pages
 */
export const ProgressBar = ({ 
  value, 
  max = 100, 
  showLabel = true,
  size = "md",
  status = 'active'
}) => {
  const percent = Math.min(Math.max(0, value), max) / max * 100;
  
  const getColorClass = (percent) => {
    if (status === 'stopped' || status === 'inactive') {
      return 'bg-slate-500';
    }
    
    if (percent < 50) {
      return 'bg-green-500';
    } else if (percent < 80) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };
  
  const heightClass = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  }[size] || 'h-1.5';
  
  return (
    <div className="flex items-center">
      <div className={`w-full bg-slate-800 rounded-full ${heightClass} mr-2`}>
        <div 
          className={`${heightClass} rounded-full ${getColorClass(percent)}`}
          style={{ width: `${status === 'stopped' || status === 'inactive' ? 0 : percent}%` }}
        ></div>
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400">{status === 'stopped' || status === 'inactive' ? '0' : Math.round(percent)}%</span>
      )}
    </div>
  );
};

// Helper icons needed for components
const Code = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
};

const Activity = ({ size, className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
};