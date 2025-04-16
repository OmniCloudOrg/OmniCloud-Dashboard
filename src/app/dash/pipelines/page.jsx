"use client"

import React, { useState } from 'react';
import { 
  GitBranch, 
  PlayCircle, 
  RefreshCw, 
  Plus, 
  Search,
  Server,
  GitCommit,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Component imports
import { PipelineCard } from './components/PipelineCard';
import { CreatePipelineModal } from './components/CreatePipelineModal';
import { PipelineDetail } from './components/PipelineDetail';
import { BuildsTable } from './components/BuildsTable';
import { ArtifactsTable } from './components/ArtifactsTable';
import { EnvironmentsGrid } from './components/EnvironmentsGrid';

// UI library imports
import { 
  ResourceCard, 
  TabNavigation,
  DashboardHeader,
  EmptyState,
  LineChartComponent,
  StatusBadge
} from '../components/ui';

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
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.repository.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.lastRunStatus === statusFilter)
        );
      case 'builds':
        return builds.filter(item => 
          (item.pipeline.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.commit.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (statusFilter === 'all' || item.status === statusFilter)
        );
      case 'artifacts':
        return artifacts.filter(item => 
          (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           item.pipeline.toLowerCase().includes(searchQuery.toLowerCase()))
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
              <EmptyState
                icon={GitBranch}
                title="No Pipelines Found"
                description="We couldn't find any pipelines matching your search criteria. Try adjusting your filters or search query."
                buttonText="Clear Filters"
                onButtonClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              />
            )}
          </div>
        );
        
      case 'builds':
        return <BuildsTable data={filteredData} />;
        
      case 'artifacts':
        return <ArtifactsTable data={filteredData} />;
        
      case 'environments':
        return <EnvironmentsGrid data={filteredData} />;
        
      default:
        return null;
    }
  };

  // Search filter component with inputs
  const SearchFilter = () => (
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
  );

  return (
    <div className="space-y-6">
      {selectedPipeline ? (
        <PipelineDetail 
          pipeline={selectedPipeline} 
          onBack={() => setSelectedPipeline(null)} 
        />
      ) : (
        <>
          <DashboardHeader
            title="CI/CD"
            onRefresh={() => console.log('Refreshing...')}
            actionLabel="New Pipeline"
            onAction={() => setIsCreateModalOpen(true)}
            actionIcon={Plus}
          />
          
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
          
          {/* Success Rate Chart & Recent Builds */}
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
                  <LineChartComponent
                    data={successRateData}
                    dataKey="rate"
                    xAxisDataKey="date"
                    colors={['#10b981']}
                    showGrid={true}
                    showLegend={false}
                    name="Success Rate"
                    tooltipFormatter={(value) => [`${value}%`, 'Success Rate']}
                  />
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
                <button 
                  onClick={() => setActiveTab('builds')}
                  className="w-full py-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  View All Builds
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <div className="p-6">
              <SearchFilter />
              {renderTabContent()}
            </div>
          </div>
          
          {/* Create Pipeline Modal */}
          <CreatePipelineModal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
          />
        </>
      )}
    </div>
  );
};

export default CiCdManagement;