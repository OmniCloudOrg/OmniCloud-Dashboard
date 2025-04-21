"use client"

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Info
} from 'lucide-react';
import { StatusIndicator } from '../StatusIndicator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * ProviderOverview - Overview tab content for provider detail
 */
const ProviderOverview = ({ provider }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

  console.log('Provider Overview:', provider);
  
  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!provider?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/providers/${provider.id}/audit_logs?page=0&per_page=5`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        
        const data = await response.json();
        setAuditLogs(data.audit_logs);
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuditLogs();
  }, [provider?.id, apiBaseUrl]);

  // Map action to status for styling
  const getStatusFromAction = (action) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'update':
        return 'info';
      case 'delete':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Format date to relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

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
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-white mb-4">Resource Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(provider.resources || {}).map(([key, value]) => (
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
            <div className="text-3xl font-bold text-white">${provider.monthlyCost?.toLocaleString() || '0'}</div>
            <div className="text-sm text-slate-400 mt-1">for current billing period</div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Current MTD Spend</span>
                <span className="text-white">${Math.round((provider.monthlyCost || 0) * 0.8).toLocaleString()}</span>
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
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-sm text-red-400 p-4 bg-red-500/10 rounded-lg">
                Error loading audit logs: {error}
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="text-sm text-slate-400 p-4 bg-slate-800/50 rounded-lg flex items-center gap-2">
                <Info size={14} />
                No recent events found
              </div>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log) => {
                  const status = getStatusFromAction(log.action);
                  return (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg mt-0.5 ${
                        status === 'success' ? 'bg-green-500/10 text-green-400' :
                        status === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                        status === 'error' ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {status === 'success' ? <CheckCircle size={14} /> :
                         status === 'warning' ? <AlertTriangle size={14} /> :
                         status === 'error' ? <XCircle size={14} /> :
                         <Info size={14} />}
                      </div>
                      <div>
                        <div className="text-sm text-slate-300">{log.details}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {getRelativeTime(log.updated_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Regions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(provider.regions || []).map((region, idx) => (
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