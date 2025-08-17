"use client"

import React from 'react';
import { GitBranch, Terminal, Clock } from 'lucide-react';
import { StatusBadge, EmptyState } from '../../../../components/ui';

const BuildsTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-800/50">
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Build ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Pipeline</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Branch</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Started</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Duration</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((build) => (
            <tr key={build.id} className="hover:bg-slate-800/30">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <div className="text-sm font-medium text-white">{build.id}</div>
                  <div className="text-xs text-slate-500">{build.commit.substring(0, 7)}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">{build.pipeline}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-sm text-slate-300">
                  <GitBranch size={14} className="text-blue-400" />
                  <span>{build.branch}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={build.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span>{build.started}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{build.duration}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="text-slate-400 hover:text-slate-300">
                    <Terminal size={16} />
                  </button>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <EmptyState
          icon={GitCommit}
          title="No Builds Found"
          description="We couldn't find any builds matching your search criteria. Try adjusting your filters or search query."
          actionText="Clear Filters"
          onAction={() => {}}
        />
      )}
    </div>
  );
};

// Missing import for the icon
const GitCommit = props => <div {...props} />;

export { BuildsTable };