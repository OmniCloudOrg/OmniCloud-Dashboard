"use client";

import { useState, useEffect } from 'react';
import LoginPageComponent from './login/page';
import { useRouter } from 'next/navigation';

// Simple auth check function
const checkAuth = () => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    return localStorage.getItem('omnicloud_token') !== null;
  }
  return false;
};

// Dev override - REMOVE IN PRODUCTION
const DEV_MODE = process.env.NODE_ENV === 'development';
const DEV_SKIP_AUTH = false; // Set to false to test normal auth flow in dev

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Dev mode bypass
    if (DEV_MODE && DEV_SKIP_AUTH) {
      console.log('DEV MODE: Bypassing authentication');
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check auth status
    const authStatus = checkAuth();
    setIsAuthenticated(authStatus);
    setIsLoading(false);
    
    // Redirect to dashboard if authenticated
    if (authStatus) {
      router.replace('/dash');
    }
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#020617' }}>
      </div>
    );
  }

  // Render login page if not authenticated
  // Since LoginPageComponent handles its own redirect via router.replace('/dash')
  // we don't need to pass an onLogin callback
  return !isAuthenticated ? <LoginPageComponent /> : null;
}