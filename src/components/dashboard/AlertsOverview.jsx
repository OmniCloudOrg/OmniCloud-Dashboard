"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";

export const AlertsOverview = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Start from page 0 (zero-based)
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");

  const fetchAlerts = async (page, status, severity) => {
    setLoading(true);
    try {
      // Using page directly since we're already using zero-based pagination
      let url = `http://localhost:8002/api/v1/alerts?page=${page}&per_page=10`;
      
      if (status) {
        url += `&status=${status}`;
      }
      
      if (severity) {
        url += `&severity=${severity}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched alerts:", data);
      
      // Check if the API returns data in different formats
      if (Array.isArray(data)) {
        // API directly returned an array of alerts
        setAlerts(data);
        setTotalPages(Math.ceil(data.length / 10) || 1);
      } else if (data.alerts && Array.isArray(data.alerts)) {
        // API returned a structure with an alerts property
        setAlerts(data.alerts);
        setTotalPages(data.total_pages || Math.ceil(data.alerts.length / 10) || 1);
      } else {
        console.error("Unexpected API response format:", data);
        setAlerts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(page, filterStatus, filterSeverity);
  }, [page, filterStatus, filterSeverity]);

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

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1); // Adjust for zero-based
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1); // Changed to check for > 0
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFilterStatus(value);
    } else if (name === "severity") {
      setFilterSeverity(value);
    }
    setPage(0); // Reset to page 0 when filter changes
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center">
          <Bell size={18} className="text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-white">Active Alerts</h3>
        </div>
        <a href="/dash/alerts" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          View All
        </a>
      </div>
      
      {/* Filters */}
      <div className="px-6 py-3 border-b border-slate-800 flex space-x-4">
        <div>
          <label htmlFor="status-filter" className="text-xs text-slate-400 block mb-1">Status</label>
          <select
            id="status-filter"
            name="status"
            value={filterStatus}
            onChange={handleFilterChange}
            className="bg-slate-800 text-white text-sm rounded-md px-3 py-1 border border-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="auto_resolved">Auto Resolved</option>
          </select>
        </div>
        <div>
          <label htmlFor="severity-filter" className="text-xs text-slate-400 block mb-1">Severity</label>
          <select
            id="severity-filter"
            name="severity"
            value={filterSeverity}
            onChange={handleFilterChange}
            className="bg-slate-800 text-white text-sm rounded-md px-3 py-1 border border-slate-700"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>
      
      <div className="divide-y divide-slate-800">
        {loading ? (
          <div className="p-4 text-center text-slate-400">Loading...</div>
        ) : alerts.length === 0 ? (
          <div className="p-4 text-center text-slate-400">No alerts found. (Check console for debug info)</div>
        ) : (
          alerts.map((alert) => {
            console.log("Rendering alert:", alert);
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
          })
        )}
      </div>
      <div className="px-6 py-4 border-t border-slate-800 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={page === 0} // Changed to check for page === 0
          className={`text-sm font-medium px-4 py-2 rounded ${
            page === 0 ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-slate-400">
          Page {page + 1} of {totalPages} {/* Display as 1-based for human readability */}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page >= totalPages - 1} // Changed to check against totalPages - 1
          className={`text-sm font-medium px-4 py-2 rounded ${
            page >= totalPages - 1 ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-slate-800 text-white hover:bg-slate-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AlertsOverview;