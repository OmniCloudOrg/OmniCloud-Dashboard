"use client"

import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  UserX 
} from 'lucide-react';

// Import components
import { UserCard } from './components/UserCard';
import { AddUserModal } from './components/AddUserModal';
import { UserDetail } from './components/UserDetail';

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
    // ... other sample users (truncated for brevity)
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
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setTeamFilter('all');
  };
  
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
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <UserDetail 
          user={selectedUser} 
          onBack={() => setSelectedUser(null)} 
          users={sampleUsers}
        />
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