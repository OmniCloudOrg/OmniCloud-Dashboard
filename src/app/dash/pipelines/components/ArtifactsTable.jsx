"use client"

import React from 'react';
import { Package, Download, Copy, Clock } from 'lucide-react';
import { EmptyState } from '../../../../components/ui';

const ArtifactsTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-800/50">
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Pipeline</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {data.map((artifact) => (
            <tr key={artifact.id} className="hover:bg-slate-800/30">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-white">{artifact.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">{artifact.pipeline}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-300">{artifact.size}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-slate-400">
                  <Clock size={14} className="mr-1" />
                  <span>{artifact.created}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end gap-2">
                  <button className="text-slate-400 hover:text-slate-300">
                    <Download size={16} />
                  </button>
                  <button className="text-slate-400 hover:text-slate-300">
                    <Copy size={16} />
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
          icon={Package}
          title="No Artifacts Found"
          description="We couldn't find any artifacts matching your search criteria."
          actionText="Clear Filters"
          onAction={() => {}}
        />
      )}
    </div>
  );
};

export { ArtifactsTable };