"use client"

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectRoute from '@/components/auth/ProtectRoute';
import { PlatformProvider } from '@/components/context/PlatformContext';
import '../globals.css';

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
        {children}
      </DashboardLayout>
      </PlatformProvider>
    </ProtectRoute>
  );
}