"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
      } else {
        // Optionally, you can add token validation logic here
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
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