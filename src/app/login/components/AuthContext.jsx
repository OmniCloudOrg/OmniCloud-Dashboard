"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Dev mode settings - REMOVE IN PRODUCTION
const DEV_MODE = process.env.NODE_ENV === 'development';
const DEV_USER = {
  name: 'Development User',
  email: 'dev@example.com',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('omnicloud_token');
        
        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll just assume it's valid
          
          // In dev mode, return a dev user
          if (DEV_MODE && token === 'dev_token') {
            setUser(DEV_USER);
            setLoading(false);
            return;
          }
          
          // Simulate getting user data from API
          // In a real app, you would fetch user data from your backend
          const userData = {
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
          };
          
          setUser(userData);
        } else {
          setUser(null);
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
    setLoading(true);
    
    try {
      // In a real app, you would send a request to your backend
      // For now, we'll just simulate a successful login
      
      // Dev mode shortcut
      if (DEV_MODE && email === 'dev@example.com') {
        localStorage.setItem('omnicloud_token', 'dev_token');
        setUser(DEV_USER);
        router.replace('/dash');
        return true;
      }
      
      // Simulate API request
      localStorage.setItem('omnicloud_token', 'user_authenticated_token');
      
      const userData = {
        name: 'John Doe',
        email: email,
        role: 'user',
      };
      
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('omnicloud_token');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;