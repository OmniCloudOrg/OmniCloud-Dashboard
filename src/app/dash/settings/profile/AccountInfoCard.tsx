import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

const AccountInfoCard: React.FC = () => {
  // State for user data
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('omnicloud_token');
        
        if (!token) {
          router.replace('/login');
          return;
        }
        
        // Fetch user profile data
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('omnicloud_token');
            router.replace('/login');
            return;
          }
          throw new Error(`Error fetching user data: ${response.status}`);
        }
        
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load account information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  // Render loading state
  if (loading) {
    return (
      <div className="mt-6 bg-gray-900 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase mb-3">Account Info</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="mt-6 bg-gray-900 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase mb-3">Account Info</h3>
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    );
  }

  // Render user data
  return (
    <div className="mt-6 bg-gray-900 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase mb-3">Account Info</h3>
      {userData ? (
        <>
          <div className="mb-2">
            <div className="text-xs text-gray-500">User ID</div>
            <div className="text-sm text-gray-300">{userData.id}</div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500">Created</div>
            <div className="text-sm text-gray-300">
              {new Date(userData.created_at).toLocaleString()}
            </div>
          </div>
          <div className="mb-2">
            <div className="text-xs text-gray-500">Last Login</div>
            <div className="text-sm text-gray-300">
              {userData.last_login_at 
                ? new Date(userData.last_login_at).toLocaleString() 
                : 'Never'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div className="flex items-center mt-1">
              <div className={`w-2 h-2 rounded-full ${userData.active ? 'bg-green-400' : 'bg-red-400'} mr-2`}></div>
              <span className="text-sm text-gray-300">{userData.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-sm">No data available</div>
      )}
    </div>
  );
};

export default AccountInfoCard;