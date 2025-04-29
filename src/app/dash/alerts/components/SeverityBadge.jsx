"use client"

import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

// Severity Badge Component
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
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      <span className="capitalize">{severity}</span>
    </div>
  );
};