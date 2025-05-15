'use client';

import React from 'react';
import { PlatformProvider } from '@/components/context/PlatformContext';
import './globals.css';

/**
 * Client-side wrapper for platform provider
 */
const ClientProviders = ({ children }) => {
  return <PlatformProvider>{children}</PlatformProvider>;
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
    <html lang="en">
      <head>
        <title>OmniCloud Dashboard</title>
        <meta name="description" content="OmniCloud - Cloud Management Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}