"use client"

import React, { useState } from 'react';
import { Shield } from 'lucide-react';

export const UserPermissions = ({ user, roleBadge }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const roleDescriptions = {
    admin: 'Full administrative access to all systems',
    developer: 'Can deploy and manage applications',
    viewer: 'Read-only access to applications',
    auditor: 'Can access logs and audit reports'
  };

  const permissionsList = [
    { name: 'Create Applications', description: 'Can create new applications', enabled: true },
    { name: 'Delete Applications', description: 'Can delete applications', enabled: false },
    { name: 'Invite Users', description: 'Can invite new users to the platform', enabled: true },
    { name: 'Manage Billing', description: 'Can manage billing settings and payment methods', enabled: false },
    { name: 'View Audit Logs', description: 'Can view system audit logs', enabled: true }
  ];

  const teamsList = ['Frontend', 'Backend', 'DevOps', 'Design', 'QA'];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h4 className="text-base font-medium text-white mb-4">Role Permissions</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-white">Current Role</div>
              <div className="text-sm text-slate-400 mt-1">
                {roleDescriptions[user.role]}
              </div>
            </div>
            {roleBadge(user.role)}
          </div>
          
          <div className="pt-4 border-t border-slate-700/50">
            <label className="block text-sm font-medium text-slate-400 mb-2">Change Role</label>
            <div className="flex gap-3">
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="viewer">Viewer</option>
                <option value="auditor">Auditor</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h4 className="text-base font-medium text-white mb-4">Custom Permissions</h4>
        <div className="space-y-4">
          {permissionsList.map((permission, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
              <div>
                <div className="font-medium text-white">{permission.name}</div>
                <div className="text-sm text-slate-400 mt-0.5">{permission.description}</div>
              </div>
              <div className="flex items-center">
                <div className={`mr-3 text-sm ${permission.enabled ? 'text-green-400' : 'text-slate-500'}`}>
                  {permission.enabled ? 'Enabled' : 'Disabled'}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    defaultChecked={permission.enabled} 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h4 className="text-base font-medium text-white mb-4">Team Memberships</h4>
        <div className="space-y-4">
          {teamsList.map((team, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
              <div className="font-medium text-white">{team} Team</div>
              <div className="flex items-center">
                <div className={`mr-3 text-sm ${user.teams.includes(team) ? 'text-green-400' : 'text-slate-500'}`}>
                  {user.teams.includes(team) ? 'Member' : 'Not a member'}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    defaultChecked={user.teams.includes(team)} 
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};