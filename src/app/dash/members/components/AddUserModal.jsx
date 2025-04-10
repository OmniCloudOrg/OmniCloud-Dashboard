"use client"

import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer',
    teams: [],
    sendInvite: true
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTeamChange = (team) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.includes(team)
        ? prev.teams.filter(t => t !== team)
        : [...prev.teams, team]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Adding user:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Add New User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="developer">Developer</option>
                  <option value="viewer">Viewer</option>
                  <option value="auditor">Auditor</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Admins have full access. Developers can deploy apps. Viewers have read-only access. Auditors can view logs and reports.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Teams</label>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  {['Frontend', 'Backend', 'DevOps', 'Design', 'QA'].map((team) => (
                    <div key={team} className="flex items-center mb-2 last:mb-0">
                      <input
                        type="checkbox"
                        id={`team-${team}`}
                        checked={formData.teams.includes(team)}
                        onChange={() => handleTeamChange(team)}
                        className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      />
                      <label htmlFor={`team-${team}`} className="ml-2 text-sm text-slate-300">
                        {team}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="send-invite"
                  name="sendInvite"
                  checked={formData.sendInvite}
                  onChange={handleInputChange}
                  className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                />
                <label htmlFor="send-invite" className="ml-2 text-sm text-slate-300">
                  Send email invitation to set up account
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-8 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};