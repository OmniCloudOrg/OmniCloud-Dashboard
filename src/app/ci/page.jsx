"use client"

import React, { useState } from 'react';
import { 
  GitBranch, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MoreVertical, 
  RefreshCw, 
  Plus, 
  Filter,
  Search,
  Box,
  GitCommit,
  GitPullRequest,
  Code,
  Terminal,
  Settings,
  Zap,
  AlertTriangle,
  Download,
  Copy,
  Edit,
  Trash,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BarChart2,
  Calendar,
  User,
  Users,
  Github,
  GitMerge,
  Repeat,
  Star,
  Package,
  Server,
  HardDrive,
  Shield,
  CheckSquare,
  Circle,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Resource Card Component
const ResourceCard = ({ title, value, percentage, icon: Icon, color, trend, subtitle }) => (
  <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} />
      </div>
      {percentage && (
        <div className={`flex items-center gap-1 text-sm ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'
        }`}>
          {trend === 'up' ? <ChevronRight size={16} className="rotate-90" /> : trend === 'down' ? <ChevronRight size={16} className="rotate-270" /> : null}
          {percentage}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-semibold text-white">{value}</h3>
      <p className="text-sm text-slate-400">{title}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'running':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'canceled':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle size={14} />;
      case 'failed':
        return <XCircle size={14} />;
      case 'running':
        return <RefreshCw size={14} className="animate-spin" />;
      case 'pending':
        return <Clock size={14} />;
      case 'canceled':
        return <XCircle size={14} />;
      case 'warning':
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Pipeline Card Component
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

// Create Pipeline Modal Component
const CreatePipelineModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white">Create Pipeline</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Pipeline Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="my-app-pipeline"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Repository</label>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="bitbucket">Bitbucket</option>
                    <option value="azure">Azure DevOps</option>
                  </select>
                </div>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="username/repository"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Branch</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="main"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Pipeline Configuration</label>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="config-auto"
                    name="config-type"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                    defaultChecked
                  />
                  <label htmlFor="config-auto" className="ml-2 text-sm text-white">
                    Auto-detected
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="config-yaml"
                    name="config-type"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="config-yaml" className="ml-2 text-sm text-white">
                    YAML file
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="config-visual"
                    name="config-type"
                    className="text-blue-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="config-visual" className="ml-2 text-sm text-white">
                    Visual Editor
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Build Configuration</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Build Command</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue="npm run build"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Test Command</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue="npm test"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-xs text-slate-500 mb-1">Triggers</label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trigger-push"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
                    />
                    <label htmlFor="trigger-push" className="ml-2 text-sm text-white">
                      On Push
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trigger-pr"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
                    />
                    <label htmlFor="trigger-pr" className="ml-2 text-sm text-white">
                      On Pull Request
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trigger-tag"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="trigger-tag" className="ml-2 text-sm text-white">
                      On Tag
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trigger-schedule"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="trigger-schedule" className="ml-2 text-sm text-white">
                      Scheduled
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Deployment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Environment</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                    <option value="development">Development</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Deployment Strategy</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="auto">Automatic</option>
                    <option value="manual">Manual Approval</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            >
              Create Pipeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pipeline Detail Component
const PipelineDetail = ({ pipeline, onBack }) => {
  const [activeTab, setActiveTab] = useState('runs');
  
  const tabs = [
    { id: 'runs', label: 'Runs' },
    { id: 'branches', label: 'Branches' },
    { id: 'config', label: 'Configuration' },
    { id: 'artifacts', label: 'Artifacts' },
    { id: 'settings', label: 'Settings' }
  ];
  
  const pipelineRuns = [
    { id: 'run-001', commit: 'a1b2c3d', branch: 'main', status: 'success', started: '2 hours ago', duration: '4m 32s', triggeredBy: 'john.doe' },
    { id: 'run-002', commit: 'b2c3d4e', branch: 'feature/new-ui', status: 'failed', started: '5 hours ago', duration: '3m 45s', triggeredBy: 'jane.smith' },
    { id: 'run-003', commit: 'c3d4e5f', branch: 'main', status: 'success', started: '1 day ago', duration: '5m 12s', triggeredBy: 'john.doe' },
    { id: 'run-004', commit: 'd4e5f6g', branch: 'hotfix/login-issue', status: 'success', started: '2 days ago', duration: '2m 50s', triggeredBy: 'alex.johnson' },
    { id: 'run-005', commit: 'e5f6g7h', branch: 'main', status: 'success', started: '3 days ago', duration: '4m 10s', triggeredBy: 'system' },
    { id: 'run-006', commit: 'f6g7h8i', branch: 'feature/api-updates', status: 'running', started: '10 minutes ago', duration: 'Running', triggeredBy: 'sarah.williams' }
  ];
  
  const branchesData = [
    { name: 'main', lastCommit: 'a1b2c3d', lastRun: 'success', lastRunTime: '2 hours ago' },
    { name: 'develop', lastCommit: 'z9y8x7w', lastRun: 'success', lastRunTime: '3 hours ago' },
    { name: 'feature/new-ui', lastCommit: 'b2c3d4e', lastRun: 'failed', lastRunTime: '5 hours ago' },
    { name: 'feature/api-updates', lastCommit: 'f6g7h8i', lastRun: 'running', lastRunTime: '10 minutes ago' },
    { name: 'hotfix/login-issue', lastCommit: 'd4e5f6g', lastRun: 'success', lastRunTime: '2 days ago' }
  ];
  
  const artifactsData = [
    { id: 'artifact-001', name: 'app-bundle.zip', size: '24.5 MB', runId: 'run-001', created: '2 hours ago' },
    { id: 'artifact-002', name: 'app-bundle.zip', size: '23.8 MB', runId: 'run-003', created: '1 day ago' },
    { id: 'artifact-003', name: 'coverage-report.xml', size: '152 KB', runId: 'run-003', created: '1 day ago' },
    { id: 'artifact-004', name: 'app-bundle.zip', size: '24.1 MB', runId: 'run-004', created: '2 days ago' },
    { id: 'artifact-005', name: 'docker-image.tar', size: '156.3 MB', runId: 'run-004', created: '2 days ago' },
    { id: 'artifact-006', name: 'app-bundle.zip', size: '22.9 MB', runId: 'run-005', created: '3 days ago' }
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'runs':
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
        
      case 'branches':
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
        
      case 'config':
        return (
          <div className="space-y-6">
            <div className="flex justify-end mb-2">
              <button className="text-blue-400 hover:text-blue-300 text-sm">
                Edit Configuration
              </button>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-slate-300 mb-3">Pipeline Configuration</h3>
              <pre className="font-mono text-sm text-slate-300 p-4 bg-slate-900 rounded-lg overflow-x-auto">
                {`name: ${pipeline.name}
version: 1.0.0
repository: ${pipeline.repository}
branch: ${pipeline.branch}

triggers:
  - push:
      branches: [main, develop]
  - pull_request:
      branches: [main, develop]

stages:
  - name: build
    jobs:
      - name: build-app
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with:
              node-version: '18'
          - run: npm ci
          - run: npm run build
          - run: npm test

  - name: deploy
    jobs:
      - name: deploy-staging
        runs-on: ubuntu-latest
        needs: build-app
        if: success() && github.ref == 'refs/heads/develop'
        steps:
          - uses: actions/checkout@v3
          - name: Deploy to Staging
            run: ./deploy.sh staging

      - name: deploy-production
        runs-on: ubuntu-latest
        needs: build-app
        if: success() && github.ref == 'refs/heads/main'
        steps:
          - uses: actions/checkout@v3
          - name: Deploy to Production
            run: ./deploy.sh production`}
              </pre>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Environment Variables</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <div className="font-mono text-sm text-blue-400">NODE_ENV</div>
                    <div className="font-mono text-sm text-green-400">production</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <div className="font-mono text-sm text-blue-400">API_URL</div>
                    <div className="font-mono text-sm text-green-400">https://api.example.com</div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <div className="font-mono text-sm text-blue-400">DEPLOY_TOKEN</div>
                    <div className="font-mono text-sm text-slate-500">**************</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Integrations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <div className="flex items-center gap-2">
                      <GitHub size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-300">GitHub</span>
                    </div>
                    <StatusBadge status="success" />
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <div className="flex items-center gap-2">
                      <Server size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-300">Deployment</span>
                    </div>
                    <StatusBadge status="success" />
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-300">Security Scan</span>
                    </div>
                    <StatusBadge status="success" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'artifacts':
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
        
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-base font-medium text-white mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Pipeline Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    defaultValue={pipeline.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    rows={3}
                    defaultValue="Main CI/CD pipeline for our application. Builds, tests and deploys to staging and production environments."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Default Branch</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      defaultValue={pipeline.branch}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Timeout (minutes)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      defaultValue="60"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-base font-medium text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-400">Email Notifications</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="toggle-email" 
                      id="toggle-email" 
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                      defaultChecked
                    />
                    <label 
                      htmlFor="toggle-email" 
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer"
                    ></label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-400">Slack Notifications</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="toggle-slack" 
                      id="toggle-slack" 
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                      defaultChecked
                    />
                    <label 
                      htmlFor="toggle-slack" 
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer"
                    ></label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-400">Webhook Notifications</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="toggle-webhook" 
                      id="toggle-webhook" 
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                    />
                    <label 
                      htmlFor="toggle-webhook" 
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-700 cursor-pointer"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-base font-medium text-white mb-4">Permissions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Access Control</label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="public">Public (All organization members)</option>
                    <option value="restricted">Restricted (Selected roles)</option>
                    <option value="private">Private (Selected users)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Manual Approval Required</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="require-approval"
                      className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4 bg-slate-900 border-slate-700"
                      defaultChecked
                    />
                    <label htmlFor="require-approval" className="ml-2 text-sm text-white">
                      Require approval for production deployments
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              <h3 className="text-base font-medium text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-white">Delete Pipeline</h4>
                    <p className="text-xs text-slate-400 mt-1">Once deleted, this pipeline cannot be recovered</p>
                  </div>
                  <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
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
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${pipeline.successRate}%` }}></div>
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
          <div className="text-sm font-medium text-slate-300 mt-2">fix: resolve login issue with OAuth providers</div>
          <div className="text-xs text-slate-500 mt-1">a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6</div>
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
        <div className="border-b border-slate-800">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-blue-400 border-b-2 border-blue-500' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Main CI/CD Management Component
const CiCdManagement = () => {
  const [activeTab, setActiveTab] = useState('pipelines');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  
  // Sample data for pipelines
  const pipelines = [
    { id: 1, name: 'Web App Pipeline', repository: 'acme/web-app', branch: 'main', successRate: 94, lastRunStatus: 'success', lastRun: '2 hours ago', avgDuration: '4m 32s' },
    { id: 2, name: 'API Service Pipeline', repository: 'acme/api-service', branch: 'main', successRate: 87, lastRunStatus: 'failed', lastRun: '5 hours ago', avgDuration: '3m 45s' },
    { id: 3, name: 'Mobile App Pipeline', repository: 'acme/mobile-app', branch: 'develop', successRate: 92, lastRunStatus: 'success', lastRun: '1 day ago', avgDuration: '5m 12s' },
    { id: 4, name: 'Auth Service Pipeline', repository: 'acme/auth-service', branch: 'main', successRate: 89, lastRunStatus: 'success', lastRun: '2 days ago', avgDuration: '2m 50s' },
    { id: 5, name: 'Data Processing Pipeline', repository: 'acme/data-processor', branch: 'main', successRate: 76, lastRunStatus: 'warning', lastRun: '3 days ago', avgDuration: '8m 15s' },
    { id: 6, name: 'Email Service Pipeline', repository: 'acme/email-service', branch: 'develop', successRate: 91, lastRunStatus: 'running', lastRun: '10 minutes ago', avgDuration: 'Running' }
  ];
  
  // Sample data for builds
  const builds = [
    { id: 'build-001', pipeline: 'Web App Pipeline', status: 'success', commit: 'a1b2c3d', branch: 'main', started: '2 hours ago', duration: '4m 32s' },
    { id: 'build-002', pipeline: 'API Service Pipeline', status: 'failed', commit: 'b2c3d4e', branch: 'main', started: '5 hours ago', duration: '3m 45s' },
    { id: 'build-003', pipeline: 'Mobile App Pipeline', status: 'success', commit: 'c3d4e5f', branch: 'develop', started: '1 day ago', duration: '5m 12s' },
    { id: 'build-004', pipeline: 'Auth Service Pipeline', status: 'success', commit: 'd4e5f6g', branch: 'main', started: '2 days ago', duration: '2m 50s' },
    { id: 'build-005', pipeline: 'Data Processing Pipeline', status: 'warning', commit: 'e5f6g7h', branch: 'main', started: '3 days ago', duration: '8m 15s' },
    { id: 'build-006', pipeline: 'Email Service Pipeline', status: 'running', commit: 'f6g7h8i', branch: 'develop', started: '10 minutes ago', duration: 'Running' }
  ];
  
  // Sample data for artifacts
  const artifacts = [
    { id: 'artifact-001', name: 'web-app-bundle.zip', pipeline: 'Web App Pipeline', size: '24.5 MB', created: '2 hours ago' },
    { id: 'artifact-002', name: 'api-service-bundle.zip', pipeline: 'API Service Pipeline', size: '18.2 MB', created: '5 hours ago' },
    { id: 'artifact-003', name: 'mobile-app-bundle.zip', pipeline: 'Mobile App Pipeline', size: '32.7 MB', created: '1 day ago' },
    { id: 'artifact-004', name: 'auth-service-bundle.zip', pipeline: 'Auth Service Pipeline', size: '15.3 MB', created: '2 days ago' },
    { id: 'artifact-005', name: 'data-processor-bundle.zip', pipeline: 'Data Processing Pipeline', size: '42.1 MB', created: '3 days ago' },
    { id: 'artifact-006', name: 'email-service-bundle.zip', pipeline: 'Email Service Pipeline', size: '12.8 MB', created: '2 hours ago' }
  ];
  
  // Sample data for environments
  const environments = [
    { id: 1, name: 'Production', status: 'healthy', applications: 6, lastDeployed: '1 day ago', version: 'v2.3.4' },
    { id: 2, name: 'Staging', status: 'healthy', applications: 6, lastDeployed: '5 hours ago', version: 'v2.3.5-rc.1' },
    { id: 3, name: 'Development', status: 'warning', applications: 6, lastDeployed: '2 hours ago', version: 'v2.3.5-dev' },
    { id: 4, name: 'QA', status: 'healthy', applications: 5, lastDeployed: '12 hours ago', version: 'v2.3.5-beta.2' }
  ];
  
  const tabs = [
    { id: 'pipelines', label: 'Pipelines' },
    { id: 'builds', label: 'Build History' },
    { id: 'artifacts', label: 'Artifacts' },
    { id: 'environments', label: 'Environments' }
  ];
  
  // Filter data based on search query and status filter
  const getFilteredData = () => {
    switch (activeTab) {
      case 'pipelines':
        return pipelines.filter(item => 
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.repository.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.lastRunStatus === statusFilter)
        );
      case 'builds':
        return builds.filter(item => 
          (item.pipeline.toLowerCase().includes(searchQuery.toLowerCase()) || item.commit.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'artifacts':
        return artifacts.filter(item => 
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.pipeline.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      case 'environments':
        return environments.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      default:
        return [];
    }
  };
  
  // Render content based on active tab
  const renderTabContent = () => {
    const filteredData = getFilteredData();
    
    switch (activeTab) {
      case 'pipelines':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(pipeline => (
              <PipelineCard 
                key={pipeline.id} 
                pipeline={pipeline} 
                onSelect={setSelectedPipeline} 
              />
            ))}
            
            {filteredData.length === 0 && (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <GitBranch size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Pipelines Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any pipelines matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'builds':
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
                {filteredData.map((build) => (
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
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <GitCommit size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Builds Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any builds matching your search criteria.
                  Try adjusting your filters or search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'artifacts':
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
                {filteredData.map((artifact) => (
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
            
            {filteredData.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Package size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Artifacts Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any artifacts matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      case 'environments':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((env) => (
              <div key={env.id} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Server size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{env.name}</h3>
                      <div className="text-sm text-slate-400 mt-0.5">{env.version}</div>
                    </div>
                  </div>
                  <StatusBadge status={env.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-slate-800">
                  <div>
                    <div className="text-sm text-slate-500">Applications</div>
                    <div className="font-semibold text-lg text-white">{env.applications}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Last Deployed</div>
                    <div className="font-semibold text-lg text-white">{env.lastDeployed}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button className="text-slate-400 hover:text-slate-300 text-sm">
                    View Details
                  </button>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Deploy
                  </button>
                </div>
              </div>
            ))}
            
            {filteredData.length === 0 && (
              <div className="col-span-2 py-12 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Server size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Environments Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  We couldn't find any environments matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Success rate data for chart
  const successRateData = [
    { date: '01/19', rate: 88 },
    { date: '01/20', rate: 92 },
    { date: '01/21', rate: 90 },
    { date: '01/22', rate: 94 },
    { date: '01/23', rate: 91 },
    { date: '01/24', rate: 86 },
    { date: '01/25', rate: 92 }
  ];
  
  return (
    <div className="space-y-6">
      {selectedPipeline ? (
        <PipelineDetail 
          pipeline={selectedPipeline} 
          onBack={() => setSelectedPipeline(null)} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">CI/CD</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors">
                <RefreshCw size={16} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>New Pipeline</span>
              </button>
            </div>
          </div>
          
          {/* Resource Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResourceCard 
              title="Success Rate" 
              value="91%" 
              percentage="3" 
              trend="up" 
              icon={CheckCircle} 
              color="bg-green-500/10 text-green-400" 
              subtitle="Last 7 days"
            />
            <ResourceCard 
              title="Active Pipelines" 
              value="8" 
              icon={GitBranch} 
              color="bg-blue-500/10 text-blue-400" 
            />
            <ResourceCard 
              title="Total Builds" 
              value="1,248" 
              percentage="12" 
              trend="up" 
              icon={GitCommit} 
              color="bg-purple-500/10 text-purple-400" 
              subtitle="142 this week"
            />
            <ResourceCard 
              title="Avg. Build Time" 
              value="4m 12s" 
              percentage="8" 
              trend="down" 
              icon={Clock} 
              color="bg-amber-500/10 text-amber-400" 
              subtitle="Improved by 22 seconds"
            />
          </div>
          
          {/* Success Rate Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Pipeline Success Rate</h3>
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white">
                  <option value="7">Last 7 Days</option>
                  <option value="14">Last 14 Days</option>
                  <option value="30">Last 30 Days</option>
                </select>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={successRateData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" />
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Success Rate']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(51, 65, 85, 0.5)',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#10b981' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-lg font-medium text-white">Recent Builds</h3>
              </div>
              <div className="divide-y divide-slate-800">
                {builds.slice(0, 4).map((build, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitCommit size={16} className="text-blue-400" />
                        <div className="text-sm font-medium text-white">{build.pipeline}</div>
                      </div>
                      <StatusBadge status={build.status} />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <GitBranch size={12} />
                        <span>{build.branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{build.started}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-800">
                <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300">
                  View All Builds
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="border-b border-slate-800">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'text-blue-400 border-b-2 border-blue-500' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-3 self-end">
                  {(activeTab === 'pipelines' || activeTab === 'builds' || activeTab === 'environments') && (
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                      <option value="running">Running</option>
                      <option value="warning">Warning</option>
                    </select>
                  )}
                  
                  {activeTab === 'artifacts' && (
                    <select
                      className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="all">All Pipelines</option>
                      {pipelines.map((pipeline) => (
                        <option key={pipeline.id} value={pipeline.name}>{pipeline.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              
              {renderTabContent()}
            </div>
          </div>
          
          {/* Create Pipeline Modal */}
          <CreatePipelineModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default CiCdManagement;