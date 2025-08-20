"use client"

import React from 'react';
import { 
  Check, X, Clock, RefreshCw, CheckCircle, AlertCircle, 
  AlertTriangle, Info, Loader, Pause, Play
} from 'lucide-react';

/**
 * Enhanced StatusBadge Component
 * Consolidates StatusBadge, StackStatusBadge, and SeverityBadge implementations
 */
export const StatusBadge = ({ 
  status, 
  variant = 'default',
  size = 'sm',
  showIcon = true,
  className = ''
}) => {
  let bgColor, textColor, borderColor, icon, displayText;
  
  // Normalize status for processing
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';
  
  // Define status mappings based on variant
  if (variant === 'severity') {
    // Severity variant (for alerts, security findings)
    switch (normalizedStatus) {
      case 'critical':
        bgColor = 'bg-red-500/10';
        textColor = 'text-red-400';
        borderColor = 'border-red-500/20';
        icon = <AlertCircle size={14} />;
        displayText = 'Critical';
        break;
      case 'high':
        bgColor = 'bg-red-500/10';
        textColor = 'text-red-400';
        borderColor = 'border-red-500/20';
        icon = <AlertCircle size={14} />;
        displayText = 'High';
        break;
      case 'warning':
      case 'medium':
        bgColor = 'bg-yellow-500/10';
        textColor = 'text-yellow-400';
        borderColor = 'border-yellow-500/20';
        icon = <AlertTriangle size={14} />;
        displayText = normalizedStatus === 'medium' ? 'Medium' : 'Warning';
        break;
      case 'low':
        bgColor = 'bg-blue-500/10';
        textColor = 'text-blue-400';
        borderColor = 'border-blue-500/20';
        icon = <Info size={14} />;
        displayText = 'Low';
        break;
      case 'info':
        bgColor = 'bg-blue-500/10';
        textColor = 'text-blue-400';
        borderColor = 'border-blue-500/20';
        icon = <Info size={14} />;
        displayText = 'Info';
        break;
      case 'resolved':
        bgColor = 'bg-green-500/10';
        textColor = 'text-green-400';
        borderColor = 'border-green-500/20';
        icon = <CheckCircle size={14} />;
        displayText = 'Resolved';
        break;
      default:
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        borderColor = 'border-slate-500/20';
        icon = <Info size={14} />;
        displayText = status;
    }
  } else if (variant === 'stack') {
    // Stack status variant (for CloudFormation, infrastructure)
    switch (normalizedStatus) {
      case 'create_complete':
      case 'update_complete':
        bgColor = 'bg-green-500/10';
        textColor = 'text-green-400';
        borderColor = 'border-green-500/20';
        icon = <CheckCircle size={14} />;
        displayText = normalizedStatus.replace('_', ' ').toUpperCase();
        break;
      case 'create_in_progress':
      case 'update_in_progress':
      case 'delete_in_progress':
        bgColor = 'bg-blue-500/10';
        textColor = 'text-blue-400';
        borderColor = 'border-blue-500/20';
        icon = <RefreshCw size={14} className="animate-spin" />;
        displayText = normalizedStatus.replace('_', ' ').toUpperCase();
        break;
      case 'create_failed':
      case 'update_failed':
      case 'delete_failed':
      case 'rollback_failed':
        bgColor = 'bg-red-500/10';
        textColor = 'text-red-400';
        borderColor = 'border-red-500/20';
        icon = <AlertCircle size={14} />;
        displayText = normalizedStatus.replace('_', ' ').toUpperCase();
        break;
      case 'rollback_in_progress':
      case 'update_rollback_in_progress':
        bgColor = 'bg-orange-500/10';
        textColor = 'text-orange-400';
        borderColor = 'border-orange-500/20';
        icon = <RefreshCw size={14} className="animate-spin" />;
        displayText = normalizedStatus.replace('_', ' ').toUpperCase();
        break;
      default:
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        borderColor = 'border-slate-500/20';
        icon = <Info size={14} />;
        displayText = typeof status === 'string' ? status.replace('_', ' ').toUpperCase() : status;
    }
  } else {
    // Default variant (for general statuses)
    switch (normalizedStatus) {
      case 'running':
      case 'active':
      case 'in_progress':
        bgColor = 'bg-blue-500/10';
        textColor = 'text-blue-400';
        borderColor = 'border-blue-500/20';
        icon = <RefreshCw size={12} className="animate-spin" />;
        displayText = normalizedStatus.replace('_', ' ');
        break;
      case 'success':
      case 'successful':
      case 'completed':
      case 'healthy':
        bgColor = 'bg-green-500/10';
        textColor = 'text-green-400';
        borderColor = 'border-green-500/20';
        icon = <Check size={12} />;
        displayText = normalizedStatus;
        break;
      case 'failed':
      case 'error':
      case 'unhealthy':
        bgColor = 'bg-red-500/10';
        textColor = 'text-red-400';
        borderColor = 'border-red-500/20';
        icon = <X size={12} />;
        displayText = normalizedStatus;
        break;
      case 'pending':
      case 'queued':
      case 'waiting':
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        borderColor = 'border-slate-500/20';
        icon = <Clock size={12} />;
        displayText = normalizedStatus;
        break;
      case 'paused':
      case 'stopped':
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        borderColor = 'border-slate-500/20';
        icon = <Pause size={12} />;
        displayText = normalizedStatus;
        break;
      case 'loading':
        bgColor = 'bg-blue-500/10';
        textColor = 'text-blue-400';
        borderColor = 'border-blue-500/20';
        icon = <Loader size={12} className="animate-spin" />;
        displayText = normalizedStatus;
        break;
      default:
        bgColor = 'bg-slate-500/10';
        textColor = 'text-slate-400';
        borderColor = 'border-slate-500/20';
        icon = null;
        displayText = status;
    }
  }

  // Size variants
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div 
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${bgColor} ${textColor} ${borderColor}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {showIcon && icon}
      <span className="capitalize">{displayText}</span>
    </div>
  );
};

/**
 * Specialized StatusBadge variants
 */

// Severity Badge for alerts and security
export const SeverityBadge = (props) => (
  <StatusBadge {...props} variant="severity" />
);

// Stack Status Badge for infrastructure
export const StackStatusBadge = (props) => (
  <StatusBadge {...props} variant="stack" />
);

// Simple Status Badge for general use
export const SimpleStatusBadge = (props) => (
  <StatusBadge {...props} showIcon={false} />
);

export default StatusBadge;