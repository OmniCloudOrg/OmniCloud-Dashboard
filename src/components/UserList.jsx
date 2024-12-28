import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  Mail, 
  User, 
  X,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './Base/Alert';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'admin',
      status: 'active',
      lastActive: '2024-03-15T10:30:00',
      permissions: ['read', 'write', 'delete']
    },
    // Add more sample users as needed
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const showStatus = (message, type) => {
    setStatusMessage({ text: message, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-white">User Management</h2>
          <span className="px-2 py-1 rounded-full text-xs font-medium border bg-slate-500/10 text-slate-400 border-slate-500">
            {users.length} Users
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">User</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">Role</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">Status</th>
                <th className="text-left text-sm font-medium text-slate-400 px-6 py-4">Last Active</th>
                <th className="text-right text-sm font-medium text-slate-400 px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                        <User size={16} className="text-slate-300" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-400">
                      {new Date(user.lastActive).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {}} 
                        className="p-1 hover:bg-slate-700 rounded"
                      >
                        <Edit size={16} className="text-slate-400" />
                      </button>
                      <button 
                        onClick={() => {}} 
                        className="p-1 hover:bg-slate-700 rounded"
                      >
                        <Key size={16} className="text-slate-400" />
                      </button>
                      <button 
                        onClick={() => {}} 
                        className="p-1 hover:bg-slate-700 rounded"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <UserFormModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={(userData) => {
            setUsers([...users, { id: users.length + 1, ...userData }]);
            setIsModalOpen(false);
            showStatus('User added successfully', 'success');
          }}
        />
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={`w-80 transition-colors ${
            statusMessage.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <AlertDescription className="flex items-center gap-2">
              {statusMessage.type === 'success' 
                ? <CheckCircle size={16} className="text-green-500" />
                : <XCircle size={16} className="text-red-500" />
              }
              <span>{statusMessage.text}</span>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const styles = {
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500',
    user: 'bg-blue-500/10 text-blue-400 border-blue-500',
    guest: 'bg-slate-500/10 text-slate-400 border-slate-500'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[role]}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500',
    suspended: 'bg-red-500/10 text-red-400 border-red-500'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const UserFormModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
    permissions: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lastActive: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Full Name</span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">Role</span>
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <UserPlus size={18} />
              <span>Add User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;