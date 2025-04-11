"use client"

import React from 'react';
import { GitBranch, Clock } from 'lucide-react';
import { DashboardSection, ExpandableCard, StatusBadge } from '../../components/ui';


/**
 * Application Deployments Tab Component
 * Refactored to use the UI component library
 */
const ApplicationDeployments = ({ app }) => {
  // Sample deployments data
  const deployments = [
    {
      id: 1,
      version: 'v1.2.6',
      status: 'success',
      branch: 'main',
      commit: 'a1b2c3d',
      time: 'Started 5 minutes ago',
      user: 'john.doe',
      isExpanded: false
    },
    {
      id: 2,
      version: 'v1.2.5',
      status: 'in-progress',
      branch: 'main',
      commit: 'e4f5g6h',
      time: 'Yesterday',
      user: 'john.doe',
      isExpanded: false
    },
    {
      id: 3,
      version: 'v1.2.4',
      status: 'failed',
      branch: 'main',
      commit: 'i7j8k9l',
      time: '3 days ago',
      user: 'john.doe',
      isExpanded: false
    },
    {
      id: 4,
      version: 'v1.2.3',
      status: 'success',
      branch: 'main',
      commit: 'm1n2o3p',
      time: '4 days ago',
      user: 'john.doe',
      isExpanded: false
    },
    {
      id: 5,
      version: 'v1.2.2',
      status: 'success',
      branch: 'main',
      commit: 'q4r5s6t',
      time: '5 days ago',
      user: 'john.doe',
      isExpanded: false
    }
  ];

  // Get status badge for each deployment
  const getStatusBadge = (status) => {
    switch(status) {
      case 'success':
        return <StatusBadge status="success" />;
      case 'in-progress':
        return <StatusBadge status="deploying" />;
      case 'failed':
        return <StatusBadge status="failed" />;
      default:
        return <StatusBadge status={status} />;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardSection title="Deployment History">
        <div className="bg-slate-800/50 rounded-lg overflow-hidden">
          {deployments.map((deployment) => (
            <ExpandableCard
              key={deployment.id}
              item={deployment}
              expanded={deployment.isExpanded}
              onToggle={() => {
                // In a real implementation, this would update the state
                console.log(`Toggle deployment ${deployment.id}`);
              }}
              title={deployment.version}
              badge={
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <GitBranch size={16} />
                </div>
              }
              subtitle={`Deployed from branch ${deployment.branch} • commit ${deployment.commit}`}
              metadata={
                <>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{deployment.time}</span>
                  </div>
                  <div>by {deployment.user}</div>
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
                    <h4 className="text-sm font-medium text-white mb-2">Deployment Log</h4>
                    <div className="font-mono text-xs text-slate-400 space-y-1">
                      <div>[12:34:56] Starting deployment...</div>
                      <div>[12:35:01] Fetching source code from repository</div>
                      <div>[12:35:14] Installing dependencies...</div>
                      <div>[12:36:22] Building application...</div>
                      <div>[12:37:45] Running tests...</div>
                      <div>[12:38:30] Deploying to production...</div>
                      <div className="text-green-400">[12:39:15] Deployment completed successfully!</div>
                    </div>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
};

export default ApplicationDeployments;