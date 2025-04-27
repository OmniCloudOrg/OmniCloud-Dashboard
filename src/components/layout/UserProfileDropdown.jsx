"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, User, Settings, CreditCard, HelpCircle, Bell, Shield } from 'lucide-react';

// API base URL configuration
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

const UserDropdown = ({ isOpen, onClose }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('omnicloud_token');
        
        if (!token) {
          setError('Not authenticated');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('omnicloud_token');
            router.replace('/login');
            return;
          }
          throw new Error(`Error fetching user data: ${response.status}`);
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, router]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    const token = localStorage.getItem('omnicloud_token');
    
    if (token) {
      // Call logout endpoint to invalidate the session
      fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(error => {
        console.error('Error during logout:', error);
      });
    }
    
    // Clear token regardless of API response
    localStorage.removeItem('omnicloud_token');
    router.replace('/login');
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 rounded-md bg-slate-900 shadow-xl border border-slate-700 z-50 overflow-hidden"
      style={{ animation: 'fadeIn 0.15s ease-out' }}
    >
      <div className="text-lg font-medium text-white px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        User
        <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
          <span className="sr-only">Close panel</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      {isLoading ? (
        <div className="p-4 flex flex-col items-center">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          <p className="mt-2 text-slate-400 text-sm">Loading user data...</p>
        </div>
      ) : error ? (
        <div className="p-3 m-2 rounded bg-red-900 bg-opacity-20 border border-red-800">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-2 text-sm text-blue-400 hover:text-blue-300"
          >
            Return to login
          </button>
        </div>
      ) : user ? (
        <>
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md text-base">
                {user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="ml-3 overflow-hidden">
                <h3 className="text-base font-medium text-white truncate">{user.name || user.email}</h3>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="divide-y divide-slate-700">
            {/* Account section */}
            <div className="py-2">
              <div className="px-4 py-1 text-xs text-slate-400 uppercase font-medium">Account</div>
              
              <button 
                onClick={() => {
                  router.push('/dash/settings/profile');
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
              >
                <User size={16} className="text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Profile Settings</span>
              </button>
              
              <button 
                onClick={() => {
                  router.push('/dash/settings');
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
              >
                <Settings size={16} className="text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Account Settings</span>
              </button>
              
              <button 
                onClick={() => {
                  router.push('/dash/billing');
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
              >
                <CreditCard size={16} className="text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Billing & Subscription</span>
              </button>
            </div>
            
            {/* System section */}
            <div className="py-2">
              <div className="px-4 py-1 text-xs text-slate-400 uppercase font-medium">System</div>
              
              <button 
                onClick={() => {
                  router.push('/dash/notifications');
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
              >
                <Bell size={16} className="text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Notifications</span>
              </button>
              
              <button 
                onClick={() => {
                  router.push('/dash/security');
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
              >
                <Shield size={16} className="text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Security</span>
              </button>
              
              <button 
                onClick={() => {
                  router.push('/dash/help');
                  onClose();
                }}
                className="w-full flex items-center px-4 py-2 hover:bg-slate-800 transition-colors text-left"
              >
                <HelpCircle size={16} className="text-slate-400 mr-3" />
                <span className="text-sm text-slate-300">Help & Support</span>
              </button>
            </div>
          </div>
          
          {/* Logout */}
          <div className="p-3 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded transition-colors"
            >
              <LogOut size={16} className="text-red-400" />
              <span className="text-slate-300 text-sm">Logout</span>
            </button>
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-slate-400">
          No user information available
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default UserDropdown;