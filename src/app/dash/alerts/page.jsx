"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Search, 
  RefreshCw, 
  Plus,
  Download, 
  BarChart2, 
  Settings
} from 'lucide-react';

// Import API client
import { AlertsApiClient, PaginationParams } from '@/utils/apiClient/alerts';

// Import platform context
import { usePlatform } from '@/components/context/PlatformContext';

// Import subcomponents
import { ResourceCard } from './components/ResourceCard';
import { AlertCard } from './components/AlertCard';
import { CreateAlertRuleModal } from './components/CreateAlertRuleModal';
import { NotificationChannelsModal } from './components/NotificationChannelsModal';
import { AlertActivityChart } from './components/AlertActivityChart';
import { AlertRulesList } from './components/AlertRulesList';

const AlertsManagement = () => {
  // Get platform context
  const platform = usePlatform();
  const platformId = platform?.selectedPlatformId;

  // Initialize API client with useMemo to prevent recreation and handle platform changes
  const alertsClient = useMemo(() => {
    if (!platformId) return null;
    return new AlertsApiClient(platformId);
  }, [platformId]);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChannelsModalOpen, setIsChannelsModalOpen] = useState(false);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlerts, setTotalAlerts] = useState(0);

  // Early returns for platform issues
  if (platform === null || platform === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading platform context...</span>
      </div>
    );
  }

  if (platformId === null || platformId === undefined) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg max-w-md text-center">
          <div className="text-blue-700 font-medium mb-2">No Platform Selected</div>
          <div className="text-blue-600 text-sm">
            Please select a platform from the platform selector to view alerts.
          </div>
        </div>
      </div>
    );
  }

  // Handle API client initialization errors
  if (!alertsClient) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg max-w-md">
          <div className="text-red-700 font-medium mb-2">API Client Error</div>
          <div className="text-red-600 text-sm">
            Failed to initialize alerts API client for platform {platformId}
          </div>
        </div>
      </div>
    );
  }
  
  // Fetch alerts from API using the client
  useEffect(() => {
    if (!alertsClient) return;

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        console.log(`Fetching alerts for page ${currentPage} with ${perPage} items per page`);
        
        // Use the API client to fetch alerts
        const paginationParams = {
          page: currentPage,
          per_page: perPage
        };
        
        const response = await alertsClient.listAlerts(paginationParams);
        console.log('API response:', response);
        
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Unexpected data format:', response);
          throw new Error('Unexpected data format from API');
        }
        
        // Extract pagination data
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages);
          setTotalAlerts(response.pagination.total_count);
        }
        
        // Transform API data for UI and add necessary fields
        const transformedAlerts = response.data.map(alert => ({
          id: `alert-${alert.id}`,
          title: alert.message,
          severity: alert.severity,
          timestamp: formatTimestamp(alert.timestamp),
          source: determineSource(alert),
          service: alert.service,
          assignee: alert.resolved_by ? `user-${alert.resolved_by}` : null,
          description: alert.message,
          rule: alert.alert_type,
          firstDetected: formatTimestamp(alert.timestamp),
          resolvedAt: alert.resolved_at ? formatTimestamp(alert.resolved_at) : null,
          resolvedBy: alert.resolved_by,
          status: alert.status,
          data: alert.details || {} // Using details field from API
        }));
        
        console.log('Transformed alerts:', transformedAlerts.slice(0, 2));
        setAlerts(transformedAlerts);
        
        // Extract unique services
        const uniqueServices = [...new Set(transformedAlerts.map(a => a.service))].filter(Boolean);
        setServices(uniqueServices);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(`Failed to load alerts: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, [alertsClient, currentPage, perPage]);
  
  // Helper function to determine the source from alert data
  const determineSource = (alert) => {
    if (alert.resource_type && alert.resource_id) {
      return `${alert.resource_type}-${alert.resource_id}`;
    }
    // Fallback to previous logic
    if (alert.instance_id) return `instance-${alert.instance_id}`;
    if (alert.node_id) return `node-${alert.node_id}`;
    if (alert.app_id) return `app-${alert.app_id}`;
    if (alert.region_id) return `region-${alert.region_id}`;
    return `org-${alert.org_id || 'unknown'}`;
  };
  
  // Format timestamp to relative time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Filter alerts based on search query, tab, severity, and service filters
  const getFilteredAlerts = () => {
    // If we're already filtering by API parameters, just apply local filters
    // Note: In a real-world scenario, you might want to implement server-side filtering
    // by adding query parameters for severity, service, etc. to the API call
    return alerts.filter(alert => 
      (searchQuery === '' || 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.service && alert.service.toLowerCase().includes(searchQuery.toLowerCase()))
      ) &&
      (severityFilter === 'all' || alert.severity === severityFilter) &&
      (serviceFilter === 'all' || alert.service === serviceFilter) &&
      (
        (activeTab === 'active' && alert.status !== 'resolved' && alert.status !== 'auto_resolved') ||
        (activeTab === 'resolved' && (alert.status === 'resolved' || alert.status === 'auto_resolved')) ||
        (activeTab === 'critical' && alert.severity === 'critical') ||
        (activeTab === 'acknowledged' && alert.status === 'acknowledged') ||
        activeTab === 'all'
      )
    );
  };
  
  const filteredAlerts = getFilteredAlerts();
  
  // Toggle alert expansion
  const toggleAlertExpansion = (alertId) => {
    if (expandedAlert === alertId) {
      setExpandedAlert(null);
    } else {
      setExpandedAlert(alertId);
    }
  };
  
  // Count alerts by severity for stats cards
  const countAlerts = (severity) => {
    return alerts.filter(alert => alert.severity === severity && alert.status !== 'resolved' && alert.status !== 'auto_resolved').length;
  };
  
  const activeSeverityCounts = {
    critical: countAlerts('critical'),
    warning: countAlerts('warning'),
    info: countAlerts('info')
  };
  
  // Calculate total active alerts
  const totalActiveAlerts = activeSeverityCounts.critical + activeSeverityCounts.warning + activeSeverityCounts.info;
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSeverityFilter('all');
    setServiceFilter('all');
  };
  
  // Refresh alerts using the API client
  const refreshAlerts = async () => {
    if (!alertsClient) return;

    setLoading(true);
    try {
      const paginationParams = {
        page: currentPage,
        per_page: perPage
      };
      
      const response = await alertsClient.listAlerts(paginationParams);
      
      // Extract pagination data
      if (response.pagination) {
        setTotalPages(response.pagination.total_pages);
        setTotalAlerts(response.pagination.total_count);
      }
      
      // Transform API data for UI
      const transformedAlerts = response.data.map(alert => ({
        id: `alert-${alert.id}`,
        title: alert.message,
        severity: alert.severity,
        timestamp: formatTimestamp(alert.timestamp),
        source: determineSource(alert),
        service: alert.service,
        assignee: alert.resolved_by ? `user-${alert.resolved_by}` : null,
        description: alert.message,
        rule: alert.alert_type,
        firstDetected: formatTimestamp(alert.timestamp),
        resolvedAt: alert.resolved_at ? formatTimestamp(alert.resolved_at) : null,
        resolvedBy: alert.resolved_by,
        status: alert.status,
        data: alert.details || {}
      }));
      
      setAlerts(transformedAlerts);
      setError(null);
    } catch (err) {
      console.error('Error refreshing alerts:', err);
      setError(`Failed to refresh alerts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to acknowledge an alert
  const acknowledgeAlert = async (alertId, userId, notes) => {
    if (!alertsClient) return false;

    try {
      const numericAlertId = parseInt(alertId.replace('alert-', ''), 10);
      await alertsClient.acknowledgeAlert(numericAlertId, {
        acknowledged_by: userId,
        notes: notes
      });
      
      // Refresh the alerts after acknowledgment
      await refreshAlerts();
      return true;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      return false;
    }
  };
  
  // Function to resolve an alert
  const resolveAlert = async (alertId, userId, notes) => {
    if (!alertsClient) return false;

    try {
      const numericAlertId = parseInt(alertId.replace('alert-', ''), 10);
      await alertsClient.resolveAlert(numericAlertId, {
        resolved_by: userId,
        resolution_notes: notes
      });
      
      // Refresh the alerts after resolution
      await refreshAlerts();
      return true;
    } catch (error) {
      console.error('Error resolving alert:', error);
      return false;
    }
  };
  
  if (loading && alerts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 text-blue-500 mr-2">
          <RefreshCw />
        </div>
        <span className="text-lg text-white">Loading alerts...</span>
      </div>
    );
  }
  
  if (error && alerts.length === 0) {
    return (
      <div className="p-6 bg-red-900/30 border border-red-800 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-300 mb-2">Error Loading Alerts</h2>
        <p className="text-white mb-4">{error}</p>
        <div className="mb-4 text-left bg-red-950/30 p-3 rounded-lg text-slate-300 text-sm">
          <p className="font-medium mb-2">Troubleshooting suggestions:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Make sure the API server is running</li>
            <li>Check network tab in browser developer tools for CORS issues</li>
            <li>Verify that the API response format matches what the app expects</li>
            <li>Check server logs for any backend errors</li>
          </ul>
        </div>
        <div className="flex justify-center gap-4">
          <button 
            onClick={refreshAlerts} 
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Alerts</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-400">
            Platform: {platformId}
          </div>
          <button 
            onClick={() => setIsChannelsModalOpen(true)} 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Bell size={16} />
            <span>Channels</span>
          </button>
          <button 
            onClick={refreshAlerts}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
            {loading && <span className="animate-spin ml-1"><RefreshCw size={12} /></span>}
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
            <span>Create Rule</span>
          </button>
        </div>
      </div>
      
      {/* Alert Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ResourceCard 
          title="Total Active Alerts" 
          value={totalActiveAlerts} 
          icon={Bell} 
          color="bg-blue-500/10 text-blue-400" 
        />
        <ResourceCard 
          title="Critical Alerts" 
          value={activeSeverityCounts.critical} 
          percentage={activeSeverityCounts.critical > 0 ? 100 : 0} 
          trend={activeSeverityCounts.critical > 0 ? 'up' : 'down'} 
          icon={AlertCircle} 
          color="bg-red-500/10 text-red-400" 
        />
        <ResourceCard 
          title="Warning Alerts" 
          value={activeSeverityCounts.warning} 
          icon={AlertTriangle} 
          color="bg-yellow-500/10 text-yellow-400" 
        />
        <ResourceCard 
          title="Info Alerts" 
          value={activeSeverityCounts.info} 
          icon={Info} 
          color="bg-blue-500/10 text-blue-400" 
        />
      </div>
      
      {/* Alert Activity and Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertActivityChart alerts={alerts} />
        </div>
        <div>
          <AlertRulesList 
            apiClient={alertsClient} 
            onCreateRule={() => setIsCreateModalOpen(true)} 
          />
        </div>
      </div>
      
      {/* Alerts List */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'all' ? 'bg-slate-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'active' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Active ({totalActiveAlerts})
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'critical' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Critical ({activeSeverityCounts.critical})
            </button>
            <button
              onClick={() => setActiveTab('acknowledged')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'acknowledged' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Acknowledged
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === 'resolved' ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Resolved
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Download size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <BarChart2 size={16} />
            </button>
            <button className="text-slate-400 hover:text-slate-300 p-1.5">
              <Settings size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search alerts by title, source or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 self-end">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Services</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Alert Results */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center z-10">
                <div className="flex items-center">
                  <div className="animate-spin h-6 w-6 text-blue-500 mr-2">
                    <RefreshCw size={24} />
                  </div>
                  <span className="text-slate-300">Loading alerts...</span>
                </div>
              </div>
            )}
            
            {filteredAlerts.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {filteredAlerts.map((alert) => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    expanded={expandedAlert === alert.id} 
                    onToggle={() => toggleAlertExpansion(alert.id)} 
                    onAcknowledge={(alertId, userId, notes) => acknowledgeAlert(alertId, userId, notes)}
                    onResolve={(alertId, userId, notes) => resolveAlert(alertId, userId, notes)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-800/50 rounded-full text-slate-400 mb-4">
                  <Bell size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Alerts Found</h3>
                <p className="text-slate-400 mb-4 text-center max-w-lg">
                  {error ? 'An error occurred while loading alerts.' : 
                   'We couldn\'t find any alerts matching your search criteria. Try adjusting your filters or search query.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredAlerts.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-slate-400">
                Showing {filteredAlerts.length} of {totalAlerts} alerts
                {activeTab !== 'all' && ' (filtered)'}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage === 0 
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    // Logic to show pages around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i;
                    } else if (currentPage < 3) {
                      pageToShow = i;
                    } else if (currentPage > totalPages - 3) {
                      pageToShow = totalPages - 5 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageToShow}
                        onClick={() => setCurrentPage(pageToShow)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                          currentPage === pageToShow
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {pageToShow + 1}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 3 && (
                    <>
                      <span className="text-slate-500">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md text-sm bg-slate-800 text-slate-300 hover:bg-slate-700"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    currentPage >= totalPages - 1
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Next
                </button>
                
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(0); // Reset to first page when changing items per page
                  }}
                  className="ml-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {isCreateModalOpen && alertsClient && (
        <CreateAlertRuleModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          apiClient={alertsClient}
        />
      )}
      
      {isChannelsModalOpen && alertsClient && (
        <NotificationChannelsModal 
          isOpen={isChannelsModalOpen} 
          onClose={() => setIsChannelsModalOpen(false)} 
          apiClient={alertsClient}
        />
      )}
    </div>
  );
};

export default AlertsManagement;