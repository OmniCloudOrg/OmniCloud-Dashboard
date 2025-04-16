"use client"

import React from 'react';
import { Package, Download, Copy, Clock } from 'lucide-react';

const PipelineArtifacts = ({ pipeline }) => {
  // Sample data for artifacts
  const artifactsData = [
    { id: 'artifact-001', name: 'app-bundle.zip', size: '24.5 MB', runId: 'run-001', created: '2 hours ago' },
    { id: 'artifact-002', name: 'app-bundle.zip', size: '23.8 MB', runId: 'run-003', created: '1 day ago' },
    { id: 'artifact-003', name: 'coverage-report.xml', size: '152 KB', runId: 'run-003', created: '1 day ago' },
    { id: 'artifact-004', name: 'app-bundle.zip', size: '24.1 MB', runId: 'run-004', created: '2 days ago' },
    { id: 'artifact-005', name: 'docker-image.tar', size: '156.3 MB', runId: 'run-004', created: '2 days ago' },
    { id: 'artifact-006', name: 'app-bundle.zip', size: '22.9 MB', runId: 'run-005', created: '3 days ago' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
          <option value="all">All Artifacts</option>
          <option value="app-bundle">app-bundle</option>
          <option value="coverage">coverage</option>
          <option value="docker">docker</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Run ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {artifactsData.map((artifact) => (
              <tr key={artifact.id} className="hover:bg-slate-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-blue-400" />
                    <span className="text-sm font-medium text-white">{artifact.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-300">{artifact.size}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer">{artifact.runId}</div>
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
      </div>
    </div>
  );
};

export { PipelineArtifacts };