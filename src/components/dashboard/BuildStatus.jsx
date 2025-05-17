"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Rocket } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PaginatedContainer } from "../ui/PaginatedContainer";
import { BuildsApiClient } from '@/utils/apiClient/builds';

export const BuildStatus = ({ platformId }) => {
    // State for builds data
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);
    const itemsPerPage = 5; // Match your API's per_page parameter

    // Track if we're currently fetching data to prevent duplicate requests
    const isFetchingRef = useRef(false);
    
    // Track the last platform ID to prevent redundant updates
    const lastPlatformIdRef = useRef(null);
    
    // Track the last page to prevent redundant fetches
    const lastPageRef = useRef(null);
    
    // API request cancellation controller
    const abortControllerRef = useRef(null);

    // Initialize API client
    const buildsClient = useMemo(() => {
        // Only create the client if we have a platformId
        if (!platformId) return null;
        return new BuildsApiClient(Number(platformId));
    }, [platformId]);

    // Handle platform changes
    useEffect(() => {
        // Skip if platform ID hasn't changed or is not provided
        if (!platformId || platformId === lastPlatformIdRef.current) return;
        
        // Update last platform ID ref
        lastPlatformIdRef.current = platformId;
        
        // Reset state for the new platform
        setBuilds([]);
        setCurrentPage(0);
        setTotalPages(1);
        setError(null);
        
        // Reset last page ref
        lastPageRef.current = null;
        
        // Fetch data with slight delay to prevent race conditions
        const timer = setTimeout(() => {
            fetchBuilds(0);
        }, 50);
        
        return () => clearTimeout(timer);
    }, [platformId]);

    const fetchBuilds = useCallback(async (page) => {
        // Skip if no platform selected
        if (!platformId || !buildsClient) {
            setLoading(false);
            setError("No platform selected");
            return;
        }
        
        // Skip if already fetching or if we're fetching the same page with the same platform
        if (isFetchingRef.current || (page === lastPageRef.current && platformId === lastPlatformIdRef.current && builds.length > 0)) {
            return;
        }
        
        // Set fetching flag to prevent duplicate requests
        isFetchingRef.current = true;
        setLoading(true);
        setError(null);
        
        // Update the last page ref
        lastPageRef.current = page;
        
        // Cancel any in-flight requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Create a new abort controller
        abortControllerRef.current = new AbortController();
        
        try {
            console.log(`Fetching builds for platform: ${platformId}, page: ${page}`);
            
            // Use the API client to fetch builds
            const response = await buildsClient.listBuilds({
                page: page,
                per_page: itemsPerPage
            });
            
            // Extract builds and pagination info
            const fetchedBuilds = response.data || [];
            const paginationInfo = response.pagination || {};
            
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
            // Don't report errors for aborted requests
            if (error.name === 'AbortError') {
                console.log('Build status request was cancelled');
                return;
            }
            
            console.error("Failed to fetch builds:", error);
            setError(error.message || "Failed to load builds");
            setBuilds([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [platformId, builds.length, buildsClient]);

    // Handle page navigation
    const handlePrevPage = useCallback(() => {
        if (currentPage > 0) {
            const newPage = currentPage - 1;
            console.log(`Moving to previous page: ${newPage}`);
            setCurrentPage(newPage);
        }
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages - 1) {
            const newPage = currentPage + 1;
            console.log(`Moving to next page: ${newPage}`);
            setCurrentPage(newPage);
        }
    }, [currentPage, totalPages]);

    // Fetch builds when page changes (but not on initial render if we've already fetched)
    useEffect(() => {
        // Skip if no platform selected
        if (!platformId) return;
        
        // Skip if currentPage is the same as the last page we fetched
        if (currentPage === lastPageRef.current && builds.length > 0) return;
        
        fetchBuilds(currentPage);
    }, [currentPage, fetchBuilds, platformId, builds.length]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Cancel any pending requests when component unmounts
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <PaginatedContainer
            title="Recent Builds"
            titleIcon={<Rocket size={18} className="text-blue-400" />}
            viewAllLink="/dash/apps"
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevPage}
            onNext={handleNextPage}
        >
            {!platformId ? (
                <div className="p-6 text-center text-slate-400">Select a platform to view build status</div>
            ) : loading && builds.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent mb-2"></div>
                    <div>Loading builds...</div>
                </div>
            ) : error ? (
                <div className="p-6 text-center text-red-400">Error: {error}</div>
            ) : builds.length === 0 ? (
                <div className="p-6 text-center text-slate-400">No builds found.</div>
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

// Set default props
BuildStatus.defaultProps = {
    platformId: null
};

export default BuildStatus;