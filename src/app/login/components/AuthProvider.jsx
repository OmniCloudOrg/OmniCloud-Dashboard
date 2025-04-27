"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// API base URL configuration
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
console.log('API Base URL:', apiBaseUrl);

// Create the auth context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  changePassword: () => {},
  resetPassword: () => {},
  loading: true,
  error: null,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('omnicloud_token');
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Validate token with backend
        try {
          const response = await fetch(`${apiBaseUrl}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token is invalid or expired
            console.log('Auth token invalid, clearing storage');
            localStorage.removeItem('omnicloud_token');
            setUser(null);
          }
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          // Don't clear token on network errors to prevent logouts on temporary outages
        }
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse login response:', e);
        setError('Server returned an invalid response');
        return false;
      }
      
      if (response.ok) {
        localStorage.setItem('omnicloud_token', data.token);
        setUser(data.user);
        return true;
      } else {
        setError(data.message || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setError(null);
    
    try {
      // Exactly match the format expected by your API
      const requestBody = JSON.stringify({ 
        email, 
        password, 
        name 
      });
      
      console.log('Sending registration request to:', `${apiBaseUrl}/auth/register`);
      console.log('With data:', { email, name });
      
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('Registration response status:', response.status);
      
      let data;
      try {
        data = await response.json();
        console.log('Registration response data:', data);
      } catch (e) {
        console.error('Failed to parse registration response:', e);
        setError('Server returned an invalid response');
        return false;
      }
      
      if (response.ok) {
        localStorage.setItem('omnicloud_token', data.token);
        setUser(data.user);
        return true;
      } else {
        setError(data.message || 'Registration failed. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('omnicloud_token');
      
      if (token) {
        // Call logout endpoint to invalidate the session
        try {
          await fetch(`${apiBaseUrl}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (e) {
          console.error('Error during logout API call:', e);
          // Continue with logout even if API call fails
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state, even if API call fails
      localStorage.removeItem('omnicloud_token');
      setUser(null);
      router.replace('/login');
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    
    try {
      const token = localStorage.getItem('omnicloud_token');
      
      if (!token) {
        setError('Not authenticated');
        return false;
      }
      
      const response = await fetch(`${apiBaseUrl}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          current_password: currentPassword, 
          new_password: newPassword 
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse change password response:', e);
        setError('Server returned an invalid response');
        return false;
      }
      
      if (response.ok) {
        // Password changed successfully - note that this will invalidate all sessions
        // The user will need to log in again
        localStorage.removeItem('omnicloud_token');
        setUser(null);
        router.replace('/login');
        return true;
      } else {
        setError(data.message || 'Failed to change password');
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      setError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  // Reset password request function
  const resetPassword = async (email) => {
    setError(null);
    
    try {
      const response = await fetch(`${apiBaseUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        return true;
      } else {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          console.error('Failed to parse reset password response:', e);
          setError('Server returned an invalid response');
          return false;
        }
        setError(data.message || 'Failed to request password reset');
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please check your connection and try again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      register,
      logout,
      changePassword,
      resetPassword,
      loading,
      error,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;