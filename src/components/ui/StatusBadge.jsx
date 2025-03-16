"use client"

import React from 'react';
import { Check, X, Clock, RefreshCw } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  let bgColor, textColor, icon;
  
  switch (status) {
    case 'running':
      bgColor = 'bg-blue-500/10';
      textColor = 'text-blue-400';
      icon = <RefreshCw size={12} className="animate-spin" />;
      break;
    case 'success':
      bgColor = 'bg-green-500/10';
      textColor = 'text-green-400';
      icon = <Check size={12} />;
      break;
    case 'failed':
      bgColor = 'bg-red-500/10';
      textColor = 'text-red-400';
      icon = <X size={12} />;
      break;
    case 'queued':
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = <Clock size={12} />;
      break;
    default:
      bgColor = 'bg-slate-500/10';
      textColor = 'text-slate-400';
      icon = null;
  }
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

export default StatusBadge;