"use client"

import React, { useState } from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const ResourceUsageChart = () => {
  const [timeRange, setTimeRange] = useState('24h');
  
  // Sample data - in a real app this would be fetched
  const data = [
    { time: '00:00', cpu: 32, memory: 45, disk: 56, network: 21 },
    { time: '03:00', cpu: 40, memory: 48, disk: 56, network: 24 },
    { time: '06:00', cpu: 35, memory: 50, disk: 57, network: 18 },
    { time: '09:00', cpu: 65, memory: 59, disk: 58, network: 45 },
    { time: '12:00', cpu: 75, memory: 68, disk: 58, network: 52 },
    { time: '15:00', cpu: 60, memory: 63, disk: 59, network: 40 },
    { time: '18:00', cpu: 50, memory: 55, disk: 59, network: 30 },
    { time: '21:00', cpu: 45, memory: 52, disk: 60, network: 25 },
  ];
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Resource Usage</h3>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(51, 65, 85, 0.5)',
                  borderRadius: '0.5rem'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                name="CPU" 
                stroke="#3b82f6" 
                fillOpacity={1}
                fill="url(#colorCpu)" 
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                name="Memory" 
                stroke="#10b981" 
                fillOpacity={1}
                fill="url(#colorMemory)" 
              />
              <Area 
                type="monotone" 
                dataKey="disk" 
                name="Disk" 
                stroke="#f59e0b" 
                fillOpacity={1}
                fill="url(#colorDisk)" 
              />
              <Area 
                type="monotone" 
                dataKey="network" 
                name="Network" 
                stroke="#8b5cf6" 
                fillOpacity={1}
                fill="url(#colorNetwork)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-slate-300">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-300">Memory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-slate-300">Disk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-slate-300">Network</span>
          </div>
        </div>
      </div>
    </div>
  );
};
