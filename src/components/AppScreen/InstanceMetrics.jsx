import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const InstanceMetrics = ({ instance }) => {
  const [timeRange, setTimeRange] = useState('24h');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-white">Instance Metrics</h4>
        <select 
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <MetricChart 
          title="CPU Usage" 
          data={instance.metrics} 
          dataKey="cpu" 
          color="#3b82f6" 
        />
        <MetricChart 
          title="Memory Usage" 
          data={instance.metrics} 
          dataKey="memory" 
          color="#10b981" 
        />
      </div>
    </div>
  );
};

const MetricChart = ({ title, data, dataKey, color }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 h-64">
    <h5 className="text-sm font-medium text-slate-400 mb-4">{title}</h5>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="time" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', border: 'none' }}
          itemStyle={{ color: '#94a3b8' }}
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fill={color} 
          fillOpacity={0.2} 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
