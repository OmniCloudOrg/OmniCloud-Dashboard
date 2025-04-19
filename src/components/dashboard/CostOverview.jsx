"use client"

import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const CostOverview = () => {
  const [period, setPeriod] = useState('month');
  
  const costData = [
    { name: 'AWS', value: 12500, color: '#FF9900' },
    { name: 'GCP', value: 8200, color: '#4285F4' },
    { name: 'Azure', value: 5800, color: '#0078D4' },
    { name: 'On-Prem', value: 3500, color: '#6B7280' }
  ];
  
  const dailyCosts = [
    { day: 'Mon', aws: 520, gcp: 340, azure: 240, onprem: 145 },
    { day: 'Tue', aws: 580, gcp: 320, azure: 260, onprem: 145 },
    { day: 'Wed', aws: 620, gcp: 380, azure: 290, onprem: 145 },
    { day: 'Thu', aws: 540, gcp: 340, azure: 230, onprem: 145 },
    { day: 'Fri', aws: 490, gcp: 290, azure: 190, onprem: 145 },
    { day: 'Sat', aws: 420, gcp: 240, azure: 170, onprem: 145 },
    { day: 'Sun', aws: 380, gcp: 220, azure: 150, onprem: 145 }
  ];
  
  const totalCost = costData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Cost Overview</h3>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div className="flex-1 p-6">
        <div className="flex flex-col md:flex-row gap-6 h-full">
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white">${(totalCost/1000).toFixed(1)}k</div>
              <div className="text-sm text-slate-400">Total Spend</div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full md:w-2/3 flex flex-col">
            <div className="text-sm font-medium text-slate-400 mb-4">Daily Cost Breakdown</div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyCosts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="aws" stackId="a" fill="#FF9900" name="AWS" />
                  <Bar dataKey="gcp" stackId="a" fill="#4285F4" name="GCP" />
                  <Bar dataKey="azure" stackId="a" fill="#0078D4" name="Azure" />
                  <Bar dataKey="onprem" stackId="a" fill="#6B7280" name="On-Prem" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostOverview;
