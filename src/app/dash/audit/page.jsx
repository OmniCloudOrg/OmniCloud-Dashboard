"use client"

import React, { useState, useEffect } from 'react';
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8002/api/v1';

/**
 * Main Audit Logs Component - Provides a dashboard for viewing and filtering audit logs
 * Integrated with backend API
 */
const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventTypes, setSelectedEventTypes] = useState(['login', 'deletion', 'permission', 'api_key', 'setting', 'deployment', 'access', 'security']);
  const [timeRange, setTimeRange] = useState('24h');
  const [expandedLog, setExpandedLog] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [view, setView] = useState('detailed'); // 'detailed' or 'summary'
  
  // State for API data
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 0
  });

  // State for event type and severity counts
  const [eventTypeCounts, setEventTypeCounts] = useState({});
  const [severityCounts, setSeverityCounts] = useState({
    high: 0,
    medium: 0,
    low: 0
  });

  // Activity data state
  const [activityData, setActivityData] = useState([]);

  // Fetch audit logs from API
  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        per_page: pagination.per_page
      });
      
      const response = await fetch(`${API_BASE_URL}/audit_logs?${params}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched audit logs:", data); // Debug to see full response
      
      setAuditLogs(data.audit_logs || []);
      setPagination(data.pagination || {
        page: 1,
        per_page: 10,
        total_count: data.audit_logs?.length || 0,
        total_pages: 1
      });
      
      // Calculate counts after fetching data
      calculateCounts(data.audit_logs || []);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Calculate event type and severity counts from the fetched data
  const calculateCounts = (logs) => {
    // Calculate event type counts
    const typeCounts = {};
    // Calculate severity counts
    const sevCounts = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    logs.forEach(log => {
      // Count event types
      if (log.action) {
        const eventType = getEventTypeFromAction(log.action);
        typeCounts[eventType] = (typeCounts[eventType] || 0) + 1;
      }
      
      // Count severities (derived from action since we don't have a severity field)
      const severity = getSeverity(log.action);
      sevCounts[severity] = (sevCounts[severity] || 0) + 1;
    });
    
    setEventTypeCounts(typeCounts);
    setSeverityCounts(sevCounts);
    
    // Generate activity data (simplified version - in production, you'd have a specific API endpoint for this)
    generateActivityData(logs);
  };

  // Helper function to extract event type from action (based on your actual API response)
  const getEventTypeFromAction = (action) => {
    if (!action) return 'other';
    action = action.toLowerCase();
    if (action === 'deploy') return 'deployment';
    if (action === 'create') return 'access';
    if (action === 'delete') return 'deletion';
    if (action === 'update') return 'setting';
    // Map other action types as they appear in your system
    return action; // Default to the action itself
  };

  // Generate activity data from logs (in production, this would come from a specific API endpoint)
  const generateActivityData = (logs) => {
    // Group logs by day for visualization
    const dayGroups = {
      '05-15': 0, // May 15
      '05-16': 0,
      '05-17': 0,
      '05-18': 0,
      '05-19': 0,
      '05-20': 0, // May 20
      '05-21': 0,
      '05-22': 0,
    };
    
    // Count logs by date
    logs.forEach(log => {
      if (log.created_at) {
        const date = new Date(log.created_at);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const dateKey = `${month}-${day}`;
        
        if (dayGroups[dateKey] !== undefined) {
          dayGroups[dateKey]++;
        }
      }
    });
    
    // Convert to array format for chart
    const activityArray = Object.entries(dayGroups).map(([date, count]) => ({
      time: date,
      count
    }));
    
    setActivityData(activityArray);
  };

  // Load data when component mounts or when pagination changes
  useEffect(() => {
    fetchAuditLogs();
  }, [pagination.page, pagination.per_page]);

  // Refresh data
  const handleRefresh = () => {
    fetchAuditLogs();
  };

  // Change page
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

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
  
  // Map user_id to user names for display (in a real app, you would fetch this from an API)
  const userMapping = {
    1: "admin@example.com",
    2: "developer1@example.com",
    3: "developer2@example.com"
  };

  // Map resource types to more readable names
  const resourceTypeMapping = {
    "app": "Application",
    "space": "Workspace",
    // Add more mappings as needed
  };

  // Map action types to more readable descriptions
  const actionMapping = {
    "create": "Created",
    "deploy": "Deployed",
    "delete": "Deleted",
    "update": "Updated"
  };
  
  // Get user display name
  const getUserName = (userId) => {
    return userMapping[userId] || `User ${userId}`;
  };
  
  // Get readable resource type
  const getResourceType = (type) => {
    return resourceTypeMapping[type] || type;
  };
  
  // Get readable action
  const getActionDisplay = (action, resourceType) => {
    const actionText = actionMapping[action] || action;
    const resourceText = getResourceType(resourceType);
    return `${actionText} ${resourceText}`;
  };
  
  // Generate severity from action (since actual data doesn't have severity)
  const getSeverity = (action) => {
    if (action === 'delete') return 'high';
    if (action === 'deploy') return 'medium';
    return 'low';
  };
  
  // Filter logs based on search query and selected event types
  const filteredLogs = auditLogs.filter(log => 
    (searchQuery === '' || 
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (log.resource_type && log.resource_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (getUserName(log.user_id) && getUserName(log.user_id).toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.resource_id && log.resource_id.toLowerCase().includes(searchQuery.toLowerCase()))
    ) &&
    selectedEventTypes.includes(getEventTypeFromAction(log.action || ''))
  );
  
  // Sample saved filters (these would typically come from an API or local storage)
  const savedFilters = [
    { id: 1, name: 'Security Events', query: 'eventType:security', createdBy: 'john.doe@example.com', lastRun: '1 hour ago' },
    { id: 2, name: 'Failed Deployments', query: 'eventType:deployment action:"failed"', createdBy: 'admin@example.com', lastRun: '3 hours ago' },
    { id: 3, name: 'Permission Changes', query: 'eventType:permission', createdBy: 'sarah.williams@example.com', lastRun: '2 days ago' }
  ];

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

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
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </DashboardHeader>
      
      {/* Audit Logs Metrics Cards */}
      <DashboardGrid columns={4} gap={6}>
        <ResourceCard 
          title="Total Events" 
          value={pagination.total_count.toLocaleString()} 
          icon={Activity} 
          color="bg-blue-500/10 text-blue-400" 
          subtitle="Total Records"
        />
        <ResourceCard 
          title="Security Events" 
          value={eventTypeCounts.security || 0} 
          icon={Shield} 
          color="bg-red-500/10 text-red-400" 
          subtitle="High priority"
        />
        <ResourceCard 
          title="User Actions" 
          value={(eventTypeCounts.login || 0) + (eventTypeCounts.access || 0)} 
          icon={User} 
          color="bg-green-500/10 text-green-400" 
          subtitle="Login & access"
        />
        <ResourceCard 
          title="System Changes" 
          value={(eventTypeCounts.deployment || 0) + (eventTypeCounts.setting || 0) + (eventTypeCounts.permission || 0)} 
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
                style={{ width: `${(severityCounts.high / pagination.total_count || 0) * 100}%` }}
              ></div>
              <div 
                className="bg-yellow-500" 
                style={{ width: `${(severityCounts.medium / pagination.total_count || 0) * 100}%` }}
              ></div>
              <div 
                className="bg-blue-500" 
                style={{ width: `${(severityCounts.low / pagination.total_count || 0) * 100}%` }}
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
          
          {/* Audit Log Results */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center text-red-400">
              {error}. Please try refreshing the page.
            </div>
          ) : (
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
                            <div className={`p-2 rounded-lg ${
                              getSeverity(log.action) === 'high' ? 'bg-red-500/10 text-red-400' : 
                              getSeverity(log.action) === 'medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                              'bg-green-500/10 text-green-400'}`}>
                              <Activity size={16} />
                            </div>
                            <div className="text-sm font-medium text-white truncate">
                              {getActionDisplay(log.action, log.resource_type)}
                            </div>
                          </div>
                          <div className="text-sm text-slate-400 truncate mb-1">
                            {getResourceType(log.resource_type)} #{log.resource_id || 'N/A'}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatTimestamp(log.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{getUserName(log.user_id)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity size={14} />
                              <span>{getEventTypeFromAction(log.action || '')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Settings size={14} />
                              <span>{log.source || 'API'}</span>
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
                      
                      {/* Content Area - Expanded Log Details */}
                      {expandedLog === log.id && (
                        <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-800">
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-medium text-slate-300 mb-1">Details</div>
                              <div className="text-sm text-slate-400">
                                {log.details || `${log.action || 'Action'} on ${log.resource_type || 'resource'} ${log.resource_id || ''}`}
                              </div>
                            </div>
                            
                            {/* Show metadata as JSON */}
                            <div>
                              <div className="text-sm font-medium text-slate-300 mb-2">Log Record</div>
                              <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs">
                                <pre className="text-slate-400">
                                  {JSON.stringify(log, null, 2)}
                                </pre>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-xs">
                              <div>
                                <span className="text-slate-500">Organization:</span>
                                <span className="ml-2 text-slate-300">{log.org_id || 'N/A'}</span>
                              </div>
                              {log.ip && (
                                <div>
                                  <span className="text-slate-500">IP Address:</span>
                                  <span className="ml-2 text-slate-300 font-mono">{log.ip}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-500">Log ID:</span>
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
          )}
          
          {/* Pagination */}
          {!loading && !error && filteredLogs.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-400">
                Showing {filteredLogs.length} of {pagination.total_count} audit logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-slate-400">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.total_pages}
                  onClick={() => handlePageChange(pagination.page + 1)}
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