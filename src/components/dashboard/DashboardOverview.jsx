"use client"

import React, { useState, useEffect } from 'react';
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
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [stats, setStats] = useState({
        appsCount: "...",
        instancesCount: "...",
        cpuUtilization: "62%",
        monthlyCost: "$15.2k"
    });
    // Track loading state for each card independently
    const [loading, setLoading] = useState({
        appsCount: true,
        instancesCount: true,
        cpuUtilization: false,
        monthlyCost: false
    });
    // Track percentage changes
    const [changes, setChanges] = useState({
        appsCount: { value: "0", trend: "up" },
        instancesCount: { value: "0", trend: "up" },
        cpuUtilization: { value: "5", trend: "down" },
        monthlyCost: { value: "3", trend: "up" }
    });
    const [error, setError] = useState(null);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

    // Memoize the apiBaseUrl to prevent unnecessary re-renders
    const memoizedApiBaseUrl = React.useMemo(() => apiBaseUrl, [apiBaseUrl]);

    // Use a single function to fetch data for a specific card
    const fetchCardData = async (key, endpoint) => {
        if (!memoizedApiBaseUrl) return;
        
        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const controller = new AbortController();
            const signal = controller.signal;
            
            // Set a timeout to abort the fetch if it takes too long
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(`${memoizedApiBaseUrl}/${endpoint}`, { signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`Failed to fetch ${key}`);
            const data = await response.text();
            setStats(prev => ({ ...prev, [key]: data.trim() }));
            
            return data.trim();
        } catch (err) {
            if (err.name === 'AbortError') {
                console.warn(`Fetch for ${key} timed out`);
            } else {
                console.error(`Error fetching ${key}:`, err);
            }
            return null;
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const fetchData = async () => {
        setError(null);
        
        // Only fetch the two endpoints we need
        fetchCardData('appsCount', 'apps/count');
        fetchCardData('instancesCount', 'instances/count');
        
        // CPU and cost are static for now, no need to fetch
    };
    
    // Only run on initial mount
    useEffect(() => {
        fetchData();
    }, []);

    const toggleQuickActions = () => {
        setQuickActionsOpen(prev => !prev);
    };

    const handleRefresh = () => {
        fetchData();
    };

    // Check if any card is still loading
    const isAnyLoading = loading.appsCount || loading.instancesCount;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <div className="flex items-center gap-4">
                    <button 
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={handleRefresh}
                        disabled={isAnyLoading}
                    >
                        <RefreshCw size={16} className={isAnyLoading ? "animate-spin" : ""} />
                        <span>{isAnyLoading ? "Refreshing..." : "Refresh"}</span>
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
            
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg">
                    Error loading dashboard data: {error}
                </div>
            )}
            
            {/* Resource Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ResourceCard 
                    title="Total Applications" 
                    value={stats.appsCount} 
                    percentage={changes.appsCount.value} 
                    trend={changes.appsCount.trend} 
                    icon={Box} 
                    color="bg-blue-500/10 text-blue-400" 
                    loading={loading.appsCount}
                    shine={loading.appsCount}
                />
                <ResourceCard 
                    title="Running Instances" 
                    value={stats.instancesCount} 
                    percentage={changes.instancesCount.value} 
                    trend={changes.instancesCount.trend} 
                    icon={Server} 
                    color="bg-green-500/10 text-green-400" 
                    loading={loading.instancesCount}
                    shine={loading.instancesCount}
                />
                <ResourceCard 
                    title="CPU Utilization" 
                    value={stats.cpuUtilization} 
                    percentage={changes.cpuUtilization.value} 
                    trend={changes.cpuUtilization.trend} 
                    icon={Cpu} 
                    color="bg-purple-500/10 text-purple-400" 
                    loading={loading.cpuUtilization}
                    shine={loading.cpuUtilization}
                />
                <ResourceCard 
                    title="Monthly Cost" 
                    value={stats.monthlyCost} 
                    percentage={changes.monthlyCost.value} 
                    trend={changes.monthlyCost.trend} 
                    icon={CreditCard} 
                    color="bg-amber-500/10 text-amber-400" 
                    loading={loading.monthlyCost}
                    shine={loading.monthlyCost}
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