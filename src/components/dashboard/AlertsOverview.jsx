"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";
import { PaginatedContainer } from "../ui/PaginatedContainer";

export const AlertsOverview = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // Show 5 items per page

  useEffect(() => {
    // Simulate fetching data or use your API
    const fetchAlerts = async () => {
      setLoading(true);
      
      try {
        // This is your sample data
        const allAlerts = [
          {id: 1, alert_type: 'high_cpu', severity: 'warning', service: 'compute', message: 'Instance CPU usage exceeding 90% for over 15 minutes', status: 'active', timestamp: new Date().toISOString()},
          {id: 2, alert_type: 'memory_leak', severity: 'critical', service: 'app_service', message: 'Possible memory leak detected in production service', status: 'active', timestamp: new Date().toISOString()},
          {id: 3, alert_type: 'disk_space', severity: 'warning', service: 'storage', message: 'Database storage approaching 85% capacity', status: 'acknowledged', timestamp: new Date().toISOString()},
          {id: 4, alert_type: 'api_latency', severity: 'info', service: 'api_gateway', message: 'API response time increased by 35%', status: 'active', timestamp: new Date().toISOString()},
          {id: 5, alert_type: 'security_event', severity: 'critical', service: 'auth_service', message: 'Multiple failed login attempts detected from unusual location', status: 'active', timestamp: new Date().toISOString()},
          {id: 6, alert_type: 'network_outage', severity: 'critical', service: 'network', message: 'Network connectivity lost in region us-east-1', status: 'resolved', timestamp: new Date().toISOString()},
          {id: 7, alert_type: 'service_crash', severity: 'critical', service: 'app_service', message: 'Critical service crashed unexpectedly', status: 'acknowledged', timestamp: new Date().toISOString()},
          {id: 8, alert_type: 'high_memory', severity: 'warning', service: 'compute', message: 'Memory usage exceeded 85% for over 10 minutes', status: 'active', timestamp: new Date().toISOString()},
          {id: 9, alert_type: 'ssl_expiry', severity: 'info', service: 'security', message: 'SSL certificate expiring in 15 days', status: 'active', timestamp: new Date().toISOString()},
          {id: 10, alert_type: 'database_error', severity: 'critical', service: 'database', message: 'Frequent database connection errors detected', status: 'active', timestamp: new Date().toISOString()}
        ];
        
        // Calculate total pages
        const calculatedTotalPages = Math.ceil(allAlerts.length / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        
        // Get current page of data
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedAlerts = allAlerts.slice(start, end);
        
        console.log(`Loaded page ${currentPage + 1} of ${calculatedTotalPages}, showing items ${start + 1}-${end}`);
        setAlerts(paginatedAlerts);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [currentPage]); // Re-fetch when page changes

  // Handle page navigation
  const handlePrevPage = () => {
    console.log("Previous page clicked");
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    console.log("Next page clicked");
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
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