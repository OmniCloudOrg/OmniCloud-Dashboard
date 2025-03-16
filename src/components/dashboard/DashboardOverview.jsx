"use client"

import React from 'react';
import { RefreshCw, Zap, Box, Server, Cpu, CreditCard, Activity, Database } from 'lucide-react';

// Import all the component modules
import { ResourceCard } from       '@/components/ui/ResourceCard';
import { StatusCard } from         '@/components/ui/StatusCard';
import { MultiRegionStatus } from  './MultiRegionStatus';
import { ResourceUsageChart } from './ResourceUsageChart';
import { RunningServices } from    './RunningServices';
import { BuildStatus } from        './BuildStatus';
import { CostOverview } from       './CostOverview';
import { AlertsOverview } from     './AlertsOverview';
import { RecentActivity } from     './RecentActivity';

const DashboardOverview = () => {
const [quickActionsOpen, setQuickActionsOpen] = React.useState(false);

const toggleQuickActions = () => {
    setQuickActionsOpen(prev => !prev);
};

return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                </button>
                <div className="relative">
                    <button 
                        onClick={toggleQuickActions}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Zap size={16} />
                        <span>Quick Actions</span>
                    </button>
                    {quickActionsOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10">
                            <ul className="py-1">
                                <li className="px-4 py-2 hover:bg-slate-700 text-white cursor-pointer">New Application</li>
                                <li className="px-4 py-2 hover:bg-slate-700 text-white cursor-pointer">Deploy Service</li>
                                <li className="px-4 py-2 hover:bg-slate-700 text-white cursor-pointer">Scale Resources</li>
                                <li className="px-4 py-2 hover:bg-slate-700 text-white cursor-pointer">View Logs</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* Resource Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard 
                title="Total Applications" 
                value="56" 
                percentage="8" 
                trend="up" 
                icon={Box} 
                color="bg-blue-500/10 text-blue-400" 
            />
            <ResourceCard 
                title="Running Instances" 
                value="128" 
                percentage="12" 
                trend="up" 
                icon={Server} 
                color="bg-green-500/10 text-green-400" 
            />
            <ResourceCard 
                title="CPU Utilization" 
                value="62%" 
                percentage="5" 
                trend="down" 
                icon={Cpu} 
                color="bg-purple-500/10 text-purple-400" 
            />
            <ResourceCard 
                title="Monthly Cost" 
                value="$15.2k" 
                percentage="3" 
                trend="up" 
                icon={CreditCard} 
                color="bg-amber-500/10 text-amber-400" 
            />
        </div>
        
        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard 
                title="Platform Health" 
                status="healthy" 
                icon={Activity} 
                details="All systems operational" 
            />
            <StatusCard 
                title="API Gateway" 
                status="warning" 
                icon={Server} 
                details="High latency in us-west region" 
            />
            <StatusCard 
                title="Database Cluster" 
                status="healthy" 
                icon={Database} 
                details="All replicas in sync" 
            />
        </div>
        
        {/* Multi-Region Status */}
        <MultiRegionStatus />
        
        {/* Resource Usage Chart */}
        <ResourceUsageChart />
        
        {/* Two-column layout for remaining components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RunningServices />
            <CostOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsOverview />
            <BuildStatus />
        </div>
        
        {/* Recent Activity */}
        <RecentActivity />
    </div>
);
};

export default DashboardOverview;