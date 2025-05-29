"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { GitBranch, Clock } from 'lucide-react';
import { DashboardSection, ExpandableCard, StatusBadge } from '../../components/ui';
import { DeploymentApiClient } from '@/utils/apiClient/deployments';

const ApplicationDeployments = ({ app }) => {
  // Use useMemo to recreate client when platform_id changes
  const client = useMemo(() => {
    if (!app?.platform_id) return null;
    return new DeploymentApiClient(app.platform_id);
  }, [app?.platform_id]);

  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch deployments
  const fetchDeployments = async () => {
    if (!app?.id || !client) return;
    
    try {
      setLoading(true);
      const response = await client.listAppDeployments(app.id, { 
        page, 
        per_page: 10 
      });
      
      setDeployments(response.data);
      setTotalPages(response.pagination.total_pages);
      setError(null);
    } catch (err) {
      setError("Failed to load deployments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchDeployments();
  }, [app?.id, page, client]); // Added client as dependency

  // Early return if no client (waiting for platform_id)
  if (!client) {
    return (
      <DashboardSection title="Deployment History">
        <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-400">
          Loading platform configuration...
        </div>
      </DashboardSection>
    );
  }

  // Simple relative time formatter
  const timeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };

  // Simple duration formatter
  const duration = (seconds) => seconds ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : '';

  // Status badge mapping
  const statusBadge = (status) => {
    const statusMap = {
      deployed: 'success',
      in_progress: 'deploying',
      pending: 'deploying',
      failed: 'failed'
    };
    return <StatusBadge status={statusMap[status] || status} />;
  };

  // Loading state
  if (loading && !deployments.length) {
    return (
      <DashboardSection title="Deployment History">
        <div className="bg-slate-800/50 rounded-lg p-8 text-center text-slate-400">
          Loading deployments...
        </div>
      </DashboardSection>
    );
  }

  // Error state
  if (error && !deployments.length) {
    return (
      <DashboardSection title="Deployment History">
        <div className="bg-slate-800/50 rounded-lg p-8">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            onClick={fetchDeployments}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection title="Deployment History">
      <div className="bg-slate-800/50 rounded-lg overflow-hidden">
        {!deployments.length ? (
          <div className="p-8 text-center text-slate-400">
            No deployments found
          </div>
        ) : (
          deployments.map((deployment) => (
            <ExpandableCard
              key={deployment.id}
              item={deployment}
              expanded={expanded[deployment.id] || false}
              onToggle={() => setExpanded(prev => ({ 
                ...prev, 
                [deployment.id]: !prev[deployment.id] 
              }))}
              title={deployment.version}
              badge={
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <GitBranch size={16} />
                </div>
              }
              subtitle={`ID: ${deployment.id} • ${deployment.deployment_strategy}`}
              metadata={
                <>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{timeAgo(deployment.created_at)}</span>
                  </div>
                  <div>Duration: {duration(deployment.deployment_duration)}</div>
                </>
              }
              actions={
                <div className="flex items-center gap-4">
                  {statusBadge(deployment.status)}
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Details
                  </button>
                </div>
              }
              expandedContent={
                <div className="mt-4 bg-slate-900 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-white mb-3">Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Started:</span>
                      <div className="text-white">{new Date(deployment.created_at).toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Completed:</span>
                      <div className="text-white">
                        {deployment.updated_at && deployment.status !== 'in_progress' 
                          ? new Date(deployment.updated_at).toLocaleString() 
                          : 'In progress...'}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Build ID:</span>
                      <div className="text-white">{deployment.build_id}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Platform ID:</span>
                      <div className="text-white">{app?.platform_id}</div>
                    </div>
                    {deployment.environment_variables && (
                      <div>
                        <span className="text-slate-400">Environment:</span>
                        <div className="text-white">
                          {Object.entries(deployment.environment_variables).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="text-slate-400">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {deployment.error_message && (
                    <div className="mt-4 p-3 bg-red-900/20 rounded border border-red-800">
                      <div className="text-red-400 font-medium text-xs">Error</div>
                      <div className="text-red-400 text-sm">{deployment.error_message}</div>
                    </div>
                  )}
                </div>
              }
            />
          ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`px-3 py-1 rounded transition-colors ${
              page === 0 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            Previous
          </button>
          <div className="px-3 py-1 bg-slate-800 text-slate-300 rounded">
            {page + 1} of {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className={`px-3 py-1 rounded transition-colors ${
              page === totalPages - 1
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </DashboardSection>
  );
};

export default ApplicationDeployments;