"use client"

import React from 'react';
import { User } from 'lucide-react';

export const UserSettings = ({ user }) => {
  const notificationSettings = [
    { 
      name: 'Email Notifications', 
      description: 'Receive email notifications for important events', 
      enabled: true 
    },
    { 
      name: 'Security Alerts', 
      description: 'Get notified about suspicious account activity', 
      enabled: true 
    },
    { 
      name: 'Deployment Notifications', 
      description: 'Receive notifications when applications are deployed', 
      enabled: false 
    },
    { 
      name: 'Weekly Reports', 
      description: 'Receive weekly summary of activity and metrics', 
      enabled: true 
    },
    { 
      name: 'Team Updates', 
      description: 'Get notifications about team membership changes', 
      enabled: false 
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Account Settings</h3>
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Profile Picture</label>
              <div className="flex items-center gap-4">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-slate-900 flex items-center justify-center rounded-lg text-slate-300">
                    <User size={32} />
                  </div>
                )}
                <button className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white hover:bg-slate-700 text-sm">
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Notification Preferences</h3>
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="space-y-4">
            {notificationSettings.map((notification, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                <div>
                  <div className="font-medium text-white">{notification.name}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{notification.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    defaultChecked={notification.enabled} 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-red-400">Account Status</h4>
              <p className="text-sm text-slate-400 mt-1">Temporarily suspend this user's access to the platform.</p>
              {user.status === 'active' ? (
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Suspend Account
                </button>
              ) : user.status === 'suspended' ? (
                <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Reactivate Account
                </button>
              ) : (
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {user.status === 'invited' ? 'Resend Invitation' : 'Unlock Account'}
                </button>
              )}
            </div>
            <div className="pt-6 border-t border-red-500/10">
              <h4 className="text-base font-medium text-red-400">Delete Account</h4>
              <p className="text-sm text-slate-400 mt-1">Permanently delete this user and all associated data.</p>
              <button className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};