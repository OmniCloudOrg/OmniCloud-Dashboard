"use client"

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Resource Card Component
export const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : trend === 'down' ? <ArrowUpRight size={16} className="rotate-90" /> : null}
          {percentage}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);