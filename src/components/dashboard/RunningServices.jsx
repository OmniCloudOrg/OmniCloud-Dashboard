"use client";

import React, { useState, useEffect } from 'react';
import { Server } from 'lucide-react';
import { PaginatedContainer } from '../ui/PaginatedContainer';

export const RunningServices = () => {
    // State management
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    // Fetch data function
    const fetchServices = async (page) => {
        console.log(`Fetching services for page ${page}`);
        setLoading(true);
        
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
        try {
            const response = await fetch(`${apiBaseUrl}/apps?page=${page}&per_page=${itemsPerPage}`);
            const data = await response.json();
            
            console.log('API response:', JSON.stringify(data, null, 2));
            if (!data || data.length === 0) {
                console.warn('No data found from API for this chart.');
            } else {
                const transformedData = data.map(service => ({
                    id: service.id,
                    name: service.name,
                    status: service.status || "unknown",
                    instances: service.instance_count || 0,
                    cpu: Math.floor(Math.random() * 100), // Placeholder
                    memory: Math.floor(Math.random() * 100), // Placeholder
                    provider: service.provider || "unknown"
                }));
                setServices(transformedData);
                
                // Calculate total pages based on API response
                const calculatedTotal = Math.ceil(data.length / itemsPerPage) || 1;
                setTotalPages(calculatedTotal);
                console.log(`API data: ${data.length} items, ${calculatedTotal} pages`);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // Use mock data on error
            const mockData = [
                { id: 1, name: "Frontend Service", status: "healthy", instances: 3, cpu: 45, memory: 60, provider: "AWS" },
                { id: 2, name: "Backend API", status: "warning", instances: 2, cpu: 75, memory: 50, provider: "GCP" }
            ];
            setServices(mockData);
            setTotalPages(1);
            console.log("Error occurred, using fallback data");
        } finally {
            setLoading(false);
        }
    };

    // Handle page navigation
    const handlePrevPage = () => {
        if (currentPage > 0) {
            const newPage = currentPage - 1;
            console.log(`Moving to previous page: ${newPage}`);
            setCurrentPage(newPage);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            const newPage = currentPage + 1;
            console.log(`Moving to next page: ${newPage}`);
            setCurrentPage(newPage);
        }
    };

    // Fetch data when page changes
    useEffect(() => {
        fetchServices(currentPage);
    }, [currentPage]);

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
            debug={true} // Enable debug info
        >
            {loading ? (
                <div className="p-6 text-center text-slate-400">Loading services...</div>
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

export default RunningServices;