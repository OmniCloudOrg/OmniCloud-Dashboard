"use client"

import React from 'react';
import { 
  Users, 
  Clock, 
  Key, 
  Eye 
} from 'lucide-react';

export const UserOverview = ({ user }) => {
  const stats = [
    { label: 'Applications', value: user.applications || 8, icon: Users },
    { label: 'Last Login', value: user.lastLogin || '2 days ago', icon: Clock },
    { label: 'API Keys', value: user.apiKeys || 3, icon: Key },
    { label: 'Sessions', value: user.activeSessions || 2, icon: Eye }
  ];
  
  // Sample access history
  const accessHistory = [
    { action: 'Login', ip: '192.168.1.1', location: 'San Francisco, CA', device: 'Chrome / macOS', time: '2 days ago' },
    { action: 'API Key Created', ip: '192.168.1.1', location: 'San Francisco, CA', device: 'Chrome / macOS', time: '1 week ago' },
    { action: 'Password Changed', ip: '192.168.1.1', location: 'San Francisco, CA', device: 'Chrome / macOS', time: '3 weeks ago' },
    { action: 'Login', ip: '192.168.1.100', location: 'New York, NY', device: 'Safari / iOS', time: '1 month ago' },
  ];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900/80 rounded-lg text-blue-400">
                <stat.icon size={18} />
              </div>
              <div>
                <div className="text-sm text-slate-400">{stat.label}</div>
                <div className="text-xl font-semibold text-white">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">User Details</h3>
          <div className="bg-slate-800/50 rounded-lg divide-y divide-slate-700/50">
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Full Name</span>
              <span className="text-white">{user.name}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{user.email}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Role</span>
              <span className="text-white capitalize">{user.role}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="text-white capitalize">{user.status}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Teams</span>
              <span className="text-white">{user.teams.join(', ')}</span>
            </div>
            <div className="px-4 py-3 flex justify-between">
              <span className="text-slate-400">Date Added</span>
              <span className="text-white">{user.dateAdded}</span>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Access History</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm">
              View All
            </button>
          </div>
          <div className="bg-slate-800/50 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {accessHistory.map((entry, idx) => (
                <div key={idx} className="px-4 py-3 border-b border-slate-700/50 last:border-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-white">{entry.action}</span>
                    <span className="text-sm text-slate-500">{entry.time}</span>
                  </div>
                  <div className="text-sm text-slate-400">
                    {entry.ip} • {entry.location} • {entry.device}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Application Access</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm">
            Manage Access
          </button>
        </div>
        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700/50">
            <thead>
              <tr className="bg-slate-800/70">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Application</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Accessed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[
                { name: 'API Gateway', role: 'Developer', lastAccessed: '2 days ago' },
                { name: 'User Service', role: 'Admin', lastAccessed: '3 days ago' },
                { name: 'Payment Processor', role: 'Viewer', lastAccessed: '1 week ago' },
                { name: 'Analytics Backend', role: 'Developer', lastAccessed: '2 weeks ago' }
              ].map((app, idx) => (
                <tr key={idx} className="hover:bg-slate-700/10">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{app.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{app.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{app.lastAccessed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};