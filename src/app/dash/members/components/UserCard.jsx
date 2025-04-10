"use client"

import React from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Lock, 
  AlertCircle, 
  Clock,
  Mail, 
  User 
} from 'lucide-react';

export const UserCard = ({ user, onSelect }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'developer':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'viewer':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'auditor':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={14} />;
      case 'invited':
        return <Mail size={14} />;
      case 'suspended':
        return <XCircle size={14} />;
      case 'locked':
        return <Lock size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'invited':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'suspended':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'locked':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(user)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
            ) : (
              <div className="w-12 h-12 bg-slate-800 flex items-center justify-center rounded-lg text-slate-300">
                <User size={24} />
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
              user.status === 'active' ? 'bg-green-500' : 
              user.status === 'invited' ? 'bg-blue-500' : 
              user.status === 'suspended' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">{user.email}</div>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${getRoleColor(user.role)}`}>
          <Shield size={14} />
          <span className="capitalize">{user.role}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Status</div>
          <div className={`px-2 py-1 rounded-full inline-flex items-center gap-1 text-xs font-medium ${getStatusColor(user.status)}`}>
            {getStatusIcon(user.status)}
            <span className="capitalize">{user.status}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Teams</div>
          <div className="text-sm text-white">{user.teams.join(', ')}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">2FA</div>
          <div className="text-sm text-white">{user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Last Active</div>
          <div className="text-sm text-white">{user.lastActive}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={14} />
          <span>Added {user.dateAdded}</span>
        </div>
        <button className="text-blue-400 hover:text-blue-300">
          Manage Access
        </button>
      </div>
    </div>
  );
};