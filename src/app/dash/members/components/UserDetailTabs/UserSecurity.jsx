"use client"

import React from 'react';
import { 
  Eye, 
  RefreshCw, 
  Trash2 
} from 'lucide-react';

export const UserSecurity = ({ user }) => {
  const apiKeys = [
    { name: 'Development Key', created: '2 weeks ago', lastUsed: '2 days ago' },
    { name: 'CI/CD Pipeline', created: '1 month ago', lastUsed: '3 days ago' },
    { name: 'Staging Environment', created: '3 months ago', lastUsed: '1 week ago' }
  ];

  const activeSessions = [
    { 
      device: 'Chrome on macOS', 
      ip: '192.168.1.1', 
      location: 'San Francisco, CA', 
      lastActive: 'Currently active', 
      isCurrent: true 
    },
    { 
      device: 'Safari on iOS', 
      ip: '192.168.1.45', 
      location: 'San Francisco, CA', 
      lastActive: '1 day ago' 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h4 className="text-base font-medium text-white mb-4">Authentication</h4>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-white">Password</div>
              <div className="text-sm text-slate-400 mt-1">Last changed 3 weeks ago</div>
            </div>
            <button className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white hover:bg-slate-700 text-sm">
              Change Password
            </button>
          </div>
          
          <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
            <div>
              <div className="font-medium text-white">Two-Factor Authentication</div>
              <div className="text-sm text-slate-400 mt-1">
                {user.twoFactorEnabled ? 'Enabled via authenticator app' : 'Not enabled'}
              </div>
            </div>
            <button 
              className={`px-3 py-1.5 ${
                user.twoFactorEnabled 
                  ? 'bg-slate-900 border border-slate-700' 
                  : 'bg-blue-600'
              } rounded-lg text-white hover:${
                user.twoFactorEnabled 
                  ? 'bg-slate-700' 
                  : 'bg-blue-700'
              } text-sm`}
            >
              {user.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
            </button>
          </div>
          
          <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
            <div>
              <div className="font-medium text-white">Recovery Codes</div>
              <div className="text-sm text-slate-400 mt-1">
                {user.twoFactorEnabled 
                  ? '5 unused codes remaining' 
                  : 'Available after enabling 2FA'}
              </div>
            </div>
            <button 
              className={`px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white hover:bg-slate-700 text-sm ${
                !user.twoFactorEnabled && 'opacity-50 cursor-not-allowed'
              }`} 
              disabled={!user.twoFactorEnabled}
            >
              View Codes
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-medium text-white">API Keys</h4>
          <button className="px-3 py-1.5 bg-blue-600 rounded-lg text-white hover:bg-blue-700 text-sm">
            New API Key
          </button>
        </div>
        <div className="space-y-4">
          {apiKeys.map((key, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0"
            >
              <div>
                <div className="font-medium text-white">{key.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Created {key.created} • Last used {key.lastUsed}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 text-slate-400 hover:text-white">
                  <Eye size={16} />
                </button>
                <button className="p-1 text-slate-400 hover:text-white">
                  <RefreshCw size={16} />
                </button>
                <button className="p-1 text-red-400 hover:text-red-300">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h4 className="text-base font-medium text-white mb-4">Active Sessions</h4>
        <div className="space-y-4">
          {activeSessions.map((session, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0"
            >
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-white">{session.device}</span>
                  {session.isCurrent && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {session.ip} • {session.location} • {session.lastActive}
                </div>
              </div>
              <button 
                className={`px-3 py-1 text-sm ${
                  session.isCurrent 
                    ? 'text-slate-500 cursor-not-allowed' 
                    : 'text-red-400 hover:text-red-300'
                }`} 
                disabled={session.isCurrent}
              >
                {session.isCurrent ? 'Current Session' : 'Sign Out'}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <button className="text-red-400 hover:text-red-300 text-sm">
            Sign Out All Other Sessions
          </button>
        </div>
      </div>
    </div>
  );
};