"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import { PaginatedContainer } from "../ui/PaginatedContainer";
import { AlertsApiClient } from '@/utils/apiClient/alerts';
import { DEFAULT_PLATFORM_ID } from "@/utils/apiConfig";

export const AlertsOverview = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page
  
  // Initialize API client
  const platformId = Number(DEFAULT_PLATFORM_ID || 1);
  const alertsClient = useMemo(() => new AlertsApiClient(platformId), [platformId]);

  useEffect(() => {
    // Fetch data using the API client
    const fetchAlerts = async () => {
      setLoading(true);
      
      try {
        // Use the API client to fetch alerts with pagination
        const response = await alertsClient.listAlerts({
          page: currentPage,
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
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [currentPage, alertsClient]); // Re-fetch when page changes or client changes

  // Handle page navigation
  const handlePrevPage = () => {
    if (currentPage > 0) {
      console.log(`Navigating to previous page: ${currentPage - 1}`);
      setCurrentPage(prev => prev - 1);
    } else {
      console.log("Already at first page, cannot go previous");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      console.log(`Navigating to next page: ${currentPage + 1}`);
      setCurrentPage(prev => prev + 1);
    } else {
      console.log("Already at last page, cannot go next");
    }
  };

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
      debug={true} // Enable debug info to see what's happening
    >
      {loading ? (
        <div className="p-4 text-center text-slate-400">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="p-4 text-center text-slate-400">No alerts found.</div>
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

export default AlertsOverview;