"use client"

import React from 'react';
import { GitBranch, PlayCircle, Clock, Terminal, XCircle, User } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/status-components';

const PipelineRuns = ({ pipeline }) => {
  // Sample data for pipeline runs
  const pipelineRuns = [
    { id: 'run-001', commit: 'a1b2c3d', branch: 'main', status: 'success', started: '2 hours ago', duration: '4m 32s', triggeredBy: 'john.doe' },
    { id: 'run-002', commit: 'b2c3d4e', branch: 'feature/new-ui', status: 'failed', started: '5 hours ago', duration: '3m 45s', triggeredBy: 'jane.smith' },
    { id: 'run-003', commit: 'c3d4e5f', branch: 'main', status: 'success', started: '1 day ago', duration: '5m 12s', triggeredBy: 'john.doe' },
    { id: 'run-004', commit: 'd4e5f6g', branch: 'hotfix/login-issue', status: 'success', started: '2 days ago', duration: '2m 50s', triggeredBy: 'alex.johnson' },
    { id: 'run-005', commit: 'e5f6g7h', branch: 'main', status: 'success', started: '3 days ago', duration: '4m 10s', triggeredBy: 'system' },
    { id: 'run-006', commit: 'f6g7h8i', branch: 'feature/api-updates', status: 'running', started: '10 minutes ago', duration: 'Running', triggeredBy: 'sarah.williams' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
            <option value="all">All Branches</option>
            <option value="main">main</option>
            <option value="develop">develop</option>
            <option value="feature">feature/*</option>
          </select>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
          </select>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm hover:bg-blue-700">
          <PlayCircle size={16} />
          <span>Run Pipeline</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Run</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Started</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Triggered By</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pipelineRuns.map((run) => (
              <tr key={run.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-white">{run.id}</div>
                    <div className="ml-2 text-xs text-slate-500">{run.commit.substring(0, 7)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-blue-400">
                    <GitBranch size={14} />
                    <span>{run.branch}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={run.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock size={14} className="mr-1" />
                    <span>{run.started}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{run.duration}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-300">
                    <User size={14} className="mr-1" />
                    <span>{run.triggeredBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    {run.status === 'running' && (
                      <button className="text-slate-400 hover:text-slate-300">
                        <XCircle size={16} />
                      </button>
                    )}
                    <button className="text-slate-400 hover:text-slate-300">
                      <Terminal size={16} />
                    </button>
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PipelineRuns };