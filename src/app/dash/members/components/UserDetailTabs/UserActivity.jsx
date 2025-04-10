"use client"

import React, { useState } from 'react';

export const UserActivity = ({ user }) => {
  const [timeFrame, setTimeFrame] = useState('all');
  const [activityType, setActivityType] = useState('all');

  const activityLog = [
    { action: 'Logged in', details: 'Via web browser', ip: '192.168.1.1', location: 'San Francisco, CA', time: '2 days ago' },
    { action: 'Created API key', details: 'Developer key for CI/CD', ip: '192.168.1.1', location: 'San Francisco, CA', time: '1 week ago' },
    { action: 'Accessed API Gateway', details: 'Viewed logs', ip: '192.168.1.1', location: 'San Francisco, CA', time: '1 week ago' },
    { action: 'Created deployment', details: 'For User Service (v2.0.1)', ip: '192.168.1.1', location: 'San Francisco, CA', time: '2 weeks ago' },
    { action: 'Changed password', details: 'Via account settings', ip: '192.168.1.1', location: 'San Francisco, CA', time: '3 weeks ago' },
    { action: 'Enabled 2FA', details: 'Using authenticator app', ip: '192.168.1.1', location: 'San Francisco, CA', time: '1 month ago' },
    { action: 'Added to DevOps team', details: 'By admin@example.com', ip: '192.168.1.100', location: 'New York, NY', time: '1 month ago' },
    { action: 'Logged in', details: 'Via mobile app', ip: '192.168.1.100', location: 'New York, NY', time: '1 month ago' },
    { action: 'Account created', details: 'Invited by admin@example.com', ip: '192.168.1.100', location: 'New York, NY', time: '2 months ago' }
  ];

  // Filter activity log based on selected filters
  const filteredActivityLog = activityLog.filter(log => {
    const matchesType = activityType === 'all' || 
      (activityType === 'logins' && log.action.toLowerCase().includes('login')) ||
      (activityType === 'deployments' && log.action.toLowerCase().includes('deployment')) ||
      (activityType === 'settings' && (
        log.action.toLowerCase().includes('password') || 
        log.action.toLowerCase().includes('2fa') || 
        log.action.toLowerCase().includes('team')
      ));
    
    // TODO: Implement actual time frame filtering logic
    return matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Activity Log</h3>
        <div className="flex items-center gap-3">
          <select 
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="all">All Activity</option>
            <option value="logins">Logins</option>
            <option value="deployments">Application Access</option>
            <option value="settings">Permission Changes</option>
            <option value="security">Security</option>
          </select>
          <select 
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="all">All time</option>
            <option value="30d">Last 30 days</option>
            <option value="7d">Last 7 days</option>
            <option value="24h">Last 24 hours</option>
          </select>
          <button className="px-3 py-1.5 bg-slate-800 rounded-lg text-white hover:bg-slate-700 text-sm">
            Export
          </button>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredActivityLog.length > 0 ? (
            filteredActivityLog.map((activity, idx) => (
              <div 
                key={idx} 
                className="px-6 py-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/10"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-white">{activity.action}</span>
                  <span className="text-sm text-slate-500">{activity.time}</span>
                </div>
                <div className="text-sm text-slate-400">{activity.details}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {activity.ip} • {activity.location}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400">
              No activities found matching the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};