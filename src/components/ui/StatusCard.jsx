"use client"

import React from 'react';

export const StatusCard = ({ title, status, icon: Icon, details }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'healthy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
        'bg-red-500/10 text-red-400 border border-red-500/20'
      }`}>
        {status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Critical'}
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-lg ${
        status === 'healthy' ? 'bg-green-500/10 text-green-400' :
        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
        'bg-red-500/10 text-red-400'
      }`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-sm text-slate-400">{details}</div>
      </div>
    </div>
  </div>
);

export default StatusCard;