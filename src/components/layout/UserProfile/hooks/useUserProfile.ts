import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserData } from '../types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

export const useUserProfile = (isOpen: boolean) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
            localStorage.removeItem('omnicloud_token');
            router.replace('/login');
            return;
          }
          throw new Error(`Error fetching user data: ${response.status}`);
        }

        const userData = await response.json();
        
        const profileResponse = await fetch(`${apiBaseUrl}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        let profileData: any = {};
        if (profileResponse.ok) {
          profileData = await profileResponse.json();
        }

        setUser({
          ...userData,
          displayName: profileData.full_name || profileData.display_name || userData.name,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
        });
      } catch (err: any) {
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

  const handleLogout = () => {
    const token = localStorage.getItem('omnicloud_token');
    
    if (token) {
      fetch(`${apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).catch(error => {
        console.error('Error during logout:', error);
      });
    }
    
    localStorage.removeItem('omnicloud_token');
    router.replace('/login');
  };

  const getDisplayName = (user: UserData | null) => {
    if (!user) return 'User';
    
    if (user.displayName) return user.displayName;
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    
    if (user.name) return user.name;
    
    return user.email;
  };

  return {
    user,
    isLoading,
    error,
    handleLogout,
    getDisplayName
  };
};