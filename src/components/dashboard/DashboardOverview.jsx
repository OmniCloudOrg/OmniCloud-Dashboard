'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Zap, Box, Server, Cpu, CreditCard, Activity, Database } from 'lucide-react';

// Import all the component modules
import { ResourceCard } from '@/components/ui/ResourceCard';
import { StatusCard } from '@/components/ui/StatusCard';
import { MultiRegionStatus } from './MultiRegionStatus';
import { ResourceUsageChart } from './ResourceUsageChart';
import { RunningServices } from './RunningServices';
import { BuildStatus } from './BuildStatus';
import CostOverview from './CostOverview';
import { AlertsOverview } from './AlertsOverview';
import { RecentActivity } from './RecentActivity';

// Import the API client
import { ApplicationApiClient } from '@/utils/apiClient/apps';

// Import platform context
import { usePlatform } from '@/components/context/PlatformContext';

const DashboardOverview = () => {
    // Get platform info from context
    const { selectedPlatformId, selectedPlatform } = usePlatform();
    
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
    
    // API client ref to avoid unnecessary recreations
    const apiClientRef = useRef(null);
    
    // Track if data has been fetched to prevent redundant API calls
    const dataFetchedRef = useRef(false);
    
    // Track the last platform ID to prevent redundant updates
    const lastPlatformIdRef = useRef(null);
    
    // Initialize or update API client when platform changes
    useEffect(() => {
        // Skip if platform ID hasn't changed
        if (selectedPlatformId === lastPlatformIdRef.current) return;
        
        // Update last platform ID ref
        lastPlatformIdRef.current = selectedPlatformId;
        
        if (selectedPlatformId) {
            const platformIdNumber = Number(selectedPlatformId);
            apiClientRef.current = new ApplicationApiClient(platformIdNumber);
            
            // Reset fetched flag when platform changes
            dataFetchedRef.current = false;
            
            // Reset data
            setStats({
                appsCount: "...",
                instancesCount: "...",
                cpuUtilization: "62%",
                monthlyCost: "$15.2k"
            });
            
            // Reset loading states
            setLoading({
                appsCount: true,
                instancesCount: true,
                cpuUtilization: false,
                monthlyCost: false
            });
            
            // Refresh data when platform changes - with slight delay to prevent race conditions
            setTimeout(() => {
                fetchData();
            }, 100);
        }
    }, [selectedPlatformId]);
    
    // Use a single function to fetch data for a specific card with debouncing
    const fetchCardData = async (key, fetchFunction) => {
        // Skip if already loading this data
        if (loading[key]) return null;
        
        setLoading(prev => ({ ...prev, [key]: true }));
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            // Execute the provided fetch function (API client method)
            const result = await fetchFunction();
            clearTimeout(timeoutId);

            // Update the state with the fetched data
            setStats(prev => ({ ...prev, [key]: result }));

            return result;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.warn(`Fetch for ${key} timed out`);
            } else {
                console.error(`Error fetching ${key}:`, err);
                setError(`Failed to fetch ${key}: ${err.message}`);
            }
            return null;
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    // Create a single stable fetchData function with proper dependency management
    const fetchData = useCallback(() => {
        if (!apiClientRef.current) return;
        if (!selectedPlatformId) return;
        
        // Set fetched flag to prevent redundant fetches
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;
        
        setError(null);

        // Use Promise.all to fetch all data concurrently
        Promise.all([
            // Fetch app count
            fetchCardData('appsCount', async () => {
                try {
                    const count = await apiClientRef.current.countApps();
                    return count.toString();
                } catch (error) {
                    console.error("Error fetching app count:", error);
                    return "...";
                }
            }),
            
            // Fetch instances count
            fetchCardData('instancesCount', async () => {
                try {
                    const appsData = await apiClientRef.current.listApps({ page: 0, per_page: 100 });
                    const totalInstances = appsData.data.reduce((total, app) => {
                        return total + (app.instances || 0);
                    }, 0);
                    return totalInstances.toString();
                } catch (error) {
                    console.error("Error calculating instance count:", error);
                    return "...";
                }
            })
        ]).catch(err => {
            console.error("Error fetching dashboard data:", err);
        });
        
        // CPU and cost are static for now, no need to fetch
    }, [selectedPlatformId]); // Only depend on selectedPlatformId, not on loading or other state

    const toggleQuickActions = () => {
        setQuickActionsOpen(prev => !prev);
    };

    const handleRefresh = () => {
        // Allow manual refresh to force a new fetch
        dataFetchedRef.current = false;
        fetchData();
    };

    // Check if any card is still loading
    const isAnyLoading = loading.appsCount || loading.instancesCount;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    {selectedPlatform && (
                        <p className="text-sm text-slate-400 mt-1">
                            Platform: <span className="text-blue-400">{selectedPlatform.name}</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={handleRefresh}
                        disabled={isAnyLoading || !selectedPlatformId}
                    >
                        <RefreshCw size={16} className={isAnyLoading ? "animate-spin" : ""} />
                        <span>{isAnyLoading ? "Refreshing..." : "Refresh"}</span>
                    </button>
                    <div className="relative">
                        <button
                            onClick={toggleQuickActions}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            disabled={!selectedPlatformId}
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

            {!selectedPlatformId && (
                <div className="bg-blue-500/20 border border-blue-500 text-blue-400 p-4 rounded-lg">
                    Please select a platform from the dropdown in the navigation bar to view dashboard data.
                </div>
            )}

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
                    disabled={!selectedPlatformId}
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
                    disabled={!selectedPlatformId}
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
                    disabled={!selectedPlatformId}
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
                    disabled={!selectedPlatformId}
                />
            </div>

            {/* Pass a stable apiClient instance to child components, only pass platformId not the full apiClient */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    title="Platform Health"
                    status="healthy"
                    icon={Activity}
                    details="All systems operational"
                    disabled={!selectedPlatformId}
                />
                <StatusCard
                    title="API Gateway"
                    status="warning"
                    icon={Server}
                    details="High latency in us-west region"
                    disabled={!selectedPlatformId}
                />
                <StatusCard
                    title="Database Cluster"
                    status="healthy"
                    icon={Database}
                    details="All replicas in sync"
                    disabled={!selectedPlatformId}
                />
            </div>

            {/* Only render subcomponents if platform is selected */}
            {selectedPlatformId && (
                <>
                    {/* Multi-Region Status */}
                    <MultiRegionStatus platformId={selectedPlatformId} />

                    {/* Resource Usage Chart */}
                    <ResourceUsageChart platformId={selectedPlatformId} />

                    {/* Two-column layout for remaining components */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RunningServices platformId={selectedPlatformId} />
                        <CostOverview platformId={selectedPlatformId} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AlertsOverview platformId={selectedPlatformId} />
                        <BuildStatus platformId={selectedPlatformId} />
                    </div>

                    {/* Recent Activity */}
                    <RecentActivity platformId={selectedPlatformId} />
                </>
            )}
        </div>
    );
};

export default DashboardOverview;