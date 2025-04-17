"use client"

import React, { useState } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Download, 
  Search, 
  Filter, 
  BarChart2, 
  Settings,
  Activity,
  Shield,
  User,
  ChevronRight,
  ChevronDown,
  Server,
} from 'lucide-react';
import { 
  DashboardHeader, 
  DashboardSection, 
  DashboardGrid, 
  EmptyState,
  ResourceCard,
  Button,
  IconButton,
  AreaChartComponent,
  ChartContainer
} from '../components/ui';
import ExportLogsModal from './ExportLogsModal';
import FilterModal from './FilterModal';

/**
 * Main Audit Logs Component - Provides a dashboard for viewing and filtering audit logs
 * Refactored to use the UI component library
 */
const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState(['login', 'deletion', 'permission', 'api_key', 'setting', 'deployment', 'access', 'security']);
  const [timeRange, setTimeRange] = useState('24h');
  const [expandedLog, setExpandedLog] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [view, setView] = useState('detailed'); // 'detailed' or 'summary'
  
  // Sample audit log data
  const auditLogs = [
    {
      id: 'evt-001',
      timestamp: '2025-04-10T14:32:45',
      eventType: 'login',
      action: 'User logged in',
      user: 'john.doe@example.com',
      resource: 'Console',
      resourceType: 'Auth',
      source: 'Web Console',
      ip: '192.168.1.45',
      location: 'US East',
      details: 'Successful login using email/password authentication',
      changes: null,
      severity: 'low'
    },
    {
      id: 'evt-002',
      timestamp: '2025-04-10T14:15:22',
      eventType: 'permission',
      action: 'Role permissions updated',
      user: 'admin@example.com',
      resource: 'role-backend-dev',
      resourceType: 'IAM Role',
      source: 'API',
      ip: '203.0.113.42',
      location: 'US West',
      details: 'Modified permissions for backend developer role',
      changes: {
        added: ['storage:list', 'logs:read'],
        removed: ['storage:delete']
      },
      severity: 'medium'
    },
    {
      id: 'evt-003',
      timestamp: '2025-04-10T13:45:12',
      eventType: 'api_key',
      action: 'API key created',
      user: 'sarah.williams@example.com',
      resource: 'api-key-1234',
      resourceType: 'API Key',
      source: 'Console',
      ip: '198.51.100.73',
      location: 'EU Central',
      details: 'Created new API key with read-only permissions',
      changes: null,
      severity: 'low'
    },
    {
      id: 'evt-004',
      timestamp: '2025-04-10T13:22:18',
      eventType: 'deployment',
      action: 'Application deployed',
      user: 'ci-pipeline@example.com',
      resource: 'api-service',
      resourceType: 'Application',
      source: 'GitHub Actions',
      ip: '203.0.113.120',
      location: 'US East',
      details: 'Deployed version v1.4.2 to production',
      changes: {
        version: 'v1.4.2',
        deploymentId: 'deploy-5678',
        commit: 'a1b2c3d4'
      },
      severity: 'low'
    },
    {
      id: 'evt-005',
      timestamp: '2025-04-10T12:58:33',
      eventType: 'security',
      action: 'Unusual login attempt detected',
      user: 'alex.johnson@example.com',
      resource: 'Console',
      resourceType: 'Auth',
      source: 'Security Service',
      ip: '185.86.151.11',
      location: 'Russia',
      details: 'Login attempt from unusual location. User received security notification.',
      changes: null,
      severity: 'high'
    },
    {
      id: 'evt-006',
      timestamp: '2025-04-10T12:45:09',
      eventType: 'deletion',
      action: 'Database instance deleted',
      user: 'admin@example.com',
      resource: 'db-prod-backup-2',
      resourceType: 'Database',
      source: 'Console',
      ip: '192.168.1.45',
      location: 'US East',
      details: 'Deleted old production database backup instance',
      changes: null,
      severity: 'medium'
    },
    {
      id: 'evt-007',
      timestamp: '2025-04-10T12:37:51',
      eventType: 'setting',
      action: 'Organization settings updated',
      user: 'admin@example.com',
      resource: 'org-settings',
      resourceType: 'Organization',
      source: 'Console',
      ip: '192.168.1.45',
      location: 'US East',
      details: 'Updated billing email and security settings',
      changes: {
        billingEmail: {
          old: 'finance@example.com',
          new: 'billing@example.com'
        },
        mfaRequired: {
          old: false,
          new: true
        }
      },
      severity: 'medium'
    },
    {
      id: 'evt-008',
      timestamp: '2025-04-10T12:22:04',
      eventType: 'access',
      action: 'User added to project',
      user: 'john.doe@example.com',
      resource: 'project-apollo',
      resourceType: 'Project',
      source: 'Console',
      ip: '192.168.1.45',
      location: 'US East',
      details: 'Added sarah.williams@example.com to project with developer role',
      changes: {
        user: 'sarah.williams@example.com',
        role: 'developer'
      },
      severity: 'low'
    },
    {
      id: 'evt-009',
      timestamp: '2025-04-10T11:58:30',
      eventType: 'deployment',
      action: 'Deployment failed',
      user: 'ci-pipeline@example.com',
      resource: 'payment-service',
      resourceType: 'Application',
      source: 'GitHub Actions',
      ip: '203.0.113.120',
      location: 'US East',
      details: 'Deployment failed due to database connection error',
      changes: {
        version: 'v2.1.0',
        deploymentId: 'deploy-6789',
        commit: 'e5f6g7h8',
        error: 'DatabaseConnectionError'
      },
      severity: 'high'
    },
    {
      id: 'evt-010',
      timestamp: '2025-04-10T11:45:22',
      eventType: 'api_key',
      action: 'API key revoked',
      user: 'admin@example.com',
      resource: 'api-key-5678',
      resourceType: 'API Key',
      source: 'Console',
      ip: '192.168.1.45',
      location: 'US East',
      details: 'API key belonging to sarah.williams@example.com was revoked',
      changes: {
        status: {
          old: 'active',
          new: 'revoked'
        }
      },
      severity: 'medium'
    }
  ];

  // Filter logs based on search query and selected event types
  const filteredLogs = auditLogs.filter(log => 
    (searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    selectedEventTypes.includes(log.eventType)
  );

  // Toggle log expansion
  const toggleLogExpansion = (logId) => {
    if (expandedLog === logId) {
      setExpandedLog(null);
    } else {
      setExpandedLog(logId);
    }
  };
  
  // Toggle event type filter
  const toggleEventTypeFilter = (type) => {
    if (selectedEventTypes.includes(type)) {
      setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
    } else {
      setSelectedEventTypes([...selectedEventTypes, type]);
    }
  };
  
  // Event type counts for chart
  const eventTypeCounts = {
    login: auditLogs.filter(log => log.eventType === 'login').length,
    deletion: auditLogs.filter(log => log.eventType === 'deletion').length,
    permission: auditLogs.filter(log => log.eventType === 'permission').length,
    api_key: auditLogs.filter(log => log.eventType === 'api_key').length,
    setting: auditLogs.filter(log => log.eventType === 'setting').length,
    deployment: auditLogs.filter(log => log.eventType === 'deployment').length,
    access: auditLogs.filter(log => log.eventType === 'access').length,
    security: auditLogs.filter(log => log.eventType === 'security').length
  };
  
  // Severity counts
  const severityCounts = {
    high: auditLogs.filter(log => log.severity === 'high').length,
    medium: auditLogs.filter(log => log.severity === 'medium').length,
    low: auditLogs.filter(log => log.severity === 'low').length
  };
  
  // Recent activity data (past 24 hours in 3-hour increments)
  const activityData = [
    { time: '00:00', count: 42 },
    { time: '03:00', count: 28 },
    { time: '06:00', count: 35 },
    { time: '09:00', count: 67 },
    { time: '12:00', count: 84 },
    { time: '15:00', count: 72 },
    { time: '18:00', count: 53 },
    { time: '21:00', count: 48 }
  ];
  
  // Sample saved filters
  const savedFilters = [
    { id: 1, name: 'Security Events', query: 'eventType:security', createdBy: 'john.doe@example.com', lastRun: '1 hour ago' },
    { id: 2, name: 'Failed Deployments', query: 'eventType:deployment action:"failed"', createdBy: 'admin@example.com', lastRun: '3 hours ago' },
    { id: 3, name: 'Permission Changes', query: 'eventType:permission', createdBy: 'sarah.williams@example.com', lastRun: '2 days ago' }
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Audit Logs"
        actionLabel="Export"
        actionIcon={Download}
        onAction={() => setIsExportModalOpen(true)}
      >
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="6h">Last 6 hours</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
          <Button
            variant="secondary"
            icon={Calendar}
          >
            Calendar
          </Button>
          <Button
            variant="secondary"
            icon={RefreshCw}
          >
            Refresh
          </Button>
        </div>
      </DashboardHeader>
      
      {/* Audit Logs Metrics Cards */}
      <DashboardGrid columns={4} gap={6}>
        <ResourceCard 
          title="Total Events" 
          value={auditLogs.length.toLocaleString()} 
          percentage="8" 
          trend="up" 
          icon={Activity} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="Last 24 hours"
        />
        <ResourceCard 
          title="Security Events" 
          value={eventTypeCounts.security} 
          percentage="15" 
          trend="up" 
          icon={Shield} 
          color="bg-red-500/10 text-red-400" 
          subtitle="High priority"
        />
        <ResourceCard 
          title="User Actions" 
          value={eventTypeCounts.login + eventTypeCounts.access} 
          icon={User} 
          color="bg-green-500/10 text-green-400" 
          subtitle="Login & access"
        />
        <ResourceCard 
          title="System Changes" 
          value={eventTypeCounts.deployment + eventTypeCounts.setting + eventTypeCounts.permission} 
          icon={Settings} 
          color="bg-purple-500/10 text-purple-400" 
          subtitle="Configuration & deployments"
        />
      </DashboardGrid>
      
      {/* Audit Activity Chart and Saved Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer 
          title="Audit Activity" 
          className="lg:col-span-2"
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        >
          <AreaChartComponent
            data={activityData}
            dataKey="count"
            colors={['#3b82f6']}
            xAxisDataKey="time"
            showGrid={true}
            gradientId="colorEventCount"
          />
        </ChartContainer>
        
        <DashboardSection title="Saved Filters">
          <div className="divide-y divide-slate-800">
            {savedFilters.map((filter) => (
              <div key={filter.id} className="p-4 hover:bg-slate-800/30">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-white">{filter.name}</div>
                  <button className="text-blue-400 hover:text-blue-300 text-xs">
                    Apply
                  </button>
                </div>
                <div className="text-xs font-mono bg-slate-800 rounded p-1.5 mb-2 text-slate-400">
                  {filter.query}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>By {filter.createdBy}</span>
                  <span>Used {filter.lastRun}</span>
                </div>
              </div>
            ))}
            <div className="p-3">
              <button 
                className="w-full py-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Save Current Filter
              </button>
            </div>
          </div>
        </DashboardSection>
      </div>
      
      {/* Severity Distribution */}
      <DashboardSection title="Severity Distribution">
        <div className="flex items-center">
          <div className="w-full">
            <div className="flex items-center mb-4">
              <div className="w-1/3 text-center">
                <div className="text-3xl font-bold text-red-400">{severityCounts.high}</div>
                <div className="text-sm text-slate-400 mt-1">High</div>
              </div>
              <div className="w-1/3 text-center">
                <div className="text-3xl font-bold text-yellow-400">{severityCounts.medium}</div>
                <div className="text-sm text-slate-400 mt-1">Medium</div>
              </div>
              <div className="w-1/3 text-center">
                <div className="text-3xl font-bold text-blue-400">{severityCounts.low}</div>
                <div className="text-sm text-slate-400 mt-1">Low</div>
              </div>
            </div>
            
            <div className="w-full flex h-4 rounded-full overflow-hidden">
              <div 
                className="bg-red-500" 
                style={{ width: `${(severityCounts.high / auditLogs.length) * 100}%` }}
              ></div>
              <div 
                className="bg-yellow-500" 
                style={{ width: `${(severityCounts.medium / auditLogs.length) * 100}%` }}
              ></div>
              <div 
                className="bg-blue-500" 
                style={{ width: `${(severityCounts.low / auditLogs.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </DashboardSection>
      
      {/* Audit Logs Search and Filters */}
      <DashboardSection 
        title={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('detailed')}
              className={`px-3 py-1.5 rounded-lg text-sm ${view === 'detailed' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Detailed View
            </button>
            <button
              onClick={() => setView('summary')}
              className={`px-3 py-1.5 rounded-lg text-sm ${view === 'summary' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Summary View
            </button>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Filter}
              onClick={() => setIsFilterModalOpen(true)}
            >
              Advanced Filters
            </Button>
            <IconButton
              icon={BarChart2}
              variant="transparent"
              size="sm"
              tooltip="View Charts"
            />
            <IconButton
              icon={Settings}
              variant="transparent"
              size="sm"
              tooltip="Settings"
            />
          </div>
        }
      >
        <div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search logs by action, resource, user or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 self-end">
              <div className="flex gap-1">
                <button
                  onClick={() => toggleEventTypeFilter('login')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedEventTypes.includes('login') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => toggleEventTypeFilter('security')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedEventTypes.includes('security') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  SECURITY
                </button>
                <button
                  onClick={() => toggleEventTypeFilter('permission')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedEventTypes.includes('permission') ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  PERMISSION
                </button>
                <button
                  onClick={() => toggleEventTypeFilter('api_key')}
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${selectedEventTypes.includes('api_key') ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                  API KEY
                </button>
              </div>
              
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white">
                <option value="all">All Sources</option>
                <option value="console">Console</option>
                <option value="api">API</option>
                <option value="cli">CLI</option>
                <option value="github">GitHub Actions</option>
              </select>
            </div>
          </div>
          
          {/* TODO: Make sure we switch this to the AuditLogEntry component for uniformity and less code*/}
          {/* Audit Log Results */}
          {console.log('Filtered Logs:', filteredLogs)}
                <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden">
                {filteredLogs.length > 0 ? (
                  <div className="divide-y divide-slate-800">
                  {filteredLogs.map((log) => (
                    <div key={log.id}>
                    <div className="px-4 py-3 flex items-start cursor-pointer" onClick={() => toggleLogExpansion(log.id)}>
                      <div className="flex-none pt-1">
                      {expandedLog === log.id ?
                        <ChevronDown size={16} className="text-slate-400" /> :
                        <ChevronRight size={16} className="text-slate-400" />
                      }
                      </div>
                      <div className="ml-2 flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`p-2 rounded-lg ${log.severity === 'high' ? 'bg-red-500/10 text-red-400' : log.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                        <Activity size={16} />
                        </div>
                        <div className="text-sm font-medium text-white truncate">{log.action}</div>
                      </div>
                      <div className="text-sm text-slate-400 truncate mb-1">{log.resource} ({log.resourceType})</div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{log.user}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Activity size={14} />
                        <span>{log.eventType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Settings size={14} />
                        <span>{log.source}</span>
                        </div>
                        {log.ip && (
                        <div className="hidden md:flex items-center gap-1">
                          <Server size={14} />
                          <span className="font-mono">{log.ip}</span>
                        </div>
                        )}
                      </div>
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    {expandedLog === log.id && (
                      <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-800">
                      <div className="space-y-4">
                        <div>
                        <div className="text-sm font-medium text-slate-300 mb-1">Details</div>
                        <div className="text-sm text-slate-400">{log.details}</div>
                        </div>
                        
                        {log.changes && (
                        <div>
                          <div className="text-sm font-medium text-slate-300 mb-2">Changes</div>
                          <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs">
                          <pre className="text-slate-400">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                          </div>
                        </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-xs">
                        <div>
                          <span className="text-slate-500">Location:</span>
                          <span className="ml-2 text-slate-300">{log.location}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">IP Address:</span>
                          <span className="ml-2 text-slate-300 font-mono">{log.ip}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Event ID:</span>
                          <span className="ml-2 text-slate-300 font-mono">{log.id}</span>
                        </div>
                        </div>
                      </div>
                      </div>
                    )}
                    </div>
                  ))}
                  </div>
                ) : (
                  <EmptyState
                  icon={Search}
                  title="No Audit Logs Found"
                  description="We couldn't find any audit logs matching your search criteria. Try adjusting your filters or search query."
                  actionText="Clear Filters"
                  onAction={() => {
                  setSearchQuery('');
                  setSelectedEventTypes(['login', 'deletion', 'permission', 'api_key', 'setting', 'deployment', 'access', 'security']);
                }}
              />
            )}
          </div>
          
          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-400">
                Showing {filteredLogs.length} of {auditLogs.length} audit logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </DashboardSection>
      
      {/* Modals */}
      <ExportLogsModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default AuditLogs;
