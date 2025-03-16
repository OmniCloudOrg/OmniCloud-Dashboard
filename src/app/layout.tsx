"use client"

import React from 'react';
import './globals.css';

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

        {children}
      </body>
    </html>
  );
}