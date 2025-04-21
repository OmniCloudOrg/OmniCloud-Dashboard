"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, AlertTriangle, Layers, Box, Settings, Info, Rocket, Clock, Activity } from 'lucide-react';
import { PaginatedContainer } from '../ui/PaginatedContainer';

export const RecentActivity = () => {
  // State
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // Show 3 items per page
  
  // Sample data - in a real app this would be fetched from an API
  // Fetch all data once on component mount
  useEffect(() => {
    const fetchActivities = () => {
      // Mock data - would be API call in production
      const activitiesData = [
        { 
          id: 1,
          type: 'deployment',
          status: 'success',
          title: 'API Gateway Deployment',
          timestamp: '10 minutes ago',
          details: 'Deployment to production completed successfully', 
          user: 'sarah.jenkins',
          target: 'api-gateway',
        },
        { 
          id: 2,
          type: 'alert',
          status: 'critical',
          title: 'High CPU Usage',
          timestamp: '25 minutes ago',
          details: 'Instance i-abc123 CPU usage exceeded 90%', 
          user: 'system',
          target: 'auth-service',
        },
        { 
          id: 3,
          type: 'scaling',
          status: 'info',
          title: 'Auto-scaling Event',
          timestamp: '45 minutes ago',
          details: 'Added 2 instances to user-service', 
          user: 'system',
          target: 'user-service',
        },
        { 
          id: 4,
          type: 'build',
          status: 'success',
          title: 'Image Build Completed',
          timestamp: '1 hour ago',
          details: 'Container image frontend:v1.2.0 built successfully', 
          user: 'james.wilson',
          target: 'frontend',
        },
        { 
          id: 5,
          type: 'config',
          status: 'info',
          title: 'Configuration Updated',
          timestamp: '2 hours ago',
          details: 'Environment variables updated for payment-service', 
          user: 'michelle.lee',
          target: 'payment-service',
        },
        { 
          id: 6,
          type: 'deployment',
          status: 'warning',
          title: 'Database Migration',
          timestamp: '3 hours ago',
          details: 'Database schema migration completed with warnings', 
          user: 'david.kim',
          target: 'database',
        },
        { 
          id: 7,
          type: 'alert',
          status: 'critical',
          title: 'Network Connectivity Issue',
          timestamp: '4 hours ago',
          details: 'Loss of connectivity to EU region detected', 
          user: 'system',
          target: 'network',
        },
        { 
          id: 8,
          type: 'config',
          status: 'success',
          title: 'Secret Rotation',
          timestamp: '5 hours ago',
          details: 'API keys successfully rotated', 
          user: 'system',
          target: 'security',
        }
      ];
      
      setAllActivities(activitiesData);
      setLoading(false);
    };
    
    // Immediate fetch without setTimeout delay
    fetchActivities();
  }, []); // Empty dependency array means this runs once on mount
  
  // Calculate total pages and current page data using useMemo for performance
  const { paginatedActivities, totalPages } = useMemo(() => {
    const total = Math.ceil(allActivities.length / itemsPerPage);
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    
    return {
      paginatedActivities: allActivities.slice(start, end),
      totalPages: total
    };
  }, [allActivities, currentPage, itemsPerPage]);
  
  // Handle page navigation
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // Icon mapping based on activity type - moved outside render for performance
  const getActivityIcon = (type, status) => {
    switch (type) {
      case 'deployment':
        return status === 'success' ? <Rocket size={16} /> : <AlertCircle size={16} />;
      case 'alert':
        return <AlertTriangle size={16} />;
      case 'scaling':
        return <Layers size={16} />;
      case 'build':
        return <Box size={16} />;
      case 'config':
        return <Settings size={16} />;
      default:
        return <Info size={16} />;
    }
  };
  
  // Background color mapping based on status - moved outside render for performance
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400';
      case 'critical':
        return 'bg-red-500/10 text-red-400';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'info':
      default:
        return 'bg-blue-500/10 text-blue-400';
    }
  };
  
  return (
    <PaginatedContainer
      title="Recent Activity"
      titleIcon={<Activity size={18} className="text-blue-400" />}
      viewAllLink="/dash/audit"
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevious={handlePrevPage}
      onNext={handleNextPage}
      debug={false} // Disable debug info in production
    >
      {loading ? (
        <div className="p-4 text-center text-slate-400">Loading activities...</div>
      ) : paginatedActivities.length === 0 ? (
        <div className="p-4 text-center text-slate-400">No recent activity found.</div>
      ) : (
        <div className="divide-y divide-slate-800">
          {paginatedActivities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-slate-800/30">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg mt-1 ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="font-medium text-white">{activity.title}</div>
                    <div className="text-sm text-slate-400 flex items-center gap-1">
                      <Clock size={14} />
                      {activity.timestamp}
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{activity.details}</div>
                  <div className="flex items-center gap-6 mt-2 text-xs">
                    <div className="text-slate-500">User: <span className="text-slate-300">{activity.user}</span></div>
                    <div className="text-slate-500">Target: <span className="text-slate-300">{activity.target}</span></div>
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

export default RecentActivity;