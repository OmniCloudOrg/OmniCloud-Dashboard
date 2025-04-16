"use client"

import React, { useState } from 'react';
import { 
  ChevronDown, 
  User, 
  Edit, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Lock,
  Mail,
  AlertCircle 
} from 'lucide-react';

// Import tab components
import { UserOverview } from './UserDetailTabs/UserOverview';
import { UserPermissions } from './UserDetailTabs/UserPermissions';
import { UserActivity } from './UserDetailTabs/UserActivity';
import { UserSecurity } from './UserDetailTabs/UserSecurity';
import { UserSettings } from './UserDetailTabs/UserSettings';

export const UserDetail = ({ user, onBack, users }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'activity', label: 'Activity' },
    { id: 'security', label: 'Security' },
    { id: 'settings', label: 'Settings' }
  ];
  
  const getStatusBadge = (status) => {
    const statusColors = {
      active: 'bg-green-500/10 text-green-400 border-green-500/20',
      invited: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
      locked: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    
    const statusIcons = {
      active: <CheckCircle size={14} />,
      invited: <Mail size={14} />,
      suspended: <XCircle size={14} />,
      locked: <Lock size={14} />,
    };
    
    return (
      <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${statusColors[status] || 'bg-slate-500/10 text-slate-400'}`}>
        {statusIcons[status] || <AlertCircle size={14} />}
        <span className="capitalize">{status}</span>
      </div>
    );
  };
  
  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      developer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      viewer: 'bg-green-500/10 text-green-400 border-green-500/20',
      auditor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    
    return (
      <div className={`px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium ${roleColors[role] || 'bg-slate-500/10 text-slate-400'}`}>
        <Shield size={14} />
        <span className="capitalize">{role}</span>
      </div>
    );
  };
  
  const renderTabContent = () => {
    const tabProps = { 
      user, 
      users, 
      statusBadge: getStatusBadge, 
      roleBadge: getRoleBadge 
    };

    switch (activeTab) {
      case 'overview':
        return <UserOverview {...tabProps} />;
      case 'permissions':
        return <UserPermissions {...tabProps} />;
      case 'activity':
        return <UserActivity {...tabProps} />;
      case 'security':
        return <UserSecurity {...tabProps} />;
      case 'settings':
        return <UserSettings {...tabProps} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ChevronDown className="rotate-90" size={20} />
        </button>
        <div className="flex items-center gap-4">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-slate-800 flex items-center justify-center rounded-lg text-slate-300">
              <User size={24} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <div className="text-slate-400">{user.email}</div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {getStatusBadge(user.status)}
          {getRoleBadge(user.role)}
          <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
            <Edit size={18} />
          </button>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="border-b border-slate-800">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-blue-400 border-b-2 border-blue-500' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};