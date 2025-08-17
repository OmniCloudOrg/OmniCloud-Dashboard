"use client"

import React from 'react';
import { GitBranch, GitCommit } from 'lucide-react';
import { StatusBadge } from '../../../../components/ui';

/**
 * PipelineCard - Component displaying individual pipeline information
 */
const PipelineCard = ({ pipeline, onSelect }) => {
  return (
    <div 
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer"
      onClick={() => onSelect(pipeline)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <GitBranch size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{pipeline.name}</h3>
            <div className="text-sm text-slate-400 mt-0.5">
              {pipeline.repository}
            </div>
          </div>
        </div>
        <StatusBadge status={pipeline.lastRunStatus} />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-slate-800">
        <div className="text-center">
          <div className="text-sm text-slate-500">Success Rate</div>
          <div className="font-semibold text-lg text-white">{pipeline.successRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500">Last Run</div>
          <div className="font-semibold text-lg text-white">{pipeline.lastRun}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500">Duration</div>
          <div className="font-semibold text-lg text-white">{pipeline.avgDuration}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <GitCommit size={14} />
          <span>{pipeline.branch}</span>
        </div>
        <div className="flex">
          <button className="text-blue-400 hover:text-blue-300 text-sm">View Pipeline</button>
        </div>
      </div>
    </div>
  );
};

export { PipelineCard };