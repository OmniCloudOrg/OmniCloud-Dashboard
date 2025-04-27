"use client"

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectRoute from '../../components/auth/ProtectRoute';
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
    <html lang="en">
      <head>
        <title>OmniCloud Dashboard</title>
        <meta name="description" content="OmniCloud - Cloud Management Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <ProtectRoute>
        <body>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </body>
      </ProtectRoute>
    </html>
  );
}