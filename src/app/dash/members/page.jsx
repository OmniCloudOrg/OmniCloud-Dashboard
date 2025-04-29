"use client"

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  UserX,
  Loader2
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
  
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/users?page=0&per_page=100`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match the format expected by the component
        const transformedUsers = data.users.map(user => ({
          id: user.id,
          name: user.email.split('@')[0], // Use part of email as name since API doesn't have names
          email: user.email,
          role: determineRole(user.email), // Derive role from email domain or other logic
          status: user.status,
          teams: determineTeams(user.email), // Derive teams from email or other info
          twoFactorEnabled: Boolean(user.email_verified),
          lastActive: user.last_login_at ? formatLastActive(user.last_login_at) : 'Never',
          dateAdded: formatDateAdded(user.created_at),
          profilePic: `https://i.pravatar.cc/150?img=${user.id % 70}` // Generate avatar based on ID
        }));
        
        setUsers(transformedUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [apiBaseUrl]);
  
  // Helper function to determine role from email
  const determineRole = (email) => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('developer')) return 'developer';
    if (email.includes('support')) return 'support';
    if (email.includes('billing')) return 'billing';
    if (email.includes('test')) return 'tester';
    return 'viewer';
  };
  
  // Helper function to determine teams from email
  const determineTeams = (email) => {
    const teams = [];
    const domain = email.split('@')[1];
    
    // Assign teams based on email patterns
    if (email.includes('developer') || email.includes('test')) {
      teams.push('Development');
    }
    
    if (email.includes('admin')) {
      teams.push('Administration');
    }
    
    if (domain === 'techops.co') {
      teams.push('DevOps');
    }
    
    if (domain === 'company.com' || domain === 'example.com') {
      teams.push('Core');
    }
    
    if (domain === 'cloudplatform.io') {
      teams.push('Platform');
    }
    
    // Ensure everyone has at least one team
    if (teams.length === 0) {
      teams.push('General');
    }
    
    return teams;
  };
  
  // Format the lastActive date to a relative time
  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
      }
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    }
  };
  
  // Format the dateAdded to a relative time
  const formatDateAdded = (dateString) => {
    return formatLastActive(dateString);
  };
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesTeam = teamFilter === 'all' || user.teams.includes(teamFilter);
    
    return matchesSearch && matchesRole && matchesStatus && matchesTeam;
  });
  
  // Generate unique role options from actual user data
  const roleOptions = ['all', ...new Set(users.map(user => user.role))];
  
  // Generate unique status options from actual user data
  const statusOptions = ['all', ...new Set(users.map(user => user.status))];
  
  // Generate unique team options from all teams across users
  const teamOptions = ['all', ...new Set(users.flatMap(user => user.teams))];
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setTeamFilter('all');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-lg text-white">Loading users...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-800 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-300 mb-2">Error</h2>
        <p className="text-white mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
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
                {roleOptions.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                {teamOptions.map(team => (
                  <option key={team} value={team}>
                    {team === 'all' ? 'All Teams' : team}
                  </option>
                ))}
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
          users={users}
        />
      )}
      
      {isModalOpen && (
        <AddUserModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          apiBaseUrl={apiBaseUrl}
        />
      )}
    </div>
  );
};

export default UserAccessManagement;