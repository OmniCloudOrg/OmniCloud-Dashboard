"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import { PaginatedContainer } from "@/components/ui/PaginatedContainer";
import { AlertsApiClient } from '@/utils/apiClient/alerts';

export const AlertsOverview = ({ platformId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 5; // Show 5 items per page
  
  // Track if we're currently fetching data to prevent duplicate requests
  const isFetchingRef = useRef(false);
  
  // Track the last platform ID to prevent redundant updates
  const lastPlatformIdRef = useRef(null);
  
  // Track the last page to prevent redundant fetches
  const lastPageRef = useRef(null);
  
  // API request cancellation controller
  const abortControllerRef = useRef(null);
  
  // Initialize API client
  const alertsClient = useMemo(() => {
    // Only create the client if we have a platformId
    if (!platformId) return null;
    return new AlertsApiClient(Number(platformId));
  }, [platformId]);

  // Handle platform changes
  useEffect(() => {
    // Skip if platform ID hasn't changed or is not provided
    if (!platformId || platformId === lastPlatformIdRef.current) return;
    
    // Update last platform ID ref
    lastPlatformIdRef.current = platformId;
    
    // Reset state for the new platform
    setAlerts([]);
    setCurrentPage(0);
    setTotalPages(1);
    setError(null);
    
    // Reset last page ref
    lastPageRef.current = null;
    
    // Fetch data with slight delay to prevent race conditions
    const timer = setTimeout(() => {
      fetchAlerts(0);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [platformId]);

  const fetchAlerts = useCallback(async (page) => {
    // Skip if no platform selected
    if (!platformId || !alertsClient) {
      setLoading(false);
      setError("No platform selected");
      return;
    }
    
    // Skip if already fetching or if we're fetching the same page with the same platform
    if (isFetchingRef.current || (page === lastPageRef.current && platformId === lastPlatformIdRef.current && alerts.length > 0)) {
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
      console.log(`Fetching alerts for platform: ${platformId}, page: ${page}`);
      
      // Use the API client to fetch alerts
      const response = await alertsClient.listAlerts({
        page: page,
        per_page: itemsPerPage
      });
      
      // Extract alerts and pagination info
      const fetchedAlerts = response.data || [];
      const paginationInfo = response.pagination || {};
      
      // Update state with API response data
      setAlerts(fetchedAlerts);
      
      // Set pagination state from API response
      if (paginationInfo) {
        setCurrentPage(paginationInfo.page || 0);
        setTotalPages(paginationInfo.total_pages || 1);
        
        console.log(`Loaded page ${paginationInfo.page + 1} of ${paginationInfo.total_pages}, showing ${fetchedAlerts.length} of ${paginationInfo.total_count} alerts`);
      } else {
        console.warn('No pagination info in API response');
        setTotalPages(Math.ceil(fetchedAlerts.length / itemsPerPage) || 1);
      }
    } catch (error) {
      // Don't report errors for aborted requests
      if (error.name === 'AbortError') {
        console.log('Alerts request was cancelled');
        return;
      }
      
      console.error("Failed to fetch alerts:", error);
      setError(error.message || "Failed to load alerts");
      setAlerts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [platformId, alerts.length, alertsClient]);

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

  // Fetch alerts when page changes (but not on initial render if we've already fetched)
  useEffect(() => {
    // Skip if no platform selected
    if (!platformId) return;
    
    // Skip if currentPage is the same as the last page we fetched
    if (currentPage === lastPageRef.current && alerts.length > 0) return;
    
    fetchAlerts(currentPage);
  }, [currentPage, fetchAlerts, platformId, alerts.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "critical":
        return { icon: <AlertCircle size={16} />, color: "bg-red-500/10 text-red-400" };
      case "warning":
        return { icon: <AlertTriangle size={16} />, color: "bg-yellow-500/10 text-yellow-400" };
      case "info":
      default:
        return { icon: <Info size={16} />, color: "bg-blue-500/10 text-blue-400" };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">Active</span>;
      case "acknowledged":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">Acknowledged</span>;
      case "resolved":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">Resolved</span>;
      case "auto_resolved":
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">Auto Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <PaginatedContainer
      title="Active Alerts"
      titleIcon={<Bell size={18} className="text-blue-400" />}
      viewAllLink="/dash/alerts"
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevious={handlePrevPage}
      onNext={handleNextPage}
    >
      {!platformId ? (
        <div className="p-6 text-center text-slate-400">Select a platform to view alerts</div>
      ) : loading && alerts.length === 0 ? (
        <div className="p-6 text-center text-slate-400">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent mb-2"></div>
          <div>Loading alerts...</div>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-400">Error: {error}</div>
      ) : alerts.length === 0 ? (
        <div className="p-6 text-center text-slate-400">No alerts found.</div>
      ) : (
        <div className="divide-y divide-slate-800">
          {alerts.map((alert) => {
            const { icon, color } = getSeverityStyles(alert.severity);
          
            return (
              <div key={alert.id} className="p-4 hover:bg-slate-800/30">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-white capitalize">{alert.alert_type.replace(/_/g, " ")}</div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(alert.status)}
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            alert.severity === "critical"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : alert.severity === "warning"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {alert.severity}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mt-1">{alert.message}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm text-slate-500">
                        Service: <span className="text-slate-300">{alert.service}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PaginatedContainer>
  );
};

// Set default props
AlertsOverview.defaultProps = {
  platformId: null
};

export default AlertsOverview;