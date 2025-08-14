"use client"

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectRoute from '@/components/auth/ProtectRoute';
import { PlatformProvider, usePlatform } from '@/components/context/PlatformContext';
import '../globals.css';

// Create a wrapper component to manage the key
const PlatformKeyManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedPlatformId } = usePlatform();
  
  // When platform changes, the key changes, forcing a remount of children
  return (
    <div
      key={`platform-${selectedPlatformId || 'none'}`}
      className='h-[calc(100%-80px)]'
    >
      {children}
    </div>
  );
};

/**
 * Root layout component for the application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectRoute>
      <PlatformProvider>
        <DashboardLayout>
          <PlatformKeyManager>
            {children}
          </PlatformKeyManager>
        </DashboardLayout>
      </PlatformProvider>
    </ProtectRoute>
  );
}