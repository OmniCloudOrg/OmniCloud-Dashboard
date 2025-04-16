"use client"

import React from 'react';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * StatusIndicator - Reusable component for displaying provider status
 */
const StatusIndicator = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status) {
    case 'connected':
    case 'active':
    case 'healthy':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <CheckCircle size={14} />;
      break;
    case 'disconnected':
    case 'inactive':
    case 'error':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <XCircle size={14} />;
      break;
    case 'connecting':
    case 'syncing':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <RefreshCw size={14} className="animate-spin" />;
      break;
    case 'warning':
    case 'limited':
      bgColor = 'bg-yellow-500/10';
      textColor = 'text-yellow-400';
      icon = <AlertTriangle size={14} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border border-${textColor}/20`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

export { StatusIndicator };