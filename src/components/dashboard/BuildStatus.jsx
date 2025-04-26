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
    const itemsPerPage = 5; // Match your API's per_page parameter

    // Get API base URL from environment variable or use default
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

    const fetchBuilds = async (page) => {
        console.log(`Fetching builds for page ${page}`);
        setLoading(true);
        try {
            const response = await fetch(
                `${apiBaseUrl}/builds?page=${page}&per_page=${itemsPerPage}`
            );
            
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check if the response has the expected structure
            if (!data || !data.builds) {
                console.warn('Invalid API response format, expected { builds: [...], pagination: {...} }');
                setBuilds([]);
                setTotalPages(1);
                return;
            }
            
            // Extract builds and pagination info
            const fetchedBuilds = data.builds || [];
            const paginationInfo = data.pagination || {};
            
            // Transform the data
            const transformedBuilds = fetchedBuilds.map((build) => ({
                id: build.id || build.app_id,
                name: `App ${build.app_id}`,
                version: build.source_version,
                status: build.status === "succeeded" ? "success" : build.status,
                progress: build.status === "running" ? 50 : 100,
                provider: "Node.js",
                updated: new Date(build.completed_at || build.created_at).toLocaleString(),
            }));
            
            // Update state with transformed data
            setBuilds(transformedBuilds);
            
            // Set pagination state from API response
            if (paginationInfo) {
                setCurrentPage(paginationInfo.page || 0);
                setTotalPages(paginationInfo.total_pages || 1);
                
                console.log(`Loaded page ${paginationInfo.page + 1} of ${paginationInfo.total_pages}, showing ${fetchedBuilds.length} of ${paginationInfo.total_count} builds`);
            } else {
                console.warn('No pagination info in API response');
                setTotalPages(Math.ceil(fetchedBuilds.length / itemsPerPage) || 1);
            }
        } catch (error) {
            console.error("Failed to fetch builds:", error);
            setBuilds([]);
            setTotalPages(1);
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
        } else {
            console.log("Already at first page, cannot go previous");
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            const newPage = currentPage + 1;
            console.log(`Moving to next page: ${newPage}`);
            setCurrentPage(newPage);
        } else {
            console.log("Already at last page, cannot go next");
        }
    };

    useEffect(() => {
        fetchBuilds(currentPage);
    }, [currentPage, apiBaseUrl]);

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