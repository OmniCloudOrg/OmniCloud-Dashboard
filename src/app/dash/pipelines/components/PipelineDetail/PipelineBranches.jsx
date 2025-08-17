"use client"

import React from 'react';
import { GitBranch, GitCommit, Clock } from 'lucide-react';
import { StatusBadge } from '../../../../../components/ui';

const PipelineBranches = ({ pipeline }) => {
  // Sample data for branches
  const branchesData = [
    { name: 'main', lastCommit: 'a1b2c3d', lastRun: 'success', lastRunTime: '2 hours ago' },
    { name: 'develop', lastCommit: 'z9y8x7w', lastRun: 'success', lastRunTime: '3 hours ago' },
    { name: 'feature/new-ui', lastCommit: 'b2c3d4e', lastRun: 'failed', lastRunTime: '5 hours ago' },
    { name: 'feature/api-updates', lastCommit: 'f6g7h8i', lastRun: 'running', lastRunTime: '10 minutes ago' },
    { name: 'hotfix/login-issue', lastCommit: 'd4e5f6g', lastRun: 'success', lastRunTime: '2 days ago' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search branches..."
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 w-80"
        />
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option value="all">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Commit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Run</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Run Time</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {branchesData.map((branch, index) => (
              <tr key={index} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm">
                    <GitBranch size={14} className="text-blue-400" />
                    <span className="text-white">{branch.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <GitCommit size={14} />
                    <span>{branch.lastCommit.substring(0, 7)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={branch.lastRun} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock size={14} className="mr-1" />
                    <span>{branch.lastRunTime}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Run Pipeline
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

export { PipelineBranches };