"use client"

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AlertActivityChart = ({ alerts }) => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Calculate alert activity data based on alerts
  const alertActivityData = useMemo(() => {
    if (!alerts || !alerts.length) return [];
    
    // Get timestamp range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case '14d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 14);
        break;
      case '30d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    // Create date buckets
    const dateFormat = { month: 'numeric', day: 'numeric' };
    const dateBuckets = {};
    
    let currentDate = new Date(startDate);
    while (currentDate <= now) {
      const dateStr = currentDate.toLocaleDateString('en-US', dateFormat);
      dateBuckets[dateStr] = { time: dateStr, critical: 0, warning: 0, info: 0 };
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Count alerts by date and severity
    alerts.forEach(alert => {
      const alertDate = new Date(alert.timestamp);
      
      // Skip if outside our date range
      if (alertDate < startDate) return;
      
      const dateStr = alertDate.toLocaleDateString('en-US', dateFormat);
      
      // Skip if somehow we don't have this date bucket
      if (!dateBuckets[dateStr]) return;
      
      // Increment the appropriate severity counter
      if (alert.severity === 'critical') {
        dateBuckets[dateStr].critical++;
      } else if (alert.severity === 'warning') {
        dateBuckets[dateStr].warning++;
      } else if (alert.severity === 'info') {
        dateBuckets[dateStr].info++;
      }
    });
    
    // Convert buckets to array
    return Object.values(dateBuckets);
  }, [alerts, timeRange]);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Alert Activity</h3>
        <select 
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="14d">Last 14 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>
      <div className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alertActivityData}>
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
              <Legend />
              <Bar dataKey="critical" name="Critical" fill="#f87171" />
              <Bar dataKey="warning" name="Warning" fill="#facc15" />
              <Bar dataKey="info" name="Info" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};