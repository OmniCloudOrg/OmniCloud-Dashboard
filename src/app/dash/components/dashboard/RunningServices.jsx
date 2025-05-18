"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Server } from 'lucide-react';
import { PaginatedContainer } from '@/components/ui/PaginatedContainer';
import { ApplicationApiClient } from '@/utils/apiClient/apps';

export const RunningServices = ({ platformId }) => {
    // State management
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;
    const [error, setError] = useState(null);
    
    // API client reference to prevent recreation
    const apiClientRef = useRef(null);
    
    // Track if this is the initial render
    const isInitialMount = useRef(true);
    
    // Track if we're currently fetching data to prevent duplicate requests
    const isFetchingRef = useRef(false);
    
    // Track the last platform ID to prevent redundant updates
    const lastPlatformIdRef = useRef(null);
    
    // Initialize or update API client when platform changes
    useEffect(() => {
        // Skip if platform ID hasn't changed or is not provided
        if (!platformId || platformId === lastPlatformIdRef.current) return;
        
        // Update last platform ID ref
        lastPlatformIdRef.current = platformId;
        
        // Create new API client
        const platformIdNumber = Number(platformId);
        apiClientRef.current = new ApplicationApiClient(platformIdNumber);
        
        // Reset state when platform changes
        setServices([]);
        setCurrentPage(0);
        setTotalPages(1);
        setError(null);
        
        // Fetch data with slight delay to prevent race conditions
        const timer = setTimeout(() => {
            fetchServices(0);
        }, 50);
        
        return () => clearTimeout(timer);
    }, [platformId]);

    // Fetch data function using the API client with debouncing
    const fetchServices = useCallback(async (page) => {
        // Skip if no platform or API client
        if (!platformId || !apiClientRef.current) {
            setLoading(false);
            setError("No platform selected");
            return;
        }
        
        // Skip if already fetching data
        if (isFetchingRef.current) return;
        
        // Set fetching flag
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
    
        try {
            console.log(`Fetching services for platform: ${platformId}, page: ${page}`);
            
            // Use the API client to fetch applications
            const result = await apiClientRef.current.listApps({
                page: page,
                per_page: itemsPerPage
            });
    
            if (!result || !result.data || result.data.length === 0) {
                console.warn('No services found.');
                setServices([]);
                setTotalPages(1);
            } else {
                const transformedData = result.data.map(service => ({
                    id: service.id,
                    name: service.name,
                    status: service.maintenance_mode ? "maintenance" : "healthy", // Example status logic
                    instances: service.instances || 0,
                    cpu: Math.floor(Math.random() * 100), // Placeholder
                    memory: Math.floor(Math.random() * 100), // Placeholder
                    provider: service.container_image_url ? "custom" : "unknown"
                }));
                
                setServices(transformedData);
                setTotalPages(result.pagination.total_pages || 1);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setError(error.message || "Failed to load services");
            setServices([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [platformId]);

    // Handle page navigation
    const handlePrevPage = useCallback(() => {
        if (currentPage > 0) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
        }
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages - 1) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
        }
    }, [currentPage, totalPages]);

    // Fetch data when page changes, but not on the initial render
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        if (platformId && apiClientRef.current) {
            fetchServices(currentPage);
        }
    }, [currentPage, fetchServices, platformId]);

    // Component rendering
    return (
        <PaginatedContainer
            title="Running Services"
            titleIcon={<Server size={18} className="text-blue-400" />}
            viewAllLink="/dash/apps"
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevPage}
            onNext={handleNextPage}
        >
            {!platformId ? (
                <div className="p-6 text-center text-slate-400">Select a platform to view services</div>
            ) : loading ? (
                <div className="p-6 text-center text-slate-400">Loading services...</div>
            ) : error ? (
                <div className="p-6 text-center text-red-400">Error: {error}</div>
            ) : services.length === 0 ? (
                <div className="p-6 text-center text-slate-400">No services found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Instances</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">CPU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Memory</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-white">{service.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`flex items-center gap-2 ${
                                            service.status === 'healthy' ? 'text-green-400' :
                                            service.status === 'warning' ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                            <div className={`w-2 h-2 rounded-full ${
                                                service.status === 'healthy' ? 'bg-green-400' :
                                                service.status === 'warning' ? 'bg-yellow-400' :
                                                'bg-red-400'
                                            }`}></div>
                                            <div className="text-sm capitalize">{service.status}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{service.instances}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    service.cpu < 50 ? 'bg-green-500' :
                                                    service.cpu < 80 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${service.cpu}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{service.cpu}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    service.memory < 50 ? 'bg-green-500' :
                                                    service.memory < 80 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                                style={{ width: `${service.memory}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">{service.memory}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-300">{service.provider}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </PaginatedContainer>
    );
};

// Fallback if no platformId is provided
RunningServices.defaultProps = {
    platformId: null
};

export default RunningServices;