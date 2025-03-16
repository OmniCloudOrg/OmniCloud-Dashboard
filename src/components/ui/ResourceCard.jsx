"use client"

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-sm ${
        trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
      }`}>
        {trend === 'up' ? <ArrowUp size={16} /> : trend === 'down' ? <ArrowDown size={16} /> : null}
        {percentage}%
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  </div>
);

export default ResourceCard;