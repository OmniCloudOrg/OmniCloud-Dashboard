"use client";

import React, { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PaginatedContainer } from "../ui/PaginatedContainer";

export const BuildStatus = () => {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 5;

    const fetchBuilds = async (page) => {
        console.log(`Fetching builds for page ${page}`);
        setLoading(true);
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
            const response = await fetch(
                `${apiBaseUrl}/builds?page=${page}&per_page=${itemsPerPage}`
            );
            const data = await response.json();
            
            if (!data || data.length === 0) {
                console.warn('No data found from API, using mock data');
                // Generate mock data for demonstration
                const mockData = [
                    { id: 1, name: "App 1", version: "v2.3.4", status: "success", progress: 100, provider: "AWS", updated: new Date().toLocaleString() },
                    { id: 2, name: "App 2", version: "v1.0.0", status: "running", progress: 50, provider: "GCP", updated: new Date().toLocaleString() },
                    { id: 3, name: "App 3", version: "v3.2.1", status: "failed", progress: 100, provider: "Azure", updated: new Date().toLocaleString() },
                    { id: 4, name: "App 4", version: "v0.9.1", status: "pending", progress: 0, provider: "AWS", updated: new Date().toLocaleString() },
                    { id: 5, name: "App 5", version: "v1.1.5", status: "success", progress: 100, provider: "GCP", updated: new Date().toLocaleString() },
                    { id: 6, name: "App 6", version: "v2.0.0", status: "running", progress: 75, provider: "AWS", updated: new Date().toLocaleString() },
                    { id: 7, name: "App 7", version: "v1.2.3", status: "success", progress: 100, provider: "Azure", updated: new Date().toLocaleString() },
                    { id: 8, name: "App 8", version: "v3.0.0", status: "failed", progress: 100, provider: "GCP", updated: new Date().toLocaleString() },
                    { id: 9, name: "App 9", version: "v0.5.2", status: "pending", progress: 0, provider: "AWS", updated: new Date().toLocaleString() },
                    { id: 10, name: "App 10", version: "v4.1.0", status: "success", progress: 100, provider: "Azure", updated: new Date().toLocaleString() }
                ];
                
                // Calculate which builds to show for the current page
                const start = page * itemsPerPage;
                const end = start + itemsPerPage;
                const paginatedBuilds = mockData.slice(start, end);
                
                setBuilds(paginatedBuilds);
                setTotalPages(Math.ceil(mockData.length / itemsPerPage));
                console.log(`Using mock data: showing items ${start+1}-${end} of ${mockData.length}`);
            } else {
                // Transform the data
                const transformedBuilds = data.map((build) => ({
                    id: build.id || build.app_id,
                    name: `App ${build.app_id}`,
                    version: build.source_version,
                    status: build.status === "succeeded" ? "success" : build.status,
                    progress: build.status === "running" ? 50 : 100,
                    provider: "Unknown",
                    updated: new Date(build.completed_at).toLocaleString(),
                }));
                
                setBuilds(transformedBuilds);
                
                // Calculate total pages based on API response
                const calculatedTotal = Math.ceil(data.length / itemsPerPage) || 1;
                setTotalPages(calculatedTotal);
                console.log(`API data: ${data.length} items, ${calculatedTotal} pages`);
            }
        } catch (error) {
            console.error("Failed to fetch builds:", error);
            // Use mock data on error
            const mockData = [
                { id: 1, name: "App 1", version: "v2.3.4", status: "success", progress: 100, provider: "Unknown", updated: new Date().toLocaleString() },
                { id: 2, name: "App 2", version: "v1.0.0", status: "running", progress: 50, provider: "Unknown", updated: new Date().toLocaleString() },
                { id: 3, name: "App 3", version: "v3.2.1", status: "failed", progress: 100, provider: "Unknown", updated: new Date().toLocaleString() }
            ];
            setBuilds(mockData);
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

    useEffect(() => {
        fetchBuilds(currentPage);
    }, [currentPage]);

    return (
        <PaginatedContainer
            title="Recent Builds"
            titleIcon={<Rocket size={18} className="text-blue-400" />}
            viewAllLink="/dash/apps"
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevPage}
            onNext={handleNextPage}
            debug={true} // Enable debug info
        >
            {loading ? (
                <div className="p-4 text-center text-slate-400">Loading builds for page {currentPage + 1}...</div>
            ) : builds.length === 0 ? (
                <div className="p-4 text-center text-slate-400">No builds found.</div>
            ) : (
                <div className="divide-y divide-slate-800">
                    {builds.map((build) => (
                        <div key={build.id} className="p-4 hover:bg-slate-800/30">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 rounded-lg p-2">
                                    <Rocket size={20} className="text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <div className="font-medium text-white truncate">
                                            {build.name}
                                        </div>
                                        <StatusBadge status={build.status} />
                                    </div>
                                    <div className="text-sm text-slate-400 mt-1">
                                        {build.version} • {build.provider}
                                    </div>
                                    {build.status === "running" && (
                                        <div className="mt-2">
                                            <div className="w-full bg-slate-800 rounded-full h-1.5">
                                                <div
                                                    className="h-full rounded-full bg-blue-500"
                                                    style={{ width: `${build.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-500 mt-2">
                                        Updated {build.updated}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PaginatedContainer>
    );
};

export default BuildStatus;