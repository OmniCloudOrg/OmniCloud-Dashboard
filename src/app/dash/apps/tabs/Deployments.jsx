"use client"

import React, { useState, useEffect } from 'react';
import { GitBranch, Clock } from 'lucide-react';
import { DashboardSection, ExpandableCard, StatusBadge } from '../../components/ui';
import { DeploymentApiClient } from '@/utils/apiClient/deployments';

/**
 * Application Deployments Tab Component
 * Uses DeploymentApiClient to fetch deployment data
 */
const ApplicationDeployments = ({ app }) => {
  // Initialize the API client
  const [deploymentClient] = useState(() => new DeploymentApiClient(app?.platformId || 1));
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState({});
  const [pagination, setPagination] = useState({
    page: 0, // Maintain 0-based pagination in the component
    per_page: 10,
    total_count: 0,
    total_pages: 1
  });

  // Update platformId if app changes
  useEffect(() => {
    if (app?.platformId) {
      deploymentClient.setPlatformId(app.platformId);
    }
  }, [app?.platformId, deploymentClient]);

  // Function to fetch deployments using the client
  const fetchDeployments = async () => {
    if (!app?.id) return;
    
    try {
      setLoading(true);
      const response = await deploymentClient.listAppDeployments(
        app.id, 
        { page: pagination.page, per_page: pagination.per_page }
      );
      
      setDeployments(response.data);
      
      // Convert pagination from 1-based to 0-based for the component
      setPagination({
        page: pagination.page,
        per_page: response.pagination.per_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages
      });
      
      setError(null);
    } catch (err) {
      console.error("Failed to fetch deployments:", err);
      setError("Failed to load deployments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch deployments on component mount and when pagination changes
  useEffect(() => {
    if (app?.id) {
      fetchDeployments();
    }
  }, [app?.id, pagination.page, pagination.per_page]);

  // Toggle expanded state for a deployment
  const toggleExpanded = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Map API status to UI status
  const mapStatusToUiStatus = (apiStatus) => {
    switch(apiStatus) {
      case 'deployed':
        return 'success';
      case 'in_progress':
      case 'pending':
        return 'in-progress';
      case 'failed':
        return 'failed';
      default:
        return apiStatus;
    }
  };

  // Get status badge for each deployment
  const getStatusBadge = (status) => {
    const uiStatus = mapStatusToUiStatus(status);
    switch(uiStatus) {
      case 'success':
        return <StatusBadge status="success" />;
      case 'in-progress':
        return <StatusBadge status="deploying" />;
      case 'failed':
        return <StatusBadge status="failed" />;
      default:
        return <StatusBadge status={uiStatus} />;
    }
  };

  // Format date to relative time (e.g. "5 minutes ago")
  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    
    return date.toLocaleDateString();
  };

  // Format deployment duration
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    return `${mins}m ${secs}s`;
  };

  // Render loading state
  if (loading && deployments.length === 0) {
    return (
      <div className="space-y-6">
        <DashboardSection title="Deployment History">
          <div className="bg-slate-800/50 rounded-lg p-8 flex justify-center">
            <div className="text-slate-400">Loading deployments...</div>
          </div>
        </DashboardSection>
      </div>
    );
  }

  // Render error state
  if (error && deployments.length === 0) {
    return (
      <div className="space-y-6">
        <DashboardSection title="Deployment History">
          <div className="bg-slate-800/50 rounded-lg p-8">
            <div className="text-red-400">{error}</div>
            <button 
              onClick={fetchDeployments}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </DashboardSection>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardSection title="Deployment History">
        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
          {deployments.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No deployments found for this application.
            </div>
          ) : (
            deployments.map((deployment) => (
              <ExpandableCard
                key={deployment.id}
                item={deployment}
                expanded={expandedIds[deployment.id] || false}
                onToggle={() => toggleExpanded(deployment.id)}
                title={deployment.version}
                badge={
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <GitBranch size={16} />
                  </div>
                }
                subtitle={`Deployment ID: ${deployment.id} • Strategy: ${deployment.deployment_strategy}`}
                metadata={
                  <>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatRelativeTime(deployment.created_at)}</span>
                    </div>
                    <div>Duration: {formatDuration(deployment.deployment_duration)}</div>
                  </>
                }
                actions={
                  <div className="flex items-center">
                    {getStatusBadge(deployment.status)}
                    <button className="ml-4 text-blue-400 hover:text-blue-300 text-sm">
                      Details
                    </button>
                  </div>
                }
                expandedContent={
                  <div className="mt-4 space-y-4">
                    <div className="bg-slate-900 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-white mb-2">Deployment Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Started</p>
                          <p className="text-sm text-white">{new Date(deployment.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Completed</p>
                          <p className="text-sm text-white">
                            {deployment.updated_at && deployment.status !== 'in_progress' ? 
                              new Date(deployment.updated_at).toLocaleString() : 'In progress...'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Environment</p>
                          <div className="text-sm text-white">
                            {deployment.environment_variables && Object.entries(deployment.environment_variables).map(([key, value]) => (
                              <div key={key} className="text-xs">
                                <span className="text-slate-400">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Build ID</p>
                          <p className="text-sm text-white">{deployment.build_id}</p>
                        </div>
                      </div>
                      
                      {deployment.error_message && (
                        <div className="mt-4">
                          <p className="text-xs text-red-400 font-medium">Error</p>
                          <p className="text-sm text-red-400">{deployment.error_message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            ))
          )}
        </div>
        
        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                disabled={pagination.page === 0}
                className={`px-3 py-1 rounded ${
                  pagination.page === 0 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                Previous
              </button>
              <div className="px-3 py-1 bg-slate-800 text-slate-300 rounded">
                Page {pagination.page + 1} of {pagination.total_pages}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.total_pages - 1, prev.page + 1) }))}
                disabled={pagination.page === pagination.total_pages - 1}
                className={`px-3 py-1 rounded ${
                  pagination.page === pagination.total_pages - 1
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </DashboardSection>
    </div>
  );
};

export default ApplicationDeployments;