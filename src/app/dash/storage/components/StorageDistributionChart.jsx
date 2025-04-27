import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const StorageDistributionChart = ({ data }) => {
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h3 className="text-lg font-medium text-white">Storage Distribution</h3>
      </div>
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} GB`]}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(51, 65, 85, 0.5)',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-slate-400 mb-1">Monthly Cost</h4>
            <div className="text-xl font-bold text-white">$243.50</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-slate-400 mb-1">Projected</h4>
            <div className="text-xl font-bold text-white">$278.20</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { StorageDistributionChart };