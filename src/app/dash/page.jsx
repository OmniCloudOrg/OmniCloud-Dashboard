"use client"

import React from 'react';
import DashboardOverview from './components/dashboard/DashboardOverview';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex flex-col h-full">    
        {/* Main Content */}
          <DashboardOverview />
      </div>
    </div>
  )
}