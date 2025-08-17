import { useEffect } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

export const useUserData = (setUserProfile: (updater: (prev: any) => any) => void) => {
  useEffect(() => {
    const fetchUserData = async () => {
      setUserProfile(prev => ({ ...prev, isLoading: true }));
      
      try {
        const token = localStorage.getItem('omnicloud_token');
        
        if (!token) {
          setUserProfile(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(prev => ({ ...prev, userData: data, isLoading: false }));
        } else {
          setUserProfile(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
        setUserProfile(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    fetchUserData();
  }, [setUserProfile]);

  const getUserInitials = (userData: any) => {
    if (!userData) return 'U';
    
    const displayName = 
      userData.full_name || 
      userData.display_name || 
      userData.name || 
      userData.email;
    
    if (!displayName) return 'U';
    
    const nameParts = displayName.split(' ');
    
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    
    return displayName.substring(0, 2).toUpperCase();
  };

  return { getUserInitials };
};