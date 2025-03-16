"use client"

import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Filter, 
  ChevronDown, 
  Mail, 
  Shield, 
  Key, 
  Clock, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  UserX, 
  Edit, 
  RefreshCw, 
  Eye, 
  AlertCircle, 
  Lock,
  Trash2,
  User,
  Users
} from 'lucide-react';

// User Card Component
const UserCard = ({ user, onSelect }) => {
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

// Add User Modal Component
const AddUserModal = ({ isOpen, onClose }) => {
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
                        value={team}
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

// User Detail Component
const UserDetail = ({ user, onBack }) => {
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
    switch (activeTab) {
      case 'overview':
        return <UserOverview user={user} />;
      case 'permissions':
        return <UserPermissions user={user} />;
      case 'activity':
        return <UserActivity user={user} />;
      case 'security':
        return <UserSecurity user={user} />;
      case 'settings':
        return <UserSettings user={user} />;
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

// User Overview Tab
const UserOverview = ({ user }) => {
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

// Placeholder components for other tabs
const UserPermissions = ({ user }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-white mb-4">Permission Settings</h3>
    
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h4 className="text-base font-medium text-white mb-4">Role Permissions</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-white">Current Role</div>
            <div className="text-sm text-slate-400 mt-1">
              {user.role === 'admin' ? 'Full administrative access to all systems' :
               user.role === 'developer' ? 'Can deploy and manage applications' :
               user.role === 'viewer' ? 'Read-only access to applications' :
               'Can access logs and audit reports'}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium 
            ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
              user.role === 'developer' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              user.role === 'viewer' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
            <Shield size={16} />
            <span className="capitalize">{user.role}</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-700/50">
          <label className="block text-sm font-medium text-slate-400 mb-2">Change Role</label>
          <div className="flex gap-3">
            <select className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
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
        {[
          { name: 'Create Applications', description: 'Can create new applications', enabled: true },
          { name: 'Delete Applications', description: 'Can delete applications', enabled: false },
          { name: 'Invite Users', description: 'Can invite new users to the platform', enabled: true },
          { name: 'Manage Billing', description: 'Can manage billing settings and payment methods', enabled: false },
          { name: 'View Audit Logs', description: 'Can view system audit logs', enabled: true }
        ].map((permission, idx) => (
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
                <input type="checkbox" className="sr-only peer" defaultChecked={permission.enabled} />
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
        {['Frontend', 'Backend', 'DevOps', 'Design', 'QA'].map((team, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
            <div className="font-medium text-white">{team} Team</div>
            <div className="flex items-center">
              <div className={`mr-3 text-sm ${user.teams.includes(team) ? 'text-green-400' : 'text-slate-500'}`}>
                {user.teams.includes(team) ? 'Member' : 'Not a member'}
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={user.teams.includes(team)} />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UserActivity = ({ user }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-white">Activity Log</h3>
      <div className="flex items-center gap-3">
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option>All Activity</option>
          <option>Logins</option>
          <option>Application Access</option>
          <option>Permission Changes</option>
          <option>Security</option>
        </select>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>Last 24 hours</option>
          <option>All time</option>
        </select>
        <button className="px-3 py-1.5 bg-slate-800 rounded-lg text-white hover:bg-slate-700 text-sm">
          Export
        </button>
      </div>
    </div>
    
    <div className="bg-slate-800/50 rounded-lg overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {[
          { action: 'Logged in', details: 'Via web browser', ip: '192.168.1.1', location: 'San Francisco, CA', time: '2 days ago' },
          { action: 'Created API key', details: 'Developer key for CI/CD', ip: '192.168.1.1', location: 'San Francisco, CA', time: '1 week ago' },
          { action: 'Accessed API Gateway', details: 'Viewed logs', ip: '192.168.1.1', location: 'San Francisco, CA', time: '1 week ago' },
          { action: 'Created deployment', details: 'For User Service (v2.0.1)', ip: '192.168.1.1', location: 'San Francisco, CA', time: '2 weeks ago' },
          { action: 'Changed password', details: 'Via account settings', ip: '192.168.1.1', location: 'San Francisco, CA', time: '3 weeks ago' },
          { action: 'Enabled 2FA', details: 'Using authenticator app', ip: '192.168.1.1', location: 'San Francisco, CA', time: '1 month ago' },
          { action: 'Added to DevOps team', details: 'By admin@example.com', ip: '192.168.1.100', location: 'New York, NY', time: '1 month ago' },
          { action: 'Logged in', details: 'Via mobile app', ip: '192.168.1.100', location: 'New York, NY', time: '1 month ago' },
          { action: 'Account created', details: 'Invited by admin@example.com', ip: '192.168.1.100', location: 'New York, NY', time: '2 months ago' }
        ].map((activity, idx) => (
          <div key={idx} className="px-6 py-4 border-b border-slate-700/50 last:border-0 hover:bg-slate-700/10">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-white">{activity.action}</span>
              <span className="text-sm text-slate-500">{activity.time}</span>
            </div>
            <div className="text-sm text-slate-400">{activity.details}</div>
            <div className="text-xs text-slate-500 mt-1">
              {activity.ip} • {activity.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UserSecurity = ({ user }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-white mb-4">Security Settings</h3>
    
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
          <button className={`px-3 py-1.5 ${user.twoFactorEnabled ? 'bg-slate-900 border border-slate-700' : 'bg-blue-600'} rounded-lg text-white hover:${user.twoFactorEnabled ? 'bg-slate-700' : 'bg-blue-700'} text-sm`}>
            {user.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
          </button>
        </div>
        
        <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
          <div>
            <div className="font-medium text-white">Recovery Codes</div>
            <div className="text-sm text-slate-400 mt-1">
              {user.twoFactorEnabled ? '5 unused codes remaining' : 'Available after enabling 2FA'}
            </div>
          </div>
          <button className={`px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white hover:bg-slate-700 text-sm ${!user.twoFactorEnabled && 'opacity-50 cursor-not-allowed'}`} disabled={!user.twoFactorEnabled}>
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
        {[
          { name: 'Development Key', created: '2 weeks ago', lastUsed: '2 days ago' },
          { name: 'CI/CD Pipeline', created: '1 month ago', lastUsed: '3 days ago' },
          { name: 'Staging Environment', created: '3 months ago', lastUsed: '1 week ago' }
        ].map((key, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
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
        {[
          { device: 'Chrome on macOS', ip: '192.168.1.1', location: 'San Francisco, CA', lastActive: 'Currently active', isCurrent: true },
          { device: 'Safari on iOS', ip: '192.168.1.45', location: 'San Francisco, CA', lastActive: '1 day ago' }
        ].map((session, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
            <div>
              <div className="flex items-center">
                <span className="font-medium text-white">{session.device}</span>
                {session.isCurrent && (
                  <span className="ml-2 px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full">Current</span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {session.ip} • {session.location} • {session.lastActive}
              </div>
            </div>
            <button className={`px-3 py-1 text-sm ${session.isCurrent ? 'text-slate-500 cursor-not-allowed' : 'text-red-400 hover:text-red-300'}`} disabled={session.isCurrent}>
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

const UserSettings = ({ user }) => (
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
          {[
            { name: 'Email Notifications', description: 'Receive email notifications for important events', enabled: true },
            { name: 'Security Alerts', description: 'Get notified about suspicious account activity', enabled: true },
            { name: 'Deployment Notifications', description: 'Receive notifications when applications are deployed', enabled: false },
            { name: 'Weekly Reports', description: 'Receive weekly summary of activity and metrics', enabled: true },
            { name: 'Team Updates', description: 'Get notifications about team membership changes', enabled: false }
          ].map((notification, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
              <div>
                <div className="font-medium text-white">{notification.name}</div>
                <div className="text-sm text-slate-400 mt-0.5">{notification.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={notification.enabled} />
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

// Main User Management Component
const UserAccessManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Sample user data
  const sampleUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      teams: ['Frontend', 'Backend'],
      twoFactorEnabled: true,
      lastActive: '2 hours ago',
      dateAdded: '6 months ago',
      profilePic: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'developer',
      status: 'active',
      teams: ['Frontend', 'Design'],
      twoFactorEnabled: true,
      lastActive: '1 day ago',
      dateAdded: '3 months ago',
      profilePic: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      role: 'developer',
      status: 'active',
      teams: ['Backend', 'DevOps'],
      twoFactorEnabled: false,
      lastActive: '3 days ago',
      dateAdded: '1 year ago',
      profilePic: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'viewer',
      status: 'invited',
      teams: ['Design'],
      twoFactorEnabled: false,
      lastActive: 'Never',
      dateAdded: '1 week ago',
      profilePic: null
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      role: 'auditor',
      status: 'active',
      teams: ['QA'],
      twoFactorEnabled: true,
      lastActive: '1 week ago',
      dateAdded: '2 months ago',
      profilePic: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 6,
      name: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      role: 'developer',
      status: 'suspended',
      teams: ['Frontend', 'Backend'],
      twoFactorEnabled: true,
      lastActive: '3 weeks ago',
      dateAdded: '8 months ago',
      profilePic: 'https://i.pravatar.cc/150?img=6'
    }
  ];
  
  // Filter users based on search and filters
  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTeam = teamFilter === 'all' || user.teams.includes(teamFilter);
    
    return matchesSearch && matchesRole && matchesStatus && matchesTeam;
  });
  
  return (
    <div className="space-y-6">
      {!selectedUser ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">User Access</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={18} />
              Add User
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 self-end">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="viewer">Viewer</option>
                <option value="auditor">Auditor</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
                <option value="locked">Locked</option>
              </select>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Teams</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
                <option value="Design">Design</option>
                <option value="QA">QA</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onSelect={setSelectedUser} 
              />
            ))}
            {filteredUsers.length === 0 && (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <UserX size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Users Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any users matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                    setTeamFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <UserDetail user={selectedUser} onBack={() => setSelectedUser(null)} />
      )}
      
      {isModalOpen && (
        <AddUserModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default UserAccessManagement;