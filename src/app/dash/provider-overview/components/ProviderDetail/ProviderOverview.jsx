"use client"

import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock
} from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * ProviderOverview - Overview tab content for provider detail
 */
const ProviderOverview = ({ provider }) => {
  // Sample resource activity data
  const resourceActivity = [
    { date: '25 Feb', created: 5, deleted: 2, modified: 8 },
    { date: '24 Feb', created: 3, deleted: 1, modified: 6 },
    { date: '23 Feb', created: 7, deleted: 0, modified: 12 },
    { date: '22 Feb', created: 2, deleted: 4, modified: 5 },
    { date: '21 Feb', created: 0, deleted: 1, modified: 3 },
    { date: '20 Feb', created: 4, deleted: 2, modified: 7 },
    { date: '19 Feb', created: 6, deleted: 0, modified: 9 }
  ];
  
  // Sample events data for the Overview tab
  const recentEvents = [
    { type: 'sync', status: 'success', message: 'Resources synchronized successfully', time: '2 hours ago' },
    { type: 'quota', status: 'warning', message: 'Approaching S3 bucket limit (90%)', time: '1 day ago' },
    { type: 'sync', status: 'success', message: 'Resources synchronized successfully', time: '2 days ago' },
    { type: 'cost', status: 'warning', message: 'Monthly cost threshold exceeded', time: '3 days ago' },
    { type: 'sync', status: 'error', message: 'Failed to synchronize RDS resources', time: '5 days ago' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Resource Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(provider.resources).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-sm text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-2xl font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-400 mb-2">Resource Activity (7 days)</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resourceActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(51, 65, 85, 0.5)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="created" name="Created" fill="#3b82f6" />
                  <Bar dataKey="modified" name="Modified" fill="#f59e0b" />
                  <Bar dataKey="deleted" name="Deleted" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Estimated Monthly Cost</h3>
            <div className="text-3xl font-bold text-white">${provider.monthlyCost.toLocaleString()}</div>
            <div className="text-sm text-slate-400 mt-1">for current billing period</div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Current MTD Spend</span>
                <span className="text-white">${Math.round(provider.monthlyCost * 0.8).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button className="text-blue-400 hover:text-blue-300 text-sm">View Cost Details</button>
              <button className="text-blue-400 hover:text-blue-300 text-sm">Set Alerts</button>
            </div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white mb-4">Recent Events</h3>
            <div className="space-y-4">
              {recentEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg mt-0.5 ${
                    event.status === 'success' ? 'bg-green-500/10 text-green-400' :
                    event.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {event.status === 'success' ? <CheckCircle size={14} /> :
                     event.status === 'warning' ? <AlertTriangle size={14} /> :
                     <XCircle size={14} />}
                  </div>
                  <div>
                    <div className="text-sm text-slate-300">{event.message}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Regions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {provider.regions.map((region, idx) => (
            <div key={idx} className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-white">{region}</div>
                <StatusIndicator status="connected" />
              </div>
              <div className="text-xs text-slate-500">
                {Math.floor(Math.random() * 15) + 5} resources
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ProviderOverview };