import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Key, 
  User, 
  X,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription } from './Base/Alert';
import DataTable, { FilterConfig, ColumnConfig } from './Base/ListFilter';

// User type definition
type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  permissions: string[];
};

// User Form Modal Component
export type UserData = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
}
const UserFormModal = ({ 
  onClose, 
  onSubmit,
  initialData = {
    name: '',
    email: '',
    role: 'admin',
    status: 'active',
    permissions: [],
    id: 0
  }
}: { 
  onClose: () => void, 
  onSubmit: (userData: Omit<User, 'id'>) => void,
  initialData?: UserData
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'user',
    status: initialData.status || 'active',
    permissions: initialData.permissions || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lastActive: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {initialData.id ? 'Edit User' : 'Add New User'}
          </h2>
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
                onChange={e => setFormData({...formData, role: e.target.value as User['role']})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="guest">Guest</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-300">Status</span>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as User['status']})}
                className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
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
              <span>{initialData.id ? 'Update' : 'Add'} User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main User Management Component
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'admin',
      status: 'active',
      lastActive: '2024-03-15T10:30:00',
      permissions: ['read', 'write', 'delete']
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'user',
      status: 'inactive',
      lastActive: '2024-03-10T14:45:00',
      permissions: ['read']
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com', 
      role: 'guest',
      status: 'suspended',
      lastActive: '2024-03-05T09:20:00',
      permissions: []
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const showStatus = (message: string, type: 'success' | 'error') => {
    setStatusMessage({ text: message, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle adding a new user
  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser = { 
      ...userData, 
      id: (users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1)
    };
    setUsers(prev => [...prev, newUser]);
    showStatus('User added successfully', 'success');
  };

  // Handle editing a user
  const handleEditUser = (userData: Omit<User, 'id'>) => {
    if (!editingUser) return;
    setUsers(prev => 
      prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData } 
          : user
      )
    );
    showStatus('User updated successfully', 'success');
    setEditingUser(null);
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    showStatus('User deleted successfully', 'success');
  };

  // Filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: 'role',
      label: 'Role',
      icon: Shield,
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'guest', label: 'Guest' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      icon: Settings,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
      ]
    }
  ];

  // Column configurations
  const columns: ColumnConfig<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortable: true,
      render: (name, user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <User size={16} className="text-slate-300" />
          </div>
          <div>
            <div className="font-medium text-white">{name}</div>
            <div className="text-sm text-slate-400">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (role) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
          role === 'admin' 
            ? 'bg-purple-500/10 text-purple-400 border-purple-500'
            : role === 'user'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500'
              : 'bg-slate-500/10 text-slate-400 border-slate-500'
        }`}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
          status === 'active' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
            : status === 'inactive'
              ? 'bg-slate-500/10 text-slate-400 border-slate-500'
              : 'bg-red-500/10 text-red-400 border-red-500'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      render: (lastActive) => new Date(lastActive).toLocaleString()
    },
    {
      key: 'id',
      header: 'Actions',
      render: (id, user) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => {
              setEditingUser(user);
              setIsModalOpen(true);
            }} 
            className="p-1 hover:bg-slate-700 rounded"
          >
            <Edit size={16} className="text-slate-400" />
          </button>
          <button 
            onClick={() => {/* Reset password logic */}} 
            className="p-1 hover:bg-slate-700 rounded"
          >
            <Key size={16} className="text-slate-400" />
          </button>
          <button 
            onClick={() => handleDeleteUser(id)} 
            className="p-1 hover:bg-slate-700 rounded"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      )
    }
  ];

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
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* DataTable with Users */}
      <DataTable 
        data={users}
        columns={columns}
        filterConfigs={filterConfigs}
        searchKeys={['name', 'email']}
        onRowClick={(user) => {
          console.log('Clicked user:', user);
        }}
      />

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <UserFormModal 
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={editingUser ? handleEditUser : handleAddUser}
          initialData={editingUser || undefined}
        />
      )}

      {/* Status Message */}
      {statusMessage && (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`rounded-lg p-4 ${
            statusMessage.type === 'success' ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' 
              ? <CheckCircle size={16} className="text-green-500" />
              : <XCircle size={16} className="text-red-500" />
              }
              <span className={`${
              statusMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}>{statusMessage.text}</span>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;