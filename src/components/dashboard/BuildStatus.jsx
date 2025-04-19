"use client";

import React, { useEffect, useState } from "react";
import { Rocket } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export const BuildStatus = () => {
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchBuilds = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';
                const response = await fetch(
                    `${apiBaseUrl}/builds?page=${currentPage}&per_page=${itemsPerPage}`
                );
                const data = await response.json();
                setBuilds(
                    data.map((build) => ({
                        name: `App ${build.app_id}`,
                        version: build.source_version,
                        status: build.status === "succeeded" ? "success" : build.status,
                        progress: build.status === "running" ? 50 : 100,
                        provider: "Unknown",
                        updated: new Date(build.completed_at).toLocaleString(),
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch builds:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBuilds();
    }, [currentPage]);

    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Recent Builds</h3>
                <a
                    href="/dash/apps"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                    View All
                </a>
            </div>
            <div className="divide-y divide-slate-800">
                {builds.map((build, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-800/30">
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
            <div className="px-6 py-4 flex justify-between items-center border-t border-slate-800">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className={`text-sm font-medium px-4 py-2 rounded ${
                        currentPage === 0 ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                >
                    Previous
                </button>
                <span className="text-sm text-slate-400">Page {currentPage + 1}</span>
                <button
                    onClick={handleNextPage}
                    className="text-sm font-medium px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
