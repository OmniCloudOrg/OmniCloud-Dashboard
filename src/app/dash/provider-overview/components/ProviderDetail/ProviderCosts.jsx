"use client"

import React from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { StatusIndicator } from '../StatusIndicator';

/**
 * ProviderCosts - Cost Management tab content for provider detail
 */
const ProviderCosts = ({ provider }) => {
  // Sample cost data
  const costData = [
    { month: 'Jan', compute: 5200, storage: 2100, network: 1500, other: 800 },
    { month: 'Feb', compute: 5800, storage: 2300, network: 1600, other: 850 },
    { month: 'Mar', compute: 5500, storage: 2200, network: 1550, other: 900 },
    { month: 'Apr', compute: 6200, storage: 2400, network: 1700, other: 920 },
    { month: 'May', compute: 6800, storage: 2600, network: 1800, other: 950 },
    { month: 'Jun', compute: 7200, storage: 2800, network: 1900, other: 980 }
  ];

  // Pie chart data
  const pieData = [
    { name: 'Compute', value: 5800 },
    { name: 'Storage', value: 2300 },
    { name: 'Network', value: 1600 },
    { name: 'Other', value: 850 }
  ];

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Cost Overview</h3>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
          <option value="6">Last 6 Months</option>
          <option value="3">Last 3 Months</option>
          <option value="12">Last 12 Months</option>
          <option value="ytd">Year to Date</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Monthly Costs</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()}`]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Bar dataKey="compute" name="Compute" stackId="a" fill="#3b82f6" />
                <Bar dataKey="storage" name="Storage" stackId="a" fill="#10b981" />
                <Bar dataKey="network" name="Network" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="other" name="Other" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Cost Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()}`]}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-slate-400">Total This Month:</span>
              <span className="font-semibold text-white">${provider.monthlyCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Projected:</span>
              <span className="font-semibold text-white">${Math.round(provider.monthlyCost * 1.25).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Budget & Alerts</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm">
            Configure Budgets
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-white">Monthly Budget</div>
              <div className="text-sm font-medium text-white">${Math.round(provider.monthlyCost * 1.2).toLocaleString()}</div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-1">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Current: ${Math.round(provider.monthlyCost * 0.8).toLocaleString()}</span>
              <span>80% of budget</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Alert Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Threshold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">Monthly Budget Alert</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">Actual Cost</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">80%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status="warning" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">Budget Forecast Alert</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">Forecasted Cost</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">100%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status="warning" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">EC2 Cost Alert</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">Service Cost</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">$5,000</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status="active" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProviderCosts };