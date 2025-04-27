"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

export default function ProtectRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if we're on the client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('omnicloud_token');

      if (!token) {
        // Redirect to login if no token exists
        router.replace('/login');
        setIsLoading(false);
        return;
      }

      // Validate token with backend
      const validateToken = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Token is invalid
            localStorage.removeItem('omnicloud_token');
            router.replace('/login');
            setIsAuthenticated(false);
          } else {
            // Token is valid
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('omnicloud_token');
          router.replace('/login');
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      };

      validateToken();
    }
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="mt-4 text-slate-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Only render children if authenticated
  return isAuthenticated ? children : null;
}