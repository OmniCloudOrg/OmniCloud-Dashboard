"use client"

import React, { useState } from 'react';
import { 
  GitBranch, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Terminal,
  ChevronDown,
  GitMerge,
  GitCommit, 
  GitPullRequest,
  User,
  Circle
} from 'lucide-react';
import { StatusBadge } from '../../components/ui/status-components';
import { TabNavigation } from '../../components/ui/common-components';
import { PipelineRuns } from './PipelineDetail/PipelineRuns';
import { PipelineBranches } from './PipelineDetail/PipelineBranches';
import { PipelineConfig } from './PipelineDetail/PipelineConfig';
import { PipelineArtifacts } from './PipelineDetail/PipelineArtifacts';
import { PipelineSettings } from './PipelineDetail/PipelineSettings';

/**
 * PipelineDetail - Component for detailed pipeline view 
 */
const PipelineDetail = ({ pipeline, onBack }) => {
  const [activeTab, setActiveTab] = useState('runs');
  
  const tabs = [
    { id: 'runs', label: 'Runs' },
    { id: 'branches', label: 'Branches' },
    { id: 'config', label: 'Configuration' },
    { id: 'artifacts', label: 'Artifacts' },
    { id: 'settings', label: 'Settings' }
  ];
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'runs':
        return <PipelineRuns pipeline={pipeline} />;
      case 'branches':
        return <PipelineBranches pipeline={pipeline} />;
      case 'config':
        return <PipelineConfig pipeline={pipeline} />;
      case 'artifacts':
        return <PipelineArtifacts pipeline={pipeline} />;
      case 'settings':
        return <PipelineSettings pipeline={pipeline} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"
        >
          <ChevronDown className="rotate-90" size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{pipeline.name}</h1>
          <div className="text-slate-400">{pipeline.repository}</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <StatusBadge status={pipeline.lastRunStatus} />
          <button className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700">
            <PlayCircle size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={18} className="text-blue-400" />
            <h3 className="text-lg font-medium text-white">Statistics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Success Rate</span>
              <span className="text-sm font-medium text-white">{pipeline.successRate}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${pipeline.successRate}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm text-slate-400">Total Runs</div>
                <div className="text-xl font-semibold text-white">128</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Avg. Duration</div>
                <div className="text-xl font-semibold text-white">{pipeline.avgDuration}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitCommit size={18} className="text-blue-400" />
            <h3 className="text-lg font-medium text-white">Last Commit</h3>
          </div>
          <div className="text-sm font-medium text-slate-300 mt-2">
            fix: resolve login issue with OAuth providers
          </div>
          <div className="text-xs text-slate-500 mt-1">
            a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <User size={14} />
              <span>john.doe</span>
            </div>
            <div className="text-xs text-slate-400">2 hours ago</div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequest size={18} className="text-blue-400" />
            <h3 className="text-lg font-medium text-white">Pull Requests</h3>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-slate-300">
                <Circle size={10} className="text-green-400 fill-green-400" />
                <span>Open</span>
              </div>
              <span className="text-sm font-medium text-white">4</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-slate-300">
                <GitMerge size={14} className="text-purple-400" />
                <span>Merged</span>
              </div>
              <span className="text-sm font-medium text-white">28</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm text-slate-300">
                <XCircle size={14} className="text-red-400" />
                <span>Closed</span>
              </div>
              <span className="text-sm font-medium text-white">6</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export { PipelineDetail };