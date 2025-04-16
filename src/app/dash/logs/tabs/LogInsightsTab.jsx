"use client"

import React, { useState } from 'react';
import { 
  BarChart, 
  PieChart, 
  Server, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

const LogInsightsTab = () => {
  const [activeInsight, setActiveInsight] = useState('services');

  // Sample data for insights
  const serviceErrorRates = [
    { service: 'api-service', errorRate: 5.2, totalLogs: 1200 },
    { service: 'auth-service', errorRate: 2.1, totalLogs: 800 },
    { service: 'payment-service', errorRate: 3.7, totalLogs: 600 },
    { service: 'user-service', errorRate: 1.5, totalLogs: 1000 },
    { service: 'notification-service', errorRate: 0.8, totalLogs: 400 }
  ];

  const logLevelDistribution = [
    { name: 'Error', value: 150, color: '#ef4444' },
    { name: 'Warning', value: 350, color: '#eab308' },
    { name: 'Info', value: 1200, color: '#3b82f6' },
    { name: 'Debug', value: 300, color: '#8b5cf6' }
  ];

  const topErrorServices = serviceErrorRates
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setActiveInsight('services')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeInsight === 'services'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Server size={16} />
          Service Errors
        </button>
        <button
          onClick={() => setActiveInsight('levels')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeInsight === 'levels'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <BarChart size={16} />
          Log Levels
        </button>
      </div>

      {activeInsight === 'services' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Services Error Rate Chart */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Service Error Rates</h3>
              <Clock size={16} className="text-slate-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart 
                  data={serviceErrorRates}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="service" stroke="#94a3b8" />
                  <YAxis 
                    stroke="#94a3b8" 
                    label={{ 
                      value: 'Error Rate (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      fill: '#94a3b8'
                    }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar 
                    dataKey="errorRate" 
                    fill="#ef4444" 
                    name="Error Rate"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Error Services */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Top Error-Prone Services</h3>
              <AlertCircle size={16} className="text-red-400" />
            </div>
            <div className="space-y-4">
              {topErrorServices.map((service, index) => (
                <div 
                  key={service.service} 
                  className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-red-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {service.service}
                      </div>
                      <div className="text-xs text-slate-400">
                        {service.totalLogs} total logs
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-red-400" />
                    <span className="text-sm text-red-400">
                      {service.errorRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeInsight === 'levels' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Log Level Distribution Pie Chart */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Log Level Distribution</h3>
              <Info size={16} className="text-blue-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={logLevelDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {logLevelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {logLevelDistribution.map((level) => (
                <div 
                  key={level.name} 
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: level.color }}
                  />
                  <span className="text-sm text-white">
                    {level.name}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {level.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Log Level Trends */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Log Level Trends</h3>
              <TrendingUp size={16} className="text-slate-400" />
            </div>
            <div className="space-y-4">
              {logLevelDistribution.map((level) => (
                <div 
                  key={level.name} 
                  className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${level.color}20`, 
                        color: level.color 
                      }}
                    >
                      {level.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {level.name} Logs
                      </div>
                      <div className="text-xs text-slate-400">
                        {((level.value / logLevelDistribution.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}% of total logs
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300">
                    {level.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogInsightsTab;